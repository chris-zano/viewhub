const loadDB = require("../utils/loadDB").loadDB;
const path = require("path");
const AuthFactor = require("../utils/auth");
const filepath = path.join(__dirname, "../DB/neDB/users.db");
const db = loadDB(filepath);

class User {
    constructor(email, password) {
        this._email = email;
        this._password = AuthFactor.hashWithKey(password, "low");
    }

    createUser() {
        const userObject = {
            email: this._email,
            password: this._password
        }

        return new Promise((resolve, reject) => {
            User.checkEmail(this._email)
                .then(res => {
                    if (res.msg == "User match") {
                        reject({ err: true, msg: "User already exists" });
                    }
                    else if (res.msg == "No user with such email") {
                        db.insert(
                            userObject,
                            (err, doc) => {
                                if (err) {
                                    reject({ error: true, msg: err });
                                }
                                else {
                                    resolve({ error: false, msg: "No error! User created successfuly", userId: doc["_id"] })
                                }
                            }
                        )
                    }
                })
                .catch(err => {
                    reject({ error: true, msg: err });
                })
        })
    }

    static checkId(id) {
        return new Promise((resolve, reject) => {
            db.find(
                { _id: id },
                { multi: false },
                (err, doc) => {
                    if (err) {
                        reject(err);
                    }
                    if (doc.length == 0) {
                        resolve({ msg: "No user with such id", id: id });
                    }
                    else {
                        resolve({ msg: "User match", id: doc[0]._id, userID: doc[0]["_id"] })
                    }
                }
            )
        })
    }

    static checkEmail(email) {
        return new Promise((resolve, reject) => {
            db.find(
                { email: email },
                { multi: false },
                (err, doc) => {
                    if (err) {
                        reject(err);
                    }
                    if (doc.length == 0) {
                        resolve({ msg: "No user with such email", email: email });
                    }
                    else {
                        resolve({ msg: "User match", email: doc[0].email, userID: doc[0]["_id"] })
                    }
                }
            )
        })
    }

    static authWithPassword(username, password) {
        return new Promise((resolve, reject) => {
            db.find(
                {username: username, password:AuthFactor.hashWithKey(password, "low")},
                {multi: false},
                (err, doc) => {
                    if (err) {
                        reject({error: true, msg: err});
                    }
                    else {
                        if(doc.length == 0) {
                            reject({error: true, msg: "Wrong Email or Password"});
                        }
                        else {
                            resolve({error: false, msg: "Username and Password match", userID: doc[0]["_id"]});
                        }
                    }
                }
            )
        })
    }
}


module.exports = User;


// const me = new User("nii@haasdn.com", "myfckin#!!password")
// me.createUser()
//     .then(res => {
//         console.log(res);
//     })
//     .catch(err => {
//         console.log(err);
//     })

// User.authWithPassword("nii@haasdn.com", "mykin#!!password")
// .then(res => {
//     console.log(res);
// })
// .catch(err => {
//     console.log(err);
// })
// User.getUserEmail("nCtXg1VwWsTlWoh7");
// User.checkEmail("my@mail.com")
// User.checkEmail("niico@Christian.com")