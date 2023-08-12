const loadDB = require("../utils/loadDB").loadDB;
const path = require("path");
const AuthFactor = require("../utils/auth");
const User = require("./Users");
const filepath = path.join(__dirname, "../DB/neDB/profiles.db");
const db = loadDB(filepath);

class Profile {
    constructor(id) {
        this._id = id;
    }

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

    static checkUsernameExists(username, password) {
        return new Promise((resolve, reject) => {
            console.log({username: username, password:AuthFactor.hashWithKey(password, "low")});
            db.find(
                {username: username},
                {multi: false},
                (err, doc) => {
                    if (err) {
                        reject({error: true, msg: err});
                    }
                    else {
                        if(doc.length == 0) {
                            reject({error: true, msg: "Wrong Username"});
                        }
                        else {
                            User.authWithPassword(doc[0]._id, password)
                            .then(response => {
                                if (response.msg == "Username and Password match") {
                                    resolve({error: false, msg: "Username and Password match", userId: doc[0]["_id"]})
                                }
                            })
                            .catch(error => {
                                reject({error: false, msg: error, userID: null})
                            })
                        }
                    }
                }
            )
        })
    }

    static updateUserFirstAndLastNames(id, lastname, firstname) {
        return new Promise((resolve, reject) => {
            User.checkId(id)//check if user is a registered user
            .then(response => {
                if (response.msg == "User match"){
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
                        reject({error: true, msg: `a=> ${error}`})
                    })
                }
            })
            .catch(error => {
                reject({error: true, msg: `b=> ${error}`})
            })
        })
    }
    
    static updatedobAndGender(id, dob, gender) {
        return new Promise((resolve, reject) => {
            User.checkId(id)//check if user is a registered user
            .then(response => {
                if (response.msg == "User match"){
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
                        reject({error: true, msg: `a=> ${error}`})
                    })
                }
            })
            .catch(error => {
                reject({error: true, msg: `b=> ${error}`})
            })
        })
    }
    
    static updateUsername(id, username) {
        return new Promise((resolve, reject) => {
            User.checkId(id)//check if user is a registered user
            .then(response => {
                if (response.msg == "User match"){
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
                        reject({error: true, msg: `a=> ${error}`})
                    })
                }
            })
            .catch(error => {
                reject({error: true, msg: `b=> ${error}`})
            })
        })
    }

    static updatePictureUrl(id, profilePicUrl) {
        return new Promise((resolve, reject) => {
            User.checkId(id)//check if user is a registered user
            .then(response => {
                if (response.msg == "User match"){
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
                        reject({error: true, msg: `a=> ${error}`})
                    })
                }
            })
            .catch(error => {
                reject({error: true, msg: `b=> ${error}`})
            })
        })
    }
    
}

module.exports = Profile;

const me = new Profile("25zUV0SI2M3IGkKW");
me.init()
    .then(res => {
        switch (res.error) {
            case true:
                console.log("ERROR=> ",res.msg);
                break;
            case false:
                console.log(res);
                break;
            default:
                console.log("serious error here lol :)");
                break;
        }
    })
    .catch(error => {
        console.log(error);
    })

Profile.updateUserFirstAndLastNames("25zUV0SI2M3IGkKW","Doe", "John")
.then(res => {
    console.log(res);
})
.catch(err => {
    console.log(err);
})
Profile.updatedobAndGender("25zUV0SI2M3IGkKW","23/01/2005", "male")
.then(res => {
    console.log(res);
})
.catch(err => {
    console.log(err);
})
Profile.updateUsername("25zUV0SI2M3IGkKW","DoeJohn")
.then(res => {
    console.log(res);
})
.catch(err => {
    console.log(err);
})