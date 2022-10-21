---
author: Lahiru Pathirage
category: post
comments: true
date:   2017-02-26
keywords: JVM performance, MBeans, CPU usage
img: java-logo.jpg
layout: post
summary: Calculate JVM CPU usage using Java management extension beans.
tags:
- java, jvm cpu utilization, mxbeans, devops
title:  "JVM CPU usage using Java MXBeans"
---

This is a solution to a problem, occurred to me while developing [Depli](https://github.com/lpsandaruwan/depli) a JVM monitoring dashboard which uses JMX remote connections.
There is no way to get the JVM CPU usage directly using MXBeans in JDKs older than version 7. For my application I wanted a universal method.
Finally, I got it working thanks to [source code of jconsole](http://grepcode.com/file/repository.grepcode.com/java/root/jdk/openjdk/8-b132/sun/tools/jconsole/SummaryTab.java?av=f).


##### Explanation

Ideal solution to calculate CPU usage is periodically look at the idle time and get the time that JVM is not idle.
But there is no method to expose idle time in MXBeans. So here, JVM CPU usage is calculated using getting the
ratio of how much discrete time slices JVM used and how long JVM was up while using those time slices(total JVM uptime in all the available threads for JVM),
in a particular time period. Below algorithm will explain it better.

{% highlight java %}
previousJvmProcessCpuTime = 0;
previousJvmUptime = 0;

function getCpuUsagePercentage() {
    elapsedJvmCpuTime = currentJvmCputime - previousJvmProcessCpuTime;
    elapsedJvmUptime = currentJvmUptime - previousJvmUptime;

    // total jvm uptime
    totalElapsedJvmUptime = elapsedJvmUptime * availableNumberOfCpusForJvm;

    // calculate cpu usage ratio
    cpuUsage = (elapsedJvmCpuTime / totalElapsedJvmUptime);

    previousJvmProcessCpuTime = currentJvmCputime;
    previousJvmUptime = currentJvmUptime;

    // return as a percentage
    return cpuUsage * 100;
}
{% endhighlight %}

##### Get it working

We will be using remote method invocation(RMI) to connect and call methods in remote MXBean interfaces.
First we have to connect to a JMX remote connection and have to initiate a managed beans server connection.

{% highlight java %}
// hardcoded connection parameters
final String HOSTNAME = "localhost";
final int PORT = 9999;

// initiate address of the JMX API connector server
String serviceURL = "service:jmx:rmi:///jndi/rmi://" + HOSTNAME + ":" + PORT + "/jmxrmi";
JMXServiceURL jmxServiceURL = new JMXServiceURL(serviceURL);

// initiate client side JMX API connector
// here we set environment attributes to null, since I am not using any authentication method connect to JMX remote
JMXConnector jmxConnector = JMXConnectorFactory.connect(jmxServiceURL, null);

// initiate managed bean server connection
MBeanServerConnection mBeanServerConnection = jmxConnector.getMBeanServerConnection();
{% endhighlight %}

Now we can create proxy connections to MXBean interfaces to forward method calls though the managed bean server
connection that we have created above. We will be using runtime MXBean, operating system MXBean and operating system
MXBean from platform extension.

{% highlight java %}
com.sun.management.OperatingSystemMXBean peOperatingSystemMXBean;
java.lang.management.OperatingSystemMXBean operatingSystemMXBean;
java.lang.management.RuntimeMXBean runtimeMXBean;

// initiate proxy connections
peOperatingSystemMXBean = ManagementFactory.newPlatformMXBeanProxy(
        mBeanServerConnection,
        ManagementFactory.OPERATING_SYSTEM_MXBEAN_NAME,
        com.sun.management.OperatingSystemMXBean.class
);
operatingSystemMXBean = ManagementFactory.newPlatformMXBeanProxy(
        mBeanServerConnection,
        ManagementFactory.OPERATING_SYSTEM_MXBEAN_NAME,
        OperatingSystemMXBean.class
);
runtimeMXBean = ManagementFactory.newPlatformMXBeanProxy(
        mBeanServerConnection,
        ManagementFactory.RUNTIME_MXBEAN_NAME,
        RuntimeMXBean.class
);
{% endhighlight %}

We can call the appropriate methods to get required data now. We need data on how long JVM processes used the CPU, JVM uptime and
how much processors allowed for the JVM in a paticular time period.

{% highlight java %}
// keeping previous timestamp
long previousJvmProcessCpuTime = 0;
long previousJvmUptime = 0;

// Get JVM CPU usage
public float getJvmCpuUsage() {
    // elapsed process time is in nanoseconds
    long elapsedProcessCpuTime = peOperatingSystemMXBean.getProcessCpuTime() - previousJvmProcessCpuTime;
    // elapsed uptime is in milliseconds
    long elapsedJvmUptime = runtimeMXBean.getUptime() - previousJvmUptime;

    // total jvm uptime on all the available processors
    long totalElapsedJvmUptime = elapsedJvmUptime * operatingSystemMXBean.getAvailableProcessors();
    
    // calculate cpu usage as a percentage value
    // to convert nanoseconds to milliseconds divide it by 1000000 and to get a percentage multiply it by 100
    float cpuUsage = elapsedProcessCpuTime / (totalElapsedJvmUptime * 10000F);

    // set old timestamp values
    previousJvmProcessCpuTime = peOperatingSystemMXBean.getProcessCpuTime();
    previousJvmUptime = runtimeMXBean.getUptime();

    return cpuUsage;
}
{% endhighlight %}

Now we can get JVM CPU usage by calling the `getJvmCpuUsage` periodically. You can obtain the complete Java code from [this Gist](https://gist.github.com/lpsandaruwan/f2cef0aa91ae68cb041c7ecda04a0724).
<br>