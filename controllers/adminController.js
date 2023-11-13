const ReportError = require("../models/Errors");
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

exports.reportError = (req, res) => {
    console.log(req.body);
    if (req.body != {}) {
        const report = new ReportError(req.body);
        report.createReport()
        .then(fdb => {
            res.status(200).json(fdb);
        })
        .catch(err => {
            res.status(500).json({error: err, message: "Internal Server Error !!!"});
        })
    }
    else {
        res.status(500).json({error: err, message: "Internal Server Error !!!"});
    }
}