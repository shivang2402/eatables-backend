const bcrypt = require("bcrypt");
const {insertData} = require("../model/user.model");
const users = require('../model/user.model').getData;
const amqp = require('amqplib/callback_api')
const otpGenerator = require("otp-generator");
const {findOTP} = require("../model/otp.model");
const post = async (req, res) => {
    try {
        //hashing password using bcrypt
        // console.log(req.body)
        const hashedPassword = await bcrypt.hash(req.body.password.trim(), 10)
        let id = Date.now().toString();
        let flagSignup=true;
        users.forEach((item) => {
            // console.log("item")
            // console.log(item)
            if(""+item[0].EMAIL_ID===""+req.body.email.trim()){
                id=item[0].STUDENT_ID;
                flagSignup=false;
                // console.log("id1 " + id)

            }
        })
        // console.log("id2 " + id)

        if(flagSignup){
            await insertData(
                id,
                req.body.name.trim(),
                req.body.email.trim(),
                hashedPassword,
                parseInt(req.body.number.trim()),
                false
            )
        }

        // console.log("id3 " + id)
        // var request = require('request');
        // request.post({
        //     headers: {'content-type' : 'application/x-www-form-urlencoded'},
        //     url:     'http://localhost:3000/login',
        //     body:    "email="+req.body.email+"&password="+hashedPassword+"&id="+id+"&name="+req.body.name
        // }, function(error, response, body){
        //     console.log(response)
        //     console.log(body);
        // });

        // console.log("sign up successfull")
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
                const otp = otpGenerator.generate(4, {
                    upperCaseAlphabets: false,
                    specialChars: false,
                    lowerCaseAlphabets: false
                });

                const msgJson = {
                    "id": id,
                    "email": req.body.email.trim(),
                    "otp": otp
                }
                chanel.sendToQueue(queue, Buffer.from(JSON.stringify(msgJson)));

            })
        })
        res.send('true')
    } catch {
        res.send('false')
    }
}
const get = function (req, res) {
    // console.log("get")

    res.send("get register")
}
module.exports = {
    post: post,
    get: get
}
