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
                    // alert("Upload a video to get started");
                    // window.location.href = "/nav/upload_video";
                    const UpV = document.createElement("div");
                    const UpVO = document.createElement("div");
                    UpV.innerHTML = `
                        <p>No videos available.</p>
                        <p>Upload a video to start watching.</p>
                        <button type="button" style="
                            min-width: 120px;
                            padding: 3px 1rem;
                            height: 35px;
                            border: 1px solid transparent;
                            background-color: var(--color-theme-2);
                            border-radius: 0.6rem;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            font-family: inherit;
                            cursor: pointer;
                            box-shadow: var(--box-shadow-thin);
                        ">
                            <a href="/nav/upload_video" style="
                                font-size: 14px;
                                color: white;
                            ">Click here to get Started</a>
                        </button>
                    `;

                    UpVO.style.position = "fixed";
                    UpVO.style.left = "0";
                    UpVO.style.right = "0";
                    UpVO.style.bottom = "0";
                    UpVO.style.top = "0";
                    UpVO.style.display = "grid";
                    UpVO.style.justifyContent = "center";
                    UpVO.style.alignItems = "center";
                    UpVO.style.backgroundColor = "#14141492";
                    UpV.style.backgroundColor = "var(--background-white)";
                    UpV.style.borderRadius = "1rem";
                    UpV.style.padding = "1rem";
                    UpV.style.display = "grid";
                    UpV.style.justifyContent = "center";
                    UpV.style.alignItems = "center";
                    UpV.querySelectorAll("p").forEach(p=> p.style.color = "var(--default-dark-font)")
                    UpV.querySelectorAll("button").forEach(p=> p.addEventListener("mouseenter", ()=> p.style.backgroundColor = "var(--color-theme-3)"))
                    UpV.querySelectorAll("button").forEach(p=> p.addEventListener("mouseleave", ()=> p.style.backgroundColor = "var(--color-theme-2)"))

                    UpVO.append(UpV);
                    document.getElementById("usertviewlist").append(UpVO);

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