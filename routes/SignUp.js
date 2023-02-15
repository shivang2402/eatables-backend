const router = require('express').Router();
const {ensureAuthenticated}=require('../helper/auth.helper')

const controller=require('../controller/SignUp.controller')
router.get('/', controller.get)
//signup
router.post('/', controller.post)
router.get('/false', (req, res) => {
    console.log("sign false")
    res.send("sign false");
})
module.exports = {
    router: router
}