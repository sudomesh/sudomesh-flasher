
var os = require('os');
var net = require('net');
var Netmask = require('netmask').Netmask;

// Unfortunately a missing feature in the dbus node module used by
// networkmanager makes it impossible to close the dbus connection
// so the application must be forced closed with process.exit(0)
var NetworkManager = require('networkmanager');

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

NetworkManager.connect(function(err, nm) {
    if(err) fail(err);

    nm.NetworkManager.GetVersion(function(err, Version) {
        if(err) fail(err);
        console.log("NetworkManager Version: "+Version);
           

        NetworkManager.disconnect();
    });
});
