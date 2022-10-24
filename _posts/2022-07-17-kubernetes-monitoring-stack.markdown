---
layout: post
title: "Kubernetes Monitoring Stack"
description: "Kubernetes Monitoring Stack"
date: 2022-07-17 09:02:07
hero_image: /images/kubernetes-monitoring.jpg
hero_height: is-medium
hero_darken: true
image: /images/kubernetes-monitoring.jpg
tags: linux docs learn kubernetes helm monitoring grafana alertmanager db node-exporter 
summary: ""

---
### Kubernetes Monitoring Stack 

![_config.yml]({{ site.baseurl }}/images/kubernetes-stack-monitoring.png)

- Helm Installation
    
      [Helm-Installation]({{ site.baseurl }}/2022/06/28/helm-installation-and-usage/) 

- Helm Repo add and pull
    
    ```bash
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo add stable https://charts.helm.sh/stable
    helm repo update
    ```
    
- Deploy Kubernetes Monitoring Stack with helm
    
    ```bash
    kubectl create ns monitoring
    helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring

    ### Note: If you modify helm chart values, you can do this ### (OPTIONAL)
    wget https://github.com/prometheus-community/helm-charts/blob/main/charts/kube-prometheus-stack/values.yaml
    helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring -f values.yaml
    ```


-  Can Access with port forwarding

    ```bash
    $ kubectl get pods -n monitoring 
    NAMESPACE       NAME                                                          READY   STATUS             RESTARTS           AGE
    monitoring      alertmanager-monitoring-kube-prometheus-alertmanager-0        2/2     Running            0                  5m
    monitoring      monitoring-grafana-596asdsd79-pm5f6                           3/3     Running            0                  5m
    monitoring      monitoring-kube-prometheus-operator-qwe14dbc64-22qtl          1/1     Running            0                  5m
    monitoring      monitoring-kube-state-metrics-7fasdqw55b-7qk22                1/1     Running            0                  5m
    monitoring      monitoring-prometheus-node-exporter-2aslt                     1/1     Running            0                  5m
    monitoring      monitoring-prometheus-node-exporter-sdslb                     1/1     Running            0                  5m
    monitoring      monitoring-prometheus-node-exporter-jssv4                     1/1     Running            0                  5m
    monitoring      monitoring-prometheus-node-exporter-laswb                     1/1     Running            0                  5m
    monitoring      monitoring-prometheus-node-exporter-aastx                     1/1     Running            0                  5m
    monitoring      monitoring-prometheus-node-exporter-vasns                     1/1     Running            0                  5m
    monitoring      monitoring-prometheus-node-exporter-wasxg                     1/1     Running            0                  5m
    monitoring      prometheus-monitoring-kube-prometheus-prometheus-0            2/2     Running            0                  5m
    
    $ kubectl port-forward --namespace monitoring monitoring-grafana-596asdsd79-pm5f6 3000
    $ kubectl port-forward --namespace monitoring prometheus-monitoring-kube-prometheus-prometheus-0  9090
    $ kubectl port-forward --namespace monitoring alertmanager-monitoring-kube-prometheus-alertmanager-0 9093
    ```



