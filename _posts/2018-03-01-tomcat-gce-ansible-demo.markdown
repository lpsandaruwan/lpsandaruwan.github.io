---
author: lpsandaruwan
categories: [Posts, DevOps]
comments: true
date:  2018-03-01
img: posts/gce-tomcat-ansible/web.png
summary: Orchestrating Apache tomcat Tomcat deployments in Google Cloud Platform using Ansible.
tags: [tomcat, gce, ansible, configuration-management]
title: "Application Deployment in Apache Tomcat on GCE Using Ansible"
---

Think about a person who needs a cloud instance temporarily to deploy a web application to do tests frequently and throughout the time he deploys the application,
use it for a while and then deletes the instance to save the cost.
Or someone needs to create a cluster, thus he needs to instantiate several cloud servers at once,
install dependencies and deploy the application on each server. Doing these tasks by hand costs much effort and it is inefficient.
The way to make such scenarios easier, efficient and effective is making a reusable structure which does these repetitive tasks when we invoke it.
For that purpose, we use configuration management.

![cm_what_happens](/assets/img/content/posts/gce-tomcat-ansible/cm_showoff.png)

This tutorial is about a such scenario, to splash the easiness of using a reusable code base when deploying an application,
using **Ansible**(a radical and impressive configuration management tool with its capabilities and ease of use compared to other tools),
**Google cloud platform**(future potential cloud services with a good pricing model) and **Apache Tomcat**
(one of the most popular web servers in the Java community). For this purpose, we are going to use the [gce-tomcat-ansible-demo](https://github.com/lpsandaruwan/gce-tomcat-ansible-demo) repository,
 a concatenation of Ansible playbooks(the reusable code base) implemented by me to reflect this task.
  Running this will create a Google compute engine in a given Google cloud platform project, install java,
   configure an Apache Tomcat server and will deploy a war file according to given metadata.
   (To understand playbooks knowing Ansible basics is more than enough. Refer [Ansible documentation](http://docs.ansible.com/ansible/latest/intro_getting_started.html))

![playbook_flow](/assets/img/content/posts/gce-tomcat-ansible/playbook_flow.png)

<br>
## Getting started

To run the playbook you need to have **a Google cloud platform account**, **a Google cloud platform project** and **a service account**
to manipulate Google cloud project with appropriate roles and permission and **an Ansible running machine**.

There are several ways to install Ansible but here let’s install it using python pip package manager since the installation
is not going to depend on which operating system you use. But first make sure Python version 2,
Python development and Python pip(most probably python-dev and python-pip respectively,
refer [installing pip with package managers for more information](https://packaging.python.org/guides/installing-using-linux-tools/#installing-pip-setuptools-wheel-with-linux-package-managers)) packages have been installed on the machine that you are
 going to install Ansible. To make sure, try running the command below.

{% highlight bash %}
pip list
{% endhighlight %}

![pip_list](/assets/img/content/posts/gce-tomcat-ansible/pip_list.png)

And then clone the repository [gce-tomcat-ansible-demo](https://github.com/lpsandaruwan/gce-tomcat-ansible-demo), which contains playbooks to create a Google compute engine instance,
 install Java, configure a Apache Tomcat server and deploy a given war file on the configured application server.

{% highlight bash %}
git clone https://github.com/lpsandaruwan/gce-tomcat-ansible-demo.git
{% endhighlight %}

Then change the current working directory into the cloned repository.

{% highlight bash %}
cd gce-tomcat-ansible-demo
{% endhighlight %}

Now use the `requirements.txt` to install appropriate Python pip package versions which this playbook has been written and tested for.

{% highlight bash %}
pip install -r requirements.txt
{% endhighlight %}

This will install ansible and apache-libcloud(a fine interface to deal with popular cloud services)
Python packages which we are going to use for manipulating Google cloud project.

Make sure that you have a working Google cloud platform project(if not refer [creating and manage projects](https://cloud.google.com/resource-manager/docs/creating-managing-projects)),
and a service account assigned to it(do not use the default service account since it has full permission over the project,
refer [service accounts](https://cloud.google.com/compute/docs/access/service-accounts) for more information) and then obtain the project ID,
private JSON keyfile(you can obtain the JSON key file when creating a new service account,
if not refer [service account credentials](https://cloud.google.com/storage/docs/authentication#service-account-credentials)) and the service account email from them.
Now we have to configure Ansible running machine to access the GCP project.
Here Let’s use Google cloud SDK to make things easier(refer [install Google cloud SDK](https://cloud.google.com/sdk/downloads#versioned)).
After installing the SDK run the below command to initialize.

{% highlight bash %}
gcloud init
{% endhighlight %}

![gcloud_init](/assets/img/content/posts/gce-tomcat-ansible/gcloud_init.png)

And it will direct you to the web page in your browser. From there allow the access to the SDK.
 Now in the terminal select the appropriate project ID. After that you should be able to run playbooks on the appropriate project and manipulate it.
  If you run into a permission problem connecting the instance configure SSH authentication using cloud SDK tools by running the command below.
  (refer [gcloud compute config-ssh](https://cloud.google.com/sdk/gcloud/reference/compute/config-ssh))

{% highlight bash %}
gcloud compute config-ssh
{% endhighlight %}
<br>

## Play it

Now configure the file `gce-vars/authentication` and update the obtained metadata from GCP project and service account in playbook.

{% highlight yaml %}
project_id: “project-id-193706”
credentials_file: “/path/to/private/json/key/file”
service_account_email: “tomcat-ansible-demo@service-account-193706.iam.gserviceaccount.com”
{% endhighlight %}

After that change instance metadata in `gce-vars/instance` as you need. Here,
we are going to add firewall rules to allow HTTP traffic on 8080 ports for Apache Tomcat server

{% highlight yaml %}
name: tomcat-ansible-demo
type: f1-micro
image: debian-9
zone: europe-west1-b
allowed_ports_tcp: tcp:8080
allowed_ports_udp: udp:8080
{% endhighlight %}

Then set the `ANSIBLE_HOSTS` environment variable required by Ansible for SSH interactions.
To do that simply put hostnames in `hosts` file and import it as below.

{% highlight bash %}
export ANSIBLE_HOSTS=hosts
{% endhighlight %}

Now you should be able to run this project. Simply run the main playbook.

{% highlight bash %}
ansible-playbook run.ym
{% endhighlight %}

Final output will be as below. And after a successful run you will have your application deployed in an
Apache Tomcat server on a Google compute engine instance.

![final](/assets/img/content/posts/gce-tomcat-ansible/final.png)
![web](/assets/img/content/posts/gce-tomcat-ansible/web.png)
<br>

## Appendix

(If you wish to change Java version, Tomcat version etc.
configure main.yml in defaults directory in roles. They contain configuration variables with lower priorities.)

{% highlight text %}
gce-tomcat-ansible-demo
|------gce_vars				# variables related to Google cloud platform
|	|	authentication		# Google project and service account related metadata
|	|	instance		# GCE instance related metadata
|
|-------roles
|	|-------java				# role to install Java
|	|	|-------defaults
|	|	|	|	main.yml	# default variables for java role
|	|	|
|	|	|-------tasks
|	|	|	|	main.yml	# tasks to download and install Java
|	|
|	|-------tomcat
|	|	|-------defaults
|	|	|	|	main.yml	# default variables for tomcat role
|	|	|
|	|	|-------files
|	|	|	|	tomcat-users.xml	# set tomcat manager credentials
|	|	|
|	|	|-------tasks
|	|	|	|	main.yml	# tasks to download and configure tomcat
|	|
|	|-------tomcat-deploy
|	|	|-------defaults
|	|	|	|	main.yml	# default variables for tomcat-deploy role
|	|	|
|	|	|-------tasks
|	|	|	|	main.yml	# tasks to deploy the given war file
|
|	hosts					# ansible hosts
|	bootstrap-instance.yml			# playbook to initiate google cloud instance
|	deploy-war.yml				# playbook to deploy war file
|	install-java.yml			# playbook to install Java
|	install-tomcat.yml			# playbook to install Apache Tomcat
|	run.yml					# main playbook to run
{% endhighlight %}

<br>
<a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" href="http://purl.org/dc/dcmitype/Text" property="dct:title" rel="dct:type">gce-tomcat-ansible-demo post</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="http://lahiru.site/blog/2018/tomcat-gce-ansible-demo/" property="cc:attributionName" rel="cc:attributionURL">Lahiru Pathirage</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.<br />Based on a work at <a xmlns:dct="http://purl.org/dc/terms/" href="https://github.com/lpsandaruwan/gce-tomcat-ansible-demo" rel="dct:source">https://github.com/lpsandaruwan/gce-tomcat-ansible-demo</a>.