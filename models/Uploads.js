const loadDB = require("../utils/loadDB").loadDB;
const path = require("path");
const fs = require("fs");
const AuthFactor = require("../utils/auth");
const User = require("./Users");
const Profile = require("./Profiles");
const UpdateVideoObject = require("./UpdateVideoObjects");
const filepath = path.join(__dirname, "../DB/neDB/video_uploads.db");
const db = loadDB(filepath);


class Uploads {

    /**
     * *_Uploads_ -::- blueprints for video uploads, defines video object structure, properties and methods
     * @param {string} creatorId 
     * @param {string} title 
     * @param {string} description 
     * @param {string} category 
     * @param {string} thumbnailUrl 
     * @param {string} streamUrl 
     * @param {string} tags 
     * @param {string} privacy 
     * @param {string} locale 
     * @param {string} license 
    */
    constructor(creatorId, title, description, category, thumbnailUrl, streamUrl, tags, privacy, locale, license, duration) {
        this._creatorId = creatorId;
        this._title = title;
        this._description = description;
        this._category = category;
        this._thumbnailUrl = thumbnailUrl;
        this._streamUrl = streamUrl;
        this._tags = tags;
        this._privacy = privacy;
        this._locale = locale;
        this._license = license;
        this._duration = duration;
    }

    /**
     * initialise the video object and store it in the videos db
     * @returns {object}
     */
    init() {
        return new Promise((resolve, reject) => {

            //authenticate the upload from the calling function
            try {
                const dateTime = new Date();

                const videoObject =
                {
                    creatorId: this._creatorId,
                    title: this._title,
                    description: this._description,
                    category: this._category,
                    thumbnailUrl: this._thumbnailUrl,
                    streamUrl: this._streamUrl,
                    tags: this._tags,
                    privacy: this._privacy,
                    locale: this._locale,
                    license: this._license,
                    duration: this._duration,
                    dateTime: dateTime.getTime(),
                    views: 0,
                    likes: 0,
                    comments: 0
                }
                // Profile.getUserProfilePicture(this._creatorId)
                Profile.fetchProfilePicture(videoObject.creatorId)
                    .then(res => {
                        if (res.error == false && res.imgUrl != null) {
                            videoObject.creatorProfilePic = res.imgUrl
                            db.insert(videoObject, (err, doc) => {
                                if (err) {
                                    reject({ error: true, msg: err });
                                }
                                else {
                                    UpdateVideoObject.init(doc._id)
                                        .then(res => {
                                            resolve({ error: false, msg: "init successful", videoId: doc._id });
                                        })
                                        .catch(err => {
                                            reject({ error: err });
                                        })
                                }
                            })
                        }
                    }).catch(err => {
                        reject({ error: err })
                    })
            } catch (error) {
                console.log(error);
            }
        })
    }

    initShorts() {
        return new Promise((resolve, reject) => {

            //authenticate the upload from the calling function
            try {
                const dateTime = new Date();

                const videoObject =
                {
                    creatorId: this._creatorId,
                    title: this._title,
                    description: this._description,
                    category: this._category,
                    thumbnailUrl: this._thumbnailUrl,
                    streamUrl: this._streamUrl,
                    tags: this._tags,
                    privacy: this._privacy,
                    locale: this._locale,
                    license: this._license,
                    duration: this._duration,
                    dateTime: dateTime.getTime(),
                    views: 0,
                    likes: 0,
                    comments: 0,
                    type: "shorts"
                }
                // Profile.getUserProfilePicture(this._creatorId)
                Profile.fetchProfilePicture(videoObject.creatorId)
                    .then(res => {
                        if (res.error == false && res.imgUrl != null) {
                            videoObject.creatorProfilePic = res.imgUrl
                            db.insert(videoObject, (err, doc) => {
                                if (err) {
                                    reject({ error: true, msg: err });
                                }
                                else {
                                    UpdateVideoObject.init(doc._id)
                                        .then(res => {
                                            resolve({ error: false, msg: "init successful", videoId: doc._id });
                                        })
                                        .catch(err => {
                                            reject({ error: err });
                                        })
                                }
                            })
                        }
                    }).catch(err => {
                        reject({ error: err })
                    })
            } catch (error) {
                console.log(error);
            }
        })
    }

