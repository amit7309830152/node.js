const nodemailer = require('nodemailer');

exports.sendMail = (email, subject = false, text = false, html = false) => {
    return new Promise((resolve, reject) => {
        console.log(process.env.EMAIL_AUTH_USER)
        console.log(process.env.EMAIL_AUTH_PASSWORD)

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_AUTH_USER,
                pass: process.env.EMAIL_AUTH_PASSWORD
            }
        });

        var mailOptions = {
            from: process.env.EMAIL_AUTH_USER,
            to: email,
            subject: subject,
            text: text,
            html: html
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                reject(`Error in sending the mail ${error}`)
                console.log(`Error in sending the mail ${error}`);
            } else {
                resolve(true)
                console.log('Email sent: ' + info.response);
            }
        });
    })
}