if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", main())
}

else {
    main();
}

function main() {
    getVideoRecommendations()
        .then(response => {
            for (let video of response.document) {
                const tview = new Tview(video);
                getId("usertviewlist").append(tview.renderObjectTemlate());
            }
        })
        .catch(error => {
            console.log(error);
        })

    const videoPlayer = document.getElementById("video_player");
    const videoPlayerOverlay = document.getElementById("video_player_overlay");

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
        } else if (videoPlayer.mozRequestFullScreen) { // Firefox
            videoPlayer.mozRequestFullScreen();
        } else if (videoPlayer.webkitRequestFullscreen) { // Chrome, Safari, and Opera
            videoPlayer.webkitRequestFullscreen();
        } else if (videoPlayer.msRequestFullscreen) { // IE/Edge
            videoPlayer.msRequestFullscreen();
        }
    });

    //settings
    settings.addEventListener("click", () => {
        document.getElementById("settings_overlay").classList.toggle("hidden");

        const qualityRadios = document.querySelectorAll('.quality-radio input');
        qualityRadios.forEach((radio) => {
            radio.addEventListener('change', () => {
                const value = radio.value;
                console.log(value);
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
    previous.addEventListener("click", ()=> {
        const previousVideoUrl = JSON.parse(localStorage.getItem('previous-video'));

        if (previousVideoUrl) {
            console.log(previousVideoUrl);

            videoPlayer.src = previousVideoUrl;
        }
    });

    //replay
    replay.addEventListener("click", ()=> {
        const currentVideoUrl = videoPlayer.getAttribute('src');
        videoPlayer.src = currentVideoUrl;
    })
}

async function getVideoRecommendations() {
    const req = await fetch(`/user/get/recommendations/${getId("license").textContent.trim()}/${getId("tags").textContent.trim().replaceAll("#", "hashtag_")}/${getId("category").textContent.trim()}`);
    const res = await req.json()
    return (res)
}

