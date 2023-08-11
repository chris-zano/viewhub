const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const path = require("path");
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, "../DB/profile_images") });

router.get('/login', (req, res) => {
    res.render("signin", {pageTitle: "signup"})
})

router.post("/signup", userController.userSignup);
router.post("/update/name", userController.userUpdateName);
router.post("/update/gender", userController.userUpdatedobAndgender);
router.post("/update/username", userController.userUpdateUsername);
router.post("/update/ppic", upload.single("ppic") ,userController.userUpdateProfilePic);
module.exports = router