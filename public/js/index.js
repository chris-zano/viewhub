if (document.readyState == "loading") document.addEventListener("DOMContentLoaded", indexMain());
else indexMain();

/**
 * The main entry point of the program
 * 
 * @returns nothing
 */
function indexMain() {
    // check the index of the user in the database.
    // fetch the videos from the server.

    fetchVideos(JSON.parse(getLocalStorage("loginState")).userId)
    .then(res => {
        console.log(res.res.message);
        if (res.res.message == "Empty Feed") {
            alert("Upload a video to get started");
            window.location.href ="/nav/upload_video";
        }
    })
    .catch(err => {
        console.log(err);
    })
}

async function fetchVideos(userId) {
    try {
        const req = await fetch(`/get/foryou/videos/${userId}`);
        const res = await req.json();
        const status = req.status;

        return ({
            res: res,
            status: status
        });
    }
    catch(error) {
        console.log("I am reporting an error");
        reportError(error)
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }
}