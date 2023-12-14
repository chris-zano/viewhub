const loadDB = require("../utils/loadDB").loadDB;
const path = require("path");
const AuthFactor = require("../utils/auth");
const User = require("./Users");
const Profile = require("./Profiles");
const filepath = path.join(__dirname, "../DB/neDB/update_video_object.db");
const db = loadDB(filepath);


class UpdateVideoObject {

    static init(videoId) {
        return new Promise((resolve, reject) => {
            const viewers = new Array();
            const videoObj = {
                videoId: videoId,
                viewers: viewers
            }

            db.insert(
                videoObj,
                (error, doc) => {
                    if (error) reject({ error: true, message: error });
                    else {
                        resolve({ error: false, message: doc });
                    }
                }
            )
        })
    }

    static updateViewersList(videoId, viewid) {
        return new Promise((resolve, reject) => {
            db.find(
                { videoId: videoId },
                { multi: false },
                (err, doc) => {
                    if (err) reject({ error: true, message: "Internal Server Error" });
                    else {
                        if (doc.length == 1) {
                            const vidObj = doc[0];
                            const viewers = vidObj.viewers
                            if ((viewers.findIndex(viewer => viewer == viewid)) == -1) {
                                viewers.push(viewid);
                                db.update(
                                    {videoId: videoId},
                                    {
                                        $set: {
                                            viewers: viewers
                                        }
                                    },
                                    (err, docUpdated) => {
                                        resolve({ error: false, message: "No match", doc: doc })
                                    }
                                )
                            }
                            else {
                                resolve({ error: false, message: "Viewer match", doc: doc });
                            }
                        }
                        else {
                            resolve({ error: false, message: "No video match" });
                        }
                    }
                }
            )
        })
    }
}

module.exports = UpdateVideoObject;