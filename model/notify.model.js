const sqlite = require('sqlite');
const sqlite3 = require("sqlite3");

const showUserNotify=async (email) => {
    let db = await sqlite.open({
        filename: './USERS', driver: sqlite3.Database
    });
    let sql = "SELECT * FROM orders where deliverId=? ;";
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

const showAdminNotify=async () => {
    let db = await sqlite.open({
        filename: './USERS', driver: sqlite3.Database
    });


    let sql = "SELECT DISTINCT * FROM orders GROUP BY deliverId;";

    let values = {};

    const rows = await db.all(sql,);
    // console.log("rows////////////////////////////////////////");
    //
    // console.log(rows);
    for (const row of rows) {
        if(values[row.deliverId]===undefined) {
            values[row.deliverId]=[];
        }
        values[row.deliverId].push(row);
    }
    console.log("values////////////////////////////////////////");
    console.log(values);
    return values;

}



module.exports = {
    showUserNotify:showUserNotify,
    showAdminNotify:showAdminNotify
}