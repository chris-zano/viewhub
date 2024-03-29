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
const Uploads = require('../models/Uploads');
const UpdateUserProfileInformation = require('../models/UpdateProfileObjects');
const UpdateVideoObject = require('../models/UpdateVideoObjects');
const Log = require('../models/Log');
const upload = multer({ dest: path.join(__dirname, "../DB/profile_images") });

router.get('/', (req, res) => {
    // console.log(res);
    res.render("index", { pageTitle: "Tview", error: false, userId: null, msg: "no error" })
})

router.get('/user/get/email/:id', (req, res) => {
    const id = req.params.id;

    User.getEmail(id)
        .then(response => {
            if (response.msg == "No user with such email") {
                res.status(404).json("No email found");
            }
        })
        .catch(error => {
            if (error.msg == "User match" && error.userId == id) {
                res.status(200).json({ email: error.email })
            }
        })
})

router.get('/user/password/reset/:userId', (req, res) => {
    if (req.params.userId != "null") {
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
    console.log(recipient);

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
});

router.get('/admin/delete-user-account', async (req, res) => {
    const userId = req.query.userId;

    try {
        await UpdateUserProfileInformation.deleteUser(userId);
        await Uploads.deleteCreatorVideos(userId);
        await Profile.deleteProfile(userId);
        const result = await User.deleteUser(userId);

        if (result.message === "delete Success") {
            Log.createLogOfUserId(userId, "delete")
            res.status(200).json({ message: "delete Success" });
        } else {
            Log.createLogOfUserId(userId, "attempted delete")
            res.status(500).json({ message: "Internal Server Error" });
        }
    } catch (e) {
        console.error(e);
        Log.createLogOfUserId(userId, "attempted delete")
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/admin/deactivate-user-account', adminController.deactivateUserAccount);


router.get("/admin/delete/deleteVideoByCreator/:videoId", adminController.deleteVideo);

router.get("/account/recover", (req, res) => {
    if (req.query.v == "t") {
        console.log(true);
        res.render("recover");
    }
    else {
        console.log(false);
        res.status(400).json("Bad Request");
    }
})

router.post("/edit/update/name", adminController.userUpdateName);
router.post("/edit/update/username", adminController.userUpdateUsername);
router.post("/edit/update/ppic", upload.single("ppic"), adminController.userUpdateProfilePic);

//error handling routes
router.post("/admin/error/report", adminController.reportError);

module.exports = router