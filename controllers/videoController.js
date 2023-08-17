const Uploads = require("../models/Uploads");
const User = require("../models/Users");
/**
 * extracts the properties from the request object.$8 takes request.body as argument
 * @param {object} stream 
 * @returns 
 */
function extractObj(stream) {
    return ({
        creatorId: stream.creatorId,
        title: stream.title,
        description: stream.description,
        category: stream.category,
        tags: stream.tags,
        privacy: stream.privacy,
        locale: stream.locale,
        license: stream.license,
    })
}

/**
 * uploads a video to the db
 * @param {object} req request object
 * @param {object} res resonse object
 * @return {object} 
 */
exports.uploadVideo = (req, res) => {
    // res.end("Video Uploaded Successfully")
    
    User.checkId(req.body.creatorId)
        .then(response => {
            if ((response.msg == "User match") && (response.id.trim() == req.body.creatorId.trim())) {
                //user is authenticated, so continue
                const streamUrl = `/video/stream/${req.files.main_video[0].filename}`;
                const thumbnailUrl = `/video/thumbnail/${req.files.main_thumbnail[0].filename}`;

                const vidObj = extractObj(req.body);

                const upload = new Uploads(
                    vidObj.creatorId, vidObj.title, vidObj.description, 
                    vidObj.category, thumbnailUrl, streamUrl,
                    vidObj.tags, vidObj.privacy, vidObj.locale,
                    vidObj.license
                )
                
                upload.init()
                .then(init_response => {
                    if (init_response.error == false && init_response.msg == "init successful")
                    {
                        res.render("index", {pageTitle: "Home", error: false, userId: null, msg: "no error"})
                    }
                })
                .catch(error => {
                    res.render("error",{message: error.msg})
                })
            }
        })
        .catch(error => {
            if (error.msg == "No user with such id") {
                res.render("error", { message: error.msg })
            }
        })

}

/**
 * fetches a creator's video array
 * @param {object} req request object
 * @param {object} res response object
 * @return {object}
 */
exports.getCreatorVideos = (req, res) => {
    Uploads.getCreatorUploads(req.params.creatorId)
    .then( response => {
        if (response.error == false) {
            res.status(200).json({error: false, message: "found'em",data: response.data});
        }
    })
    .catch(error => {
        res.status(404).json({error: true, message: error, data: null});
    })
}

/**
 * retrieves a particular video object
 * @param {string} videoId
 */
exports.getVideoObject = (videoId) => {
    return new Promise((resolve, reject) => {
        Uploads.getVideoObject(videoId)
        .then(response => {
            if (response.error == false && response.message == "success") {
                resolve({error: false, document: response.document, message: "success"});
            }
        })
        .catch(error => {
            reject({error: true, document: null, message: error})
        })
    })
}