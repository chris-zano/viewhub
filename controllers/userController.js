const Profile = require("../models/Profiles");
const User = require("../models/Users");

exports.userSignup = (req, res) => {
    console.log(req.body);
    const user = new User(req.body.email, req.body.password);
    user.createUser()
    .then(response => {
        if (response.error == false) {
            const newprofile = new Profile(response.userId);
            newprofile.init()
            .then(onexec => {
                if(onexec.error == false && onexec.msg == "No error! Profile initialized successfuly") {
                    res.render("../views/layouts/flname", {pageTitle: "Create-Profile ~ name", userId: response.userId})
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
            throw new error(response.msg);
        }
    })
    .catch(error => {
        throw new Error(error);
    })
}

exports.userLogin = (req, res) => {
    console.log(req.body);
    User.authWithPassword(req.body.username, req.body.password)
    .then(response => {
        if (response.error == false && response.msg == "Username and Password match") {
            res.status(200).json({message: response.msg, userId: response.userId});   
        }
        else if(response.error == true) {
            throw new Error(response.msg);
        }
    })
    .catch(error => {
        throw new Error(error);
    })
}

exports.userUpdateName = (req, res) => {
    console.log(req.body);
    Profile.updateUserFirstAndLastNames(req.body.userId, req.body.lastname, req.body.firstname)
    .then(response => {
        if (response.error == false && response.msg == "success") {
            res.render("../views/layouts/username", {pageTitle: "Create-Profile ~ username", userId: response.userId})
        }
    })
    .catch(error => {
        throw new Error(error);
    })
}

exports.userUpdateUsername = (req, res) => {
    console.log(req.body);
    Profile.updateUsername(req.body.userId, req.body.username)
    .then(response => {
        if (response.error == false && response.msg == "success") {
            res.render("../views/layouts/gender", {pageTitle: "Create-Profile ~ gender", userId: req.body.userId});
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
    console.log(req.body);

    Profile.updatedobAndGender(req.body.userId, req.body.dob, req.body.gender)
    .then(response => {
        if (response.error == false && response.msg == "success") {
            res.render("../views/layouts/picture", {pageTitle: "Create-Profile ~ picture", userId: req.body.userId});
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
    console.log(req.body);

    Profile.updatePictureUrl(req.body.userId, `/image/profile/${req.file.filename}`)
    .then(response => {
        if (response.error == false && response.msg == "success") {
            res.render("index", {pageTitle: "Home", userId: req.body.userId});
        }
        else {
            throw new Error(response.msg);
        }
    })
    .catch(error => {
        throw new Error(error);
    })
}