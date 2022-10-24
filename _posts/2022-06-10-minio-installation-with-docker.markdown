---
layout: post
title: "MinIO Object Storage"
description: "MinIO Object Storage"
date: 2022-06-10 09:00:07
hero_image: /images/minio-logo.jpg
hero_height: is-medium
hero_darken: true
image: /images/minio-logo.jpg
tags: linux docs learn minio s3 locals3 
summary: ""
---

What is MinIO?, Learn MinIO Object Storage?

### What is MinIO? 
MinIO offers high-performance, S3-compatible object storage. If you search Object Storage for use on prime or cloud, you can use this. MinIO provides an Amazon Web Services S3-compatible API and supports all core S3 features

### MinIO's Architecture 
MinIO is designed to be cloud native and can run as lightweight containers managed by external orchestration services such as Kubernetes. The entire server is a ~40MB static binary and is highly efficient in its use of CPU and memory resources - even under high loads. The result is that you can co-host a large number of tenants on shared hardware.

![_config.yml]({{ site.baseurl }}/images/minio_architecture_diagram.svg)


MinIO operates on commodity servers with locally attached drives (JBOD/JBOF). All of the servers in a cluster are equal in capability (fully symmetrical architecture). There are no name nodes or metadata servers.

MinIO writes data and metadata together as objects, eliminating the need for a metadata database. In addition MinIO performs all functions (erasure code, bitrot check, encryption) as inline, strictly consistent operations. The result is that MinIO is exceptionally resilient.

Each MinIO cluster is a collection of distributed MinIO servers with one process per node. MinIO runs in the user space as a single process and uses lightweight co-routines for high concurrency. Drives are grouped into erasure sets (16 drives per set by default) and objects are placed on these sets using a deterministic hashing algorithm.

MinIO is designed for large scale, multi-data center cloud storage services. Each tenant runs their own MinIO cluster, fully isolated from other tenants giving them the ability to protect them from any disruption on upgrade, update, security incidents. Each tenant scales independently by federating clusters across geographies.

### MinIO's Installation for Analyst

**PreRequisite**

- 1 vm (8 CPU, 8GB RAM) for MinIO Cluster Analyst(Ubuntu 20.04) 

**Minio Cluster Installation**

- **Define PreRequisite and Setupfile**

  - Setup File Define
      
      ```bash
      mkdir /SETUP/minio/ -p 
      cd /SETUP/minio/ 
      
      ```
      
  - Define a directory for minio storage
      
      ```bash
      mkdir /data
      ```
      
- **Define Docker-compose and nginx confugration**
  - Define Minio Cluster with docker and docker-compose (NOTE: Please Change usernmae and password ("MINIO_ROOT_USER: minioadmin" and MINIO_ROOT_PASSWORD: minioadmin))

    ```yaml
    $ vim docker-compose.yaml
    ####
    version: '3.7'
    
    # Settings and configurations that are common for all containers
    x-minio-common: &minio-common
      image: quay.io/minio/minio:RELEASE.2022-04-12T06-55-35Z
      command: server --console-address ":9001" http://minio{1...4}/data{1...2}
      expose:
        - "9000"
        - "9001"
      environment:
        MINIO_ROOT_USER: minioadmin
        MINIO_ROOT_PASSWORD: minioadmin
      healthcheck:
        test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
        interval: 30s
        timeout: 20s
        retries: 3
    
    # starts 4 docker containers running minio server instances.
    # using nginx reverse proxy, load balancing, you can access
    # it through port 9000.
    services:
      minio1:
        <<: *minio-common
        hostname: minio1
        volumes:
          - /data/data1-1:/data1
          - /data/data1-2:/data2
    
      minio2:
        <<: *minio-common
        hostname: minio2
        volumes:
          - /data/data2-1:/data1
          - /data/data2-2:/data2
    
      minio3:
        <<: *minio-common
        hostname: minio3
        volumes:
          - /data/data3-1:/data1
          - /data/data3-2:/data2
    
      minio4:
        <<: *minio-common
        hostname: minio4
        volumes:
          - /data/data4-1:/data1
          - /data/data4-2:/data2
    
      nginx:
        image: nginx:1.19.2-alpine
        hostname: nginx
        volumes:
          - ./nginx.conf:/etc/nginx/nginx.conf:ro
        ports:
          - "80:9000"
          - "9001:9001"
        depends_on:
          - minio1
          - minio2
          - minio3
          - minio4
    
    ## By default this config uses default local driver,
    ## For custom volumes replace with volume driver configuration.
    volumes:
      data1-1:
      data1-2:
      data2-1:
      data2-2:
      data3-1:
      data3-2:
      data4-1:
      data4-2:
    ```
        
  - Define Nginx confugration (NOTE: Please Change domain (server_name  s3.devops.example.com;))
        
      ```conf
      $ vim nginx.conf
      ###
      user  nginx;
      worker_processes  auto;
      
      error_log  /var/log/nginx/error.log warn;
      pid        /var/run/nginx.pid;
      
      events {
          worker_connections  4096;
      }
      
      http {
          include       /etc/nginx/mime.types;
          default_type  application/octet-stream;
      
          log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                            '$status $body_bytes_sent "$http_referer" '
                            '"$http_user_agent" "$http_x_forwarded_for"';
      
          access_log  /var/log/nginx/access.log  main;
          sendfile        on;
          keepalive_timeout  65;
      
          # include /etc/nginx/conf.d/*.conf;
      
          upstream minio {
              server minio1:9000;
              server minio2:9000;
              server minio3:9000;
              server minio4:9000;
          }
      
          upstream console {
              ip_hash;
              server minio1:9001;
              server minio2:9001;
              server minio3:9001;
              server minio4:9001;
          }
      
          server {
              listen       9000;
              listen  [::]:9000;
              server_name  s3.devops.example.com;
      
              # To allow special characters in headers
              ignore_invalid_headers off;
              # Allow any size file to be uploaded.
              # Set to a value such as 1000m; to restrict file size to a specific value
              client_max_body_size 0;
              # To disable buffering
              proxy_buffering off;
              proxy_request_buffering off;
      
              location / {
                  proxy_set_header Host $http_host;
                  proxy_set_header X-Real-IP $remote_addr;
                  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                  proxy_set_header X-Forwarded-Proto $scheme;
      
                  proxy_connect_timeout 300;
                  # Default is HTTP/1, keepalive is only enabled in HTTP/1.1
                  proxy_http_version 1.1;
                  proxy_set_header Connection "";
                  chunked_transfer_encoding off;
      
                  proxy_pass http://minio;
              }
          }
      
          server {
              listen       9001;
              listen  [::]:9001;
              server_name  s3.devops.example.com;
      
              # To allow special characters in headers
              ignore_invalid_headers off;
              # Allow any size file to be uploaded.
              # Set to a value such as 1000m; to restrict file size to a specific value
              client_max_body_size 0;
              # To disable buffering
              proxy_buffering off;
              proxy_request_buffering off;
      
              location / {
                  proxy_set_header Host $http_host;
                  proxy_set_header X-Real-IP $remote_addr;
                  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                  proxy_set_header X-Forwarded-Proto $scheme;
                  proxy_set_header X-NginX-Proxy true;
      
                  # This is necessary to pass the correct IP to be hashed
                  real_ip_header X-Real-IP;
      
                  proxy_connect_timeout 300;
                  
                  # To support websocket
                  proxy_http_version 1.1;
                  proxy_set_header Upgrade $http_upgrade;
                  proxy_set_header Connection "upgrade";
                  
                  chunked_transfer_encoding off;
      
                  proxy_pass http://console;
              }
          }
      }
      ```

