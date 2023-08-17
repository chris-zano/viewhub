const Profile = require("../models/Profiles");
const User = require("../models/Users");

exports.userUpdateName = (req, res) => {
    Profile.updateUserFirstAndLastNames(req.body.userId, req.body.lastname, req.body.firstname)
        .then(response => {
            if (response.error == false && response.msg == "success") {
                try {
                    Profile.getUserProfileById(req.body.userId)
                        .then(response => {
                            if (response.error == false) {
                                console.log(response.document[0]);
                                res.render("layouts/profile/editprofile", { userId: req.body.userId, document: response.document[0] });
                            }
                        })
                        .catch(error => {
                            res.render(`error/${error}`)
                        })
                } catch (error) {
                    res.render(`error/${error}`)
                }
            }
        })
        .catch(error => {
            res.render(`error/${error}`)
        })
}

exports.userUpdateUsername = (req, res) => {
    Profile.updateUsername(req.body.userId, req.body.username)
        .then(response => {
            if (response.error == false && response.msg == "success") {
                try {
                    Profile.getUserProfileById(req.body.userId)
                        .then(response => {
                            if (response.error == false) {
                                console.log(response.document[0]);
                                res.render("layouts/profile/editprofile", { userId: req.body.userId, document: response.document[0] });
                            }
                        })
                        .catch(error => {
                            res.render(`error/${error}`)
                        })
                } catch (error) {
                    res.render(`error/${error}`)
                }
            }
        })
        .catch(error => {
            res.render(`error/${error}`)
        })
}

exports.userUpdateProfilePic = (req, res) => {
    Profile.updatePictureUrl(req.body.userId, `/image/profile/${req.file.filename}`)
        .then(response => {
            if (response.error == false && response.msg == "success") {
                try {
                    Profile.getUserProfileById(req.body.userId)
                        .then(response => {
                            if (response.error == false) {
                                console.log(response.document[0]);
                                res.render("layouts/profile/editprofile", { userId: req.body.userId, document: response.document[0] });
                            }
                        })
                        .catch(error => {
                            res.render(`error/${error}`)
                        })
                } catch (error) {
                    res.render(`error/${error}`)
                }
            }
        })
        .catch(error => {
            res.render(`error/${error}`)
        })
}
