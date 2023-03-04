const pushNotificationController = require("../controller/push-notification.controller");
const express= require("express");
const router = express.Router();
router.post("/send-notifications",pushNotificationController.sendPushNotification);
module.exports=router;
