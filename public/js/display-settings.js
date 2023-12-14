if (document.readyState == "loading") document.addEventListener("DOMContentLoaded", main());
else main();
function main() {

    const userData = JSON.parse(localStorage.getItem("userDetails"));
    const userId = userData._id;

    const btnQuality = document.getElementById("quality");
    const btnBitrate = document.getElementById("bitrate");
    const btnPlayback = document.getElementById("playback");
    const btnDataSaver = document.getElementById("data-saver");
    const btnSubtitle = document.getElementById("subtitle");
    const btnCCFormat = document.getElementById("cc-format");
    const btnTheme = document.getElementById("theme");

    const buttonsCollection = [btnQuality, btnBitrate, btnBitrate, btnPlayback, btnDataSaver, btnSubtitle, btnCCFormat, btnTheme];

    for (let button of buttonsCollection) {

        const setState = userData[button.getAttribute("id")];

        button.setAttribute("data-status", setState);
        flipBtnTextContent(button);
    }

    btnTheme.addEventListener("click", (e) => {
        const btnDataStatus = e.target.getAttribute("data-Status")
        const btnId = e.target.getAttribute("id");

        updateUserPreference(userId, btnId, btnDataStatus)
            .then(res => {
                flipBtnTextContent(e.target);
                flipBtnDataStatus(e.target);
                fetchuserDetails();
                setTheme();
            })
            .catch(err => {
                console.log(err);
            })
    });

    btnQuality.addEventListener("click", (e) => {
        const btnDataStatus = e.target.getAttribute("data-Status")
        const btnId = e.target.getAttribute("id");

        updateUserPreference(userId, btnId, btnDataStatus)
            .then(res => {
                flipBtnTextContent(e.target);
                flipBtnDataStatus(e.target);
                fetchuserDetails();
            })
            .catch(err => {
                console.log(err);
            })
    })
    btnBitrate.addEventListener("click", (e) => {
        const btnDataStatus = e.target.getAttribute("data-Status")
        const btnId = e.target.getAttribute("id");

        updateUserPreference(userId, btnId, btnDataStatus)
            .then(res => {
                flipBtnTextContent(e.target);
                flipBtnDataStatus(e.target);
                fetchuserDetails();
            })
            .catch(err => {
                console.log(err);
            })
    })
    btnPlayback.addEventListener("click", (e) => {
        const btnDataStatus = e.target.getAttribute("data-Status")
        const btnId = e.target.getAttribute("id");

        updateUserPreference(userId, btnId, btnDataStatus)
            .then(res => {
                flipBtnTextContent(e.target);
                flipBtnDataStatus(e.target);
                fetchuserDetails();
            })
            .catch(err => {
                console.log(err);
            })
    })
    btnDataSaver.addEventListener("click", (e) => {
        const btnDataStatus = e.target.getAttribute("data-Status")
        const btnId = e.target.getAttribute("id");

        updateUserPreference(userId, btnId, btnDataStatus)
            .then(res => {
                flipBtnTextContent(e.target);
                flipBtnDataStatus(e.target);
                fetchuserDetails();
            })
            .catch(err => {
                console.log(err);
            })
    })
    btnSubtitle.addEventListener("click", (e) => {
        const btnDataStatus = e.target.getAttribute("data-Status")
        const btnId = e.target.getAttribute("id");

        updateUserPreference(userId, btnId, btnDataStatus)
            .then(res => {
                flipBtnTextContent(e.target);
                flipBtnDataStatus(e.target);
                fetchuserDetails();
            })
            .catch(err => {
                console.log(err);
            })
    })
    btnCCFormat.addEventListener("click", (e) => {
        const btnDataStatus = e.target.getAttribute("data-Status")
        const btnId = e.target.getAttribute("id");

        updateUserPreference(userId, btnId, btnDataStatus)
            .then(res => {
                flipBtnTextContent(e.target);
                flipBtnDataStatus(e.target);
                fetchuserDetails();
            })
            .catch(err => {
                console.log(err);
            })
    })

}

function flipBtnTextContent(btn) {
    switch (btn.getAttribute("data-status")) {
        case "disabled":
            btn.textContent = "Enable";
            break;
        case "enabled":
            btn.textContent = "Disable"
            break;
        default:
            break;
    }
}

function flipBtnDataStatus(btn) {
    switch (btn.getAttribute("data-status")) {
        case "enabled":
            btn.setAttribute("data-status", "disabled");
            break;
        case "disabled":
            btn.setAttribute("data-status", "enabled");
            break;
        default:
            break;
    }
}

function setdataStatus(btn, status) {
    btn.setAttribute("data-status", status);
}