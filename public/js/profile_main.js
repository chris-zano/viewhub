if (document.readyState == "loading") document.addEventListener("DOMContentLoaded", main);
else main();
const userId = JSON.parse(localStorage.getItem("userDetails"))._id;
const url = new URL(window.location.href);
const urlProfileId = url.pathname.slice(url.pathname.lastIndexOf("/") + 1);

function main() {
    if (JSON.parse(getLocalStorage("userDetails"))._id === urlProfileId) {
        console.log(JSON.parse(getLocalStorage("userDetails"))._id);
        addeventlistener(document.getElementById("editProfile"), "click", (e) => {
            getUserProfile(urlProfileId)
                .then(response => {
                    if (response.error == false) {//the user has been autheticated
                        if (response.userId == e.target.getAttribute("data-userId").trim()) {//check if id matches cached id
                            location.href = `/user/edit/profile/${e.target.getAttribute("data-userId").trim()}`;
                        }
                    }
                })
                .catch(error => {
                    location.href = `/error/${error}`;
                })
        })
    }
    else {
        document.getElementById("editProfile").parentElement.remove(document.getElementById("editProfile"));
    }

    fetch_C_Up(urlProfileId)
        .then(response => {
            for (let video of response.data) {
                //render videolist by thumbnails and descriptions in grid format
                const tview = new Tview(video);
                getId("usertviewlist").append(tview.renderObjectTemlate());
            }

            if (urlProfileId === userId) {
                const creatorVideosCollection = document.getElementsByClassName("link_object");
                for (let video of creatorVideosCollection) {
                    video.addEventListener("click", (e) => {

                        if (e.target.classList.contains("more-settings")) {
                            e.preventDefault();

                            const contextMenu = createContextMenu();

                            document.body.appendChild(contextMenu);

                            addContextMenuListeners(contextMenu);
                        }
                    })
                }
            }
        })
        .catch(error => {
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


async function getVideoDuration(videoId) {
    const req = await fetch(`/admin/get/videoduration/${videoId}`);
    const res = await req.json();
    return (res)
}

async function deleteVideoByCreator(videoId) {
    try {
        const req = await fetch(`/admin/delete/deleteVideoByCreator/${videoId}`);
        const res = await req.json();
        const status = req.status;
        if (status == 200) {
            return res
        }
        else {
            console.error(status, res)
        }
    } catch (error) {
        console.error(error);
    }
}

function createContextMenu() {
    const contextMenu = document.createElement("div");
    contextMenu.className = "custom-context-menu";
    contextMenu.innerText = "Delete";

    // Position the context menu
    contextMenu.style.position = "absolute";
    contextMenu.style.left = e.clientX + "px";
    contextMenu.style.top = e.clientY + "px";
    contextMenu.style.borderRadius = "0.6rem";
    contextMenu.style.cursor = "pointer";

    // Apply styles for normal state
    contextMenu.style.backgroundColor = "var(--background-white)";
    contextMenu.style.boxShadow = "var(--box-shadow-thin)";
    contextMenu.style.color = "var(--default-dark-font)";
    contextMenu.style.padding = "1rem";
    contextMenu.style.transition = "var(--transition-default)";

    return contextMenu;
}

function addContextMenuListeners(contextMenu) {
    contextMenu.addEventListener("mouseover", (e) => {
        contextMenu.style.backgroundColor = "red"
        contextMenu.style.color = "white"
    })
    contextMenu.addEventListener("mouseleave", (e) => {
        contextMenu.style.backgroundColor = "var(--background-white)"
        contextMenu.style.color = "var(--default-dark-font)"
    })

    contextMenu.addEventListener("click", function (menuEvent) {
        // Perform actions based on the clicked item
        const action = menuEvent.target

        deleteVideoByCreator(video.getAttribute("id").trim())
            .then(res => {
                // Remove the context menu
                document.body.removeChild(contextMenu);
                window.location.href = "";
            })
            .catch(err => {
                console.log(err);
            })

    });
}