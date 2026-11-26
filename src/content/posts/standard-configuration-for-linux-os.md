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

> [!NOTE]
> `open-vm-tools` is only required for VMware virtual machines. On Ubuntu 22.04+ and Debian 12+, prefer `plocate` instead of `mlocate`.

```bash
sudo apt install -y \
  net-tools vim nano git wget curl unzip dos2unix \
  procps htop iftop iotop ncdu sysstat rsync screen \
  links telnet traceroute gcc plocate open-vm-tools
```

## Set Server Hostname & `/etc/hosts`

Update both the system hostname and `/etc/hosts` so local `sudo` invocations resolve cleanly without warnings:

```bash
sudo hostnamectl set-hostname hostname-01
echo "127.0.1.1 hostname-01" | sudo tee -a /etc/hosts
```
