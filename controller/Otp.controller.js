const {validateOTP} = require("../model/otp.model");
const post = function (req, res) {
    var otp = req.body;
    let bool = false;
   validateOTP(otp.otp).then((b)=>bool=b);

    setTimeout(()=>{
        console.log("bool "+bool)
        if (bool) {
            res.send("true");
        } else{
            res.send("false");}
    },100)

}
const get = function (req, res) {
    console.log("get otp")

    res.send("get otp ")
}
module.exports = {
    post: post,
    get: get
}
