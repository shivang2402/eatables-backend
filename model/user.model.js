const validator = require("email-validator");
const sqlite3 = require("sqlite3");
const {open} = require("sqlite");
let users = []
//database connectivity
const db = new sqlite3.Database("./USERS")
//fires select query
db.all("select * from USERS", (err, rows) => {
    if (err) {
        console.log(err)
    }
    users.push(rows);
})
db.close()
//fires insert query

const selectData=async function (email) {
    const db = await open({
        filename: './USERS',
        driver: sqlite3.Database
    })
    const result=await db.get("select * from USERS where EMAIL_ID=?", [email]);
    return result;
}

const insertData = function (id, name, email, password, number, isVerified) {
    const db = new sqlite3.Database("./USERS")
    let boolEmail = false;
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
                    console.log("2")
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

    db.close()
}

module.exports = {
    getData: users,
    insertData: insertData,
    selectData:selectData
}