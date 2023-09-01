const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const path = require("path");
const User = require('../models/Users');
const Profile = require('../models/Profiles');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, "../DB/profile_images") });

router.get('/login', (req, res) => {
    res.render("signin", { pageTitle: "login", userId: null, error: false })
})
router.get('/signup', (req, res) => {
    res.render("signin", { pageTitle: "signup", userId: null, error: false, msg: "no error here" })
})

router.get('/nav/upload_video', (req, res) => {
    res.render("upload_video");
})

router.get("/get/profile/userbyId/:userId", (req, res) => {
    User.checkId(req.params.userId)
        .then(response => {
            if ((response.msg == "User match") && (response.id == req.params.userId)) {
                res.status(200).json({ error: false, userId: req.params.userId, message: "User authenticated" });
            }
        })
        .catch(error => {
            res.status(404).json({ error: true, userId: null, message: error.msg });
        })
});

router.get("/error/:errormsg", (req, res) => {
    res.render("error", { message: req.params.errormsg });
})

router.get("/user/profile/:userId", (req, res) => {
    Profile.getUserProfileById(req.params.userId)
        .then(response => {
            if (response.error == false && response.message == "data retreived successfully") {
                // console.log(response.document[0]);
                res.render("layouts/profile/profile", { document: response.document[0] });
            }
        })
        .catch(error => {
            res.end(error);
        })
})

router.post("/userSignup", userController.userSignup);
router.post("/userlogin", userController.userLogin);
router.post("/update/name", userController.userUpdateName);
router.post("/update/gender", userController.userUpdatedobAndgender);
router.post("/update/username", userController.userUpdateUsername);
router.post("/update/ppic", upload.single("ppic"), userController.userUpdateProfilePic);

router.get("/userLogout/:userId", userController.userLogout);


module.exports = router