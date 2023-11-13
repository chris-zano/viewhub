const loadDB = require("../utils/loadDB").loadDB;
const path = require("path");
const filepath = path.join(__dirname, "../DB/neDB/errors.db");
const db = loadDB(filepath);

class ReportError {
    status = 0;
    constructor(errorObject) {
        this._errorObject = errorObject;
    }

    createReport() {
        return new Promise((resolve, reject) => {
            db.insert(this._errorObject, (error, document) => {
                if (error) reject({error: true, message: "error creating report"});
                else {
                    console.log(this._errorObject);
                    resolve({error: false, message: "report created successfully"});
                }
            })
        })
    }

    static loadAllReports() {
        return new Promise((resolve, reject) => {
            db.find({},{multi: true}, (error, documents) => {
                if (error) reject({error: true, reports: null});
                else {
                    resolve({error: false, reports: documents});
                }
            })
        })
    }
}

module.exports = ReportError;