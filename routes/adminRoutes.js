// require("env").config();
const express = require('express');
const router = express.Router();
const path = require("path");

const nodemailer = require("nodemailer");
const adminController = require("../controllers/adminController");

const User = require('../models/Users');
const Profile = require('../models/Profiles');
const VerifyCode = require('../models/Verifycode');

const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, "../DB/profile_images") });

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
    const verificationCode = Math.floor(1000 + Math.random() * 9000);//generate random 4 digit number

    //create a transporter profile, that allows login access to your gmail
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "niicodes.teamst0199@gmail.com",
            pass: "ldwqdwzudicildio"
        }
    })

    //compose an email
    const mailOptions = {
        from: "niicodes.teamst0199@gmail.com",
        to: req.params.email,
        subject: 'Email Verification Code',
        text: `Your verification code is: ${verificationCode}`
    };

    //send an email
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

router.get("/admin/update/password/:userId/:current_password/:new_password", (req, res) => {
    try {
        console.log(req.params);
        User.updateUserPassword(req.params.userId, req.params.current_password, req.params.new_password)
        .then(response => {
            if (response.error == false && response.message == "password updated")
            {
                res.status(200).json({message: "password updated"});
            }
        })
        .catch(error => {
            if (error) res.status(200).json({message: "failed to update password"});
        })
    } catch (error) {
        
    }
})

router.get("/user/edit/profile/:userId", (req, res) => {
    try {
        Profile.getUserProfileById(req.params.userId)
        .then(response => {
            if (response.error == false) {
                console.log(response.document[0]);
                res.render("layouts/profile/editprofile", {userId: req.params.userId, document: response.document[0]});
            }
        })
        .catch(error => {
            res.render(`error/${error}`)
        })
    } catch (error) {
        res.render(`error/${error}`)
    }
})

router.post("/edit/update/name", adminController.userUpdateName);
router.post("/edit/update/username", adminController.userUpdateUsername);
router.post("/edit/update/ppic", upload.single("ppic"), adminController.userUpdateProfilePic);

module.exports = router