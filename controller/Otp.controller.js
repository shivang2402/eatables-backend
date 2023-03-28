const {validateOTP} = require("../model/otp.model");
const post = async function (req, res) {
    var otp = req.body;
    let bool = false;
    console.log("dddddddddddddddddddddddddd");
    console.log(otp);
    console.log("dddddddddddddddddddddddddd");

    bool = await validateOTP(otp.otp);
    console.log("dddddddddddddddddddddddddd");

    console.log(bool);
    console.log("dddddddddddddddddddddddddd");


    setTimeout(() => {
        if (bool) {
            res.send("true");
        } else {
            res.send("false");
        }
    }, 100)

}
const get = function (req, res) {
    // console.log("get otp")

    res.send("get otp ")
}
module.exports = {
    post: post,
    get: get
}
