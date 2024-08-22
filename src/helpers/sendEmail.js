const nodemailer = require('nodemailer');
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service:"Gmail",
    host: "smtp.email.com",
    port: 587,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
});

const sendEmail =async (email,subject,html)=>{
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER, 
            to: email, 
            subject,
            html, 
          });
        
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = sendEmail


