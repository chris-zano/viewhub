const Uploads = require("../models/Uploads");

function update() {
    //TODO: what would you like to update
    Uploads.updateVideoLikes("0wsVwNhdnlxsqsII", "IwKiolX21WDeH7qI")
    .then(r => {
        console.log(r);
    })
    .catch(e => {
        console.log(e);
    })
}

update();