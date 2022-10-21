---
author: Lahiru Pathirage
category: post
comments: true
date:   2020-06-19
img: posts/gostep/functions.png
keywords: gcp, serverless, cloud functions, cli
layout: post
summary: Bootstrap a micro services project with Google cloud functions quickly.
tags:
- gcp, serverless, gostep, python, cli
title: "Super charge a Google cloud functions project"
---
<br>
When developing a microservices project with cloud functions, managing the cluster of functions all of them together can be a pain in the ass. That is why I thought of developing a simple cli tool to super charge the development and deployment process.

I named this little Pythonic tool as **gostep** a.k.a serverless templates provider for Google cloud platform. However this tool is still taking the baby steps. Hope to develop this to be more useful in future releases.

I would like to show you how it works up to now.

### First of all...
You need to have installed below components to use gostep cli.
1. Python version 3.x with PyPI a.k.a pip(https://www.python.org/download/releases/3.0/, https://pypi.org/project/pip/)
2. Gcloud sdk(https://cloud.google.com/sdk)
3. subversion(https://subversion.apache.org)
4. gostep(https://github.com/codimite/gostep)

### Next steps...
Now simply install gostep cli.
```
pip install gostep
```

After installing gostep, using gcloud sdk log in to your google cloud platform account.
```
gcloud auth login
```
Once you logged in, select the gcloud project that you want to use for your serverless functions.
```
gcloud config set project {projectId}
```
Oh! wait, to list down project Ids `gcloud projects list` or `gostep gcloud projects` can be used.

### All set...
Now we are ready build a cloud functions cluster.
First gostep needs a workspace directory, a gcloud service account and a credentials file for deployment purposes.
We can initiate them by this command, `gostep auth init {new_service_account_name} inside {workspace_directory}`.
```
gostep auth init my-service-account inside ./my-workspace
```
Now we can see a credentials file has been generated inside the workspace.
Next we need to create a configuration file which keeps the project skeleton. We need to chose a default region for that. Otherwise gostep will choose that for us. To get a list for our gcloud project `gostep gcloud locations` can be used. Now we can simply do, 
```
gostep base init {project_name} location{gcloud_region_id} version "0.1.0" explains {description} inside {workspace_directory}
```
In our case,
```
cd my-workspace
gostep base init my-new-project location asia-east2 version "0.1.0" explains "my sample project"
```
It's geen light now to create cloud functions now. gostep has [specified template structures](https://github.com/codimite/gostep-templates) for this.
Let's simply bootstrap a python cloud function. For this purpose, 
```
gostep service init {cloud_function_name} location {gcloud_region_id} version {service_version} env {runtime} explains {desciption} inside {workspace_directory}
```
Since we are in the workspace directory and we already set up a default location Id we won't be using `location` and `inside` arguments.
```
gostep service init my-python-function version "0.1.0" env python
```
Let's bootstrap another function with nodeJs.
```
gostep service init my-nodejs-function version "0.1.0" env nodejs
```
We can see source files inside the `{workspace_directory}/src`. In our case inside, `my-workspace/src/my-nodejs-function` and `my-workspace/src/my-python-function`.

### Great...!
Now our project is ready to get deployed.
Aight... Let's do,
```
gostep deploy diff
```
`diff` keyword will only deploy the changes we made for our functions(gostep tracks md5 of the function directory). To deploy a single function it needs to be called by name. `gostep deploy {function_name}`. In our case,
```
gostep deploy my-nodejs-function
```

### Bravo...!
Now our functions are deployed and ready to be executed.
![cfunctions](/assets/img/posts/gostep/functions.png)

### In future releases...
* More templates, templates for go lang, templates for Spring framework, etc...
* Handle function triggers such as pubsub, events, etc...
* Run cloud functions cluster in local environment, so developers can benefit debugging.

Please find the source code in https://github.com/lpsandaruwan/gostep.