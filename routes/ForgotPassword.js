const router = require('express').Router();
const controller= require('../controller/itemAdd.controller.js')
const {selectData, updatePassword} = require("../model/user.model");
const amqp = require("amqplib/callback_api");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
router.post('/setPassword',async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password.trim(), 10)
updatePassword(req.body.email,hashedPassword);
    res.send("true");
})
router.post('/',async (req, res) => {
    const r = await selectData(req.body.email);
    console.log(r);
    if(r===undefined){
        res.send("false")

    }
    else{
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
                    "id": r.STUDENT_ID,
                    "email": req.body.email.trim(),
                    "otp": otp
                }
                chanel.sendToQueue(queue, Buffer.from(JSON.stringify(msgJson)));

            })
        })
        res.send("true")

    }


})
module.exports = {
    router:router
}