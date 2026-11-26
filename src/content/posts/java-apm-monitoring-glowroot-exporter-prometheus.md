---
title: "Monitoring Java & Tomcat APM Metrics in Prometheus with Glowroot Exporter"
author: "Ufkun Karaman"
pubDatetime: 2026-11-27T01:35:00+03:00
featured: true
draft: false
tags:
  - glowroot
  - prometheus
  - grafana
  - apm
  - tomcat
  - go
  - monitoring
description: "Attach Glowroot APM to Apache Tomcat, export transaction and error metrics to Prometheus with glowroot-exporter, configure Alertmanager rules, and import Grafana Dashboard 23125."
---

If you run monolithic Java services on Apache Tomcat alongside Kubernetes workloads, JVM heap metrics from `jmx_exporter` only tell half the story. You can see high CPU or GC pauses, yet still have no visibility into which specific HTTP endpoint or SQL query is throwing exceptions or slowing down.

**Glowroot** solves that nicely at the JVM layer with low-overhead transaction tracing. The catch is that Glowroot keeps its metrics inside its own Central UI, whereas most SRE teams centralize alerting in **Prometheus**, **Alertmanager**, and **Grafana**. To bridge that gap, I wrote **[glowroot-exporter](https://github.com/ufkunkaraman/glowroot-exporter)** in Go.

## 1. Architecture

![Glowroot APM to Prometheus and Grafana Architecture](/images/glowroot-exporter-architecture.svg)

1. Java / Tomcat services run with the Glowroot `-javaagent` attached and stream traces to Glowroot Central (`:4000`).
2. `glowroot-exporter` polls Glowroot Central on a configurable schedule (`metrics_update_interval_seconds`), aggregates rollup error and slow-trace metrics, and exposes them at `:9101/metrics`.
3. Prometheus scrapes `:9101/metrics`, evaluates Alertmanager rules, and feeds **Grafana Dashboard #23125**.

## 2. Attach Glowroot Agent to Apache Tomcat

If you followed our [Apache Tomcat Installation](/posts/apache-tomcat-installation) guide, place the Glowroot agent directory under `/opt/glowroot` owned by the `tomcat` user, then add `-javaagent:/opt/glowroot/glowroot.jar` to `CATALINA_OPTS` in `/etc/systemd/system/tomcat.service`:

```ini file=/etc/systemd/system/tomcat.service
[Service]
User=tomcat
Group=tomcat

Environment="CATALINA_OPTS=-Xms512M -Xmx1024M -server -XX:+UseParallelGC -javaagent:/opt/glowroot/glowroot.jar"
```

Reload systemd and restart Tomcat:

```bash
sudo systemctl daemon-reload
sudo systemctl restart tomcat
```

Verify the JVM reports to your Glowroot Central collector (`http://glowroot-server:4000`) before setting up the exporter.

## 3. Deploy `glowroot-exporter`

Create `config.yaml` pointing to your Glowroot Central URL:

```yaml file=config.yaml
server:
  glowroot_url: "http://glowroot-server:4000"
  exporter_port: 9101
  glowroot_time_interval_minutes: 5
  metrics_update_interval_seconds: 60
```

Run it with Docker Compose:

```yaml file=docker-compose.yaml
services:
  glowroot-exporter:
    image: ufkunkaraman/glowroot-exporter:latest
    container_name: glowroot-exporter
    restart: unless-stopped
    ports:
      - "9101:9101"
    volumes:
      - ./config.yaml:/app/config.yaml:ro
```

```bash
docker compose up -d
curl -fsS http://localhost:9101/metrics | grep glowroot_
```

If you prefer running a standalone binary without Docker, build directly with Go 1.21+:

```bash
git clone https://github.com/ufkunkaraman/glowroot-exporter.git
cd glowroot-exporter
go build -o glowroot-exporter main.go
./glowroot-exporter
```

## 4. Exported Metrics & Prometheus Scrape Config

At `/metrics`, the exporter exposes the following rollup series:

- `glowroot_agent_rollup`: Metadata for Glowroot agent rollups
- `glowroot_agent_rollup_id`: Agent ID identifiers
- `glowroot_agent_rollup_id_error_total_count`: Total error count in the polling window
- `glowroot_agent_rollup_id_error_transaction_total_count`: Total transaction count for error rollups
- `glowroot_agent_rollup_id_error`: Error count broken down per transaction
- `glowroot_agent_rollup_id_slow_trace_transaction_total_count`: Total slow-trace transaction count
- `glowroot_agent_rollup_id_slow_trace_transaction`: Slow-trace count broken down per transaction

### Static Prometheus Scrape Job

Add a scrape target in `prometheus.yml` matching your `metrics_update_interval_seconds`:

```yaml file=prometheus.yml
scrape_configs:
  - job_name: "glowroot-exporter"
    scrape_interval: 60s
    static_configs:
      - targets: ["<exporter-host>:9101"]
```

### Kubernetes `ServiceMonitor`

If you run `kube-prometheus-stack` from our [Kubernetes Monitoring Stack](/posts/kubernetes-monitoring-stack) guide, deploy `glowroot-exporter` with a `Service` + `ServiceMonitor` in the `monitoring` namespace:

```yaml file=servicemonitor-glowroot.yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: glowroot-exporter
  namespace: monitoring
  labels:
    release: monitoring
spec:
  selector:
    matchLabels:
      app: glowroot-exporter
  endpoints:
    - port: metrics
      interval: 60s
      path: /metrics
```

### Example Alertmanager Rules

```yaml file=glowroot-alerts.yaml
groups:
  - name: glowroot-apm
    rules:
      - alert: TomcatHighErrorRate
        expr: sum by (agent_rollup_id) (glowroot_agent_rollup_id_error_total_count) > 25
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High Java application error count in Glowroot ({{ $labels.agent_rollup_id }})"

      - alert: TomcatSlowTraceSpike
        expr: sum by (agent_rollup_id) (glowroot_agent_rollup_id_slow_trace_transaction_total_count) > 50
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Spike in slow JVM transactions ({{ $labels.agent_rollup_id }})"
```

## 5. Grafana Dashboard (#23125)

You can import the ready-made dashboard directly in Grafana using Dashboard ID **`23125`** ([Grafana Dashboard 23125](https://grafana.com/grafana/dashboards/23125)) or load `Glowroot Exporter Dashboard.json` from the repository.

![Glowroot Exporter Global Overview in Grafana](/images/glowroot-global-overview.png)

![Glowroot Exporter Error Overview in Grafana](/images/glowroot-error-overview.png)

## References & Source Code

- [ufkunkaraman/glowroot-exporter on GitHub](https://github.com/ufkunkaraman/glowroot-exporter)
- [Grafana Dashboard #23125](https://grafana.com/grafana/dashboards/23125)
- [Apache Tomcat Installation](/posts/apache-tomcat-installation)
- [Kubernetes Monitoring Stack](/posts/kubernetes-monitoring-stack)
