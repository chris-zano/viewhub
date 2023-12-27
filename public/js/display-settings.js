const btnQuality = document.getElementById("quality");
const btnBitrate = document.getElementById("bitrate");
const btnPlayback = document.getElementById("playback");
const btnDataSaver = document.getElementById("data-saver");
const btnSubtitle = document.getElementById("subtitle");
const btnCCFormat = document.getElementById("cc-format");
const btnTheme = document.getElementById("theme");

if (document.readyState == "loading") document.addEventListener("DOMContentLoaded", main());
else main();


function main() {
    const userData = JSON.parse(localStorage.getItem("userDetails"));
    const userId = userData._id;

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

    const buttonsCollection = document.getElementById("display_section");

    buttonsCollection.addEventListener("click", (e) => {
        if (e.target.tagName == "BUTTON" && e.target.getAttribute("id") != "theme") {
            const button = e.target;
            const btnDataStatus = button.getAttribute("data-Status")
            const btnId = button.getAttribute("id");

            updateUserPreference(userId, btnId, btnDataStatus)
                .then(res => {
                    flipBtnTextContent(e.target);
                    flipBtnDataStatus(e.target);
                    fetchuserDetails();
                })
                .catch(err => {
                    console.log(err);
                })
        }
        else {
            console.log(e.target.tagName);
            console.log("no");
        }
    })

    setDefaultStatesForButtonElements(userData)

}

function flipBtnTextContent(btn) {
    switch (btn.getAttribute("data-Status")) {
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
    switch (btn.getAttribute("data-Status")) {
        case "enabled":
            btn.setAttribute("data-Status", "disabled");
            break;
        case "disabled":
            btn.setAttribute("data-Status", "enabled");
            break;
        default:
            break;
    }
}

function setdataStatus(btn, status) {
    btn.setAttribute("data-Status", status);
}

function setDefaultStatesForButtonElements(userData) {
    if (userData[btnQuality.getAttribute("id")] == "enabled") {
        btnQuality.textContent = "Disable";
    }
    else {
        btnQuality.textContent = "Enable";
    }

    if (userData[btnBitrate.getAttribute("id")] == "enabled") {
        btnBitrate.textContent = "Disable";
    }
    else {
        btnBitrate.textContent = "Enable";
    }

    if (userData[btnPlayback.getAttribute("id")] == "enabled") {
        btnPlayback.textContent = "Disable";
    }
    else {
        btnPlayback.textContent = "Enable";
    }

    if (userData[btnDataSaver.getAttribute("id")] == "enabled") {
        btnDataSaver.textContent = "Disable";
    }
    else {
        btnDataSaver.textContent = "Enable";
    }

    if (userData[btnSubtitle.getAttribute("id")] == "enabled") {
        btnSubtitle.textContent = "Disable";
    }
    else {
        btnSubtitle.textContent = "Enable";
    }

    if (userData[btnCCFormat.getAttribute("id")] == "enabled") {
        btnCCFormat.textContent = "Disable";
    }
    else {
        btnCCFormat.textContent = "Enable";
    }

    if (userData[btnTheme.getAttribute("id")] == "enabled") {
        btnTheme.textContent = "Disable";
    }
    else {
        btnTheme.textContent = "Enable";
    }

}