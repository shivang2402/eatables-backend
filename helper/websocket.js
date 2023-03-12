var WebSocket, { WebSocketServer } =require( 'ws');
const sqlite3 = require('sqlite3');
const sqlite = require("sqlite");
const {displaymenuItem, updateItem} = require("../model/item.model");



const wss=new WebSocketServer({port: 8090});
wss.on('connection', (socket)=>{
    console.log("8090:=-=-=-=-=-=")
     orderBroadcast();



})
async function orderBroadcast() {
    let data =  await (async () => {
        let db = await sqlite.open({
            filename: './USERS', driver: sqlite3.Database
        });
        const sql = "select * from orders;";
        const rows1 = await db.all(sql);
        let values = [];
        var temp1 = {}

        rows1.forEach((row) => {
            var temp = {
                'deliverId': row.deliverId,
                'orderId': row.orderId,
                'item': row.item,
                'quantity': row.quantity,
                'status': row.status,
                'customerName': row.customerName,
                'customerEmail': row.customerEmail,
                'delivered': row.delivered,
                'tobedelivered': row.tobedelivered,
            }
            values.push(temp);
        });

        db.close()

        return values;

    })();
    // console.log("res1  ")

    console.log("-------=-=-=-=-===-=-=-=-=-=-==-==-");
    let result = {
        "type": "getData",
        "data": data
    };
    // console.log(result)
    // Loop through all connected clients and send the message to each one
    for (const client of wss.clients) {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(result));
        }
    }
}

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

async function itemBroadcast() {
    let data = await displaymenuItem();
    console.log("-------=-=-=-=-===-=-=-=-=-=-==-==-");
    let result = {
        "type": "getData",
        "data": data
    };
    // console.log(result)
    // Loop through all cosnnected clients and send the message to each one
    for (const client of server.clients) {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(result));
        }
    }
}


server.on('connection', async (socket) => {
    console.log('Client connected ');
    // console.log(socket);

    socket.on('message', async (message) => {
        console.log("message get  + " + message)
        try {


            let msg = JSON.parse(message.toString())
            if (msg['type'].trim() === "getData") {
                let data = await displaymenuItem();
                let result = {
                    "type": "getData",
                    "data": data
                }
            socket.send(JSON.stringify(result))

            } else if (msg['type'] === "deliverItems") {
                const items = JSON.parse(msg.data);
                console.log(items);
                console.log("1111111");
                // var itemstoDeliver = items.quantity.toString();
                console.log("1111111");

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
            }

                else if (msg['type'] === "sendItems") {
                db.all('SELECT item, SUM(tobedelivered) AS total_quantity\n' +
                    'FROM orders\n' +
                    'WHERE orders.status != \'Delivered\'\n' +
                    'GROUP BY item;', function (err, rows) {
                    console.log(rows);
                    if (err) {
                        console.error(err);
                        return;
                    }
                    socket.send("s");

                    socket.send(JSON.stringify(rows));
                });
            } else if (msg['type'] === "sendOrder") {
                const items = JSON.parse(msg.data);
                console.log(items)

                for (let msgKey in items.products) {
                    db.run("INSERT INTO orders(orderId,item,quantity,status,customerName,customerEmail,delivered,tobedelivered,AMOUNT) VALUES (?,?,?,?,?,?,?,?,?)",[items['id'],items.products[msgKey].product,items.products[msgKey].quantity,"new order",items['userId']['name'],items['userId']['email'],0,items.products[msgKey].quantity,items.amount])
                }
                let result = {
                    "type": "sendOrder",
                    "data": "Order get"

                    // "data": msg['data']!=="sendOrder"?msg['data']:"Order get"
                }

                // console.log(msg['data']);
                await orderBroadcast();
                // socket.send(JSON.stringify(result));
            }
            else if (msg['type'].trim() === "AddData") {

                // console.log("=-=-=-=-=-=-==-====-=-==--=-==-==-==-=-")

                await itemBroadcast()
                socket.send("item added");
            }
            else if (msg['type'].trim() === "EditData") {
                // let data = await updateItem();

                console.log("sss")
                await itemBroadcast()
                socket.send("item updated");
            }
            else if (msg['type'].trim() === "DeleteData") {
                // let data = await updateItem();

                console.log("aaaaa")
                await itemBroadcast()
                socket.send("item Deleted");
            }
            else {
                let data = await displaymenuItem();
                console.log("smsms")
                server.clients.forEach((client) => {
                    // if (client !== socket && client.readyState === WebSocket.OPEN) {
                    // console.log(data);
                    let result = {
                        "type": "getData",
                        "data": data
                    }
                    socket.emit(JSON.stringify(result));                    // }
                });
            }
        } catch (err) {
            console.log(err)
        }

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
                    `, [itemsToDeliver, row.total_quantity, order.deliverId], (err) => {
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
                    console.log(`Order ${order.orderId} for ${order.item} partially delivered`);
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


