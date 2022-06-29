---
layout: post
title: "Docker and Docker Compose Installation"
description: "Docker and Docker Compose Installation"
date: 2022-05-11 09:00:07
hero_image: /images/vm-vs-docker-container.png
hero_height: is-large
hero_darken: true
image: /images/vm-vs-docker-container.png
tags: linux docs learn docker docker-compose
---

### What is Docker?

![_config.yml]({{ site.baseurl }}/images/docker_container_engine_logo.png)

Docker is an open source containerization platform.



### why will not Docker use with kubernetes?
https://kubernetes.io/blog/2018/05/24/kubernetes-containerd-integration-goes-ga/





Dockerfile,Docker-compose,Iamge,Container,docker hub registry açıkla



 Nasıl Çalışır?

LXC (Linux Container) üzerine kurulu bir teknoloji olan Docker, aynı linux işletim sistemi üzerinde birbirinden izole bir biçimde çalışan konteynerler oluşturmaktadır. Her bir konteyner bir process kullanmakta ve bu sayede konteynerler kolaylıkla çoğaltılabilmektedir. Ayrıca Docker, klasik sanal makinelerden (vmware, virtualbox vb.) farklı olarak bir Hypervisor katmanına sahip değildir. Bunun yerine Docker Engine üzerinden konak işletim sistemine erişerek sistem kaynaklarını paylaşımlı kullanır.


 Avantajları Nelerdir?

    Docker, Hypervisor kullanmaz ve tam yüklü bir işletim sistemi barındırmaz bu sayede saniyeler içinde çalışır ve kullanıma hazır hale gelir.
    Docker, yazılımlarınızın tüm altyapı gereksinimlerini kod olarak saklar. (versiyonlama) Bu Docker'ın en önemli özelliklerinden biridir. Bu özellik sayesinde yazılımınızı farklı servis sağlayıcıları üzerinde kolaylıkla gezindirebilir, çoğaltabilir veya paylaşabilirsiniz.
    Docker, çok az kaynakla büyük işler yapabilmektedir. Bunun ana sebebi kullandığı konteyner teknolojisidir.
    Uygulamalarınıza beklenmedik bir şekilde yüksek trafik geldiğinde saniyeler içerisinde 1000'lerce konteyner hazır hale gelerek yükünüzü omuzlar.
    Docker, uygulamalarınızı standart bir zemine oturtarak her platformda aynı şekilde çalışmasını sağlar.





### What is MinIO? 
MinIO offers high-performance, S3-compatible object storage. If you search Object Storage for use on prime or cloud, you can use this. MinIO provides an Amazon Web Services S3-compatible API and supports all core S3 features



### why will not Docker use with kubernetes?
https://kubernetes.io/blog/2018/05/24/kubernetes-containerd-integration-goes-ga/


Referance:
  - https://www.upguard.com/blog/docker-vs-lxc   