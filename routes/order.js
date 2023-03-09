const {showUserOrderHistory, showAdminOrderHistory} = require("../model/orders.model");
const router = require('express').Router();

router.post('/orderHistory',async (req, res) => {
    let re = await showUserOrderHistory(req.body.email);
    console.log(re)
    res.send(re);
})
router.post('/adminOrderHistory',async (req, res) => {
    let re = await showAdminOrderHistory();
    console.log(re)
    res.send(re);
})

module.exports = {
    router:router
}