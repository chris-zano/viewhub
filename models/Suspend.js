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
                        resolve({ error: false, document: document, message: "retrieve Success" })
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