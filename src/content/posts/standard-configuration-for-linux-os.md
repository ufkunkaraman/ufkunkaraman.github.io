---
title: "Standard Configuration for Linux OS"
author: "Ufkun Karaman"
pubDatetime: 2022-05-10T09:00:07+03:00
featured: false
draft: false
tags:
  - linux
  - sysadmin
  - ubuntu
description: "Baseline Ubuntu/Debian server setup checklist: system updates, essential DevOps & troubleshooting packages, and hostname configuration."
---

Before following any of the installation or infrastructure guides on this blog, apply these baseline configuration steps on your Linux servers.

## Update and Upgrade OS

```bash
sudo apt-get update
sudo apt-get upgrade -y
sudo apt autoremove -y
```

## Install Essential System & Troubleshooting Packages

```bash
sudo apt install -y net-tools vim git procps iftop iotop ncdu
sudo apt install -y wget gcc screen links telnet nano open-vm-tools sysstat rsync htop mlocate unzip dos2unix traceroute
```

## Set Server Hostname

```bash
sudo hostnamectl set-hostname hostname-01
```
