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
                        console.log(r);
                    })
                    .catch(e => {
                        console.log(e);
                    })
            }
        })
        .catch(error => {
            res.render("error", { message: error });
        })
})


module.exports = router;