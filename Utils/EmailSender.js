const nodemailer =require( "nodemailer");
const sendVerificationEmail = async (email,msg) => {
    const from = process.env.EMAIL;
    const to = ""+email;
    const subject = "MyCompany - Account activation link";
    const html = ""+ msg;

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

    // console.log("MAIL-OPTIONS >> ", mailOptions);

    await transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
            console.log("error >> ", err);
        } else {
            console.log("response >> ", response);
        }
    });
};

module.exports={
    sendVerificationEmail:sendVerificationEmail
}
