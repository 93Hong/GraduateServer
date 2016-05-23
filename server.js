var net = require('net');
var mongoose = require('mongoose');
var gcm = require('node-gcm');
var fs = require('fs');

// show server ip address
var interfaces = require('os').networkInterfaces();
for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
        var alias = iface[i];
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
            console.log(alias.address);
    }
}

var message = new gcm.Message();

var server_api_key = 'AIzaSyAH_oXjEPf7L0km8jr876wXnfmsgimVBrQ';
var sender = new gcm.Sender(server_api_key);
var registrationIds = [];

var token = 'eylbdJ_KUCo:APA91bHDT7ix0mOjb6sWoKJE5d6p7LNZVWmh3ACyZV3xPK2hcD35GDIV95NcGzh5Qox7R4PZLZrLwa_tiiFJjaXdvzgmhjDTbqRidujgci2Z9vEGtzHWW8EkeHW9pVK0uJTc6R63UvKV';
registrationIds.push(token);

/* database
mongoose.connect(process.env.MONGO_DB); // encryption
var db = mongoose.connection;
db.once("open", function() {
    console.log("DB connected!");
});
db.on("error", function(err) {
    console.log("DB error : ", err);
});

var childSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    location: [{
        latitude: Number,
        longitude: Number,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    parentName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    token: {
        type: String,
        required: true
    }
});
var Child = mongoose.model('child', childSchema);
*/


var server = net.createServer(function(socket) {
    console.log("#red[Client connected to the server with ip: " + socket.remoteAddress + "]");

    socket.on("error", function(error) {
        console.log("error" + error);
    });
    socket.on("close", function() {

        console.log("#red[Client has disconnected" + socket.remoteAddress + "]");
    });

    socket.on("data", function(data) {
      try {
        //var packet = JSON.parse(data);
        var packet = JSON.parse(data);


            var msg = packet.username + "/" + packet.latitude + "/" + packet.longitude;
            var message = new gcm.Message({
                collapseKey: 'demo',
                delayWhileIdle: true,
                timeToLive: 3,
                data: {
                    title: 'Someone need your help',
                    message: msg
                }
            });
            socket.write('Echo server\n');

            sender.send(message, registrationIds, 4, function (err, result) {
                console.log(result);
            });
            console.log(packet);

        } catch (e) {
            console.log("Else " + e.message);
        }
    });
});

server.listen(12345, function() {
    //'listening' listener
    console.log('Server is listening for incoming connections');
});
