// <<<<<<< HEAD
var WebSocket, { WebSocketServer } =require( 'ws');
const {displaymenuItem} = require("../model/item.model");
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

// const {WebSocketServer} = require("ws");
const server = new WebSocketServer({port: 8080});
console.log("websocket is on")


server.on('connection', (socket) => {
    console.log('Client connected ');
    // console.log(socket);


    socket.on('message', async (message) => {
        console.log("message get  + " +message)
        try {
            var msg= JSON.parse(message.toString())
            if (msg['type'] === "getData") {
                let data = await displaymenuItem();
                // console.log(data);
                let result={
                    "type": "getData",
                    "data": data
                }
                console.log("result")
                // console.log(JSON.stringify(result))
                socket.send(JSON.stringify(result));
            }
            else if (msg['type'] === "addData") {
                let data = await displaymenuItem();
                console.log(data);
                let result={
                    "type": "getData",
                    "data": data
                }
                socket.send(JSON.stringify(result));
            }
            else if(msg['type'] === "sendOrder"){
                let result={
                    "type": "getData",
                    "data": "Order get"
                }
                socket.send(JSON.stringify(result));
            }
            else {
                server.clients.forEach((client) => {
                    // if (client !== socket && client.readyState === WebSocket.OPEN) {
                    client.send("message recevied ");
                    // }
                });
            }
        }catch (err) {
            console.log(err)
        }

    });
});
