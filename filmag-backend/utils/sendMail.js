const nodemailer = require("nodemailer");

async function main(){

  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "georg.neumayer1@gmail.com", // generated ethereal user
      pass: "12345678a123" // generated ethereal password
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"georg.neumayer1@gmail.com', // sender address
    to: "jarek_wicher@wp.pl", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>" ,// html body
        attachments: [
            {   // utf-8 string as an attachment
                filename: '1.xlsx',
                content: ''
            }]
  });

}

main().catch(console.error);

module.exports.main = main;
