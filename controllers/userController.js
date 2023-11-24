const Profile = require("../models/Profiles");
const User = require("../models/Users");
const mailer = require("../utils/mail")


exports.userSignup = (req, res) => {
    const user = new User(req.body.email, req.body.password);
    user.createUser()
        .then(response => {
            if (response.error == false) {
                const newprofile = new Profile(response.userId);
                newprofile.init()
                    .then(onexec => {
                        if (onexec.error == false && onexec.msg == "No error! Profile initialized successfuly") {
                            res.render("signin", { pageTitle: "Create-Profile ~ name", userId: response.userId, message: "profile initialised" })
                        }
                        else {
                            throw new Error(onexec.msg);
                        }
                    })
                    .catch(error => {
                        throw new Error(error);
                    })
            }
        })
        .catch(error => {
            if (error.error == true && error.msg.msg != "User match") {
                Profile.checkProfile(error.msg.userId)
                    .then(response1 => {
                        if (response1.msg == "No user with such id") {
                            res.render("signin", { pageTitle: "signup", userId: null, error: true, msg: "User already exists" });
                        }
                        else if (response1.msg == "no username found") {
                            res.render("signin", { pageTitle: "Create-Profile ~ name", userId: response1.userID, message: "no username" });
                        }
                    })
                    .catch(error1 => {
                        res.render("signin", { pageTitle: "signup", userId: null, error: true, msg: "No such User Exists!" });
                    })
            }
            else {
                const recipient = error.msg.email;
                const subject = 'UNSUCCESSFUL LOGIN ATTEMPT';
                const message = `
                    <p>Dear ViewHub User,</p>
                    <p>This email is to inform you that there has been an unsuccessful attempt to signin to your viewhub account with this email ${recipient}.</p>
                    <p>If this was not you, click the button below to reset you account password; Otherwise, no further action is required</p>
                    <p><a href="https://viewhub.io/admin/password/reset/u=?asjjuerbvnrio-10cc4lddi">Reset Password</a></p>
                `;
                
                mailer.sendMail(recipient, subject, message)
                .then(mail => {
                    console.log(mail);
                })
                .catch(mailerror => {
                    console.log(mailerror);
                })
                res.render("signin", { pageTitle: "signup", userId: null, error: true, msg: "Email already registered" });
            }
        })
}

exports.userLogin = (req, res) => {
    console.log(req.body);
    Profile.checkUsernameExists(req.body.username, req.body.password)
        .then(response => {
            if (response.error == false && response.msg == "Username and Password match") {
                console.log("user match");
                res.render("signin", { pageTitle: "authenticateUser", error: false, userId: response.userId, msg: "no error" });
            }
            else if (response.error == false && response.msg == "username matches an email") {
                console.log("username matches an email");
                Profile.checkProfile(response.userId)
                    .then(response1 => {
                        if (response1.msg == "No user with such id") {
                            res.render("signin", { pageTitle: "signup", userId: null, error: true, msg: "User already exists" });
                        }
                        else if (response1.msg == "no username found") {
                            res.render("signin", { pageTitle: "Create-Profile ~ name", userId: response1.userID, message: "no username" });
                        }
                    })
                    .catch(error1 => {
                        res.render("signin", { pageTitle: "signup", userId: null, error: true, msg: "No such User Exists!" });
                    })
            }
        })
        .catch(error => {
            if (error.error == true && error.msg == "Wrong Username") {
                console.log("Wrong username");
                res.render("signin", { pageTitle: "login", userId: null, error: true })
            }
            else if (error.msg.msg == "Wrong Password") {
                console.log(14);
                res.render("signin", { pageTitle: "login", userId: null, error: true })
            }
        })
}

exports.userLogout = (req, res) => {
    //const userId = req.params.userId;
    //TODO: log user logout to access logs using userId as param.

    res.status(200).json({ error: false, message: "User Logged Out Successfully" });
}

exports.userUpdateName = (req, res) => {
    console.log(req.body.userId, req.body.lastname, req.body.firstname);
    Profile.updateUserFirstAndLastNames(req.body.userId, req.body.lastname, req.body.firstname)
        .then(response => {
            if (response.error == false && response.msg == "success") {
                res.render("signin", { pageTitle: "Create-Profile ~ username", userId: response.userId })
            }
        })
        .catch(error => {
            res.send("Internal server Error")
            throw new Error(error);
        })
}

exports.userUpdateUsername = (req, res) => {
    Profile.updateUsername(req.body.userId, req.body.username)
        .then(response => {
            if (response.error == false && response.msg == "success") {
                res.render("signin", { pageTitle: "Create-Profile ~ gender", userId: req.body.userId });
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
                res.render("signin", { pageTitle: "Create-Profile ~ picture", userId: req.body.userId });
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
                res.render("signin", { pageTitle: "authenticateUser", error: false, userId: req.body.userId, msg: "no error" })
            }
            else {
                throw new Error(response.msg);
            }
        })
        .catch(error => {
            throw new Error(error);
        })
}