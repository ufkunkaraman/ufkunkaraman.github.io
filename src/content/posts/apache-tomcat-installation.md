---
title: "Apache Tomcat Installation"
author: "Ufkun Karaman"
pubDatetime: 2022-05-15T09:00:07+03:00
featured: false
draft: false
tags:
  - linux
  - tomcat
  - java
  - systemd
description: "How to install Apache Tomcat 9 on Ubuntu Linux with OpenJDK, configure a systemd service unit, tune JVM heap flags, and verify deployment."
---

## 1. What is Apache Tomcat?

Apache Tomcat is a widely used open-source web server and servlet container for publishing Java-based web applications.

## 2. Standard Linux OS Settings

Complete the baseline Linux preparation on your server before installing Tomcat:

[Standard Configuration for Linux OS](/posts/standard-configuration-for-linux-os)

Set the server hostname:

```bash
sudo hostnamectl set-hostname apache-tomcat-1
```

## 3. Apache Tomcat Installation Process

### Install Java Runtime Environment

```bash
sudo apt update
sudo apt install -y default-jdk
java -version
```

### Download and Extract Apache Tomcat

Check the [official Tomcat downloads](https://tomcat.apache.org/whichversion.html) page for the latest release, then download and extract it into `/opt/tomcat`:

```bash
mkdir -p /SETUP/
wget https://kozyatagi.mirror.guzel.net.tr/apache/tomcat/tomcat-9/v9.0.62/bin/apache-tomcat-9.0.62.tar.gz -P /SETUP/
sudo mkdir -p /opt/tomcat
sudo tar -zxvf /SETUP/apache-tomcat-9.0.62.tar.gz --directory /opt/tomcat --strip-components=1
cd /opt/tomcat
```

### Create the systemd Service Unit

> [!TIP]
> In production environments, run Tomcat under a dedicated unprivileged `tomcat` system user rather than `root`.

```ini file=/etc/systemd/system/tomcat.service
[Unit]
Description=Tomcat
After=network.target

[Service]
Type=forking

User=root
Group=root

LimitNOFILE=65535
LimitNPROC=65535

Environment="JAVA_HOME=/usr/lib/jvm/java-1.11.0-openjdk-amd64"
Environment="JAVA_OPTS=-Djava.security.egd=file:///dev/urandom"
Environment="CATALINA_BASE=/opt/tomcat"
Environment="CATALINA_HOME=/opt/tomcat"
Environment="CATALINA_PID=/opt/tomcat/temp/tomcat.pid"
Environment="CATALINA_OPTS=-Xms512M -Xmx1024M -server -XX:+UseParallelGC"

ExecStart=/opt/tomcat/bin/startup.sh
ExecStop=/opt/tomcat/bin/shutdown.sh

[Install]
WantedBy=multi-user.target
```

### Start and Enable the Tomcat Service

```bash
sudo systemctl daemon-reload
sudo systemctl start tomcat
sudo systemctl enable tomcat
sudo systemctl status tomcat
```

### Verify the Deployment

Create a quick test page and verify HTTP connectivity on port `8080`:

```bash
echo "$(hostname)" | sudo tee /opt/tomcat/webapps/ROOT/index.jsp
curl http://ServerIPaddress:8080
```
