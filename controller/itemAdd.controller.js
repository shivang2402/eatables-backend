const {insertItem} =require('../model/item.model');
const {deleteItem} =require('../model/item.model');
const {updateItem} =require('../model/item.model');
const {insertCat} =require('../model/item.model');
const {displayCat} =require('../model/item.model');
const {updateCat} =require('../model/item.model');
const {deleteCat} =require('../model/item.model');


const {displaymenuItem} =require('../model/item.model');





const postinsert= async function (req,res)
{
    let info = req.body;
    const {name, data} = req.files.files;
    let bool
    await insertItem(info.itemId, info.itemName,info.category,info.itemDescription, info.itemPrice,info.availStatus,name,data).then((_)=>bool=_);
    console.log(bool);
    console.log("naman")
    res.send(bool);

}

const postDisplayCat= async function (req,res)
{

    let bool
    await displayCat().then((_)=>bool=_);
    console.log(bool);
    console.log("shivvv")
    res.send(bool);

}
const postDisplaymenuItem= async function (req,res)
{

    let bool
    await displaymenuItem().then((_)=>bool=_);
    console.log(bool);
    console.log("shivvv")
    res.send(bool);

}

const postCat= async function (req,res)
{
    let info = req.body;

    let bool
    await insertCat(info.catId,info.catName).then((_)=>bool=_);
    console.log(bool);
    console.log("shivvv")
    res.send(bool);

}

const postdelete= async function (req,res)
{
    let info = req.body;
    let bool
    await deleteItem(info.itemName).then((_)=>bool=_);
    console.log(bool);
    console.log("shivvv")
    res.send(bool);

}
const postdeleteCat= async function (req,res)
{
    let info = req.body;
    let bool
    await deleteCat(info.catName).then((_)=>bool=_);
    console.log(bool);
    console.log("shivvv")
    res.send(bool);

}
const postupdate= async function (req,res)
{
    let info = req.body;
    const {name, data} = req.files.pic;
    let bool
    //itemId, itemName,category, itemDescription, itemPrice,availStatus, name, data

    await updateItem( info.itemName, info.itemDescription,info.category, info.itemPrice,info.availStatus,name,data,info.itemId,).then((_)=>bool=_);
    console.log(bool);
    console.log("shivvv")
    res.send(bool);

}

const postupdateCat= async function (req,res)
{
    let info = req.body;
    let bool
    //itemId, itemName,category, itemDescription, itemPrice,availStatus, name, data

    await updateCat(info.catId,info.catName).then((_)=>bool=_);
    console.log(bool);
    console.log("shivvv")
    res.send(bool);

}
module.exports=
    {
        postinsert:postinsert,
        postdelete:postdelete,
        postCat:postCat,
        postDisplaymenuItem:postDisplaymenuItem,
        postDisplayCat:postDisplayCat,
        postupdate:postupdate,
        postupdateCat:postupdateCat,
        postdeleteCat:postdeleteCat

    }

