---
author: lpsandaruwan
categories: [Posts, Linux]
date: 2017-05-11
img: sb1095.png
keywords: USB DAC, Creative Labs XFi, Linux
summary: Configure volume control knob of Creative SBS1095 USB sound card to adjust volume in Linux.
tags: [usb dac, creative labs, sb1095, linux, volume knob]
title: "Setting up Creative Labs USB DAC volume knob on Linux"
---

Lately I bought a [Creative Labs SB1095](http://us.creative.com/p/sound-blaster/sound-blaster-x-fi-surround-5-1-pro), a 5.1 USB DAC for my laptop.
This USB sound card works perfectly on Linux.
The sound quality is better than the integrated,
but it has a volume knob on it and a remote controller,
which does not support out of the box by Linux distributions which I have tried(Ubuntu, Linux Mint, OpenSuse, Arch Linux).
After digging up the internet a little bit I perceived that it is required to configure a software volume controller to handle the volume knob.
However, I did not want to go for that kind of advanced configurations, and finally found an easy workaround for this purpose. Would like to take down the steps,
so it might help others which have the same issue.

To achieve this I used lirc (an application which interprets IR actions) to detect volume knob and remote actions and wrapped it with irexec (trigger actions for lirc inputs) to change system sound volume.

I am currently using Linux Mint 18.1, so this solution will work perfectly with Ubuntu 16.04 derivatives.
For other Linux distributions please follow [this guide](https://sites.google.com/site/klaasdc/runeaudio-creative-xfi-5-1-usb).
<br><br>

#### Requirements
First I installed these packages, selected Creative USB IR Receiver (SB0540) for remote controller configuration(not the SB1095,
but it has the same configurations) and selected none for IR transmitter in appearing configuration menus when installing.

{% highlight bash %}
sudo apt install lirc lirc-x
{% endhighlight %}
<br>

#### Configurations
Then I changed the `REMOTE_DRIVER` in lirc hardware configuration file `/etc/lirc/hardware.conf`, left other settings unchanged.

{% highlight bash %}
# ~/.lircrc
begin
 remote = *
 prog = irexec
 config = amixer -D pulse sset Master 5%-
 button = vol-
 repeat = 1
end

begin
 remote = *
 prog = irexec
 config = amixer -D pulse sset Master 5%+
 button = vol+
 repeat = 1
end

begin
 remote = *
 prog = irexec
 config = amixer -D pulse sset Master 0
 button = mute
end
{% endhighlight %}
<br>

#### Test
Then I restarted lirc daemon and loaded irexec daemon.

{% highlight bash %}
sudo service lirc restart
irexec -d # make a startup entry to load on system boot up
{% endhighlight %}

Now I have the volume knob working just fine.
<br>If the volume is not changing check whether lirc detects inputs by the USB device using the command `irw`

{% highlight bash %}
# irw sample output for volume knob changes
0000000000000010 01 vol+ RM-1500
0000000000000010 00 vol+ RM-1500
0000000000000010 01 vol+ RM-1500
000000000000000f 03 vol- RM-1500
000000000000000f 00 vol- RM-1500
000000000000000d 00 mute RM-1500
{% endhighlight %}

If the output is something like the above, try changing config values(commands to change sound volume) in the `~/.lircrc` after that try restarting lirc daemon and loading `irexec` again.
<br>

##### Sources
[http://alsa.opensrc.org/Usb-audio#Creative_USB_X-Fi_Surround_5.1](http://alsa.opensrc.org/Usb-audio#Creative_USB_X-Fi_Surround_5.1)
<br>[http://www.lirc.org/html/configure.html](http://www.lirc.org/html/configure.html)
<br><br><br>
