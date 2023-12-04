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

    videoPlayer.addEventListener("mouseenter", (e) => {
        videoPlayerOverlay.classList.remove("hidden")
    });

    videoPlayer.addEventListener("mouseleave", (e) => {
        setTimeout(()=>{
            videoPlayerOverlay.classList.add("hidden")
        }, 5000)
    });
}

async function getVideoRecommendations() {
    const req = await fetch(`/user/get/recommendations/${getId("license").textContent.trim()}/${getId("tags").textContent.trim().replaceAll("#","hashtag_")}/${getId("category").textContent.trim()}`);
    const res = await req.json()
    return (res)
}

