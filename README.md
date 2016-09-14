
NOT YET WORKING! Come back later.
        
This is a command-line utility that lets the user flash any router supported by sudo mesh. After flashing it optionally generates and prints a sticker with configuration information for the user.

# Setup

Install node modules:

```
npm install
```

Copy the `settings.js.example` file to `settings.js` and edit to taste. 

# Usage

```
./bin/flash.js router_model firmware_file

  --auto: Do not guide or prompt user before flashing
  --sticker: Generate and print sticker
  --nocheck: Disable TP-Link filename checks
  --ip: Alternate IP to use
  --port: Alternate port to use
```

This program will guide you through the flashing process, step by step. 

Possible values for router_model are:

* ubiquiti 
* tp-link
* mynet
* nexx

If `--auto` is specified then the program will not guide you and will not wait for user input before proceeding.

If `--sticker` is specified then a sticker will be generated in the subdir specified by settings.js (default `stickers/`) and if printing is enabled in settings.js then it will attempt to send to the printer. 

For TP-Link flashing this program will check if the filename requested by the router matches what is exected for supported router models. Use `--nocheck` to turn this checking off.

# Printing

The stickers are printed using the [ql570](https://github.com/sudomesh/ql570/) program which supports the Brother QL570 and QL700 thermal sticker printers.

# Routers

Brief list of supported routers and notes on flashing them.

## TP-Link 

Specifically the WDR3500, WDR3600 and WDR4300 models.

When booted into reflashing mode these routers run a tftp client so this program runs a tftp server and waits for the router to connect and download the firmware.

## Ubiquiti AirMax

The AirMax M models, not the new 802.11ac models

When booted into reflashing mode these routers run a tftp server so this program uses a tftp client to connect and upload the firmware.

IMPORTANT IF THE FIRMWARE UPLOAD FAILS WITH A CHECKSUM ERROR: The official Ubiquiti firmware that ships with the device is called AirOS. If the device is running AirOS v5.6 and above then firmware upload using this utility will fail. If this happens then DO NOT try to upload the firmware via the AirOS web interface. This will succeed and you will be stuck with a device where any filesystem changes are lost upon rebooting. Instead use the web interface, NOT THIS UTILITY AND NOT TFTP, to upload AirOS version 5.5 (you should be able to find it on the web somewhere). This will downgrade not only AirOS but also the bootloader, which is what you want. After completing the downgrade you can come back and use this utility normally

## Western Digital MyNet N600

When booted into reflashing mode these routers have a built-in web interface for flashing, so this program is not needed.

Hold down the internal reset button using a paper clip (poke through bottom of device) while powering on. Wait for front LED to start blinking once a second before removing paperclip.

Set your computer's IP to 192.168.1.10 

IMPORTANT: YOU MUST SET YOUR COMPUTER'S IP TO EXACTLY 192.168.1.10 - NOTHING ELSE WILL WORK.

In a browser go to http://192.168.1.1/ and upload the firmware file using the form.

## Nexx WT3020

These nodes are flashed using the built-in web UI. They do not seem to have a special "reflashing mode" so they are easy to brick.

Connect to the LAN port. The device should give you an IP using DHCP, or give yourself e.g. `192.168.8.2` manually.

Go to http://192.168.8.1/ and login:

```
username: admin
password: admin
```

Go to `System Setting -> Upgrade Firmware`.

Select the firmware file and click `Upgrade`.

# Copyright and license

Copyright 2016 Marc Juul

License: GPLv3