    static initReactivatedUserVideos(videoObject) {
        return new Promise((resolve, reject) => {
            const initObject = videoObject;
            initObject.suspendedAccount = 'false';

            db.insert(initObject, (error, doc) => {
                if (error) {
                    reject({error: true, message: "failed"});
                }
                else {
                    resolve({error: false, message: "success"});
                }
            })
        })
    }

    /**
     * getCreatorUploads - fetch creator uploads from db
     * 
     * * the creatorId is authenticated by this method and not the calling function
     * @param {string} creatorId 
     * @returns {object} new promise that resolves the data retreived from the database
     */
    static getCreatorUploads(creatorId) {
        return new Promise((resolve, reject) => {
            User.checkId(creatorId)//check id for match [authenticates request]
                .then(response => {
                    if (response.msg == "User match" && response.id == creatorId) {
                        db.find(
                            { creatorId: creatorId },
                            { multi: true },
                            (err, document) => {
                                if (err) reject({ error: true, msg: err, data: null });
                                resolve({ error: false, msg: "data retreive success", data: document })//return creator data as array
                            }
                        )
                    }
                })
                .catch(error => {
                    reject({ error: true, msg: error, data: null })
                })
        })
    }

    /**
     * returns an specified video object by Id
     * @param {string} videoId 
     * @returns {object}
     */
    static getVideoObject(videoId) {
        return new Promise((resolve, reject) => {
            db.find(
                { _id: videoId },
                { multi: false },
                (error, document) => {
                    if (error) reject({ error: true, message: error, document: null });
                    resolve({ error: false, message: "success", document: document[0] });
                }
            )
        })
    }

    static getRecommendations(license, tags, category) {
        return new Promise((resolve, reject) => {
            db.find(
                {
                    license: license,
                    tags: tags.replaceAll("hashtag_", "#"),
                    category: category
                },
                { multi: true },
                (error, document) => {
                    if (error) reject({ error: true, message: error })

                    if (document.length == 0) {
                        db.find({}, (error, doc) => {
                            if (error) reject({ error: true, message: error })
                            if (doc.length == 0) {
                                reject({ error: true, message: "no videos found" })
                            }
                            else if (doc.length <= 100) {
                                resolve({ error: false, document: doc })
                            }
                            else if (doc.length > 100) {
                                resolve({ error: false, document: doc.slice(0, 99) })
                            }
                        })
                    }
                    else if (document.length <= 100) {
                        resolve({ error: false, document: document })
                    }
                    else {
                        resolve({ error: false, document: document.slice(0, 99) })
                    }
                }
            )
        })
    }

    static fetchUserFeedByLimit() {
        return new Promise((resolve, reject) => {
            var limit = new Array();
            db.find(
                {},
                { multi: true },
                (err, document) => {
                    if (err) {
                        reject({ error: true, error_Object: err });
                    }
                    else {
                        if (document.length < 1) {
                            resolve({ error: true, error_Message: "Empty feed" });
                        }
                        else {
                            for (let video of document) {
                                if (video.suspendedAccount !== "true") {
                                    limit.push(video);
                                }
                            }
                            resolve({ error: false, document: limit })
                        }
                    }
                }
            )
        })
    }

    //danger zone. Admin only

    static updateVideo(id, query, value) {
        return new Promise((resolve, reject) => {
            db.find(
                { _id: id },
                { multi: false },
                (err, document) => {
                    if (err) reject({ error: err });
                    else {
                        if (document) {
                            db.update(
                                { _id: id },
                                {
                                    $set: {
                                        [query]: value
                                    }
                                },
                                { multi: false },
                                (error, nC) => {
                                    if (error) reject({ error: err });
                                    else {
                                        resolve({ doc: nC });
                                    }
                                }
                            )
                        }
                        else {
                            resolve({ doc: null })
                        }
                    }
                }
            )
        })
    }

