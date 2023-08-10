const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
router.get("/", (req, res) => {
    console.log("It works motherfuckers");
    res.render("index");
})