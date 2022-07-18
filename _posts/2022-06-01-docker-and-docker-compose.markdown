---
layout: post
title: "Docker and Docker Compose"
description: "Docker and Docker Compose"
date: 2022-06-01 09:00:07
hero_image: /images/vm-vs-docker-container.png
hero_height: is-medium
hero_darken: true
image: /images/vm-vs-docker-container.png
tags: linux docs learn docker docker-compose
summary: ""
---

### 1. Docker Info
### What is Docker?

![_config.yml]({{ site.baseurl }}/images/docker_container_engine_logo.png)

Docker is an open source containerization platform. 

### Why use Docker ?

- Insulation and separation applications.
- Standardize container creation.
- Container versioning.
- Shared container images.
- and so on.


### Docker architecture

![_config.yml]({{ site.baseurl }}/images/docker-architecture.svg)


### DockerFile

- Docker can build images automatically by reading the instructions from a Dockerfile. 

### Docker images

- A Docker image is a file used to execute code in a Docker container.Docker images act as a set of instructions to build a Docker container, like a template.

### Docker containers

- Containers are a form of operating system virtualization. A single container might be used to run anything from a small microservice or software process to a larger application. Inside a container are all the necessary executables, binary code, libraries, and configuration files. Compared to server or machine virtualization approaches, however, containers do not contain operating system images. This makes them more lightweight and portable, with significantly less overhead.

### Docker Registry (Docker Hub)

- A Docker registry is a storage and distribution system for named Docker images.

### Docker daemon

- The Docker daemon is a service that runs on your host operating system. It currently only runs on Linux because it depends on a number of Linux kernel features, but there are a few ways to run Docker on MacOS and Windows too.

## 2. Docker install

- Uninstall old versions
    
    ```bash
    apt-get remove docker docker.io containerd runc -y
    #docker-engine
    ```
    
- Update the apt package index and install packages to allow apt to use a repository over HTTPS:
    
    ```bash
    
    sudo apt-get update
    
    sudo apt-get install \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg \
        lsb-release -y
    ```
    
- Add Docker’s official GPG key:
    
    ```bash
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    ```
    
- Verify that you now have the key with the fingerprint 9DC8 5822 9FC7 DD38 854A E2D8 8D81 803C 0EBF CD88, by searching for the last 8
characters of the fingerprint.
    
    ```bash
    sudo apt-key fingerprint 0EBFCD88
    
        pub   rsa4096 2017-02-22 [SCEA]
              9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88
        uid           [ unknown] Docker Release (CE deb) <docker@docker.com>
        sub   rsa4096 2017-02-22 [S]
    ```
    
- Repository add
    
    ```bash
    add-apt-repository \
           "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
           $(lsb_release -cs) \
           stable"
    ```
    
- Install Docker
    
    ```bash
    apt-get update 
    sudo apt-get install docker-ce docker-ce-cli containerd.io -y 
    ```
    
- Service şeklinde çalıştır
    
    ```jsx
    systemctl start docker
    systemctl enable docker
    ```
    
- Control
    
    ```bash
    
    docker run hello-world
    ```
    
### Let's do sample

- Define directory and sample file
    
    ```bash
    mkdir ~/sample-dockerfile/; cd ~/sample-dockerfile/
    echo "I am learning docker" > learn-docker.txt
    ```
    
- Define Dockerfile
    
    ```bash
    $ vim Dockerfile 
    FROM ubuntu:20.04
    RUN apt update 
    RUN apt install iftop -y
    COPY learn-docker.txt learn-docker.txt
    ```
    
- Dockerfile build (Docker-deamon pull ubuntu image from docker hub, then the docker-daemon does other processes ,Finally, The Output is container image )
    
    ```bash
    docker build . -t learn-docker
    ```
    
- Run container image
    
    ```bash
    docker run -it --name learn-docker learn-docker bash
    ls 
    cat learn-docker.txt
    ```

## 3. Docker compose

Docker Compose is a tool that was developed to help define and share multi-container applications. With Compose, we can create a YAML file to define the services and with a single command, can spin everything up or tear it all down.

- Installation docker-compose latest version
    
    ```bash
    
    bash <(curl -s https://gist.githubusercontent.com/ufkunkaraman/72ecf0b56eb7b9758c16c82b3c717275/raw/219d7768e3898b5e6f3665d7e1a97eec562e6a46/docker-compose-installation.bash)
    
    ```
    

### Let's do sample

- Define docker compose
    
    ```bash
    $ vim docker-compose.yaml
    version: "3.9"
        
    services:
      db:
        image: mysql:5.7
        volumes:
          - db_data:/var/lib/mysql
        restart: always
        environment:
          MYSQL_ROOT_PASSWORD: somewordpress
          MYSQL_DATABASE: wordpress
          MYSQL_USER: wordpress
          MYSQL_PASSWORD: wordpress
        
      wordpress:
        depends_on:
          - db
        image: wordpress:latest
        volumes:
          - wordpress_data:/var/www/html
        ports:
          - "8000:80"
        restart: always
        environment:
          WORDPRESS_DB_HOST: db
          WORDPRESS_DB_USER: wordpress
          WORDPRESS_DB_PASSWORD: wordpress
          WORDPRESS_DB_NAME: wordpress
    volumes:
      db_data: {}
      wordpress_data: {}
    ```
    
- Execute docker compose
    
    ```bash
    docker-compose up -d
    ```
- Bring up WordPress in a web browser (http://<your-machine-ip>:8080)

![_config.yml]({{ site.baseurl }}/images/wordpress-url-sample.png)



Referance:
  - https://www.upguard.com/blog/docker-vs-lxc  
  - https://www.ibm.com/cloud/learn/docker
  - https://www.techtarget.com/searchitoperations/definition/Docker-image