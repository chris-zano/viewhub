const loadDB = require("../utils/loadDB").loadDB;
const path = require("path");
const fs = require("fs");
const AuthFactor = require("../utils/auth");
const User = require("./Users");
const filepath = path.join(__dirname, "../DB/neDB/profiles.db");
const db = loadDB(filepath);

/**
 * Profile - blueprints for user profile.
 * instantiates a user object with objectkeys as follows
 * 
 * *[lastname, firstname, username, gender, DOB, followers, following, profilePicUrl].
 * 
 * This class provides methods for performing _CRUD_ operations on a user instance.
 * 
 * *It provides individual methods for create update and delete of object instances.
 * 
 * *It provides a single method for reading the entire object at once
 */
class Profile {
    /**
     * instantiates a user object with objectkeys as follows
     * 
     * @param {string} id User id.
     * *The user id should be authenticated by the User class before beign passed as a parameter to this class
     */

    constructor(id) {
        this._id = id;
    }

    /**
     * *_init()_ -::- initialises the user Profile, after user id has been authenticated.
     * 
     * @returns a new promise, which resolve the user id on success, rejects with appropriate error values and message set correctly
     */
    init() {
        const profileObject = {
            "_id": this._id,
            lastname: '',
            firstname: '',
            username: '',
            gender: '',
            dob: '',
            followers: 0,
            following: 0,
            profilePicUrl: ''
        }

        return new Promise((resolve, reject) => {
            User.checkId(this._id) //checks if user id matches a user in the user datatbase
                .then(res => {
                    if (res.msg == "User match") {
                        Profile.checkProfile(this._id) //checks if profile has already been initialised
                            .then(resp => {
                                if (resp.msg == "User match") {
                                    reject({ error: true, msg: "User already exists" });
                                }
                                else if (resp.msg == "No user with such id") {
                                    db.insert(
                                        profileObject,
                                        async (err, doc) => {
                                            if (err) {
                                                reject({ error: true, msg: err });
                                            }
                                            else {
                                                try {
                                                    resolve({ error: false, msg: "No error! Profile initialized successfuly", userId: doc["_id"] })

                                                }
                                                catch (error) { reject({ error: true, msg: "Failed to init UpdateObject" }) }
                                            }
                                        }
                                    )
                                }
                            })
                            .catch(error => {
                                reject({ error: true, msg: error });
                            })
                    }
                    else {
                        reject({ error: true, msg: "An error occurred while creating your profile" });
                    }
                })
                .catch(err => {
                    reject({ error: true, msg: err });
                })
        })
    }

    /**
     * *checkProfile(id) -::- checks to see if the id has a profile instance
     * @param {string} id
     * @returns a match for the profile id in question
     */
    static checkProfile(id) {
        return new Promise((resolve, reject) => {
            db.find(
                { "_id": id },
                { multi: false },
                (err, doc) => {
                    if (err) {
                        reject(err);
                    }
                    if (doc.length == 0) {
                        resolve({ msg: "No user with such id", id: id });
                    }
                    else {
                        if (doc[0].username == "") {
                            User.checkId(id)
                                .then(res => {
                                    if (res.msg == "User match") {
                                        resolve({ msg: "no username found", userID: doc[0]._id })
                                    }
                                })
                                .catch(error => {
                                    db.remove({ _id: id, username: "" },
                                        { multi: false, returnUpdatedDocs: false },
                                        (err, numRemoved) => {
                                            if (err) reject({ msg: "Error removing false document!!!" });
                                            reject({ error: "user does not exist!!", msg: "False document removed!!!" });
                                        }
                                    )
                                })
                        }
                        else {
                            resolve({ msg: "User match", userID: doc[0]._id })
                        }
                    }
                }
            )
        })
    }

    /**
     * *_checkUsernameExists()_ -::- checks if username exists, for login authentication
     * @param {string} username
     * @param {string} password 
     * @returns a promise that resolves an object with error values and messages set appropriately
     */
    static checkUsernameExists(username, password) {
        return new Promise((resolve, reject) => {
            db.find(
                { username: username },
                { multi: false },
                (err, doc) => {
                    if (err) {
                        reject({ error: true, msg: err });
                    }
                    else {
                        if (doc.length == 0) {
                            User.checkEmail(username)
                                .then(res => {
                                    if (res.msg == "No user with such email") {
                                        reject({ error: true, msg: "Wrong Username" });
                                    }
                                })
                                .catch(err => {
                                    if (err.msg == "User match" && err.email == username) {
                                        resolve({ error: false, userId: err.userId, msg: "username matches an email" });
                                    }
                                    else {
                                        reject(err);
                                    }
                                })
                        }
                        else {
                            User.authWithPassword(doc[0]._id, password)
                                .then(response => {
                                    if (response.msg == "Username and Password match") {
                                        resolve({ error: false, msg: "Username and Password match", userId: doc[0]["_id"] })
                                    }
                                })
                                .catch(error => {
                                    reject({ error: false, msg: error, userID: null })
                                })
                        }
                    }
                }
            )
        })
    }

