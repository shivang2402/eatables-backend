const sqlite3 = require("sqlite3");
let res = false;
let l1 = 120000;

const {open} = require('sqlite');

const deleteOTP = async (otp) => {
    setTimeout(() => {
        const db = new sqlite3.Database("./USERS")

        db.run("delete from OTP  where OTP=?", [otp], (err) => {
            if (err) {
                console.log(err)
                console.log("otp delete")
            }

        })
        console.log("Otp delete")
        db.close()
    }, 120000)
}
const findOTP=async (id)=>{
    const db = await open({
        filename: './USERS',
        driver: sqlite3.Database
    })
    const result = await db.get("select * from OTP where STUDENT_ID=?;", [id])
    console.log("result s")
    console.log(result)
    if(result!==undefined && result.STUDENT_ID===id){
        return true;
    }

    return false;
}
const validateOTP = async (otp) => {
    const db = await open({
        filename: './USERS',
        driver: sqlite3.Database
    })
    const result = await db.get("select * from OTP where OTP=? and EXPIRES_AT>?;", [otp, new Date().getTime()])
    console.log("result s")
    console.log(result)
    if (result !== undefined && result.OTP === otp.toString()) {
        res = true;
        console.log("res " + res + " " + l1)
        await db.all("update USERS set IS_VERIFIED=true where STUDENT_ID=? ",[result.STUDENT_ID])
        const dr = await db.all("delete from OTP where OTP=?", [otp]);
        console.log("dr" + dr)
        return true
    }
    await db.close();
    console.log("res " + res + " " + l1)
    return false
}
// const validateOTP = function (otp) {
//     // ()()
//     console.log("res " + res+ " "+l1)
//     return res;
//
// }

const insertOTP = function (id, otp, timeC) {
    const db = new sqlite3.Database("./USERS")
    let boolEmail = false;

    db.all("select * from OTP where STUDENT_ID=?", [id], (err, rows) => {
        console.log("O'tp")
        console.log(rows)
        if (rows === undefined||rows.length<=0) {
            boolEmail = true;
        }
        if(rows.length>0){
            db.run("update OTP set OTP=? ,CREATED_AT=?,EXPIRES_AT=?  where STUDENT_ID=?",[otp,timeC,timeC+120000,id],(err)=>{
                if (err) {
                    console.log(err)
                    console.log("otp")
                }
            })
        }

        if (boolEmail) {
            db.run("insert into OTP (STUDENT_ID,OTP,CREATED_AT,EXPIRES_AT)values (?,?,?,?)", [id, otp, timeC, timeC + 120000], (err) => {
                if (err) {
                    console.log(err)
                    console.log("otp")
                }

            })

            deleteOTP(otp);
        }
    })
    console.log("boolEmail otp "+boolEmail);


    db.close()

}

module.exports = {
    insertOTP: insertOTP,
    validateOTP: validateOTP,
    findOTP:findOTP
}