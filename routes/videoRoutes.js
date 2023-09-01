const express = require('express');
const router = express.Router();
const videoController = require("../controllers/videoController");
const path = require("path");
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, "../DB/video_thumbnails") });

router.post("/upload/video/:userId", upload.fields([{name: "main_video"}, {name: "main_thumbnail"}]), videoController.uploadVideo);

router.get("/get/creator/uploads/:creatorId", videoController.getCreatorVideos);

router.get("/tview/stream/video/:videoId", (req, res) => {
    videoController.getVideoObject(req.params.videoId)
    .then(response => {
        if (response.error == false) {
            res.render("tview", {document: response.document})
        }
    })
    .catch(error => {
        res.render("error", {message: error});
    })
})

module.exports = router;