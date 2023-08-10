const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    console.log("This is working");
    res.render("index")
})

router.get('/login', (req, res) => {
    // console.log(req);
    console.log("================== ",req.headers['user-agent']);
    console.log("================== ",req.headers['user-agent']);
    res.status(200  ).json({message: "Login request received successfully"});
})

module.exports = router