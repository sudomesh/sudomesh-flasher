

// It seems like either a limitation in this networkmanager module makes it impossible to list devices that aren't currently connected. E.g. ethernet devices with the cable unplugged :(


// Unfortunately a missing feature in the dbus node module used by
// networkmanager makes it impossible to close the dbus connection
// so the application must be forced closed with process.exit(0)
var NetworkManager = require('networkmanager');

function cb(err) {
    if(err) {
        console.error(err);
        process.exit(1);
    }
    console.log("complete");
}

NetworkManager.connect(function(err, nm) {
    if(err) {
        if(err === 'timeout') {
            console.error("It appears you aren't using Network Manager. Good for you");
            return cb(err);
        }
        return cb(err);
    }
    
    console.log("Looks like you're running Network Manager :)"); 
    
    nm.NetworkManager.GetActiveConnections(function(err, connections) {

        for (var i = 0; i < connections.length; i++) {  
            console.log(connections[i]);
            console.log("Found", connections.length, devices);
            connections[i].GetDevices(function(error, devices) {
                for (var i = 0; i < devices.length; i++) {  
                    devices[i].GetDeviceType(function(err, deviceType) {
                        console.log(deviceType.name);
                    })
                }
            });
        }
    });

/*
    nm.NetworkManager.GetVersion(function(err, Version) {
        if(err) fail(err);
        console.log("NetworkManager Version: "+Version);
           

//        NetworkManager.disconnect();
    });
*/
});
