---
layout: post
title: "Helm Kuberentes Backup"
description: "Helm Kuberentes Backup"
date: 2022-06-29 09:00:07
hero_image: /images/helm-kubernetes-backup.webp
hero_height: is-medium
hero_darken: true
image: /images/helm-kubernetes-backup.webp
tags: linux docs learn kubernetes helm backup
summary: ""
---
### Backup Kubernetes helm 

- Download the backup script for Kubernetes helm

   ```bash
   wget https://gist.githubusercontent.com/ufkunkaraman/63fe55c6c01808d9b7d36f8dcfa605e9/raw/dfdd7db95467b5c5a0c10b7bd5dd18d72de46387/k8s_helm_backup.bash
   ```
- Usage (Kubernetes helm backup and send the helm backup file to MINIO)

   ```bash
   #bash kuberneteshelmbackup.bash -d "<DIR_BACKUP>" -b "<BUCKET>" -h "http://x.x.x.x" -a "<MINIO_ACCESS_KEY>" -s "<MINIO_SECRET_KEY>"
   bash kuberneteshelmbackup.bash -d BACKUP -b kubernetes -a "kubernetesbackupuser" -s "kubernetesbackupusersecret" -m true

   ```