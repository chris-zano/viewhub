const loadDB = require("../utils/loadDB").loadDB;
const path = require("path");
const filepath = path.join(__dirname, "../DB/neDB/update_video_object.db");
const db = loadDB(filepath);


class UpdateVideoObject {

    static init(videoId) {
        return new Promise((resolve, reject) => {
            const viewers = new Array();
            const likes = new Array();
            const comments = new Array();

            const videoObj = {
                videoId: videoId,
                viewers: viewers,
                likes: likes,
                comments: comments
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

    static deleteVideoObject(videoId) {
        return new Promise((resolve, reject) => {
            db.remove(
                { videoId: videoId },
                { multi: false },
                (error, numRemoved) => {
                    if (error) reject({ error: true, errorObject: error, message: "Failed to delete" })
                    else {
                        if (numRemoved == 1) {
                            resolve({error: false, message: "delete Success"});
                        }
                        else {
                            resolve({error: true, message: "No usermatch found"});
                        }
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
                            if (viewers) {
                                if ((viewers.findIndex(viewer => viewer == viewid)) == -1) {
                                    viewers.push(viewid);
                                    db.update(
                                        { videoId: videoId },
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
                        }
                        else {
                            resolve({ error: false, message: "No video match" });
                        }
                    }
                }
            )
        })
    }

    static updateLikesList(videoId, userId) {
        return new Promise((resolve, reject) => {
            db.find(
                { videoId: videoId },
                { multi: false },
                (err, doc) => {
                    if (err) reject({ error: true, message: "Internal Server Error" });
                    else {
                        if (doc.length == 1) {
                            const vidObj = doc[0];
                            const likes = vidObj.likes
                            if (likes) {
                                const indexOfLike = likes.findIndex(like => like == userId)
                                if (indexOfLike == -1) {
                                    likes.push(userId);
                                    db.update(
                                        { videoId: videoId },
                                        {
                                            $set: {
                                                likes: likes
                                            }
                                        },
                                        (err, docUpdated) => {
                                            resolve({ error: false, message: "No match", doc: doc })
                                        }
                                    )
                                }
                                else {
                                    likes.splice(indexOfLike, 1);
                                    db.update(
                                        { videoId: videoId },
                                        {
                                            $set: {
                                                likes: likes
                                            }
                                        },
                                        (err, docUpdated) => {
                                            resolve({ error: false, message: "Like match", doc: doc });
                                        }
                                    )
                                }
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

    static updateCommentsList(videoId, commentObj) {
        return new Promise((resolve, reject) => {
            db.find(
                { videoId: videoId },
                { multi: false },
                (err, doc) => {
                    if (err) reject({ error: true, message: "Internal Server Error" });
                    else {
                        if (doc.length == 1) {
                            const vidObj = doc[0];
                            const comments = vidObj.comments
                            const indexOfComments = comments.findIndex(comment => comment == commentObj)
                            if (comments) {
                                if ( indexOfComments == -1) {
                                    comments.push(commentObj);
                                    db.update(
                                        { videoId: videoId },
                                        {
                                            $set: {
                                                comments: comments
                                            }
                                        },
                                        (err, docUpdated) => {
                                            resolve({ error: false, message: "No match", doc: doc })
                                        }
                                    )
                                }
                                else {
                                    comments.splice(indexOfComments, 1)
                                    db.update(
                                        { videoId: videoId },
                                        {
                                            $set: {
                                                comments: comments
                                            }
                                        },
                                        (err, docUpdated) => {
                                            resolve({ error: false, message: "Comment match", doc: doc });
                                        }
                                    )

                                }
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

    static getCommentsList(videoId) {
        return new Promise((resolve, reject) => {
            db.find(
                { videoId: videoId },
                { multi: false },
                (err, doc) => {
                    if (err) reject({ error: err, message: "Iternal serverr Error" });
                    else {
                        if (doc.length == 1) {
                            const arr = [...doc[0].comments];
                            if (arr.length > 100) {
                                resolve({ message: "success", comments: arr.slice(0, 100) });
                            }
                            else {
                                resolve({ message: "success", comments: arr });
                            }
                        }
                        else {
                            resolve({ message: "failed" });
                        }
                    }
                }
            )
        })
    }
}

module.exports = UpdateVideoObject;