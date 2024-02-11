const ReportError = require("../models/Errors");
const Profile = require("../models/Profiles");
const SuspendUserAccount = require("../models/Suspend");
const Uploads = require("../models/Uploads");
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
    if (req.body != {}) {
        const report = new ReportError(req.body);
        report.createReport()
            .then(fdb => {
                res.status(200).json(fdb);
            })
            .catch(err => {
                res.status(500).json({ error: err, message: "Internal Server Error !!!" });
            })
    }
    else {
        res.status(500).json({ error: err, message: "Internal Server Error !!!" });
    }
}

exports.deleteVideo = (req, res) => {
    const videoId = req.params.videoId;
    Uploads.deleteVideo(videoId)
        .then(r => {
            if (r.message == 1) {
                res.status(200).json({ message: "delete success" })
            }
            else {
                res.status(201).json({ message: "delete pending" });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err, message: "An error occured" })
        })
}

exports.deactivateUserAccount = async (req, res) => {
    const userId = req.query.userId;
    const userObject = { _id: userId, "UsersDB": {}, "ProfileDB": {}, "CreatorVideos": {} }

    console.log("here 0");
    console.log(userId);

    const UO_1 = await User.getUserAccount(userId) ?? undefined;
    console.log("here 0.1");
    const PO_1 = await Profile.fetchUserProfile(userId) ?? undefined;

    console.log("here 1");
    if ((UO_1.error == false && UO_1.message == "retreived successfully") && (PO_1.error == false && PO_1.message == "retreived successfully")) {

        const delUser = await User.deleteUser(userId);
        const delProfile = await Profile.deleteProfile(userId);

        if (delProfile.message == "delete Success" && delUser.message == "delete Success") {

            const UO_2 = await Uploads.setVideoProperty(userId, "suspendedAccount", "true") ?? undefined;

            if (UO_2.error == false) {

                const VU_1 = await Uploads.retrieveCreatorVideos(userId);

                if (VU_1.message == "success") {
                    userObject.UsersDB = UO_1.document[0];
                    userObject.ProfileDB = PO_1.document[0];
                    userObject.CreatorVideos = VU_1.document;

                    await Uploads.deleteCreatorVideos(userId);

                    const suspendedAccount = new SuspendUserAccount(userObject);
                    suspendedAccount.initialiseSuspendObject()
                        .then(async r => {
                            res.status(200).json(r);
                            await User.deleteUser(userId);
                            await Profile.deleteProfile(userId);
                        })
                        .catch(e => {
                            res.status(500).json(e)
                        })
                }
            }

        }


    }
    else {
        res.status(404).json('404 not found')
    }
}

exports.verifyAndRecoverSuspendedAccount = (req, res) => {
    
}