const {getData: users, selectData} = require("../model/user.model");
const bcrypt = require("bcrypt");


const authenticateUser = async (email, password) => {
    // console.log(users)
    const user = users[0].find(user => user.EMAIL_ID === email)
    if (user == null) {
        return false
    }
    try {
        let resB = false;


        resB = await bcrypt.compare(password, user.PASSWORD);


        // console.log("resB " + resB)

        return resB

    } catch (e) {
        console.log(e)
        return false
    }

}

const post=async (req, res) => {
    // console.log("/Login")
    // console.log(req.body.email)
    // console.log(req.body.password)

    let bool = false;
    bool = await authenticateUser(req.body.email, req.body.password);
    // console.log("bool1");

    // console.log(bool)

    // console.log("b " + bool)
    setTimeout(async () => {
        if (bool) {
            // console.log("login done")
            const result = await selectData(req.body.email);
            res.json({
                STUDENT_ID:result.STUDENT_ID,
                NAME:result.NAME,
                EMAIL_ID:result.EMAIL_ID,
                CONTACT_NO:result.CONTACT_NO,
                validate:"true"
            })
        } else {
            console.log("login not done")
            res.send("false")
        }
    }, 100);


}
const get=function (req,res){
    // console.log("get")

    res.send("get ")
}
module.exports={
    post:post,
    get:get
}
