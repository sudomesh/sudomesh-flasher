
var os = require('os');
var net = require('net');
var Netmask = require('netmask').Netmask;

var nm = require('./lib/network_manager');

// Check if this system has an IP in the same range as the router
// and that it's not the same as the router's IP
// This function relies on os.networkInterfaces
// which unfortunately ignored ethernet interfaces
// if they aren't plugged into an active device :(
// Returns the number of interfaces with a valid IP
// It returns -1 if the ip matches 
function numValidIPs(routerIP, cb) {

    if(!os.networkInterfaces) {
        return 0;
    }
    var found = 0;
    var ifaces = os.networkInterfaces();
    var i, iface, addrs, addr, netmask;
    for(iface in ifaces) {
        addrs = ifaces[iface];
        for(i=0; i < addrs.length; i++) {
            addr = addrs[i];
            if(addr.internal || addr.family != 'IPv4') continue;
            
            if(addr.address == routerIP) {
                return -1;
                
                if(!addr.netmask) {
                    // node pre 0.11 did not include netmask so make assumptions
                    if(addr.address.match(/^10\./)) {
                        addr.netmask = '255.0.0.0';
                    } else {
                        addr.netmask = '255.255.255.0';
                    }
                }
                var block = new Netmask(addr.address+'/'+addr.netmask);
                if(block.contains(routerIP)) {
                    found += 1;
                    break;
                }
            }
        }
    }
    return found;
}

// check if this system has a specific IP
// callback first arg is error, second is true or false
function hasExactIP(ip, cb) {

    var server = net.createServer();
    
    server.on('error', function(err) {
        if(err.code === 'EADDRNOTAVAIL') return cb(null, false);
        return cb(err);
    });
        
    server.listen(64876, ip, 10, function() {
        server.close();
        return cb(null, true);
    });

}


function ipAssistant(cb) {
    var platform = os.platform();

    if(platform == 'linux') {
        console.log("Looks like this is Linux system");
        console.log("Checking if you're using Network Manager");
        nm.check(function(err, version) {
            if(version) {
                console.log("Looks like you're using Network Manager version: " + version);
            } else {
                console.log("Looks like you're not using Network Manager. Good for you.");
            };
            
        });
        return;
    } else if(platform = 'darwin') {
        console.log("Looks like this is Mac OS X");
        

    }
}



ipAssistant(console.error);
