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
description: "How to install Apache Tomcat 9 on Ubuntu Linux with OpenJDK, configure a systemd service unit under a dedicated user, tune JVM heap flags, and verify deployment."
---

> [!NOTE]
> Tested on **Ubuntu 20.04** with **Apache Tomcat 9.0.62**. For current releases, check the [official Tomcat downloads](https://tomcat.apache.org/whichversion.html) page and update the version number accordingly.

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
dirname "$(dirname "$(readlink -f "$(which java)")")"
```

### Create Dedicated Service User & Install Apache Tomcat

Download the archive from Apache Archive (or substitute the latest Tomcat 9/10 tarball URL from `tomcat.apache.org`), extract it into `/opt/tomcat`, and assign ownership to a dedicated unprivileged `tomcat` user:

```bash
sudo useradd -r -m -U -d /opt/tomcat -s /bin/false tomcat

mkdir -p /SETUP/
wget https://archive.apache.org/dist/tomcat/tomcat-9/v9.0.62/bin/apache-tomcat-9.0.62.tar.gz -P /SETUP/
sudo tar -zxvf /SETUP/apache-tomcat-9.0.62.tar.gz --directory /opt/tomcat --strip-components=1
sudo chown -R tomcat:tomcat /opt/tomcat
sudo chmod -R u+x /opt/tomcat/bin
```

### Create the systemd Service Unit

> [!TIP]
> Verify your `JAVA_HOME` path using the `readlink` command above (`default-jdk` on Ubuntu 22.04/24.04 installs OpenJDK 17 or 21 instead of OpenJDK 11).

```ini file=/etc/systemd/system/tomcat.service
[Unit]
Description=Apache Tomcat Web Application Container
After=network.target

[Service]
Type=forking

User=tomcat
Group=tomcat

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

Create a dedicated health-check JSP file (without overwriting the default `ROOT/index.jsp`) and verify HTTP connectivity on port `8080`:

```bash
echo "<%= java.net.InetAddress.getLocalHost().getHostName() %>" | sudo -u tomcat tee /opt/tomcat/webapps/ROOT/health.jsp
curl http://<server-ip>:8080/health.jsp
```
