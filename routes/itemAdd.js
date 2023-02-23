const router = require('express').Router();
const controller= require('../controller/itemAdd.controller.js')

router.post('/insertItem',controller.postinsert)//insert menuitem
router.post('/delete',controller.postdelete)//delete
router.post('/update-form',controller.postupdate)//update

router.post('/displayItem',controller.postDisplaymenuItem) //display items acc to category


router.post('/add-category',controller.postCat)//add category
router.post('/display-cat',controller.postDisplayCat)//display category





module.exports = {
    router:router
}