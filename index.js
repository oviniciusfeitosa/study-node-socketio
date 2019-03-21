var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const clients = [];

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    // console.log(socket.client.id);
    console.log('an user connected');

    clients.push({clientId: socket.client.id})

    io.emit('connectedUsers', clients.length);
    io.emit('clientConnected', { clientId: socket.client.id });

    socket.on('disconnect', function () {
        const index = clients.findIndex(client => client.clientId === socket.client.id);
        clients.splice(index, 1);
        console.log('user disconnected');
        io.emit('connectedUsers', clients.length);
        io.emit('clientDisconnected', { clientId: socket.client.id });
    });

    // socket.on('active_users', () => {
    //     console.log(`users active ${clients.length}`)
    // });

    socket.on('chatMessage', function(data){
        console.log(`[${data.clientId}]: ` + data.message);

        io.emit('generalChat', data);
    });
});



http.listen(3000, function () {
    console.log('listening on *:3000');
});
