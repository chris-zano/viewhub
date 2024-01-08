const loadDB = require("../utils/loadDB").loadDB;
const path = require("path");
const filepath = path.join(__dirname, "../DB/neDB/logs.db");
const db = loadDB(filepath);


class Log {
    static createLogOfUserId(userId, state) {
        return new Promise((resolve, reject) => {
            const obj = { _id: userId, state: state }

            db.insert(obj, (err, doc) => {
                if (err) rejects({ error: err });
                resolve({ error: false, message: "log success" })
            })
        })
    }
}

module.exports = Log;