---
title: "Shift-Left DevSecOps in CI/CD: SonarQube, Trivy SBOM, and HashiCorp Vault"
author: "Ufkun Karaman"
pubDatetime: 2026-11-27T01:30:00+03:00
featured: false
draft: false
tags:
  - devsecops
  - sonarqube
  - trivy
  - vault
  - gitlab-ci
  - sbom
  - security
description: "Build a practical GitLab CI security pipeline combining SonarQube SAST quality gates, Trivy container CVE scans, CycloneDX SBOM generation, and dynamic HashiCorp Vault secrets."
---

Waiting until a container hits staging or production to scan for CVEs, leaked tokens, or broken code slows everyone down. Fixing a vulnerability right after `git push` takes minutes; tracking it down three weeks later in a release branch takes days.

The bigger trap in many CI/CD setups is security theater: adding scanners that run in `allow_failure: true` mode forever, or pasting long-lived registry passwords and kubeconfigs into GitLab CI project variables. Here is how to wire **SonarQube** (SAST), **Trivy** (secret scan, CVE gate, and CycloneDX SBOM), and **HashiCorp Vault** (short-lived OIDC/JWT secrets) into one clean GitLab CI pipeline.

## 1. Pipeline Architecture

![Shift-Left DevSecOps Pipeline with SonarQube, Trivy, and HashiCorp Vault](/images/devsecops-pipeline-architecture.svg)

Each stage has one clear job:

1. **Repo & Secret Scan:** Catch hardcoded API keys or insecure Dockerfiles before running heavy builds.
2. **SonarQube SAST:** Run static code analysis and wait for the Quality Gate result.
3. **Container Build, CVE Gate & SBOM:** Build the image, block `HIGH`/`CRITICAL` OS or library CVEs with a known fix, and emit a CycloneDX SBOM artifact.
4. **Vault JWT Auth:** Exchange GitLab's signed `id_tokens` JWT for short-lived Vault credentials instead of storing static tokens.
5. **Helm Deploy:** Ship the verified image tag to Kubernetes with `--atomic` rollback protection.

## 2. Configure HashiCorp Vault JWT Auth for GitLab CI

GitLab CI issues signed OIDC tokens via `id_tokens`. HashiCorp Vault can verify those tokens directly against GitLab's JWKS endpoint, so your pipeline never needs a static `VAULT_TOKEN`.

Enable and configure the JWT auth backend in Vault:

```bash
vault auth enable jwt

vault write auth/jwt/config \
  jwks_url="https://gitlab.example.com/-/jwks" \
  bound_issuer="https://gitlab.example.com"
```

Create a least-privilege policy (`gitlab-deploy-policy.hcl`) allowing read access only to the target service's KV path:

```hcl file=gitlab-deploy-policy.hcl
path "kv/data/prod/my-service/*" {
  capabilities = ["read"]
}
```

Apply the policy and bind a Vault role strictly to your GitLab project and protected `main` branch:

```bash
vault policy write gitlab-deploy gitlab-deploy-policy.hcl

vault write auth/jwt/role/gitlab-ci-deploy \
  role_type="jwt" \
  policies="gitlab-deploy" \
  token_explicit_max_ttl="5m" \
  user_claim="user_login" \
  bound_claims_type="glob" \
  bound_claims='{
    "project_path": "platform/my-service",
    "ref": "main",
    "ref_type": "branch"
  }'
```

Notice `token_explicit_max_ttl="5m"` and `bound_claims`: even if someone forks the repo or runs a pipeline from a feature branch, Vault refuses to issue production secrets.

## 3. SonarQube SAST & Quality Gate

Add a `sonar-project.properties` file in your repository root so scanner settings stay versioned alongside the code:

```properties file=sonar-project.properties
sonar.projectKey=platform_my-service
sonar.projectName=my-service
sonar.sources=src
sonar.tests=tests
sonar.sourceEncoding=UTF-8
```

In CI, pass `-Dsonar.qualitygate.wait=true`. Without that flag, `sonar-scanner` submits the report and exits `0` immediately, even when the code fails your Quality Gate.

