const loadDB = require("../utils/loadDB").loadDB;
const path = require("path");

const Profile = require("./Profiles")
const filepath = path.join(__dirname, "../DB/neDB/profiles-extended.db");
const db = loadDB(filepath);


class UpdateUserProfileInformation {

    static init(creatorId) {
        return new Promise((resolve, reject) => {
            const subscribers = new Array();
            const following = new Array();
            const subscriberObject = {
                _id: creatorId,
                subscribers: subscribers,
                following: following
            }

            db.insert(
                subscriberObject,
                (err, doc) => {
                    if (err) reject({ error: true, message: "Failed to initialise object", errorObject: err });
                    else {
                        console.log(doc);
                        resolve({ error: false, message: "Object initialised", document: doc });
                    }
                }
            )
        });
    }

    static updateSubscriberList(creatorId, subscriberId) {
        return new Promise((resolve, reject) => {
            db.find(
                { _id: creatorId },
                { multi: false },
                (err, doc) => {
                    if (err) reject({ error: err, message: "failed to read from document" });
                    else {
                        if (doc.length == 1) {
                            const subscriberList = [...doc[0].subscribers];
                            const indexOfSubs = subscriberList.findIndex(subsId => subsId == subscriberId)
                            if (indexOfSubs == -1) {
                                subscriberList.push(subscriberId);
                                db.update(
                                    { _id: creatorId },
                                    {
                                        $set: {
                                            subscribers: subscriberList
                                        }
                                    },
                                    { multi: false },
                                    (err, numUpdated) => {
                                        if (err) reject({ error: err, message: "Failed to write to file" });
                                        else {

                                            Profile.setProfileObject(creatorId, "followers", subscriberList.length)
                                                .then(r => {
                                                    if (r.message == "property set successfully") {
                                                        resolve({ error: false, message: "updated", subs: subscriberList.length })
                                                    }
                                                })
                                                .catch(e => {
                                                    reject({ error: "user not found" })
                                                })

                                        };
                                    }
                                )
                            }
                            else {
                                subscriberList.splice(indexOfSubs, 1);
                                db.update(
                                    { _id: creatorId },
                                    {
                                        $set: {
                                            subscribers: subscriberList
                                        }
                                    },
                                    { multi: false },
                                    (err, numUpdated) => {
                                        if (err) reject({ error: err, message: "Failed to write to file" });
                                        else {

                                            Profile.setProfileObject(creatorId, "followers", subscriberList.length)
                                                .then(r => {
                                                    if (r.message == "property set successfully") {
                                                        UpdateUserProfileInformation.updateSubscriptionList(subscriberId, creatorId)
                                                            .then(rs => {
                                                                resolve({ error: false, message: "unsubscribed", subs: subscriberList.length });
                                                            })
                                                            .catch(error => {
                                                                reject({ error: "user not found" })
                                                            })
                                                    }
                                                })
                                                .catch(e => {
                                                    reject({ error: "user not found" })
                                                })

                                        };
                                    }
                                )

                            }
                        }
                        else resolve({ error: false, message: "User not found" });
                    }
                }
            )
        })
    }

    static updateSubscriptionList(subscriberId, creatorId) {
        return new Promise((resolve, reject) => {
            db.find(
                { _id: subscriberId },
                { multi: false },
                (error, document) => {
                    if (error) reject({ error: error, message: "Failed to read from file" });
                    else {
                        if (document.length == 1) {
                            const subscriptionList = document[0].following;
                            const indexOfSubs = subscriptionList.findIndex(cId => cId == creatorId)
                            if (indexOfSubs == -1) {
                                subscriptionList.push(creatorId);
                                db.update(
                                    { _id: subscriberId },
                                    {
                                        $set: {
                                            following: subscriptionList
                                        }
                                    },
                                    { multi: false },
                                    (error, numUpdated) => {
                                        if (error) reject({ error: error, message: "Failed to update document" });
                                        else {

                                            Profile.setProfileObject(subscriberId, "following", subscriptionList.length)
                                                .then(r => {
                                                    if (r.message == "property set successfully") {
                                                        resolve({ error: false, message: numUpdated, wonEscape: true })
                                                    }
                                                })
                                                .catch(e => {
                                                    reject({ error: "user not found" })
                                                })

                                        };
                                    }
                                )
                            }
                            else {
                                subscriptionList.splice(indexOfSubs);
                                db.update(
                                    { _id: subscriberId },
                                    {
                                        $set: {
                                            following: subscriptionList
                                        }
                                    },
                                    { multi: false },
                                    (error, numUpdated) => {
                                        if (error) reject({ error: error, message: "Failed to update document" });
                                        else {

                                            Profile.setProfileObject(subscriberId, "following", subscriptionList.length)
                                                .then(r => {
                                                    if (r.message == "property set successfully") {
                                                        resolve({ error: false, message: "creator already exists" })
                                                    }
                                                })
                                                .catch(e => {
                                                    reject({ error: "user not found" })
                                                })

                                        };
                                    }
                                )

                            }
                        }
                        else resolve({ error: false, message: "User not found" });
                    }
                }
            )
        })
    }

    static getSubscriptionList(userId) {
        return new Promise((resolve, reject) => {
            db.find(
                { _id: userId },
                { mulit: false },
                (err, document) => {
                    if (err) reject({ error: err, message: "Error reading document!" })
                    else {
                        if (document.length == 0) resolve({ error: false, message: "No such user", document: document })

                        else {
                            const followingList = [...document[0].following]
                            resolve({ error: false, message: "success", document: followingList });
                        }
                    }
                }
            )
        });
    }

}

module.exports = UpdateUserProfileInformation;