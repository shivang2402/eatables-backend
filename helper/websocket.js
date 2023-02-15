const WebSocket = require('ws');
const express = require('express');
const {WebSocketServer} = require("ws");
const app = express();
const server = new WebSocketServer({ port: 8080 });
app.get('/hello', (req, res) => {
    console.log("hello44")
    res.send("hello22")
})

server.on('connection', (socket) => {

    console.log('Client connected');
    console.log(`Client ID:`+socket.id);

    socket.on('message', (message) => {
        console.log(`Received message: ${message}`);

        // server.clients.forEach((client) => {
        //     // const formData = JSON.parse(message);
        //     // console.log(formData);
        //     //
        //     // if (client !== socket && client.readyState === WebSocket.OPEN) {
        //     client.send(message.toString());
        //     // }
        // });

    });
});