- **Installation, Access the minio's website and mc cli usage**
  - Setup File Define
      
      ```bash
      docker-compose up -d      
      ```
  - Access Minio (http://x.x.x.x)(username:minioadmin, password:minioadmin)

    ![_config.yml]({{ site.baseurl }}/images/minio_web_ui.png)

  - Let's learn push object, get object, delete object and so on with mc cli.
      - Install mc 
          ```bash
          wget https://dl.min.io/client/mc/release/linux-amd64/mc
          chmod +x mc
          sudo mv mc /usr/local/bin/mc

          ```

      - Define Confugration
          ```bash
          #mc config host add <ALIAS> <COS-ENDPOINT> <ACCESS-KEY> <SECRET-KEY>
          mc config host add minioadmin http://x.x.x.x:9000 minioadmin minioadmin
          ### OUTPUT
          #Added `minioadmin` successfully.

          ```

      - Check Minio Cluster

          ```bash
          mc admin info minioadmin
          ### OUTPUT
          #●  minio1:9000
          #   Uptime: 4 hours
          #   Version: 2022-05-19T18:20:59Z
          #   Network: 4/4 OK
          #   Drives: 2/2 OK
          #   Pool: 1st
          #
          #●  minio2:9000
          #   Uptime: 4 hours
          #   Version: 2022-05-19T18:20:59Z
          #   Network: 4/4 OK
          #   Drives: 2/2 OK
          #   Pool: 1st
          #
          #●  minio3:9000
          #   Uptime: 4 hours
          #   Version: 2022-05-19T18:20:59Z
          #   Network: 4/4 OK
          #   Drives: 2/2 OK
          #   Pool: 1st
          #
          #●  minio4:9000
          #   Uptime: 4 hours
          #   Version: 2022-05-19T18:20:59Z
          #   Network: 4/4 OK
          #   Drives: 2/2 OK
          #   Pool: 1st

          ```
      - Define Bucket

          ```bash
          mc mb minioadmin/test

          ```
      - Copy objects
          ```bash
          echo "test" >>test.txt
          mc cp test.txt minioadmin/test/test.txt

          ```

      - List objects
          ```bash
          mc ls minioadmin/test

          ```

      - Display objects
          ```bash
          mc cat minioadmin/test/test.txt

          ```

      - Remove objects
          ```bash
          mc ls minioadmin/test

          ```

- **Minio's Access list example(Only access test bucket and only upload, delete and get   backups path on the test bucket  )**

  ```yaml
  {
  "Version": "2012-10-17",
  "Statement": [
      {
          "Effect": "Allow",
          "Action": [
              "s3:ListBucket"
          ],
          "Resource": [
              "arn:aws:s3:::test/*"
          ]
      },
      {
          "Effect": "Allow",
          "Action": [
              "s3:AbortMultipartUpload",
              "s3:DeleteObject",
              "s3:GetObject",
              "s3:ListAllMyBuckets",
              "s3:ListBucket",
              "s3:ListMultipartUploadParts",
              "s3:PutObject"
          ],
          "Resource": [
              "arn:aws:s3:::test/backups/*"
          ]
      }
    ]
  } 

  ```

Usefull Links:
- https://cloud.ibm.com/docs/cloud-object-storage?topic=cloud-object-storage-minio
- https://docs.min.io/minio/baremetal/reference/minio-mc.html
- https://docs.min.io/docs/deploy-minio-on-docker-compose.html