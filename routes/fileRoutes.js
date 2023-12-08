const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();

// javascript files will be serves through this route
router.get("/js/:filename", (req, res) => {
    fs.createReadStream(path.join(__dirname, `../public/js/${req.params.filename}.js`)).pipe(res);
})

// css files will be served through this route
router.get("/css/:filename", (req, res) => {
    fs.createReadStream(path.join(__dirname, "../public/css", `${req.params.filename}.css`)).pipe(res);
})

// fonts will be served through this route
router.get("/font/:fontname", (req, res) => {
    fs.createReadStream(path.join(__dirname, "../public/assets/fonts", req.params.fontname)).pipe(res);
})

//images will be served though this route
router.get("/images/:filename", (req, res) => {
    fs.createReadStream(path.join(__dirname, "../public/assets/images", `${req.params.filename}`)).pipe(res);
})

//tview overlay images snd graphics will be served though this route
router.get("/graphics/:filename", (req, res) => {
    fs.createReadStream(path.join(__dirname, "../public/assets/images/tview-svgs", `${req.params.filename}.png`)).pipe(res);
})

// profile images
router.get("/image/profile/:filename", (req, res) => {
    fs.createReadStream(path.join(__dirname, "../DB/profile_images", `${req.params.filename}`)).pipe(res);
})

//video thumbnails
router.get("/video/thumbnail/:filename", (req, res) => {
    fs.createReadStream(path.join(__dirname, "../DB/video_thumbnails", `${req.params.filename}`)).pipe(res);
})

//video files will be served through this route
router.get("/video/stream/:filename", (req, res) => {
    fs.createReadStream(path.join(__dirname, "../DB/video_thumbnails", `${req.params.filename}`)).pipe(res);
})

module.exports = router;