// var WebSocket, { WebSocketServer } =require( 'ws');
const {displaymenuItem} = require("../model/item.model");
const {WebSocketServer} = require("ws");
const sqlite3 = require('sqlite3').verbose();


// const WebSocket = require('ws');
// const express = require('express');
// const {WebSocketServer} = require("ws");
// const app = express();
// // const server = new WebSocketServer({ port: 8080 });
// const sqlite3 = require('sqlite3').verbose();
//
// app.get('/hello', (req, res) => {
//     console.log("hello44")
//     res.send("hello22")
// })
//
// //
// // server.on('connection', (socket) => {
// //
// //     console.log('Client connected');
// //     console.log(`Client ID:`+socket.id);
// //
// //     socket.on('message', (message) => {
// //         console.log(`Received message: ${message}`);
// //
// //         // server.clients.forEach((client) => {
// //         //     // const formData = JSON.parse(message);
// //         //     // console.log(formData);
// //         //     //
// //         //     // if (client !== socket && client.readyState === WebSocket.OPEN) {
// //         //     client.send(message.toString());
// //         //     // }
// //         // });
// //
// //     });
// // });

// const {WebSocketServer} = require("ws");
const server = new WebSocketServer({port: 8080});
console.log("websocket is on")

const db = new sqlite3.Database('./USERS', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});
db.run(`CREATE TABLE IF NOT EXISTS dummyorders
        (
            id
            INTEGER
            PRIMARY
            KEY
            AUTOINCREMENT,
            item
            TEXT,
            quantity
            INTEGER
        )`);
