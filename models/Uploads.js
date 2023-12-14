const loadDB = require("../utils/loadDB").loadDB;
const path = require("path");
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

        return new Promise((resolve, reject) => {
            //authenticate the upload from the calling function
            Profile.getUserProfilePicture(this._creatorId)
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
                            resolve({ error: false, document: document })
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
                                        console.log(viewListLength);
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
                                                    updateVideoViews(videoId, viewerId)
                                                        .then(res => {
                                                            resolve({error: false})
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
}


module.exports = Uploads;