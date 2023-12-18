const express = require('express');
const router = express.Router();
const videoController = require("../controllers/videoController");
const path = require("path");
const multer = require('multer');
const Uploads = require('../models/Uploads');
const upload = multer({ dest: path.join(__dirname, "../DB/video_thumbnails") });


router.post("/upload/video/:userId", upload.fields([{ name: "main_video" }, { name: "main_thumbnail" }]), videoController.uploadVideo);
router.get("/get/creator/uploads/:creatorId", videoController.getCreatorVideos);
router.get("/get/foryou/videos/:userId", videoController.fetchForYouByUserId);
router.get("/user/get/recommendations/:license/:tags/:category", videoController.getRecommendedVideos);

router.get("/tview/stream/video/:videoId/:viewerId", (req, res) => {
    videoController.getVideoObject(req.params.videoId)
        .then(response => {
            if (response.error == false) {
                res.render("tview", { document: response.document });
                Uploads.updateVideoViews(req.params.videoId, req.params.viewerId)
                    .then(r => {
                        // console.log(r);
                    })
                    .catch(e => {
                        // console.log(e);
                    })
            }
        })
        .catch(error => {
            res.render("error", { message: error });
        })
})

router.post("/tview/update-video/likes", (req, res) => {
    const {videoId, userId} = req.body;

    Uploads.updateVideoLikes(videoId, userId)
    .then(r => {
        if (r.message == "User already liked") {
            res.status(202).json({message: "User already liked"});
        }
        else if (r.message == "updated") {
            res.status(200).json({message: "updated"});
        }
        else {
            res.status(403).json({message: "Forbidden"});
        }
    })
    .catch(e => {
        res.status(500).json({message: "Internal Server Error", error: e}); 
    });
});

router.post("tview/update-video/comments", (req, res) => {
    const {videoId, commentObject} = req.body;

    Uploads.updateVideoComments(videoId, commentObject)
    .then(r => {
        if (r.message == "updated") {
            res.status(200).json({message: "updated"});
        }
    })
    .catch(e => {
        res.status(500).json({message: "Internal Server Error", error: e});
    });
});


module.exports = router;