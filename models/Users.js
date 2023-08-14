const loadDB = require("../utils/loadDB").loadDB;
const path = require("path");
const AuthFactor = require("../utils/auth");
const strictTypeCheck = require("../utils/Type");
const filepath = path.join(__dirname, "../DB/neDB/users.db");
const db = loadDB(filepath);

/**
 * User - class for creating User objects
 * 
 * This class is for initialising and storing user credentials [email, password]
 * in a separate database.
 * 
 * *For all methods, on success the ID property of the user object is resolved.
 * 
 * *On failure, error is set to true and a message [msg] is set.
 * 
 * @param {email}  email the email property
 * @param {password} password the password Property
 */
class User {
    /**
     * constructor(format[example@email.com]), password:(will be hashed[encrypted] on instantiation))
     * @param {email} email The email property
     * @param {password} password The password property
     */
    constructor(email, password) {
        this._email = email;
        this._password = AuthFactor.hashWithKey(password, "low");
    }

    /**
     * createUser(void) - This creates a user in the database. It first checks if the email aready exists
     * in the databse, if it does, it rejects with error and msg properties set appropriately.
     * If the check returns false, the user is saved in the database.
     * @NOTE::: The calling function must set the profile instance in the database after resolving this promise.
     * @returns new Promise - on success,
     *  it resolve to error property beign set to false, userId and msg properties set appropriately
     */
    createUser() {
        const userObject = {
            email: this._email,
            password: this._password
        }

        return new Promise((resolve, reject) => {
            User.checkEmail(this._email)
                    .then(res => {
                        if (res.msg == "No user with such email") {
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

    /**
     * *checkId(id:- mandatory!! [ id property of the object ])
     * 
     * @description this method checks the User Credentials databsae for an id match
     * 
     * @useCase this method is useful when running crud operations for a user object, with properties set in another database
     * 
     * @param {id} id The id of the user object
     * 
     * @returns Promise: The resolved object has _MSG_ and _ID_ properties set appropriately
     * 
     * @more if the function returns true, it means the id matches that of a user in the databse
     */
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
                        reject({ msg: "No user with such id", id: id });
                    }
                    else {
                        resolve({ msg: "User match", id: doc[0]._id, })
                    }
                }
            )
        })
    }

    /**
     * checkEmail(email) - checks if the email has already been registered / verified / stored in the database
     * @param {email} email The enail property of the user object
     * @returns Promise -::- This resolves an object with appropriate _ERROR STATES_ and _MESSAGES_ set correctly
     */
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
                        resolve({ msg: "No user with such email", email: email, userId: null });
                    }
                    else if (doc.length == 1) {
                        reject({error:true, msg: "User match", email: doc[0].email, userId: doc[0]["_id"] })
                    }
                }
            )
        })
    }

    /**
     * authWithPassword - authenticates a user whose username has been verified by the calling function
     * @param {id} id The id property passed from the calling function
     * @param {password} password The password property passed from the calling function
     * @returns Promise -::- Resolves an object with appropriate _ERROR STATES_ and _MESSAGES_ set correctly
     */
    static authWithPassword(id, password) {
        return new Promise((resolve, reject) => {
            db.find(
                {_id: id, password:AuthFactor.hashWithKey(password, "low")},
                {multi: false},
                (err, doc) => {
                    if (err) {
                        reject({error: true, msg: err});
                    }
                    else {
                        if(doc.length == 0) {
                            reject({error: true, msg: "Wrong Password"});
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