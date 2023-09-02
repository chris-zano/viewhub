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
            console.log(video);
            
            const tview = new Tview(video);
            getId("usertviewlist").append(tview.renderObjectTemlate());
        }
    })
    .catch(error => {
        console.log(error);
    })
}

async function getVideoRecommendations() {
    const req = await fetch(`/user/get/recommendations/${getId("license").textContent.trim()}/${getId("tags").textContent.trim().replaceAll("#","hashtag_")}/${getId("category").textContent.trim()}`);
    const res = await req.json()
    return (res)
}

