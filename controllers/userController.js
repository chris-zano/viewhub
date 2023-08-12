const Profile = require("../models/Profiles");
const User = require("../models/Users");

exports.userSignup = (req, res) => {
    const user = new User(req.body.email, req.body.password);
    user.createUser()
    .then(response => {
        if (response.error == false) {
            const newprofile = new Profile(response.userId);
            newprofile.init()
            .then(onexec => {
                if(onexec.error == false && onexec.msg == "No error! Profile initialized successfuly") {
                    res.render("signin", {pageTitle: "Create-Profile ~ name", userId: response.userId, error: true, msg: "Invalid Email Format"})
                }
                else {
                    throw new Error(onexec.msg);
                }
            })
            .catch(error => {
                throw new Error(error);
            })
        }
        else if (response.error == true) {
            res.render("signin", {pageTitle: "signup", userId: null, error: true, msg: "User Already Exists"});
        }
    })
    .catch(error => {
        if (error.error == true) {
            if (error.msg = "User already exists") {
                res.render("signin", {pageTitle: "signup", userId: null, error: true, msg: "User already exists"});
            }
        }
    })
}

exports.userLogin = (req, res) => {
    Profile.checkUsernameExists(req.body.username, req.body.password)
    .then(response => {
        if (response.error == false && response.msg == "Username and Password match") {
            res.render("signin", {pageTitle: "authenticateUser", error: false, userId: response.userId, msg: "no error"});  
        }
    })
    .catch(error => {
        if(error.error == true) {
            res.render("signin", {pageTitle: "login", userId: null, error: true})
        }
    })
}

exports.userUpdateName = (req, res) => {
    Profile.updateUserFirstAndLastNames(req.body.userId, req.body.lastname, req.body.firstname)
    .then(response => {
        if (response.error == false && response.msg == "success") {
            res.render("signin", {pageTitle: "Create-Profile ~ username", userId: response.userId})
        }
    })
    .catch(error => {
        throw new Error(error);
    })
}

exports.userUpdateUsername = (req, res) => {
    Profile.updateUsername(req.body.userId, req.body.username)
    .then(response => {
        if (response.error == false && response.msg == "success") {
            res.render("signin", {pageTitle: "Create-Profile ~ gender", userId: req.body.userId});
        }
        else {
            throw new Error(response.msg);
        }
    })
    .catch(error => {
        throw new Error(error);
    })
}

exports.userUpdatedobAndgender = (req, res) => {
    Profile.updatedobAndGender(req.body.userId, req.body.dob, req.body.gender)
    .then(response => {
        if (response.error == false && response.msg == "success") {
            res.render("signin", {pageTitle: "Create-Profile ~ picture", userId: req.body.userId});
        }
        else {
            throw new Error(response.msg);
        }
    })
    .catch(error => {
        throw new Error(error);
    })
    
}

exports.userUpdateProfilePic = (req, res) => {
    Profile.updatePictureUrl(req.body.userId, `/image/profile/${req.file.filename}`)
    .then(response => {
        if (response.error == false && response.msg == "success") {
            res.render("signin", {pageTitle: "authenticateUser", error: false, userId: req.body.userId, msg: "no error"})
        }
        else {
            throw new Error(response.msg);
        }
    })
    .catch(error => {
        throw new Error(error);
    })
}