    static updateVideoViews(videoId, viewerId) {
        return new Promise((resolve, reject) => {
            db.find(
                { _id: videoId },
                { multi: false },
                (err, doc) => {
                    if (err) reject({ error: true, message: "Internal server Error" });
                    else {
                        if (doc.length == 1) {
                            UpdateVideoObject.updateViewersList(videoId, viewerId)
                                .then(res => {
                                    if (res.message == "Viewer match") {
                                        resolve({ message: "User already watched" });
                                    }
                                    else if (res.message == "No match") {
                                        const viewListLength = res.doc[0]["viewers"].length;
                                        db.update(
                                            { _id: videoId },
                                            {
                                                $set: {
                                                    views: viewListLength
                                                }
                                            },
                                            (err, docUpdated) => {
                                                resolve({ error: false, message: "updated" })
                                            }
                                        )
                                    }
                                    else {
                                        UpdateVideoObject.init(videoId)
                                            .then(res => {
                                                if (res.error == false) {
                                                    Uploads.updateVideoViews(videoId, viewerId)
                                                        .then(res => {
                                                            resolve({ error: false })
                                                        })
                                                        .catch(err => {
                                                            reject({ error: true, error_Object: err });
                                                        })
                                                }
                                            })
                                            .catch(err => {
                                                reject({ error: true, error_Object: err });
                                            })
                                    }
                                })
                        }
                    }
                }
            )
        })
    }

    static updateVideoLikes(videoId, userId) {
        return new Promise((resolve, reject) => {
            db.find(
                { _id: videoId },
                { multi: false },
                (err, doc) => {
                    if (err) reject({ error: true, message: "Internal server Error", error_Object: err });
                    else {
                        if (doc.length == 1) {
                            UpdateVideoObject.updateLikesList(videoId, userId)
                                .then(res => {
                                    if (res.message == "Like match") {
                                        const likesListLength = res.doc[0]["likes"].length;
                                        db.update(
                                            { _id: videoId },
                                            {
                                                $set: {
                                                    likes: likesListLength
                                                }
                                            },
                                            (err, docUpdated) => {
                                                resolve({ message: "User already liked", likes: likesListLength });
                                            }
                                        )
                                    }
                                    else if (res.message == "No match") {
                                        const likesListLength = res.doc[0]["likes"].length;
                                        db.update(
                                            { _id: videoId },
                                            {
                                                $set: {
                                                    likes: likesListLength
                                                }
                                            },
                                            (err, docUpdated) => {
                                                resolve({ error: false, message: "updated", likes: likesListLength })
                                            }
                                        )
                                    }
                                    else {
                                        UpdateVideoObject.init(videoId)
                                            .then(res => {
                                                if (res.error == false) {
                                                    Uploads.updateVideoLikes(videoId, userId)
                                                        .then(res => {
                                                            resolve({ error: false })
                                                        })
                                                        .catch(err => {
                                                            reject({ error: true, error_Object: err });
                                                        })
                                                }
                                            })
                                            .catch(err => {
                                                reject({ error: true, error_Object: err });
                                            })
                                    }
                                })
                        }
                    }
                }
            )
        })
    }

