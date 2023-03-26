const sqlite = require('sqlite');
const sqlite3 = require("sqlite3");

const showUserOrderHistory=async (email) => {
    let db = await sqlite.open({
        filename: './USERS', driver: sqlite3.Database
    });
    let sql = "SELECT * FROM orders where customerEmail=? ;";
    let values = {};

    const rows = await db.all(sql,[email]);
    rows.forEach((row) => {
        if(values[row.orderId]===undefined) {
            values[row.orderId]=[];
        }
        values[row.orderId].push(row);
    });
    return values;

}

const showAdminOrderHistory=async () => {
    let db = await sqlite.open({
        filename: './USERS', driver: sqlite3.Database
    });

    let sql = "SELECT  * FROM orders ;";
    let values = {};

    const rows = await db.all(sql,);
    for (const row of rows) {
        if(values[row.orderId]===undefined) {
            values[row.orderId]=[];
        }
        // let data=await showUserOrderHistory(row.customerEmail);
        values[row.orderId].push(row);
    }
    console.log("values=-=-=-=-========-=-=-=-=-=-=-=-=-=-=");
    console.log(values);
    return values;

}



module.exports = {
    showUserOrderHistory:showUserOrderHistory,
    showAdminOrderHistory:showAdminOrderHistory
}