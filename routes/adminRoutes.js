// require("env").config();
const express = require('express');
const router = express.Router();
const path = require("path");

const mailer = require("../utils/mail")
const adminController = require("../controllers/adminController");

const User = require('../models/Users');
const Profile = require('../models/Profiles');
const VerifyCode = require('../models/Verifycode');

const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, "../DB/profile_images") });

router.get('/', (req, res) => {
    res.render("index", { pageTitle: "Home", error: false, userId: null, msg: "no error" })
})

router.get('/user/get/email/:id', (req, res) => {
    const id = req.params.id;

    User.getEmail(id)
        .then(response => {
            if (response.msg == "No user with such email") {
                res.status(500).end("a major error occured. contact the developer");
            }
        })
        .catch(error => {
            if (error.msg == "User match" && error.userId == id) {
                res.status(200).json({email: error.email})
            }
        })
})

router.get('/user/password/reset/:userId', (req, res) => {
    if (req.params.userId != "null" || null) {
        User.checkId(req.params.userId)
            .then(response => {
                if ((response.msg == "User match") && (response.id == req.params.userId)) {
                    res.render("layouts/profile/reset", { error: false, userId: req.params.userId, authorized: false });
                }
            })
            .catch(error => {
                res.render("error", { error: error });
            })
    }
    else {
        res.render("layouts/profile/reset", { error: false, userId: null, authorized: false });
    }
})

router.get("/user/auth/email/:email", (req, res) => {
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
    const message = `Your verification code is: ${verificationCode}`;
    const subject = 'Email Verification Code';
    const recipient = req.params.email;

    mailer.sendMail(recipient, subject, message)
        .then(response => {
            if (response.message == "Email sent") {
                const veriyObject = new VerifyCode(verificationCode, req.params.email);
                veriyObject.storeCodeAndEmail()
                    .then(response => {
                        if (response.error == null) {
                            res.status(200).json({ message: "code generated successfully" });
                        }
                    })
                    .catch(error => {
                        res.status(404).json({ message: error });
                    })
            }
            else {
                res.status(500).json({ message: "INTERNAL SERVER ERROR!" })
            }
        })
        .catch(error => {
            res.status(404).json({ message: error });
        })

})


router.get("/user/verifycodeandemail/:email/:code", (req, res) => {
    const verifyObject = new VerifyCode(req.params.code, req.params.email);
    verifyObject.verifyCodeAndEmail()
        .then(response => {
            res.status(200).json({ message: response.message })
        })
        .catch(error => {
            res.status(200).json({ error: error });
        })
})

router.get("/user/password_change/authorized", (req, res) => {
    void (req);
    res.render("layouts/profile/passwordreset", { error: false, userId: req.params.userId, authorized: false });

})

router.get("/admin/update/password/:userId/:current_password/:new_password", (req, res) => {
    try {
        User.updateUserPassword(req.params.userId, req.params.current_password, req.params.new_password)
            .then(response => {
                if (response.error == false && response.message == "password updated") {
                    res.status(200).json({ message: "password updated" });
                }
            })
            .catch(error => {
                if (error) res.status(200).json({ message: "failed to update password" });
            })
    } catch (error) {

    }
})

router.get("/user/edit/profile/:userId", (req, res) => {
    try {
        Profile.getUserProfileById(req.params.userId)
            .then(response => {
                if (response.error == false) {
                    res.render("layouts/profile/editprofile", { userId: req.params.userId, document: response.document[0] });
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

//error handling routes
router.post("/admin/error/report", adminController.reportError);

module.exports = router