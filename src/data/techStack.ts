export interface TechDomain {
  code: string;
  title: string;
  summary: string;
  items: string[];
}

export const TECH_STACK: TechDomain[] = [
  {
    code: "SEC-01",
    title: "Security & Code Quality",
    summary:
      "Shift-left static analysis, supply-chain visibility, and automated hardening.",
    items: [
      "SonarQube (SCA)",
      "SBOM Generation",
      "Secret Scanning",
      "Dependency & CVE Tracking",
      "Linux Hardening",
    ],
  },
  {
    code: "K8S-02",
    title: "Microservices & Kubernetes",
    summary:
      "Production HA cluster lifecycle, autoscaling, ingress routing, and grid testing.",
    items: [
      "Kubernetes",
      "Helm",
      "RBAC & CoreDNS",
      "KEDA Autoscaling",
      "Kubespray",
      "Selenium Grid",
    ],
  },
  {
    code: "OBS-03",
    title: "Observability & Distributed APM",
    summary:
      "Full-stack metrics, alerting, and end-to-end distributed request tracing.",
    items: [
      "Grafana",
      "Prometheus",
      "Alertmanager",
      "OpenTelemetry",
      "Jaeger / Zipkin",
      "Glowroot",
      "Elastic APM",
    ],
  },
  {
    code: "LOG-04",
    title: "Log Management & Compliance",
    summary:
      "Centralized log aggregation, regulatory log signing, and long-term archiving.",
    items: [
      "Elasticsearch",
      "Kibana",
      "Fluent Bit",
      "Filebeat",
      "Log Signing & Archiving",
    ],
  },
  {
    code: "OPS-05",
    title: "CI/CD & Automation",
    summary:
      "Repeatable delivery pipelines with automated rollback, RBAC, and edge storage.",
    items: [
      "GitLab CI",
      "Jenkins",
      "Rollback Deployments",
      "Helm Pipelines",
      "CDN Integration",
      "GlusterFS",
    ],
  },
  {
    code: "SYS-06",
    title: "Monolithic & Web Services",
    summary:
      "High-throughput runtime tuning, reverse proxying, and OS-level reliability.",
    items: [
      "Apache Tomcat",
      "Node.js",
      "Nginx",
      "Systemd",
      "Linux Tuning",
    ],
  },
  {
    code: "DATA-07",
    title: "Databases & Messaging",
    summary:
      "Distributed data cluster setup, replication tuning, and stream processing.",
    items: [
      "Apache Cassandra",
      "Elasticsearch Clusters",
      "Apache Kafka",
      "PostgreSQL",
    ],
  },
  {
    code: "CACHE-08",
    title: "Distributed Caching",
    summary:
      "Low-latency memory caching layers built for resilience and high throughput.",
    items: ["Redis Cluster", "Memcached", "Performance Tuning"],
  },
];