    static verifyUsername(username) {
        return new Promise((resolve, reject) => {
            db.find(
                { username: username },
                { multi: false },
                (err, doc) => {
                    if (err) reject({ error: true, res_status: 500 });
                    else {
                        if (doc.length == 0) {
                            reject({ error: true, res_status: 400 });
                        }
                        else {
                            resolve({ error: false, res_status: 200, userId: doc[0]._id });
                        }
                    }
                }
            )
        })
    }

    /**
     * 
     * @param {string} id 
     * @param {string} lastname 
     * @param {string} firstname 
     * @returns a new promise that resolves an object appropriate properties on success
     */
    static updateUserFirstAndLastNames(id, lastname, firstname) {
        return new Promise((resolve, reject) => {
            User.checkId(id)//check if user is a registered user
                .then(response => {
                    if (response.msg == "User match") {
                        Profile.checkProfile(id)//check if user profile exists
                            .then(res => {
                                if (res.msg == "no username found") {
                                    db.update( // update user details
                                        { _id: id },
                                        {
                                            $set: {
                                                lastname: lastname,
                                                firstname: firstname
                                            }
                                        },
                                        ((err, numReplaced) => {
                                            if (err) reject({ error: true, msg: `c=> ${error}` })
                                            else {
                                                resolve({ error: false, msg: "success", userId: id, docUpdated: numReplaced });
                                            }
                                        })
                                    )
                                }
                                else if (res.msg == "User match") {
                                    db.update( // update user details
                                        { _id: id },
                                        {
                                            $set: {
                                                lastname: lastname,
                                                firstname: firstname
                                            }
                                        },
                                        ((err, numReplaced) => {
                                            if (err) reject({ error: true, msg: `c=> ${error}` })
                                            else {
                                                resolve({ error: false, msg: "success", userId: id, docUpdated: numReplaced });
                                            }
                                        })
                                    )
                                }
                            })
                            .catch(error => {
                                reject({ error: true, msg: `a=> ${error}` })
                            })
                    }
                })
                .catch(error => {
                    reject({ error: true, msg: `b=> ${error}` })
                })
        })
    }

    /**
     * 
     * @param {string} id 
     * @param {date} dob 
     * @param {string} gender 
     * @returns a new promise that resolves the appropriate object on success
     */
    static updatedobAndGender(id, dob, gender) {
        return new Promise((resolve, reject) => {
            User.checkId(id)//check if user is a registered user
                .then(response => {
                    if (response.msg == "User match") {
                        Profile.checkProfile(id)//check if user profile exists
                            .then(res => {
                                if (res.msg == "User match") {
                                    db.update( // update user details
                                        { _id: id },
                                        {
                                            $set: {
                                                dob: dob,
                                                gender: gender
                                            }
                                        },
                                        ((err, numReplaced) => {
                                            if (err) reject({ error: true, msg: `c=> ${error}` })
                                            else {
                                                resolve({ error: false, msg: "success", userID: id, docUpdated: numReplaced });
                                            }
                                        })
                                    )
                                }
                            })
                            .catch(error => {
                                reject({ error: true, msg: `a=> ${error}` })
                            })
                    }
                })
                .catch(error => {
                    reject({ error: true, msg: `b=> ${error}` })
                })
        })
    }

