const shortid = require("shortid");
const {insertRazorpay, updateRazorpayStatus, updateUserStatus} = require("../model/razorpay.model");
const crypto = require('crypto')

const Razorpay = require("razorpay");
const razorpay = new Razorpay({
    key_id: process.env.SECRET_ID,
    key_secret: process.env.SECRET_KEY
})




const updateUserStatusPost=async (req,res)=>{
    const status = req.body.status;
    const oid = req.body.oid;
    // console.log("user verification")
    if (status === true) {
        await updateUserStatus(oid, status);

    }
    res.send(status);
}

const updateRazorpayStatusPost=async (req, res) => {
    const secret = process.env.SECRET.toString(); // secret string
    // for generating hash
    const shasum = crypto.createHmac('sha256', secret)
    shasum.update(JSON.stringify(req.body))
    const digest = shasum.digest('hex')

    // console.log(JSON.stringify(req.body));
    if (digest === req.headers['x-razorpay-signature']) {
        console.log('request is legit')
        // process it
        const status = req.body.payload.payment.entity.captured;
        const oid = req.body.payload.payment.entity.order_id;
        if (status === true) {
            await updateRazorpayStatus(oid,status);
        }
    } else {
        // pass it
    }
    res.json({status: 'ok'})
}
const orderIdPost=async (req,res)=>{
    const amount = parseInt(req.body.amount)
    const currency = 'INR'
    const receiptNo = shortid.generate()
    const options = {
        amount: amount * 100,
        currency,
        receipt: receiptNo,
    }
    try {
        // creating order in razorpay
        const response = await razorpay.orders.create(options)

        // entering data in database
        await insertRazorpay(response.id, new Date(), response.currency, response.amount / 100, false, false, receiptNo, req.body.email)
        // sending .json with orderid,currency,amount
        res.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount
        })


    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    orderIdPost:orderIdPost,
    updateRazorpayStatusPost:updateRazorpayStatusPost,
    updateUserStatusPost:updateUserStatusPost
}