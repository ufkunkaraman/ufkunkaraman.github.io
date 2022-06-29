---
layout: post
title: "Apache Tomcat Installation"
description: "Apache Tomcat Installation"
date: 2022-05-15 09:00:07
hero_image: /images/apache_tomcat.png
hero_height: is-large
hero_darken: true
image: /images/apache_tomcat.png
tags: linux docs tomcat
---

What is apache tomcat?, How to install and use apache tomcat?

### **Apache Tomcat Installation Process**

## 1. Apache Tomcat 

Apache tomcat is web server used to publish Java based web applications

### 2**. Standard linux settings made in the operating system**

- **Standard linux settings made in the operating system**
    
    [Standart-Confugration-For-OS]({{ site.baseurl }}/Standart-Confugration-For-OS/) 

   
- **Define hostname**
    
    ```bash
    hostnamectl set-hostname apache-tomcat-1 

    ```

### 3**. Apache Tomcat Installation Process**

- **Install Java**
    - Install Java runtime environment.
        
        ```bash
        sudo apt install default-jdk 
        ```
        
    - Verify Java installation.
        
        ```bash
        java -version
        ```
        
- **Install Apache Tomcat**
    - Download the latest version of Apache Tomcat. To find the latest Tomcat version, visit the [official download](https://tomcat.apache.org/whichversion.html) page.
        
        ```bash
        wget https://kozyatagi.mirror.guzel.net.tr/apache/tomcat/tomcat-9/v9.0.62/bin/apache-tomcat-9.0.62.tar.gz -P /SETUP/
        ```
        
    - Extract the downloaded archive.
    
    ```bash
    mkdir /opt/tomcat -p
    tar -zxvf /SETUP/apache-tomcat-9.0.62.tar.gz --directory /opt/tomcat  --strip-components=1
    cd /opt/tomcat
    ```
    
    - Define Apache Tomcat Service file
        
        ```bash
        $ vim /etc/systemd/system/tomcat.service
        
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
        
    - Start Apache Tomcat Service ,
        
        ```bash
        sudo systemctl daemon-reload
        sudo systemctl start tomcat
        sudo systemctl enable tomcat
        ```
        
    - Verify Apache Tomcat installation.
        
        ```bash
        sudo systemctl status tomcat
        ```
        
    - Make simple confugration for our project
        
        ```bash
        echo "$hostname" > /opt/tomcat/webapps/ROOT/index.jsp
        ```
        
    - Verify Apache Tomcat installation.
        
        ```bash
        curl http://ServerIPaddress:8080
        #hostname
        ```