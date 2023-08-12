const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    res.render("index", {pageTitle: "Home", error: false, userId: null, msg: "no error"})
})

module.exports = router