const sqlite = require('sqlite');
const sqlite3 = require("sqlite3");
const shortid = require('shortid')// for generating token

//done
const insertItem = async (itemId, itemName, category, itemDescription, itemPrice, availStatus, name, data) => {
    console.log("res1  insertItem -=-=-=-=-=-=-=-=-=-=-=")
    return await (async () => {
        let db = await sqlite.open({
            filename: './USERS', driver: sqlite3.Database
        });

        // const {name, data} = req.files.pic;
        let sql = `INSERT INTO MENUITEM (ITEM_NAME, ITEM_CATEGORY, ITEM_DESCRIPTION, ITEM_PRICE, ITEM_STATUS,
                                         ITEM_IMAGE_NAME, ITEM_IMAGE)
                   VALUES (?, ?, ?, ?, ?, ?, ?);`;

        let sqlCat = "select * from CATEGORY where catName=?;";
        let res = false;
        let sqlCheck = "select * from MENUITEM where ITEM_NAME=?;";
        const resultCat = await db.all(sqlCat, [category.toString().toUpperCase()])
        const resultCheck = await db.all(sqlCheck, [itemName.toString().toUpperCase()])
        console.log("result cat")
        console.log(resultCat)
        if (resultCheck.length === 0) {
            if (resultCat.length !== 0) {
                let catID;
                resultCat.forEach((row) => {
                    catID = row.catId;
                });
                let values = [itemName.toString().toUpperCase(), catID, itemDescription, itemPrice, availStatus, name, data];

                const result = await db.run(sql, values);
                console.log("result insert 1")
                console.log(values);
                if (result !== undefined && result.changes === 1) {
                    res = true;
                }
            } else {
                const resCat = await insertCat(category.toString().toUpperCase());
                if (resCat) {
                    const resultCat1 = await db.all(sqlCat, [category.toString().toUpperCase()])
                    let catID;

                    resultCat1.forEach((row) => {
                        catID = row.catId;
                    });
                    let values = [itemName.toString().toUpperCase(), catID, itemDescription, itemPrice, availStatus, name, data];

                    const result = await db.run(sql, values);
                    // console.log("result insert 1")
                    // console.log(result);
                    if (result !== undefined && result.changes === 1) {
                        res = true;
                    }
                }
            }
        } else {
            let sqlUpdate = "UPDATE MENUITEM SET  ITEM_DESCRIPTION = ? ,ITEM_PRICE=?, ITEM_STATUS=? WHERE ITEM_NAME = ? ;"
            res = true
            console.log("res3")
            const res3=await db.all(sqlUpdate, [ itemDescription, itemPrice, availStatus, itemName]);
            console.log(res3);
        }

        // console.log('Database connection closed.');
        // console.log("res")
        // console.log(res)
        await db.close();
        return res;

    })()
}
//done
const insertCat = async (catName) => {
    let res1 = await (async () => {
        let db = await sqlite.open({
            filename: './USERS', driver: sqlite3.Database
        });

        // const {name, data} = req.files.pic;
        let sql = `INSERT INTO CATEGORY (catName)
                   VALUES (?)`;

        let values = [catName];

        let res4 = false;

        const result = await db.run(sql, values,);
        // console.log("result")
        // console.log(result);
        if (result !== undefined && result.changes === 1) {
            res4 = true;
        }
        // console.log('Database connection closed.');
        // console.log("res4")
        // console.log(res4)
        await db.close();
        return res4;

    })();
    // console.log("res1  " + res1)
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

        // console.log(values);
        let res5 = false;

        const result = await db.run(sql);
        // console.log("result")
        // console.log(result);
        if (result !== undefined && result.changes === 0) {
            res5 = true;
        }
        // console.log('Database connection closed.');
        // console.log("res5")
        // console.log(res5)
        await db.close();
        return values;

    })();
    // console.log("res1  " + res1)
    return res1


}
//done
const displaymenuItem = async () => {
    let res1 = await (async () => {
        let db = await sqlite.open({
            filename: './USERS', driver: sqlite3.Database
        });
        const sql = "select * from MENUITEM;";
        const rows1 = await db.all(sql);
        let values = [];
        var temp1 = {}

        rows1.forEach((row) => {
            var temp = {
                'id': row.ITEM_ID,
                'title': row.ITEM_NAME,
                'category': row.ITEM_CATEGORY,
                'description': row.ITEM_DESCRIPTION,
                'price': row.ITEM_PRICE,
                'image': row.ITEM_IMAGE
            }
            values.push(temp);
        });

        // const rows = await db.all(`SELECT c.catName as category_name,
        //         (SELECT JSON_GROUP_ARRAY(
        //             JSON_OBJECT(
        //                 'itemId', mi.ITEM_ID,
        //                 'itemName', mi.ITEM_NAME,
        //                 'itemCategory',mi.ITEM_CATEGORY,
        //                 'itemDescription', mi.ITEM_DESCRIPTION,
        //                 'itemPrice', mi.ITEM_PRICE,
        //                 'itemImage',mi.ITEM_IMAGE
        //             )
        //         ) FROM MENUITEM mi WHERE mi.ITEM_CATEGORY = c.catName ) as menu_items
        //  FROM category c`);
        // console.log(values);
        return values;

    })();
    // console.log("res1  ")
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
        // console.log("result")
        // console.log(result);
        if (result !== undefined && result.changes === 1) {
            res3 = true;
        }
        // console.log('Database connection closed.');
        // console.log("res3")
        // console.log(res3)
        await db.close();
        return res3;

    })();
    // console.log("res1  " + res1)
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
        // console.log("result")
        // console.log(result);
        if (result !== undefined && result.changes === 1) {
            res2 = true;
        }
        // console.log('Database connection closed.');
        // console.log("res2")
        // console.log(res2)
        await db.close();
        return res2;

    })();
    // console.log("res1  " + res1)
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