const validator = require("email-validator");
const sqlite3 = require("sqlite3");
const {open} = require("sqlite");
let users = []
let admins = []

//database connectivity
const db = new sqlite3.Database("./USERS")
//fires select query
db.all("select * from USERS", (err, rows) => {
    if (err) {
        console.log(err)
    }
    users.push(rows);
})
db.all("select * from ADMIN", (err, rows) => {
    if (err) {
        console.log(err)
    }
    admins.push(rows);
})
db.close()
//fires insert query

const selectData=async function (email) {
    const db = await open({
        filename: './USERS',
        driver: sqlite3.Database
    })
    const result=await db.get("select * from USERS where EMAIL_ID=?", [email.trim()]);
    return result;
}
const updatePassword=function(email,password){
    const db = new sqlite3.Database("./USERS")
    db.all("update USERS set PASSWORD=? where EMAIL_ID=?", [password,email], (err, rows) => {
        if (err) {
            console.log(err)
        }
        console.log("update -----");

    })

    db.close()
}
const selectDataAdmin=async function (email) {
    const db = await open({
        filename: './USERS',
        driver: sqlite3.Database
    })
    const result=await db.get("select * from ADMIN where EMAIL_ID=?", [email.trim()]);
    return result;
}
const updatePasswordAdmin=function(email,password){
    const db = new sqlite3.Database("./USERS")
    db.all("update ADMIN set PASSWORD=? where EMAIL_ID=?", [password,email], (err, rows) => {
        if (err) {
            console.log(err)
        }
        console.log("update -----");

    })

    db.close()
}
const insertData = function (id, name, email, password, number, isVerified) {
    const db = new sqlite3.Database("./USERS")
    let boolEmail = false;
    console.log("lo1l")

    db.all("select * from USERS where EMAIL_ID=?", [email], (err, rows) => {
        if (err) {
            console.log(err)
        }
        if (rows.length <= 0) {
            boolEmail = true
        }

        if (boolEmail && validator.validate(email)) {
            db.run("insert into USERS (STUDENT_ID,NAME,EMAIL_ID,CONTACT_NO,PASSWORD,IS_VERIFIED)values (?,?,?,?,?,?)", [id, name, email, number, password, isVerified], (err) => {
                if (err) {
                    console.log(err)
                }

            })
            users.push({
                id: id,
                name: name,
                email: email,
                password: password,
                number: number,
                isVerified: isVerified
            })
        }
    })
    console.log("lol")
    db.close()
}
const insertDataAdmin = function (id, name, email, password, number, isVerified,bankdetails) {
    const db = new sqlite3.Database("./USERS")
    let boolEmail = false;
    console.log("aDMIN =-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=")

    db.all("select * from ADMIN where EMAIL_ID=?", [email], (err, rows) => {
        if (err) {
            console.log(err)
        }
        if (rows.length <= 0) {
            boolEmail = true
        }

        if (boolEmail && validator.validate(email)) {
            db.run("insert into ADMIN (STUDENT_ID,NAME,EMAIL_ID,CONTACT_NO,PASSWORD,IS_VERIFIED,BANK_ACCOUNT_DETAILS)values (?,?,?,?,?,?,?)", [id, name, email, number, password, isVerified,bankdetails], (err) => {
                if (err) {
                    console.log(err)
                }

            })
            admins.push({
                id: id,
                name: name,
                email: email,
                password: password,
                number: number,
                isVerified: isVerified,

            })

        }
    })
    console.log("lol")
    db.close()
}


module.exports = {
    getData: users,
    getAdmin:admins,
    insertDataAdmin:insertDataAdmin,
    insertData: insertData,
    selectData:selectData,
    selectDataAdmin:selectDataAdmin,
    updatePasswordAdmin:updatePasswordAdmin,

    updatePassword:updatePassword
}