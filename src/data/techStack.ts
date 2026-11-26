export type DomainIcon =
  | "shield"
  | "kube"
  | "hardDrive"
  | "activity"
  | "fileText"
  | "workflow"
  | "server"
  | "database";

export interface TechItem {
  label: string;
  /** Optional tag slug linking to `/tags/<tag>/` documentation posts */
  tag?: string;
}

export interface TechDomain {
  icon: DomainIcon;
  title: string;
  summary: string;
  items: TechItem[];
}

export const TECH_STACK: TechDomain[] = [
  {
    icon: "shield",
    title: "Security & Code Quality",
    summary:
      "Shift-left SAST/SCA pipelines, container scanning, secrets management, and OS hardening.",
    items: [
      { label: "SonarQube (SAST)", tag: "sonarqube" },
      { label: "Trivy", tag: "trivy" },
      { label: "HashiCorp Vault", tag: "vault" },
      { label: "SCA & SBOM", tag: "sbom" },
      { label: "Secret Scanning" },
      { label: "CVE & Dependency Tracking" },
      { label: "Linux Hardening", tag: "linux" },
    ],
  },
  {
    icon: "kube",
    title: "Containers & Orchestration",
    summary:
      "Production HA cluster lifecycle, event-driven scaling, and container runtimes.",
    items: [
      { label: "Kubernetes", tag: "kubernetes" },
      { label: "Docker", tag: "docker" },
      { label: "Docker Swarm" },
      { label: "Helm", tag: "helm" },
      { label: "KEDA Autoscaling", tag: "keda" },
      { label: "Kubespray", tag: "kubespray" },
      { label: "RBAC & CoreDNS" },
      { label: "Selenium Grid" },
    ],
  },
  {
    icon: "hardDrive",
    title: "Virtualization, Storage & Linux",
    summary:
      "On-prem hypervisors, distributed block/S3 storage, and Linux kernel tuning.",
    items: [
      { label: "VMware" },
      { label: "Proxmox" },
      { label: "Ceph" },
      { label: "RustFS (S3)", tag: "rustfs" },
      { label: "MinIO (S3)", tag: "minio" },
      { label: "GlusterFS" },
      { label: "Systemd", tag: "systemd" },
      { label: "Linux Tuning", tag: "linux" },
    ],
  },
  {
    icon: "activity",
    title: "Observability & Distributed APM",
    summary:
      "Cluster metrics, SLO alerting, and end-to-end distributed request tracing.",
    items: [
      { label: "Grafana", tag: "grafana" },
      { label: "Prometheus", tag: "prometheus" },
      { label: "Alertmanager", tag: "alertmanager" },
      { label: "OpenTelemetry" },
      { label: "Jaeger / Zipkin" },
      { label: "Glowroot", tag: "glowroot" },
      { label: "Elastic APM" },
    ],
  },
  {
    icon: "fileText",
    title: "Log Management & Compliance",
    summary:
      "Centralized log aggregation, regulatory log signing, and long-term archiving.",
    items: [
      { label: "Elasticsearch" },
      { label: "Kibana" },
      { label: "Fluent Bit" },
      { label: "Filebeat" },
      { label: "Log Signing & Archiving" },
    ],
  },
  {
    icon: "workflow",
    title: "CI/CD, IaC & Languages",
    summary:
      "Infrastructure as Code, repeatable delivery pipelines, and automation tooling.",
    items: [
      { label: "Terraform" },
      { label: "Ansible", tag: "ansible" },
      { label: "Python" },
      { label: "Go", tag: "go" },
      { label: "Bash" },
      { label: "GitLab CI", tag: "gitlab-ci" },
      { label: "Jenkins" },
      { label: "Rollback Deployments" },
      { label: "Helm Pipelines", tag: "helm" },
      { label: "CDN Integration" },
    ],
  },
  {
    icon: "server",
    title: "Monolithic & Web Services",
    summary:
      "High-throughput application runtimes, reverse proxying, and service hardening.",
    items: [
      { label: "Apache Tomcat", tag: "tomcat" },
      { label: "Nginx", tag: "nginx" },
      { label: "Node.js" },
      { label: "Reverse Proxy & Tuning" },
    ],
  },
  {
    icon: "database",
    title: "Databases, Messaging & Caching",
    summary:
      "Distributed databases, event streaming, and low-latency caching layers.",
    items: [
      { label: "PostgreSQL" },
      { label: "Supabase" },
      { label: "Apache Kafka" },
      { label: "Apache Cassandra" },
      { label: "Elasticsearch Clusters" },
      { label: "Redis Cluster" },
      { label: "Memcached" },
    ],
  },
];
