if(document.readyState == "loading")
    document.addEventListener("DOMContentLoaded", main);
else
    main();

function main() {
    addeventlistener(document.getElementById("editProfile"), "click", (e) => {
        getUserProfile(e.target.getAttribute("data-userId").trim())
        .then(response => {
            if (response.error == false) {//the user has been autheticated
                if(response.userId == e.target.getAttribute("data-userId").trim()) {//check if id matches cached id
                    location.href = `/user/edit/profile/${e.target.getAttribute("data-userId").trim()}`;
                }
            }
        })
        .catch(error => {
            location.href = `/error/${error}`;
        })
    })

    fetch_C_Up(document.getElementById("userId").textContent)
    .then(response => {
        for (let video of response.data) {
            //render videolist by thumbnails and descriptions in grid format
            const tview = new Tview(video);
            getId("usertviewlist").append(tview.renderObjectTemlate());
        }
    })
    .catch (error => {
        location.href = `/error/${error}`;
    })


}

/**
 * fetches creator uploads
 * @param {string} id 
 * @returns {object}
 */
async function fetch_C_Up(id) {
    const req = await fetch(`/get/creator/uploads/${id}`);
    const res = await req.json();
    return res;
}

