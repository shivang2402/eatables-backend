const {showUserNotify, showAdminNotify} = require("../model/notify.model");
const router = require('express').Router();

router.post('/Notify',async (req, res) => {

    console.log("shivang")
    console.log(req.body)
    let re = await showUserNotify(req.body.email);
    console.log("ll");
    console.log(re)
    res.send(re);
    console.log("ll");

})
router.post('/adminNotify',async (req, res) => {

    let re = await showAdminNotify();
    console.log(re)
    res.send(re);
})

module.exports = {
    router:router
}