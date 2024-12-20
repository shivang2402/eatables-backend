

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}



const express = require('express');
const sqlite3 = require("sqlite3");
const app = express();
const bodyParser = require('body-parser');
const path=require("path")
const static_path=path.join(__dirname,"../public")
const fileUpload = require('express-fileupload');

const { insertOTP} = require("./model/otp.model");

app.use(bodyParser.json())
app.use(express.static(static_path));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({extended:false}));
app.use(fileUpload(undefined));


let db = new sqlite3.Database('./USERS');
let selectQuery = 'SELECT * FROM MENUITEM ;';

let ans = [];

db.all(selectQuery, (err, rows) => {
    if (err) return;
    // console.log(rows[0].ITEM_IMAGE);
    // ans.push(rows);
})

app.use(require('express').json());



app.use(require('express')())
const { sendVerificationEmail24 } = require("./Utils/EmailSender.js");



// app.use(require('./helper/menuAdd.websocket')())
import('./helper/websocket.js');
const amqp = require('amqplib/callback_api')
amqp.connect('amqps://grimfxlm:CpY9yP94WbLFhBadzkwtYLnCDNOPVYRq@puffin.rmq2.cloudamqp.com/grimfxlm', (connError, connection) => {
    if (connError) {
        throw connError
    }
    try{

    connection.createChannel((channelError, chanel) => {
        if (channelError) {
            throw channelError
        }
        const queue = 'test3'

        chanel.assertQueue("asdf", {
            durable: false,
            noAck : true
        });


        // chanel.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        chanel.consume("asdf", (msg) => {
            var secs = msg.content.toString().split('.').length - 1;

            console.log("msg: " , msg.content)
            let obj = JSON.parse(msg.content);
            console.log("Done")
            setTimeout( function () {
                console.log(" [x] Done");
                console.log(obj+">>>");
                sendVerificationEmail24(obj.email,  obj.otp).then(r => {
                    console.log("Email send shiv")
                });
                insertOTP(obj.id, obj.otp, new Date().getTime())

                // chanel.ack(msg);
            }, secs * 1000);
        }, {
            noAck: true
        })
    })
}catch (err) {
        console.log("Could now create");

    }
})




const loginRoute = require('./routes/Login');
app.use("/login", loginRoute.router);

app.get('/hello', (req, res) => {
    console.log("hello1")
    res.send("hello")
})


const itemAddrouter= require('./routes/itemAdd')
app.use('/additem',itemAddrouter.router)


const SignUpRoute = require('./routes/SignUp');
app.use('/register', SignUpRoute.router);



const OtpRoute = require('./routes/otpValidation');
app.use('/otp', OtpRoute.router);

const ItemRoute=require('./routes/itemAdd');
app.use('/item',ItemRoute.router);

const OrderRoute=require('./routes/order');
app.use('/order',OrderRoute.router);

const NotifyRoute=require('./routes/notify');
app.use('/notify',NotifyRoute.router);

// >>>>>>> a6a8ebc (food item add)
const forgotPasswordRoute=require('./routes/ForgotPassword');
app.use('/forgotPassword',forgotPasswordRoute.router);
const RazorpayRoute=require('./routes/razorpay');
app.use('/razorpay',RazorpayRoute.router);

app.use("/api",require("./routes/app.routes"));

app.listen(process.env.PORT || 3000, function () {
    console.log("listing to port 3000 ")
})

