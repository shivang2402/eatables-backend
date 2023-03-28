const router = require('express').Router();
const {ensureAuthenticated}=require('../helper/auth.helper')

const controller=require('../controller/SignUp.controller')
router.get('/', controller.get)
//signup
router.post('/', controller.post)
router.post('/admin',controller.adminpost)
router.get('/false', (req, res) => {
    console.log("signup  false")
    res.send("sign false");
})
module.exports = {
    router: router
}