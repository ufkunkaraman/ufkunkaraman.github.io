---
title: "Helm Kubernetes Backup"
author: "Ufkun Karaman"
pubDatetime: 2022-06-29T09:00:07+03:00
featured: false
draft: false
tags:
  - kubernetes
  - helm
  - backup
  - minio
description: "Automate backing up Kubernetes YAML manifests and Helm releases and ship compressed archives directly to S3-compatible MinIO object storage."
---

## Backup Kubernetes Manifests and Helm Releases

Download the automated backup script for Kubernetes YAML and Helm releases:

```bash
wget https://gist.githubusercontent.com/ufkunkaraman/63fe55c6c01808d9b7d36f8dcfa605e9/raw/dfdd7db95467b5c5a0c10b7bd5dd18d72de46387/k8s_helm_backup.bash
```

Run the backup script and upload the resulting archive to MinIO object storage:

```bash
# Usage: bash k8s_helm_backup.bash -d "<DIR_BACKUP>" -b "<BUCKET>" -h "http://x.x.x.x" -a "<MINIO_ACCESS_KEY>" -s "<MINIO_SECRET_KEY>"
bash k8s_helm_backup.bash -d BACKUP -b kubernetes -a "kubernetesbackupuser" -s "kubernetesbackupusersecret" -m true
```
