const sqlite = require('sqlite');
const sqlite3 = require("sqlite3");
const shortid = require('shortid')// for generating token

//done
const insertItem = async (itemId, itemName, category, itemDescription, itemPrice, availStatus, name, data) => {
    let res1 = await (async () => {
        let db = await sqlite.open({
            filename: './USERS', driver: sqlite3.Database
        });

        // const {name, data} = req.files.pic;
        let sql = `INSERT INTO MENUITEM ( ITEM_NAME,ITEM_CATEGORY, ITEM_DESCRIPTION, ITEM_PRICE,ITEM_STATUS ,ITEM_IMAGE_NAME, ITEM_IMAGE)
                   VALUES ( ?, ?, ?, ?, ?,?,?);`;

        let values = [itemName, category, itemDescription, itemPrice, availStatus, name, data];

        let res = false;

        const result = await db.run(sql, values,);
        console.log("result insert 1")
        console.log(result);
        if (result !== undefined && result.changes === 1) {
            res = true;
        }
        console.log('Database connection closed.');
        console.log("res")
        console.log(res)
        await db.close();
        return res;

    })();
    console.log("res1  " + res1)
    return res1
}
//done
const insertCat = async (catId, catName) => {
    let res1 = await (async () => {
        let db = await sqlite.open({
            filename: './menuItem', driver: sqlite3.Database
        });

        // const {name, data} = req.files.pic;
        let sql = `INSERT INTO CATEGORY (catId, catName)
                       VALUES (?, ?)`;

        let values = [catId, catName];

        let res4 = false;

        const result = await db.run(sql, values,);
        console.log("result")
        console.log(result);
        if (result !== undefined && result.changes === 1) {
            res4 = true;
        }
        console.log('Database connection closed.');
        console.log("res4")
        console.log(res4)
        await db.close();
        return res4;

    })();
    console.log("res1  " + res1)
    return res1

}
//done
const displayCat = async () => {
    let res1 = await (async () => {
        let db = await sqlite.open({
            filename: './menuItem', driver: sqlite3.Database
        });
        // const {name, data} = req.files.pic;
        let sql = "SELECT category FROM menuItem";
        let values = [];

        const rows = await db.all(sql);
        rows.forEach((row) => {
            values.push(row.category);
        });

        console.log("shivv")
        console.log(values);
        let res5 = false;

        const result = await db.run(sql);
        console.log("result")
        console.log(result);
        if (result !== undefined && result.changes === 0) {
            res5 = true;
        }
        console.log('Database connection closed.');
        console.log("res5")
        console.log(res5)
        await db.close();
        return values;

    })();
    console.log("res1  " + res1)
    return res1


}
//done
const displaymenuItem = async () => {
    let res1 = await (async () => {
        let db = await sqlite.open({
            filename: './menuItem', driver: sqlite3.Database
        });
        // const {name, data} = req.files.pic;
        const rows = await db.all(`SELECT c.catName as category_name,
                (SELECT JSON_GROUP_ARRAY(
                    JSON_OBJECT(
                        'itemId', mi.itemId,
                        'itemName', mi.itemName,
                        'itemDescription', mi.itemDescription,
                        'itemPrice', mi.itemPrice,
                        'availStatus', mi.availStatus
                    )
                ) FROM menuItem mi WHERE mi.category = c.catName ) as menu_items
         FROM category c`);
        // console.log(rows);
        return rows;

    })();
    console.log("res1  " + res1)
    return res1


}



//done
const updateItem = async (itemName, itemDescription, category, itemPrice, availStatus, name, data, itemId) => {
    let res1 = await (async () => {
        let db = await sqlite.open({
            filename: './menuItem', driver: sqlite3.Database
        });

        // const {name, data} = req.files.pic;
        let sql = 'UPDATE menuItem SET itemName = ?, itemDescription = ? ,category=?,itemPrice=?, availStatus=?,itemImgName=?,itemImg=? WHERE itemId = ?';


        let values = [itemName, itemDescription, category, itemPrice, availStatus, name, data, itemId];

        let res3 = false;

        const result = await db.run(sql, values,);
        console.log("result")
        console.log(result);
        if (result !== undefined && result.changes === 1) {
            res3 = true;
        }
        console.log('Database connection closed.');
        console.log("res3")
        console.log(res3)
        await db.close();
        return res3;

    })();
    console.log("res1  " + res1)
    return res1


}
//done
const deleteItem = async (itemName) => {
    let res1 = await (async () => {
        let db = await sqlite.open({
            filename: './menuItem', driver: sqlite3.Database
        });

        // const {name, data} = req.files.pic;
        let sql = 'DELETE FROM menuItem WHERE itemName = ?;';

        let values = [itemName];

        let res2 = false;

        const result = await db.run(sql, values,);
        console.log("result")
        console.log(result);
        if (result !== undefined && result.changes === 1) {
            res2 = true;
        }
        console.log('Database connection closed.');
        console.log("res2")
        console.log(res2)
        await db.close();
        return res2;

    })();
    console.log("res1  " + res1)
    return res1


}
module.exports = {
    insertItem: insertItem,
    deleteItem: deleteItem,
    insertCat: insertCat,
    displayCat: displayCat,
    displaymenuItem: displaymenuItem,
    updateItem: updateItem
}