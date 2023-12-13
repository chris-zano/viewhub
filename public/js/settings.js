if (document.readyState == "loading") document.addEventListener("DOMContentLoaded", main);
else main();

function main() {
    const userData = JSON.parse(localStorage.getItem("userDetails"));
    if (userData) {

        const name = `${userData.firstname} ${userData.lastname}`,
            dob = new Date(userData.dob).toDateString(),
            username = `${userData.username}`,
            userId = userData._id;

        getEmail(userId)
            .then(res => {
                document.getElementById("email").innerText = res.email;
            })
            .catch(error => {
                // main();
            })

        try {
            document.getElementById("name").innerText = name;
            document.getElementById("username").innerText = username;
            document.getElementById("dob").innerText = dob;

            const editButton = document.getElementById("edit_profile_button")
            editButton.setAttribute("href", `/user/profile/${userId}`)

            //add functionality to button elements
            // activateButtonElements();
        } catch (error) {
            console.log(error);
        }
        const allButtons = document.querySelectorAll("button")

        for (let button of allButtons) {
            button.addEventListener("click", () => {
                setOverlay()
            })
        }
    }
    else {
        console.log("Lol");
    }
}

async function getEmail(id) {
    try {
        const req = await fetch(`/user/get/email/${id}`);
        const res = await req.json();
        const status = await req.status;

        if (status == 200) {
            return res;
        }
        else {
            console.log(res, status);
            // getEmail(id);
        }
    }
    catch (error) {
        // getEmail(id);
    }
}

function activateButtonElements() {

    const btntwof_a = document.getElementById("twofa"),
        btnprivate = document.getElementById("private"),
        btnmanage = document.getElementById("manage"),
        btndownload = document.getElementById("download"),
        btnwatchHistory = document.getElementById("watchHistory"),
        btnsearchHistory = document.getElementById("searchHistory"),
        btndeleteButton = document.getElementById("delete-btn"),
        btndeactivate = document.getElementById("deactivate");


    twof_a(btntwof_a); private(btnprivate); manage(btnmanage); download(btndownload); watchHistory(btnwatchHistory); searchHistory(btnsearchHistory); deleteButton(btndeleteButton); deactivate(btndeactivate);

}

function twof_a(twof_a) {
    twof_a.addEventListener("click", (e) => {
        console.log(e.target);
        setOverlay()
    })
}
function private(private) {
    private.addEventListener("click", (e) => {
        console.log(e.target);
        setOverlay()
    })
}
function manage(manage) {
    manage.addEventListener("click", (e) => {
        console.log(e.target);
        setOverlay()
    })
}
function download(download) {
    download.addEventListener("click", (e) => {
        console.log(e.target);
        setOverlay()
    })
}
function watchHistory(watchHistory) {
    watchHistory.addEventListener("click", (e) => {
        console.log(e.target);
        setOverlay()
    })
}
function searchHistory(searchHistory) {
    searchHistory.addEventListener("click", (e) => {
        console.log(e.target);
        setOverlay()
    })
}
function deleteButton(btndeleteButton) {
    btndeleteButton.addEventListener("click", (e) => {
        console.log(e.target);
        setOverlay()
    })
}
function deactivate(deactivate) {
    deactivate.addEventListener("click", (e) => {
        console.log(e.target);
        setOverlay()
    })
}

function setOverlay() {
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    overlay.innerHTML = `
        <section id="history" class="history">
            <h2 class="section-title">Confirm</h2>
            <div class="privacy_checklist">
                <ul class="list_container">
                    <li>
                        <div class="action-btn">
                            <button type="button" id="yes-btn">Yes</button>
                        </div>
                    </li>
                    <li>
                        <div class="action-btn">
                            <button type="button" id="no-btn">No</button>
                        </div>
                    </li>
                </ul>
            </div>
        </section>
    `
    document.getElementById("wrapper-main").append(overlay);
    const yesBtn = overlay.querySelector("#yes-btn")
    const noBtn = overlay.querySelector("#no-btn")

    yesBtn.addEventListener("click", () => {
        overlay.style.display = "none"
    })
    noBtn.addEventListener("click", () => {
        overlay.style.display = "none"
    })
}