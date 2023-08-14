// require("env").config();
const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const VerifyCode = require('../models/Verifycode');
const nodemailer = require("nodemailer");

router.get('/', (req, res) => {
    res.render("index", { pageTitle: "Home", error: false, userId: null, msg: "no error" })
})

router.get('/user/password/reset/:userId', (req, res) => {
    User.checkId(req.params.userId)
        .then(response => {
            if ((response.msg == "User match") && (response.id == req.params.userId)) {
                res.render("layouts/profile/reset", { error: false, userId: req.params.userId, authorized: false });
            }
        })
        .catch(error => {
            res.render("error", { error: error });
        })
})

router.get("/user/auth/email/:email/:userId", (req, res) => {
    User.checkEmail(req.params.email)
        .then(error => {
            res.status(404).json({ error: error, message: "an error occurred" })
        })
        .catch(response => {
            if (response.email == req.params.email && response.userId == req.params.userId) {
                res.status(200).json({ error: null, message: "auth success", credentials: { email: response.email, id: response.userId } });
            }
            else {
                res.status(200).json({ error: "invalid", message: "invalid auth credentials", credentials: { email: response.email, id: response.userId } });
            }
        })

})

router.get("/user/getverificationcode/:email", (req, res) => {
    const verificationCode = Math.floor(1000 + Math.random() * 9000);

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "niicodes.teamst0199@gmail.com",
            pass: "ldwqdwzudicildio"
        }
    })

    const mailOptions = {
        from: "niicodes.teamst0199@gmail.com",
        to: req.params.email,
        subject: 'Email Verification Code',
        text: `Your verification code is: ${verificationCode}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
            const veriyObject = new VerifyCode(verificationCode, req.params.email);
            veriyObject.storeCodeAndEmail()
            .then(response => {
                if (response.error == null) {
                    res.status(200).json({message: "code generated successfully"});
                }
            })
            .catch(error => {
                res.status(404).json({message: error});
            })
        }
    });

})


router.get("/user/verifycodeandemail/:email/:code", (req, res) => {
    const verifyObject = new VerifyCode(req.params.code, req.params.email);
    verifyObject.verifyCodeAndEmail()
    .then(response => {
        res.status(200).json({message: response.message})
    })
    .catch(error => {
        res.status(200).json({error: error});
    })
})

router.get("/user/password_change/authorized", (req,res) => {
    void(req);
    res.render("layouts/profile/passwordreset", { error: false, userId: req.params.userId, authorized: false });

})

module.exports = router