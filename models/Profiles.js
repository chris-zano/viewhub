const loadDB = require("../utils/loadDB").loadDB;
const path = require("path");
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
                                        (err, doc) => {
                                            if (err) {
                                                reject({ error: true, msg: err });
                                            }
                                            else {
                                                resolve({ error: false, msg: "No error! Profile initialized successfuly", userId: doc["_id"] })
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
                        resolve({ msg: "User match", id: doc[0].id, userID: doc[0]["_id"] })
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
                            reject({ error: true, msg: "Wrong Username" });
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
                                if (res.msg == "User match") {
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
                                if (res.msg == "User match") {
                                    db.update( // update user details
                                        { _id: id },
                                        {
                                            $set: {
                                                username: username
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
                {_id: id},
                {multi: false},
                (error, document) => {
                    if(error) reject({error: true, message: error, document: null});
                    resolve({error:false, message: "data retreived successfully", document: document})
                }
            )
        })
    }

    static getUserProfilePicture(id) {
        return new Promise((resolve, reject) => {
            db.find(
                {_id: id},
                {multi: false},
                (error, document) => {
                    if (error) reject({error: true, message: error, imgUrl: null});
                    resolve({error: false, message:"image found", imgUrl: document[0].profilePicUrl})
                }
            )
        })
    }

}


module.exports = Profile;