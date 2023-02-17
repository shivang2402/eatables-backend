<<<<<<< HEAD
// var WebSocket, { WebSocketServer } =require( 'ws');
//
// const wss = new WebSocketServer({ port: 3005 });
// wss.on('connection', function connection(ws) {
//     console.log("fedrdr");
//     ws.on('message', function message(data) {
//         console.log('received: %s', data);
//     });
//
//     ws.send('something');
// });
// // var server = new WebSocket.Server(
// //     {
// //         port: 3000,
// //     }
// // );
// // server.on('connection', function connection(client) {
// // // code to execute when a client connects
// //     client.send("KOKO");
// //     console.log(client.id);
// //
// // });
// // module.exports = {io:io};

const {WebSocketServer} = require("ws");
const server = new WebSocketServer({ port: 8080 });
console.log("websocket is on")

server.on('connection', (socket) => {
    console.log('Client connected');
    // console.log(socket);

    socket.on('message', (message) => {
        console.log("message get")
        // console.log(`Received message: ${message}`);
        server.clients.forEach((client) => {
            // if (client !== socket && client.readyState === WebSocket.OPEN) {
            client.send("message recevied");
            // }
        });
        // socket.send(message);

        // setInterval(() => {
        //     socket.send(`Hello from the server! The time is now ${new Date().toTimeString()}`);
        // }, 1000);
=======
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

>>>>>>> 7668209feaf94f4e35d0c2688f84df9a8bd9a430
    });
});
