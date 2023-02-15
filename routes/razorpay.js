const router = require('express').Router();
const shortid = require('shortid')// for generating token
const Razorpay = require('razorpay')// for connecting backend to Razorpay servers
const crypto = require('crypto')
const razorpayController = require("../controller/Razorpay.controller");

const razorpay = new Razorpay({
    key_id: process.env.SECRET_ID,
    key_secret: process.env.SECRET_KEY
})

router.post("/verification/user",razorpayController.updateUserStatusPost)
router.post("/verification",razorpayController.updateRazorpayStatusPost);
router.post("/orderId",razorpayController.orderIdPost)

//
// app.post('/verification', (req, res) => {
//     // do a validation
//     const secret = process.env.SECRET.toString(); // secret string
//     // for generating hash
//     const shasum = crypto.createHmac('sha256', secret)
//     shasum.update(JSON.stringify(req.body))
//     const digest = shasum.digest('hex')
//
//     console.log(JSON.stringify(req.body));
//
//     if (digest === req.headers['x-razorpay-signature']) {
//         console.log('request is legit')
//         // process it
//         const status = req.body.payload.payment.entity.captured;
//         const oid = req.body.payload.payment.entity.order_id;
//         if (status === true) {
//             pool.connect((err, client, done) => {
//                 if (err) throw err
//                 //updating status to true after payment into database
//                 client.query('Update  paymentgateway set razorpay_status=$1 where bill_no=$2', [true, oid], (err, res) => {
//                     done()
//
//                     if (err) {
//                         console.log(err.stack)
//                     }
//
//                 })
//             })
//         }
//     } else {
//         // pass it
//     }
//     res.json({status: 'ok'}) // sending https status 200 to razorpay servers
// })
//
// router.post('/verification/user',(req, res)=>{
//     const status = req.body.status;
//     const oid = req.body.oid;
//     console.log("user verification")
//     console.log(req.body)
//     if (status === true) {
//         pool.connect((err, client, done) => {
//             if (err) throw err
//             //updating status to true after payment into database
//             client.query('Update  paymentgateway set user_status=$1 where bill_no=$2', [true, oid], (err, res) => {
//                 done()
//
//                 if (err) {
//                     console.log(err.stack)
//                 }
//
//             })
//         })
//     }
//     res.send(true);
// })


// router.post("/orderId",async (req, res) => {
//     const amount = parseInt(req.body.amount)
//     const currency = 'INR'
//     const receiptNo = shortid.generate()
//     const options = {
//         amount: amount * 100,
//         currency,
//         receipt: receiptNo,
//     }
//
//     try {
//         // creating order in razorpay
//         const response = await razorpay.orders.create(options)
//
//         // entering data in database
//         pool.connect((err, client, done) => {
//             if (err) throw err
//             client.query('Insert Into paymentgateway (bill_no, date, currency, amount, razorpay_status,user_status, token,STUDENT_ID) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', [response.id, new Date(), response.currency, response.amount / 100, false, false, receiptNo,req.student_id], (err, res) => {
//                 done()
//                 if (err) {
//                     console.log(err.stack)
//                 }
//
//             })
//         })
//         // sending .json with orderid,currency,amount
//         res.json({
//             id: response.id,
//             currency: response.currency,
//             amount: response.amount
//         })
//
//
//     } catch (error) {
//         console.log(error)
//     }
// })

module.exports = {
    router:router
}