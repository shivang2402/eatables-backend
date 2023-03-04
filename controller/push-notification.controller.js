var admin= require("firebase-admin")
var fcm = require("fcm-notification");

var serviceAccount= require("../config/push-notification-key.json");
const certPath= admin.credential.cert(serviceAccount);
var FCM = new fcm(certPath);
exports.sendPushNotification=(req,res,next)=>
{
    console.log(req);
    console.log(req.body)
    try {
        let message={
            notification:{
                title:"Test Notification",
                body:"Notification Message"
            },data:{
                orderId:"123456",
                orderDate:"2022-10-22"
            },
            token: req.body.fcm_token,
        };
        FCM.send(message,function (err,resp)
        {
            if (err) {
                return res.status(500).send(
                    {
                        message: err
                    });
            }

            else
                {
                    return res.status(200).send(
                        {
                            message:"Notfication Sent"
                        });
                }

        });
    }
    catch (err)
    {
    throw  err;
    }
}