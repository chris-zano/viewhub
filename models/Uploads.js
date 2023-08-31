const loadDB = require("../utils/loadDB").loadDB;
const path = require("path");
const AuthFactor = require("../utils/auth");
const User = require("./Users");
const Profile = require("./Profiles");
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
    constructor(creatorId, title, description, category, thumbnailUrl, streamUrl, tags, privacy, locale, license) {
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
                            resolve({ error: false, msg: "init successful", videoId: doc._id });
                        })
                    }
                }).catch(err =>{
                    reject({error: err})
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
}


module.exports = Uploads;