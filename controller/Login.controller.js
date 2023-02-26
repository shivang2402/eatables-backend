const {getData: users, selectData} = require("../model/user.model");
const bcrypt = require("bcrypt");


const authenticateUser = async (email, password) => {
    console.log(email,password)
    console.log(users[0])

    const user = users[0].find(user1 => {
        console.log(typeof user1.EMAIL_ID);
        console.log(typeof email);
        console.log(user1.EMAIL_ID, email); // add this line to print the values of email and user1.EMAIL_ID
        if(user1.EMAIL_ID.localeCompare(email.trim()) === 0) {
            console.log(true, "lodo");
        }
        return "" + user1.EMAIL_ID.trim() === "" + email.trim();
    });

    console.log(user)
    if (user == null) {
        console.log("nulllllllllassss")
        return false
    }
    try {
        let resB = false;


        resB = await bcrypt.compare(password, user.PASSWORD);


        console.log("resB " + resB)

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
    console.log(req.body)
    bool = await authenticateUser(req.body.email.trim(), req.body.password.trim());
    console.log("bool1");

    console.log(bool)

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
