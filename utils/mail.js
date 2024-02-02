const nodemailer = require("nodemailer");

// this utility module will be deprecated soon

exports.sendMail = (recipient, subject, message) => {
    return new Promise((resolve, reject) => {
        //create a transporter profile, that allows login access to your gmail
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "niicodes.teamst0199@gmail.com",
                pass: "ldwqdwzudicildio"
            }
        });

        //compose an email
        const mailOptions = {
            from: "niicodes.teamst0199@gmail.com",
            to: recipient,
            subject: String(subject),
            text: String(message)
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject({error: true, message: "Error sending mail"});
            } else {
                resolve({error: false, message: "Email sent"})
            }
        });
    })
}