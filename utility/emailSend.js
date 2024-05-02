const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function emailSendMail(email,title,body) {
  
  const info = await transporter.sendMail({
    from: "Anuj Yadav", // sender address
    to: email, // list of receivers
    subject: title, // Subject line
    text: body, // plain text body
  });

  console.log("Message sent: %s", info.messageId);
}



module.exports = emailSendMail
