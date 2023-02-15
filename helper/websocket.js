var WebSocket, { WebSocketServer } =require( 'ws');

const wss = new WebSocketServer({ port: 3005 });
wss.on('connection', function connection(ws) {
    console.log("fedrdr");
    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });

    ws.send('something');
});
// var server = new WebSocket.Server(
//     {
//         port: 3000,
//     }
// );
// server.on('connection', function connection(client) {
// // code to execute when a client connects
//     client.send("KOKO");
//     console.log(client.id);
//
// });
// module.exports = {io:io};