    static updateUsername(id, username) {
        return new Promise((resolve, reject) => {
            User.checkId(id)//check if user is a registered user
                .then(response => {
                    if (response.msg == "User match") {
                        Profile.checkProfile(id)//check if user profile exists
                            .then(res => {
                                if (res.msg == "no username found") {
                                    db.update( // update user details
                                        { _id: id },
                                        {
                                            $set: {
                                                username: username
                                            }
                                        },
                                        ((err, numReplaced) => {
                                            if (err) reject({ error: true, msg: `c=> ${err}` })
                                            else {
                                                resolve({ error: false, msg: "success", userID: id, docUpdated: numReplaced });
                                            }
                                        })
                                    )
                                }
                                else if (res.msg == "User match") {
                                    db.update( // update user details
                                        { _id: id },
                                        {
                                            $set: {
                                                username: username
                                            }
                                        },
                                        ((err, numReplaced) => {
                                            if (err) reject({ error: true, msg: `c=> ${err}` })
                                            else {
                                                resolve({ error: false, msg: "success", userID: id, docUpdated: numReplaced });
                                            }
                                        })
                                    )
                                }
                            })
                            .catch(error => {
                                reject({ error: true, msg: `a=> ${error}` })
                            })
                    }
                })
                .catch(error => {
                    reject({ error: true, msg: `b=> ${error}` })
                })
        })
    }

    static updatePictureUrl(id, profilePicUrl) {
        return new Promise((resolve, reject) => {
            User.checkId(id)//check if user is a registered user
                .then(response => {
                    if (response.msg == "User match") {
                        Profile.checkProfile(id)//check if user profile exists
                            .then(res => {
                                if (res.msg == "User match") {
                                    db.update( // update user details
                                        { _id: id },
                                        {
                                            $set: {
                                                profilePicUrl: profilePicUrl
                                            }
                                        },
                                        ((err, numReplaced) => {
                                            if (err) reject({ error: true, msg: `c=> ${error}` })
                                            else {
                                                resolve({ error: false, msg: "success", userID: id, docUpdated: numReplaced });
                                            }
                                        })
                                    )
                                }
                            })
                            .catch(error => {
                                reject({ error: true, msg: `a=> ${error}` })
                            })
                    }
                })
                .catch(error => {
                    reject({ error: true, msg: `b=> ${error}` })
                })
        })
    }

    /**
     * getUserProfileById - static method [fetches user profile]
     * 
     * @param {string} id - the user Id or creator Id
     * @returns {object}
    */
    static getUserProfileById(id) {
        return new Promise((resolve, reject) => {
            db.find(
                { _id: id },
                { multi: false },
                (error, document) => {
                    if (error) reject({ error: true, message: error, document: null });
                    resolve({ error: false, message: "data retreived successfully", document: document })
                }
            )
        })
    }

    static fetchProfilePicture(id) {
        return new Promise((resolve, reject) => {
            db.find(
                { _id: id },
                { multi: false },
                (error, document) => {
                    if (error) reject({ error: true, message: error, imgUrl: null });
                    resolve({ error: false, message: "image found", imgUrl: document[0].profilePicUrl })
                }
            )
        })
    }

    static setProfileObject(userId, key, value) {
        return new Promise((resolve, reject) => {
            db.update(
                { _id: userId },
                {
                    $set: {
                        [key]: value
                    }
                },
                { multi: false },
                (error, numChanged) => {
                    if (error) {
                    }
                    else {
                        if (numChanged == 1) {
                            resolve({ error: false, message: "property set successfully" });
                        }
                        else {
                            resolve({ error: true, message: "Failed to set property" });
                        }
                    }
                }
            )
        });
    }

    static deleteProfile(userId, deactivate="false") {
        return new Promise((resolve, reject) => {
            db.find(
                { _id: userId },
                { multi: false },
                (err, doc) => {
                    if (err) reject({ error: true, errorObject: error, message: "Failed to delete" })
                    if (doc.length == 1) {
                        if (deactivate == "false") {
                            const ppUrl = String(doc[0].profilePicUrl).slice(String(doc[0].profilePicUrl).indexOf("/image/profile/") + 1)
                        }

                        db.remove(
                            { _id: userId },
                            { multi: false },
                            (error, numRemoved) => {
                                if (error) reject({ error: true, errorObject: error, message: "Failed to delete" })
                                else {
                                    if (numRemoved == 1) {
                                        resolve({ error: false, message: "delete Success", ppUrl: ppUrl })
                                    }
                                    else {
                                        resolve({ error: true, message: "No usermatch found" });
                                    }
                                }
                            }
                        )
                    }
                }
            )
        })
    }

    static fetchUserProfile(userId) {
        return new Promise((resolve, reject) => {
            db.find(
                { _id: userId },
                { multi: false },
                (error, document) => {
                    if (error) reject({ error: true, errorObject: error, message: "Error retreiving Object" });
                    else {
                        if (document.length != 0) {
                            resolve({ error: false, document: document, message: "retreived successfully" });
                        }
                        else {
                            reject({error: true, message: "user not found"});
                        }
                    }
                }
            )
        })
    }

}


module.exports = Profile;