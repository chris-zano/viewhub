const loadDB = require("../utils/loadDB").loadDB;
const path = require("path");
const filepath = path.join(__dirname, "../DB/neDB/suspended.db");
const db = loadDB(filepath);

class SuspendUserAccount {
    constructor(userObject) {
        this._userObject = userObject;
    }

    initialiseSuspendObject() {
        return new Promise((resolve, reject) => {
            db.find(
                { _id: this._userObject._id },
                { multi: false },
                (error, doc) => {
                    if (error) reject({ error: true, message: "Error retreiving object" })
                    else {
                        if (doc.length == 0) {
                            db.insert(this._userObject, (error, document) => {
                                if (error) reject({ error: true, document: error, message: "Error Inserting Document" });
                                else {
                                    resolve({ error: false, document: document, message: "Init Success" })
                                }
                            })
                        }
                        else reject({ error: true, message: "object already exists" })
                    }
                }
            )
        })
    }

    static retrieveSuspendedDocument(documentId) {
        return new Promise((resolve, reject) => {
            db.find(
                { _id: documentId },
                { multi: false },
                (error, document) => {
                    if (error) reject({ error: true, document: error, message: "Error Retrieving Document" })
                    else {
                        if (document.length == 1) {
                            resolve({ error: false, document: document[0], message: "retrieve Success" })
                        }
                        else {
                            resolve({ error: false, document: document[0], message: "retrieve failed" })
                        }
                    }
                }
            )
        })
    }

    static retrieveSuspendedDocumentByKey(key, value) {
        return new Promise((resolve, reject) => {
            db.find(
                {},
                {multi: true},
                (error, doc) => {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        if (doc.length > 0) {
                            if (key == "username") {
                                for (let u of doc) {
                                    if (u.ProfileDB.username == value) {
                                        resolve({error: false, message: "deactivated account"});
                                    }   
                                    else {
                                        resolve({error:true, message: "no such account"});
                                    }
                                }
                            }
                            else if (key == "email") {
                                for (let u of doc) {
                                    if (u.UsersDB.email == value) {
                                        resolve({error: false, message: "match found", document: u});
                                    }
                                    else {
                                        resolve({error:true, message: "no such account"})
                                    }
                                }
                            }
                        }
                    }
                }
            )
        })
    }

    static removeSuspendedDocument(documentId) {
        return new Promise((resolve, reject) => {
            db.remove(
                { _id: documentId },
                { multi: false },
                (error, n) => {
                    if (error) reject({ error: true, document: error, message: "Error Deleting Document" })
                    else {
                        resolve({ error: false, document: n, message: "delete Success" })
                    }
                }
            )
        })
    }
}

module.exports = SuspendUserAccount;