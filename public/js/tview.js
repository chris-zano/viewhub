if (document.readyState == "loading") document.addEventListener("DOMContentLoaded", main());
else main();

function main() {
    const videoPlayer = document.getElementById("video_player");
    const videoPlayerOverlay = document.getElementById("video_player_overlay");

    videoPlayer.addEventListener("timeupdate", ()=> {
        const {currentTime, duration} = videoPlayer;

        document.getElementById("animated-currentTime").style.width = `${(currentTime / duration) * 100}%`;
        document.getElementById("currentTime-placeholder").innerText = `${convertTime(currentTime)}`;
        document.getElementById("duration-placeholder").innerText = `${convertTime(duration-currentTime)}`;
    })

    getVideoRecommendations()
        .then(response => {
            let videoArray = [...response.document];

            videoArray = videoArray.sort((a, b) => { 
                if (a.title > b.title) return 1; 
                else if (a.title == b.title) {
                    if (a.dateTime > b.dateTime) return 1; 
                    else if (a.dateTime == b.dateTime) return 0; 
                    else return -1;
                }
                else return -1
            })

            for (let video of videoArray) {

                const tview = new Tview(video);
                const url = new URL(window.location.href).pathname;
                const userId = JSON.parse(localStorage.getItem("userDetails"))._id;

                if (`/tview/stream/video/${video._id}/${userId}` == url) {
                    delete (tview);
                    if (videoArray.length == 1) {
                        getId("refparams_wrapper").style.scale = 0;
                    }
                }
                else {
                    getId("usertviewlist").append(tview.renderObjectTemlate());
                }
            }
            const url = new URL(window.location.href);
            const videoId = url.pathname.slice(url.pathname.indexOf("video/") + 6, url.pathname.indexOf("/", url.pathname.indexOf("video/") + 6));
            fetchCommentsAndrender(videoId);
        })
        .catch(error => {
            console.log(error);
        })

    const textArea = document.getElementById("comment-message-input");
    textArea.addEventListener("click", (e) => {
        if (textArea.getAttribute("data-parentId") != "null") {
            textArea.style.borderTop = "1px solid transparent";
            textArea.style.borderBottom = "1px solid var(--dark-grey)";
            textArea.style.borderLeft = "1px solid var(--background-body)";
            textArea.style.borderRight = "1px solid var(--background-body)";
            textArea.setAttribute("data-parentId", "null");
            if (textArea.hasAttribute("data-parentUsername")) {
                textArea.removeAttribute("data-parentUsername");
            }
        }
    });

    const userId = JSON.parse(localStorage.getItem("userDetails"))._id;
    const creatorId = document.getElementById("input-creatorId").getAttribute("data-creatorId");

    if (userId.trim() == creatorId.trim()) {
        document.getElementById("subscribe-btn").style.display = "none";
    }

    //get buttons
    const previous = document.getElementById("previous");
    const playPause = document.getElementById("play-pause");
    const next = document.getElementById("next");
    const download = document.getElementById("download");
    const volume = document.getElementById("volume");
    const settings = document.getElementById("settings");
    const fullScreen = document.getElementById("full-screen");
    const miniPlayer = document.getElementById("mini-player");
    const replay = document.getElementById("replay");

    videoPlayerOverlay.addEventListener("click", (e) => {
        if (e.target.parentElement == document.getElementById("player_div")
            || e.target.parentElement == document.getElementById("video_player_overlay")) {
            if (videoPlayer.paused) {
                playPause.querySelector("#play").classList.add("hidden");
                playPause.querySelector("#pause").classList.remove("hidden");
                videoPlayer.play();
            }
            else {
                playPause.querySelector("#play").classList.remove("hidden");
                playPause.querySelector("#pause").classList.add("hidden");
                videoPlayer.pause();
            }
        }
    })

    videoPlayer.addEventListener("mouseenter", (e) => {
        videoPlayerOverlay.classList.remove("hidden")
    });

    videoPlayer.addEventListener("mouseleave", (e) => {
        setTimeout(() => {
            videoPlayerOverlay.classList.add("hidden")
        }, 5000)
    });

    //playpause
    playPause.addEventListener("click", () => {
        if (videoPlayer.paused) {
            playPause.querySelector("#play").classList.add("hidden");
            playPause.querySelector("#pause").classList.remove("hidden");
            videoPlayer.play();
        }
        else {
            playPause.querySelector("#play").classList.remove("hidden");
            playPause.querySelector("#pause").classList.add("hidden");
            videoPlayer.pause();
        }
    });

    //volume
    volume.addEventListener("click", () => {
        if (videoPlayer.muted) {
            volume.querySelector("#unmuted").classList.remove("hidden");
            volume.querySelector("#muted").classList.add("hidden");

            videoPlayer.muted = false;
        }
        else {
            volume.querySelector("#unmuted").classList.add("hidden");
            volume.querySelector("#muted").classList.remove("hidden");

            videoPlayer.muted = true;
        }
    });

    //full-screen
    fullScreen.addEventListener("click", () => {
        if (videoPlayer.requestFullscreen) {
            videoPlayer.requestFullscreen();
        } else if (videoPlayer.mozRequestFullScreen) {
            videoPlayer.mozRequestFullScreen();
        } else if (videoPlayer.webkitRequestFullscreen) {
            videoPlayer.webkitRequestFullscreen();
        } else if (videoPlayer.msRequestFullscreen) {
            videoPlayer.msRequestFullscreen();
        }
        videoPlayer.setAttribute("controls", "true")
    });

    //double-click full-screen
    videoPlayerOverlay.addEventListener("dblclick", (e) => {
        if (e.target.parentElement == document.getElementById("player_div")
            || e.target.parentElement == document.getElementById("video_player_overlay")) {
            if (videoPlayer.requestFullscreen) {
                videoPlayer.requestFullscreen();
            } else if (videoPlayer.mozRequestFullScreen) {
                videoPlayer.mozRequestFullScreen();
            } else if (videoPlayer.webkitRequestFullscreen) {
                videoPlayer.webkitRequestFullscreen();
            } else if (videoPlayer.msRequestFullscreen) {
                videoPlayer.msRequestFullscreen();
            }
        }
        videoPlayer.setAttribute("controls", "true")
    })

    //settings
    settings.addEventListener("click", () => {
        document.getElementById("settings_overlay").classList.toggle("hidden");

        const qualityRadios = document.querySelectorAll('.quality-radio input');
        qualityRadios.forEach((radio) => {
            radio.addEventListener('change', () => {
                const value = radio.value;
            });

        })
    });

    //download
    download.addEventListener("click", () => {
        const videoUrl = document.getElementById("video_player").getAttribute("src");
        const videoTitle = document.getElementById("video_h2").innerText;
        const a = document.createElement("a");
        a.href = videoUrl;
        a.download = `${videoTitle.trim()}.mp4`;
        a.click();
    });

    //next
    next.addEventListener("click", () => {
        const currentVideoUrl = videoPlayer.getAttribute('src');
        const videoArray = document.getElementsByClassName('object_route');
        const nextVideo = videoArray[0].getAttribute('href');

        localStorage.setItem('previous-video', JSON.stringify(currentVideoUrl));

        window.location.href = nextVideo;
    });

    //previous
    previous.addEventListener("click", () => {
        const previousVideoUrl = JSON.parse(localStorage.getItem('previous-video'));

        if (previousVideoUrl) {
            videoPlayer.src = previousVideoUrl;
        }
    });

    //replay
    replay.addEventListener("click", () => {
        const currentVideoUrl = videoPlayer.getAttribute('src');
        videoPlayer.src = currentVideoUrl;
    })

    const likeBtn = document.getElementById("like-btn");
    let likesCount = likeBtn.parentElement.getElementsByTagName("p")[0].textContent;
    likesCount = formatLikesCount(likesCount.slice(0, likesCount.indexOf("likes")).trim());
    likeBtn.parentElement.getElementsByTagName("p")[0].textContent = `${likesCount} likes`

    likeBtn.addEventListener("click", async () => {
        const userId = JSON.parse(localStorage.getItem("userDetails"))._id;
        const url = new URL(window.location.href)
        const videoId = url.pathname.slice(url.pathname.indexOf("video/") + 6, url.pathname.indexOf("/", url.pathname.indexOf("video/") + 6));
        const body = {
            videoId: videoId,
            userId: userId
        }

        const req = await fetch("/tview/update-video/likes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })

        const status = req.status;
        const res = await req.json();
        let likesCount = res.likes;

        if (Number(likesCount) > 1000) {
            likesCount = formatLikesCount(likesCount);
        }

        console.log(likesCount);
        likeBtn.parentElement.getElementsByTagName("p")[0].textContent = `${likesCount} likes`;
    });

    const subsBtn = document.getElementById("subscribe-btn");
    const subState = JSON.parse(localStorage.getItem("subscribedList"));

    if (subState) {
        if (subState[creatorId] == "unsubscribed") {
            subsBtn.textContent = "Subscribe";
        }
        else {
            subsBtn.textContent = "Unsubscribe";
        }
    }



    let subsCount = document.getElementById("subscribers-count")
    subsCount = String(formatLikesCount(Number(subsCount.innerText.slice(0, subsCount.innerText.indexOf("subscriber")))));
    document.getElementById("subscribers-count").textContent = `${subsCount}`;


    subsBtn.addEventListener("click", async () => {
        const userId = JSON.parse(localStorage.getItem("userDetails"))._id;
        const creatorId = document.getElementById("input-creatorId").getAttribute("data-creatorId");

        const body = {
            creatorId: creatorId,
            followerId: userId
        }
        if (userId != creatorId) {
            const req = await fetch("/update/creator/followers", {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(body)
            });
            const status = req.status;
            const res = await req.json();

            const subState = JSON.parse(localStorage.getItem("subscribedList"));
            const subStateNew = {}

            if (res.message == "unsubscribed") {
                subsBtn.textContent = "Subscribe";
                if (subState) {
                    subState[creatorId] = "unsubscribed"
                    localStorage.setItem("subscribedList", JSON.stringify(subState));
                }
                else {
                    subStateNew[creatorId] = "unsubscribed";
                    localStorage.setItem("subscribedList", JSON.stringify(subStateNew));

                }
            }
            else {
                subsBtn.textContent = "Unsubscribe";
                if (subState) {
                    subState[creatorId] = "subscribed"
                    localStorage.setItem("subscribedList", JSON.stringify(subState));
                }
                else {
                    subStateNew[creatorId] = "subscribed";
                    localStorage.setItem("subscribedList", JSON.stringify(subStateNew));

                }
            }
            document.getElementById("subscribers-count").textContent = `${res.subs} ${res.subs == 1 ? "subscriber": "subcribers"}`;
        }
    })


    processCommentsInput();
}

function formatLikesCount(number) {
    if (number >= 1e6) {
        return (number / 1e6).toFixed(1) + 'M';
    } else if (number >= 1e3) {
        return (number / 1e3).toFixed(1) + 'K';
    } else {
        return number.toString();
    }
}

async function getVideoRecommendations() {
    const req = await fetch(`/user/get/recommendations/${getId("license").textContent.trim()}/${getId("tags").textContent.trim().replaceAll("#", "hashtag_")}/${getId("category").textContent.trim()}`);
    const res = await req.json()
    return (res)
}

function processCommentsInput() {
    const postBtn = document.getElementById("postBtn");

    postBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const textContent = document.getElementById("comment-message-input").value.trim();
        const url = new URL(window.location.href)
        const videoId = url.pathname.slice(url.pathname.indexOf("video/") + 6, url.pathname.indexOf("/", url.pathname.indexOf("video/") + 6));
        const commentRegex = /^[a-zA-Z0-9.,!?' -+=*/><()]+$/;
        const creatorId = url.search.slice(url.search.indexOf("=") + 1);
        console.log(videoId);
//  && commentRegex.test(textContent)
        if (textContent) {

            getUserProfile(creatorId)
                .then(r => {
                    if (r.document[0]) {
                        const textArea = document.getElementById("comment-message-input");
                        const comment_id = String(JSON.parse(localStorage.getItem("userDetails"))._id).concat(String(new Date().getTime()));
                        const parentId = textArea.getAttribute("data-parentId") == "null" ? null : textArea.getAttribute("data-parentId");
                        const likes = 0;
                        const replies = 0;
                        const parentUsername = textArea.hasAttribute("data-parentUsername") ? textArea.getAttribute("data-parentUsername") : r.document[0].username;
                        const userProfilePicUrl = JSON.parse(localStorage.getItem("userDetails")).profilePicUrl
                        const username = JSON.parse(localStorage.getItem("userDetails")).username;
                        const postTime = new Date().getTime();

                        const commentObject = {
                            id: comment_id,
                            parentId: parentId,
                            textContent: textContent,
                            likes: likes,
                            replies: replies,
                            parentUsername: parentUsername,
                            userProfilePicUrl: userProfilePicUrl,
                            username: username,
                            postTime: postTime
                        }
                        console.log(commentObject);

                        postCommentObject(videoId, commentObject)
                            .then(r => {
                                if (r.message == "updated") {
                                    document.getElementById("comment-message-input").value = ""
                                    window.alert("comment posted");
                                    
                                }
                            })
                            .catch(e => {
                                console.error(e)
                            })
                    }
                })
                .catch(e => {
                    console.log(e);
                })
        } else {
            // Invalid input
            console.log("Invalid comment. Please enter a valid comment.");
        }
    })
}

