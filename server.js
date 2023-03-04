

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

//for testing purpose
// <<<<<<< HEAD
let db = new sqlite3.Database('./USERS');
let selectQuery = 'SELECT * FROM MENUITEM ;';

let ans = [];

db.all(selectQuery, (err, rows) => {
    if (err) return;
    // console.log(rows[0].ITEM_IMAGE);
    // ans.push(rows);
})

// app.get('/index', (req, res) => {
//     console.log(ans)
//
//     res.sendFile(__dirname+'/index.html');
// })
// app.get('/delete', (req, res) => {
//     console.log(ans)
//
//     res.sendFile(__dirname+'/delete.html');
// })
// app.get('/update', (req, res) => {
//     console.log(ans)
//
//     res.sendFile(__dirname+'/update.html');
// })
// app.get('/addCat', (req, res) => {
//     console.log(ans)
//
//     res.sendFile(__dirname+'/cat-add.html');
// })
// app.get('/updateCat', (req, res) => {
//     console.log(ans)
//
//     res.sendFile(__dirname+'/cat-update.html');
// })
//
// app.get('/deleteCat', (req, res) => {
//     console.log(ans)
//
//     res.sendFile(__dirname+'/cat-delete.html');
// })
// app.get('/displayCat', (req, res) => {
//     console.log(ans)
//
//     res.sendFile(__dirname+'/display.html');
// })
// app.get('/displayItem', (req, res) => {
//     console.log(ans)
//
//     res.sendFile(__dirname+'/display-menu-item.html');
// })
// =======
//for testing purpose
// >>>>>>> 3d4bc8f (This is a new commit for what I originally planned to be amended)
// let db = new sqlite3.Database('./menuItem');
// let selectQuery = 'SELECT * FROM menuItem ;';
// let ans = [];
//
// db.all(selectQuery, (err, rows) => {
//     if (err) return;
//     console.log(rows);
//     ans.push(rows);
// });
//
// app.get('/index', (req, res) => {
//     console.log(ans)
//
//     res.sendFile(__dirname+'/index.html');
// })
// app.get('/delete', (req, res) => {
//     console.log(ans)
//
//     res.sendFile(__dirname+'/delete.html');
// })
// app.get('/update', (req, res) => {
//     console.log(ans)
//
//     res.sendFile(__dirname+'/update.html');
// })
// app.get('/addCat', (req, res) => {
//     console.log(ans)
//
//     res.sendFile(__dirname+'/cat-add.html');
// })
// app.get('/displayCat', (req, res) => {
//     console.log(ans)
//
//     res.sendFile(__dirname+'/display.html');
// })
// app.get('/displayItem', (req, res) => {
//     console.log(ans)
//
//     res.sendFile(__dirname+'/display-menu-item.html');
// })
//
//
//
// <<<<<<< HEAD
// <<<<<<< HEAD
// =======
// >>>>>>> a6a8ebc (food item add)
// >>>>>>> 3d4bc8f (This is a new commit for what I originally planned to be amended)
// =======
// // >>>>>>> a6a8ebc (food item add)
// >>>>>>> cd29e7a (changes 2.0)
//








// const { insertOTP} = require("./model/otp.model");




app.use(require('express').json());



app.use(require('express-flash')())
const { sendVerificationEmail } = require("./Utils/EmailSender.js");



// app.use(require('./helper/menuAdd.websocket')())
import('./helper/websocket.js');
// app.use(function (req, res, next) {
//     const {io} = require('./helper/websocket.js');
//
//     next();
// })

const amqp = require('amqplib/callback_api')
amqp.connect('amqps://grimfxlm:CpY9yP94WbLFhBadzkwtYLnCDNOPVYRq@puffin.rmq2.cloudamqp.com/grimfxlm', (connError, connection) => {
    if (connError) {
        throw connError
    }
    connection.createChannel((channelError, chanel) => {
        if (channelError) {
            throw channelError
        }
        const queue = 'test3'
        chanel.assertQueue(queue, {
            durable: false
        });
        chanel.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        chanel.consume(queue, (msg) => {
            var secs = msg.content.toString().split('.').length - 1;

            console.log("msg: " + msg.content)
            let obj = JSON.parse(msg.content);
            setTimeout( function () {
                console.log(" [x] Done");

                insertOTP(obj.id, obj.otp, new Date().getTime())
                sendVerificationEmail(obj.email, "your otp " + obj.otp).then(r => {
                    console.log("Email send shiv")
                });
                chanel.ack(msg);
            }, secs * 1000);
        }, {
            noAck: false
        })
    })
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

// >>>>>>> a6a8ebc (food item add)

const RazorpayRoute=require('./routes/razorpay');
app.use('/razorpay',RazorpayRoute.router);

app.use("/api",require("./routes/app.routes"));

app.listen(3000, function () {
    console.log("listing to port 3000 ")
})

