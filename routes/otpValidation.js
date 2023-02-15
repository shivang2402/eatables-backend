const router = require('express').Router();
const controller=require('../controller/Otp.controller');
const {validateOTP} = require("../model/otp.model");
router.post('/validate', controller.post)
//if true
router.get('/',controller.get)
module.exports = {
    router: router
}