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

    try {
        if (!getLocalStorage("loginState")) return
        fetchVideos(JSON.parse(getLocalStorage("loginState")).userId)
            .then(res => {
                if (res.res.message == "Empty Feed") {
                    alert("Upload a video to get started");
                    window.location.href = "/nav/upload_video";
                }
                else {
                    const videoObjectArray = res.res.document;
                    for (let videoObject of videoObjectArray) {
                        const tviewTemplate = new Tview(videoObject);
                        const divElement = tviewTemplate.renderObjectTemlate();
                        document.getElementById("usertviewlist").appendChild(divElement);
                    }
                }
            })
            .catch(err => {
                console.log(err);
            })
    } catch (error) {
        console.log(error);
    }

    try {
        if (!getLocalStorage("loginState")) return
        getSubs(JSON.parse(getLocalStorage("loginState")).userId)
            .then(r => {
                if (!r.subs || r.subs.length == 0) {
                    document.getElementById("subsListUL").append(document.createElement("li").innerText = "No subscriptions");
                    return
                };

                const subs = [...r.subs]
                subs.forEach(sub => {
                    getUserProfile(sub)
                        .then(u => {
                            document.getElementById("subsListUL").append(createSubListItem(u.document[0]));
                        })
                })
            })
            .catch(e => {
                console.error(e);
            })
    }
    catch (error) {

    }
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
    catch (error) {
        reportError(error)
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }
}

async function getSubs(userId) {
    try {
        const req = await fetch(`/user/get-following/${userId}?count=10`);
        const res = await req.json();
        const status = req.status;

        if (status !== 200) return null;

        return res
    }
    catch (err) {
        return null
    }
}

function createSubListItem(sub) {
    try {
        const li = document.createElement("li");
        li.innerHTML = `
        <a href="/user/profile/${sub._id}">
            <div class="subs-profileImage">
                <img src="${sub.profilePicUrl}" alt="logo" width="20px" height="20px">
            </div>
            <div class="subs-name">
                <p>${sub.firstname} ${sub.lastname}</p>
            </div>
        </a>
    `;

        return li;
    }
    catch(err) {
        return null;
    }
}