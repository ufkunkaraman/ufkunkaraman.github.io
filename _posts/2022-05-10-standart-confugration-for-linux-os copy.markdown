---
layout: post
title: Standard Configuration For Linux OS
description: Install useful tools for Linux, Update Linux, configure Linux, and so on
date: 2022-05-10 09:00:07
hero_image: /images/linux.jpeg
hero_height: is-medium
hero_darken: true
image: /images/linux.jpeg
tags: linux docs
summary: ""
---

If you want to do the actions on all the blogs on this site, you should do these actions.


## **Standard Configuration For Linux OS**

- **Update and Upgrade OS**
    
    ```bash
    sudo apt-get update 
    sudo apt-get upgrade -y
    sudo apt autoremove -y 
    
    ```
    

- **Install Some Usefull Package**
    
    ```bash
    apt install net-tools vim git procps iftop iotop ncdu -y
    apt install wget gcc screen net-tools links telnet vim nano open-vm-tools sysstat rsync htop mlocate delta logwatch unzip dos2unix traceroute -y
    ```
    

- **Define Hostname**
    ```bash
    hostnamectl set-hostname hostname-01

    ```