server.on('connection', (socket) => {
    console.log('Client connected ');
    // console.log(socket);


    socket.on('message', async (message) => {
        console.log("message get  + " + message)
        try {


            var msg = JSON.parse(message.toString())
            if (msg['type'] === "getData") {
                let data = await displaymenuItem();
                // console.log(data);
                let result = {
                    "type": "getData",
                    "data": data
                }
                console.log("result")
                // console.log(JSON.stringify(result))
                socket.send(JSON.stringify(result));
            } else if (msg['type'] === "deliverItems") {
                const items = JSON.parse(msg.data);
                // insert each item into the dummyorders table
                items.forEach((item) => {
                    db.run('INSERT INTO dummyorders (item, quantity) VALUES (?, ?)', [item.item, item.quantity], (err) => {
                        if (err) {
                            console.error(err.message);
                        }
                    });
                });
                console.log(`Inserted ${items.length} items into dummyorders`);
                // call the checkOrder function to process the orders
                checkOrder();
            } else if (msg['type'] === "addData") {
                let data = await displaymenuItem();
                console.log(data);
                let result = {
                    "type": "addData",
                    "data": data
                }
                socket.send(JSON.stringify(result));
            } else if (msg['type'] === "sendItems") {
                db.all('SELECT item, SUM(tobedelivered) AS total_quantity\n' +
                    'FROM orders\n' +
                    'WHERE orders.status != \'Delivered\'\n' +
                    'GROUP BY item;', function (err, rows) {
                    console.log(rows);
                    if (err) {
                        console.error(err);
                        return;
                    }
                    socket.send(JSON.stringify(rows));
                });
            } else if (msg['type'] === "sendOrder") {
                let result = {
                    "type": "sendOrder",
                    "data": msg['data']!=="sendOrder"?msg['data']:"Order get"
                }

                socket.send(JSON.stringify(result));
            } else {
                server.clients.forEach((client) => {
                    // if (client !== socket && client.readyState === WebSocket.OPEN) {
                    client.send("message recevied ");
                    // }
                });
            }
        } catch (err) {
            console.log(err)
        }
        // }
// =======
// Create a new WebSocket server
// const wss = new WebSocket.Server({ port: 8080 });
//
// // create or open the database
//
//
// // create the dummyorder table if it doesn't exist
//
//
// // Handle new WebSocket connections
// wss.on('connection', function connection(ws) {
//     console.log('New WebSocket connection');
//
//     // Send the current status of the orders to the connected WebSocket client
//     db.all('SELECT item, SUM(tobedelivered) AS total_quantity\n' +
//         'FROM orders\n' +
//         'WHERE orders.status != \'Delivered\'\n'+
//         'GROUP BY item;', function(err, rows) {
//         console.log(rows);
//         if (err) {
//             console.error(err);
//             return;
//         }
//         ws.send(JSON.stringify(rows));
//     });
//
//     console.log('Client connected');
//     console.log(`Client ID:` + ws.id);
//
//     ws.on('message', (message) => {
//         try {
//             // parse the JSON message
//             const items = JSON.parse(message);
//
//             // insert each item into the dummyorders table
//             items.forEach((item) => {
//                 db.run('INSERT INTO dummyorders (item, quantity) VALUES (?, ?)', [item.item, item.quantity], (err) => {
//                     if (err) {
//                         console.error(err.message);
//                     }
//                 });
//             });
// // >>>>>>> 5830b1ee3af30aba34989a106740ca72d5c9b840
//
//             console.log(`Inserted ${items.length} items into dummyorders`);
//
//
//             // call the checkOrder function to process the orders
//             checkOrder();
//         } catch (e) {
//             console.error(e.message);
//         }
    });
    })

    function checkOrder() {
        // Select the next order to process
        const selectQuery = 'SELECT orders.orderid, MIN(orders.deliverid) AS deliverid, SUM(dummyorders.quantity) AS total_quantity, orders.tobedelivered, orders.item, orders.status\n' +
            'FROM orders\n' +
            'LEFT JOIN dummyorders ON orders.item = dummyorders.item\n' +
            'WHERE orders.status != \'Delivered\'\n' +
            'GROUP BY orders.deliverid\n' +
            'HAVING total_quantity !=0\n' +
            'ORDER BY orders.deliverid ASC\n' +
            'LIMIT 1';
        z

        // debug
        let selectQuery1 = 'SELECT orders.orderid, MIN(orders.deliverid) AS deliverid, SUM(dummyorders.quantity) AS total_quantity, orders.tobedelivered, orders.item, orders.status\n' +
            'FROM orders\n' +
            'LEFT JOIN dummyorders ON orders.item = dummyorders.item\n' +
            'WHERE orders.status != \'Delivered\'\n' +
            'GROUP BY orders.deliverid\n' +
            'HAVING total_quantity !=0\n' +
            'ORDER BY orders.deliverid ASC\n' +
            'LIMIT 1';


        db.all(selectQuery1, (err, rows) => {
            if (err) return;
            console.log(rows);
            // ans.push(rows);
        })
        // debug

        db.get(selectQuery, [], (err, row) => {
            if (err) {
                console.error(err.message);
                return;
            }

            if (!row) {
                // If there are no more orders to process, return
                console.log('No more orders to process');
                return;
            }

            // Determine how many items the canteen manager wants to deliver
            const itemsToDeliver = row.total_quantity - (row.delivered || 0);
            console.log(itemsToDeliver)

            // Check if there are any corresponding orders for the item
            db.get(`
                SELECT *
                FROM orders
                WHERE item = ?
                  AND status != 'Delivered'
                ORDER BY deliverid ASC
                    LIMIT 1
            `, [row.item], (err, order) => {
                if (err) {
                    console.error(err);
                    return;
                }

                if (!order) {
                    // If there are no orders for the item, return
                    console.log(`No orders for ${row.item}`);
                    return;
                }

                if (order.tobedelivered <= itemsToDeliver) {
                    // If the number of items the canteen manager wants to deliver is greater than or equal to the quantity of the order,
                    // set the order status to "Delivered" and update the dummyorders table accordingly
                    db.run(`
                        UPDATE orders
                        SET status        = 'Delivered',
                            tobedelivered = ?,
                            delivered     = ?,
                            deliverid     = ?
                        WHERE deliverid = ?
                    `, [0, order.quantity, row.deliverid, order.deliverid], (err) => {
                        if (err) {
                            console.error(err);
                        }
                    });
                    db.run(`
                        UPDATE dummyorders
                        SET quantity = quantity - ?
                        WHERE item = ?
                    `, [order.quantity, order.item], (err) => {
                        if (err) {
                            console.error(err);
                        } else {
                            deleteDummyOrder(order.item);
                        }
                    });
                    console.log(`Order ${order.orderid} for ${order.item} delivered`);
                } else {
                    // If the number of items the canteen manager wants to deliver is less than the quantity of the order,
                    // set the order status to "Partially Delivered" and update the quantity accordingly
                    db.run(`
                        UPDATE orders
                        SET tobedelivered = tobedelivered - ?,
                            delivered     = ?,
                            status        = 'Partially Delivered'
                        WHERE deliverid = ?
                    `, [itemsToDeliver, row.total_quantity, order.deliverid], (err) => {
                        if (err) {
                            console.error(err);
                        }
                    });
                    db.run(`
                        UPDATE dummyorders
                        SET quantity = quantity - ?
                        WHERE item = ?
                    `, [itemsToDeliver, order.item], (err) => {
                        if (err) {
                            console.error(err);
                        } else {
                            deleteDummyOrder(order.item);
                        }
                    });
                    console.log(`Order ${order.orderid} for ${order.item} partially delivered`);
                }

                // Call the checkOrder function recursively to process the next order
                checkOrder();
            });
        });
    }

    function deleteDummyOrder(item) {
        db.run(`
            DELETE
            FROM dummyorders
            WHERE item = ?
              AND quantity = 0
        `, [item], (err) => {
            if (err) {
                console.error(err);
            }
        });
    }


