const nodemailer =require( "nodemailer");
const sendVerificationEmail24 = async (email,msg) => {
    const from = process.env.EMAIL;
    const to = ""+email;
    const subject = "Your One-Time Password for EATABLES";
    const html = "Thank you for choosing EATABLES for your food needs. We are excited to have you as our valued customer" +
        "<br>" +
        "To ensure the security of your account and transactions, we have implemented a One-Time Password (OTP) feature. Whenever you make a payment or login to your account from a new device, you will be required to enter the OTP that we send to your registered mobile number." +
        "<br>" +
        "Your OTP for EATABLES is [" + msg + "]. Please enter this OTP within the next [5] minutes to verify your account and complete your transaction." +
        "<br>" +
        "If you did not request this OTP or suspect any unauthorized activity on your account, please contact our customer support team immediately at [support email address or phone number]." +
        "<br>" +
        "We appreciate your trust in EATABLES and look forward to serving you soon." +
        "<br>" +
        "Best regards," +
        "<br>" +
        "EATABLES Team";


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        },
    });

    let mailOptions = {
        from:from,
        to:to,
        subject:subject,
        html:html
    };

    console.log("MAIL-OPTIONS >> ", mailOptions);

    await transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
            console.log("error >> ", err);
        } else {
            console.log("response >> ", response);
        }
    });
};

module.exports={
    sendVerificationEmail24:sendVerificationEmail24
}
