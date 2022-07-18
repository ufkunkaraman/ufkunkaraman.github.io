---
layout: post
title: "Helm Installation and Usage"
description: "Helm Installation and Usage"
date: 2022-06-28 09:01:07
hero_image: /images/helm_logo.png
hero_height: is-medium
hero_darken: true
image: /images/helm_logo.png
tags: linux docs learn kubernetes helm kubernetes ubuntu
summary: ""
---
### Backup Kubernetes helm 

### 1. **Installation helm and some comfigration**

- Installation helm (ubuntu)
    
    ```bash
    sh <(curl -sL https://gist.githubusercontent.com/ufkunkaraman/049309d7316c539319b4376acaf42444/raw/3dcac154af60ae328d9168eca42d9dbc6da7e6e8/helm_install_ubuntu.sh )

    ```
    
- helm auto complate
    
    ```bash
    echo """source <(helm completion bash)
    alias h=helm
    complete -o default -F __start_helm h """>> ~/.bashrc
    bash
    ```
    

### 2. **Usage Helm**

- How to download charts from chartmuseum?
    
    ```bash
    helm repo add stable https://charts.helm.sh/stable
    helm repo update
    
    # GET yalm (mainfest)
    helm get manifest -n prod yazilimteknikdestekkod-dns-k8s
    ```

### 3. **helm 3 vs helm 2**

![_config.yml]({{ site.baseurl }}/images/helm-2-vs-helm-3.jpg)
