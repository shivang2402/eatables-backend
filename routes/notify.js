const {showUserNotify, showAdminNotify} = require("../model/notify.model");
const router = require('express').Router();

router.post('/Notify',async (req, res) => {

    let re = await showUserNotify(req.body.deliverId);
    console.log(re)
    res.send(re);
})
router.post('/adminNotify',async (req, res) => {
    let re = await showAdminNotify(req.body.deliverId);
    console.log(re)
    res.send(re);
})

module.exports = {
    router:router
}