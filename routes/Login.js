const router = require('express').Router();
const controller = require('../controller/Login.controller');
const {getData: users, selectData} = require("../model/user.model");
const bcrypt = require("bcrypt");


router.post('/', controller.post);
router.post('/admin', controller.postAdmin);


//if false
router.get('/false', (req, res) => {
    console.log("login false")
    res.send("login false");
})
//if true
router.get('/', controller.get)
module.exports = {
    router: router
}