async function postCommentObject(videoId, commentObj) {
    try {
        const body = {
            videoId: videoId,
            commentObj: commentObj
        }
        const url = new URL(window.location.href).origin
        const req = await fetch(`${url}/tview/update-video/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ body })
        });

        const res = await req.json();
        const status = req.status;

        if (status == 200) {
            return res;
        }
    }
    catch (e) {
        console.log(e);
    }
}

function fetchCommentsAndrender(videoId) {
    getAllComments(videoId)
        .then(res => {
            callMain(res.commentsArray);
        })
        .catch(e => {
            console.log(e);
        })

}

async function getAllComments(videoId) {
    try {
        const req = await fetch(`/user-get/comments?videoId=${videoId}`);
        const res = await req.json();
        const status = req.status;

        if (status == 200) {
            return res;
        }
    }
    catch (e) {
        console.log(e);
    }
}


function callMain(commentArray) {
    const ulMain = document.getElementById("ul-main");
    const comArr = [...commentArray];

    for (let i = 0; i < comArr.length; i++) {
        const comment = comArr[i];
        const comElement = createComment(comment);

        if (comment.parentId === null) {
            const ol = document.createElement("ol");
            ol.setAttribute("id", `header-${comment.id}`);
            ol.append(comElement);
            ulMain.append(ol);
        } else {
            const parent = ulMain.querySelector(`[id="${comment.parentId}"]`);

            if (parent) {
                let ol = parent;

                while (ol && (ol.getAttribute("id") !== `header-${comment.parentId}`)) {
                    ol = ol.parentElement;
                }

                if (ol) {
                    comElement.classList.add(`child-comment-1`);
                    ol.append(comElement);
                }
            } else {
                //TODO: If the parent is not found, consider delaying the rendering
                // Alternatively, you can choose to render it immediately or handle it differently
            }
        }
    }


    const replyBtn = document.getElementsByClassName("reply-btn");
    for (let btn of replyBtn) {
        btn.addEventListener("click", (e) => {
            const replyparent = e.target.parentElement.parentElement.parentElement
            const parentId = replyparent.getAttribute("id");
            const textArea = document.getElementById("comment-message-input");
            textArea.focus()
            textArea.style.border = "2px solid black";
            textArea.setAttribute("data-parentId", parentId);
            textArea.setAttribute("data-parentUsername", replyparent.getAttribute("data-username"));

        })
    }

}


function createComment(commentObject) {
    const comment = document.createElement("li")
    if (commentObject) {
        comment.classList.add("ol-list-item");
        comment.setAttribute("id", commentObject.id);
        comment.setAttribute("data-parentId", commentObject.parentId);
        comment.setAttribute("data-username", commentObject.username);

        comment.innerHTML = `
            <div class="username_and_pic" id="username_and_pic">
                <div class="left-header">
                    <img src="${commentObject.userProfilePicUrl}" alt="profile" width="30px" height="30px">
                    <p>@${commentObject.username} replying to ${commentObject.parentUsername}</p>
                </div>
                <div class="right-header">
                    <p class="time-elapsed" ></p>
                </div>
            </div>
            <div class="comment-textContent" id="comment-textContent">
                <p>${commentObject.textContent}</p>
            </div>
            <div class="comment-action-buttons" id="comment-action-buttons">
                <div class="like">
                    <img src="/graphics/like-svgrepo-com" alt="like" id="like" width="20px"
                        height="20px">
                </div>
                <div class="replies">
                    <img src="/graphics/comment-svgrepo-com" alt="reply" class="reply-btn" width="20px"
                        height="20px">
                </div>
            </div>
        `;

    }

    const timeSection = comment.getElementsByClassName("time-elapsed")[0];
    const pastTime = getPastTime(commentObject.postTime);
    timeSection.textContent = pastTime.includes("1 days") ? pastTime.replace("days", "day") : pastTime;
    return comment;
}