## 4. Trivy Secret Scan, CVE Gate & CycloneDX SBOM

Trivy handles three distinct checks in a single binary:

1. **Filesystem secret & misconfiguration scan** before building the container:
   ```bash
   trivy fs --scanners secret,misconfig --exit-code 1 .
   ```
2. **Container CVE gate** failing only when a fix actually exists (`--ignore-unfixed`):
   ```bash
   trivy image \
     --severity HIGH,CRITICAL \
     --ignore-unfixed \
     --exit-code 1 \
     "$IMAGE_TAG"
   ```
3. **CycloneDX SBOM export** for compliance and later CVE lookups without rebuilding:
   ```bash
   trivy image \
     --format cyclonedx \
     --output sbom.cdx.json \
     "$IMAGE_TAG"
   ```

Skipping `--ignore-unfixed` is a common reason teams disable Trivy after a week: base OS packages often have low-risk upstream CVEs with no patch available yet, which turns every build red for zero actionable gain.

## 5. Complete `.gitlab-ci.yml` Example

```yaml file=.gitlab-ci.yml
stages:
  - secret_scan
  - sast
  - build_and_scan
  - deploy

variables:
  IMAGE_TAG: "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA"
  VAULT_ADDR: "https://vault.example.com"

trivy_fs_scan:
  stage: secret_scan
  image:
    name: aquasec/trivy:latest
    entrypoint: [""]
  script:
    - trivy fs --scanners secret,misconfig --exit-code 1 .

sonarqube_sast:
  stage: sast
  image:
    name: sonarsource/sonar-scanner-cli:latest
    entrypoint: [""]
  variables:
    SONAR_USER_HOME: "${CI_PROJECT_DIR}/.sonar"
    GIT_DEPTH: "0"
  script:
    - sonar-scanner -Dsonar.qualitygate.wait=true

build_and_trivy_image:
  stage: build_and_scan
  image: docker:27
  services:
    - docker:27-dind
  script:
    - docker login -u "$CI_REGISTRY_USER" -p "$CI_REGISTRY_PASSWORD" "$CI_REGISTRY"
    - docker build -t "$IMAGE_TAG" .
    - docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest
        image --format cyclonedx --output sbom.cdx.json "$IMAGE_TAG"
    - docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest
        image --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 "$IMAGE_TAG"
    - docker push "$IMAGE_TAG"
  artifacts:
    when: always
    expire_in: 90 days
    paths:
      - sbom.cdx.json

deploy_prod:
  stage: deploy
  image: alpine/helm:3.16.2
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
  id_tokens:
    VAULT_ID_TOKEN:
      aud: https://vault.example.com
  secrets:
    DB_PASSWORD:
      vault: kv/prod/my-service/db@kv
      token: $VAULT_ID_TOKEN
      file: false
  script:
    - >
      helm upgrade --install my-service ./charts/my-service
      --namespace prod
      --atomic
      --timeout 5m
      --set image.tag="$CI_COMMIT_SHORT_SHA"
      --set secrets.dbPassword="$DB_PASSWORD"
```

## 6. Practical Tips from Production Pipelines

- **Use `.trivyignore` with expiration dates:** When a false positive or accepted risk blocks an urgent hotfix, document it with an expiry date (`CVE-2024-XXXX exp:2026-12-31`) instead of disabling the whole job.
- **Keep a local Trivy DB mirror in air-gapped networks:** Pulling the vulnerability database from GitHub Container Registry on every runner hit rate limits quickly; cache it on a local registry or Nginx mirror.
- **Archive SBOMs outside GitLab artifacts:** For audit retention, push `sbom.cdx.json` with build metadata to your S3/RustFS bucket alongside your Helm release backups ([Migrating from MinIO to RustFS](/posts/migrating-from-minio-to-rustfs)).
- **Separate MR checks from `main` deploys:** Run `trivy_fs_scan`, `sonarqube_sast`, and `trivy image` on Merge Requests so issues are caught before merge, while keeping Vault production role claims locked strictly to `main`.
