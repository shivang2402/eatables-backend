const sqlite3 = require("sqlite3");
const {open} = require('sqlite');


const updateUserStatus=async function(oid , status){
    const db = await open({
        filename: './USERS',
        driver: sqlite3.Database
    })

    await db.run("UPDATE PAYMENTGATEWAY SET USER_STATUS=? WHERE BILL_NO=? ", [status,oid]);

    await db.close()
}

const updateRazorpayStatus=async function (oid, status) {
    const db = await open({
        filename: './USERS',
        driver: sqlite3.Database
    })

    await db.run("UPDATE PAYMENTGATEWAY SET RAZORPAY_STATUS=? WHERE BILL_NO=? ", [status,oid]);

    await db.close()
}
const insertRazorpay=async function (id, date, currency, amount, razorpay_status, user_status, receiptNo,STUDENT_ID) {
    const db = await open({
        filename: './USERS',
        driver: sqlite3.Database
    })

    await db.run("INSERT INTO PAYMENTGATEWAY (BILL_NO, DATE, CURRENCY, AMOUNT, RAZORPAY_STATUS,USER_STATUS, TOKEN,STUDENT_ID) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)", [id, date, currency, amount , razorpay_status, user_status, receiptNo,STUDENT_ID]);

    await db.close()
}

module.exports={
    insertRazorpay:insertRazorpay,
    updateRazorpayStatus:updateRazorpayStatus,
    updateUserStatus:updateUserStatus

}