    static updateVideoComments(videoId, commentObj) {
        return new Promise((resolve, reject) => {
            db.find(
                { _id: videoId },
                { multi: false },
                (err, doc) => {
                    if (err) reject({ error: true, message: "Internal server Error", error_Object: err });
                    else {
                        if (doc.length == 1) {
                            UpdateVideoObject.updateCommentsList(videoId, commentObj)
                                .then(res => {
                                    if (res.message == "Comment match") {
                                        resolve({ message: "User already commented" });
                                    }
                                    else if (res.message == "No match") {
                                        const commentListLength = res.doc[0]["comments"].length;
                                        db.update(
                                            { _id: videoId },
                                            {
                                                $set: {
                                                    comments: commentListLength
                                                }
                                            },
                                            (err, docUpdated) => {
                                                resolve({ error: false, message: "updated" })
                                            }
                                        )
                                    }
                                    else {
                                        UpdateVideoObject.init(videoId)
                                            .then(res => {
                                                var counter = 0
                                                if (res.error == false) {
                                                    while (counter <= 2) {
                                                        Uploads.updateVideoComments(videoId, commentObj)
                                                            .then(res => {
                                                                resolve({ error: false })
                                                            })
                                                            .catch(err => {
                                                                reject({ error: true, error_Object: err });
                                                            })
                                                        counter += 1;
                                                    }
                                                }
                                            })
                                            .catch(err => {
                                                reject({ error: true, error_Object: err });
                                            })
                                    }
                                })
                        }
                    }
                }
            )
        })
    }

    static deleteVideo(videoId) {
        return new Promise((resolve, reject) => {
            db.find(
                { _id: videoId },
                { multi: false },
                (err, doc) => {
                    if (err) reject({ error: err, message: "Internal Server Error" });
                    else {
                        if (doc.length == 1) {
                            const vidFilePath = doc[0].streamUrl.slice(doc[0].streamUrl.indexOf("/video/stream/") + 1)
                            db.remove(
                                { _id: videoId },
                                { multi: false },
                                (err, n) => {
                                    if (err) reject({ error: err, message: "Failed to Delete", vidFilePath: null });
                                    else {
                                        if (n == 1) {
                                            resolve({ error: false, message: n, vidFilePath: vidFilePath })
                                        }
                                        else {
                                            reject({ error: true, message: "Something went wrong", vidFilePath: null })
                                        }
                                    }
                                }
                            )
                        }
                    }
                }
            )
        })
    }

    static setVideoProperty(userId, key, value) {
        return new Promise((resolve, reject) => {
            db.update(
                { creatorId: userId },
                {
                    $set: {
                        [key]: value
                    }
                },
                { multi: true },
                (error, numChanged) => {
                    if (error) {
                    }
                    else {
                        if (numChanged !== 0) {
                            resolve({ error: false, message: "property set successfully" });
                        }
                        else {
                            resolve({ error: false, message: "Failed to set property" });
                        }
                    }
                }
            )
        });
    }

    static deleteCreatorVideos(creatorId) {
        return new Promise((resolve, reject) => {
            db.find(
                { creatorId: creatorId },
                { multi: true },
                (err, doc) => {
                    if (err) {
                        reject({ error: true, errorObjecct: err, message: "Failed to find" })
                    }
                    else {
                        if (doc.length == 0) {
                            resolve({ error: false, message: "No matches" })
                        }
                        else {
                            doc.forEach(video => {
                                this.deleteVideo(video._id)
                                    .then(() => {
                                        UpdateVideoObject.deleteVideoObject(video._id)
                                            .then(() => { return })
                                            .catch(error => {
                                                console.log(error);
                                            })
                                    })
                                    .catch(error => {
                                        console.log(error);
                                        reject({ error: true, message: "Something went wrong", vidFilePath: null })
                                    })
                            })
                            resolve({ error: false, message: "delete Success" });
                        }
                    }
                }
            )
        })
    }

    static retrieveCreatorVideos(creatorId) {
        return new Promise((resolve, reject) => {
            db.find(
                {
                    creatorId: creatorId,
                    suspendedAccount: 'true'
                },
                { multi: true },
                (error, document) => {
                    if (error) reject({ error: true, errorObject: error, message: "Failed to remove videos" });
                    else {
                        resolve({ error: false, message: 'success', document: document });
                    }
                }
            )
        })
    }
}


module.exports = Uploads;