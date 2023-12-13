if (document.readyState == "loading") document.addEventListener("DOMContentLoaded", main);
else main();

const userId = JSON.parse(localStorage.getItem("userDetails"))._id


function main() {
    const userData = JSON.parse(localStorage.getItem("userDetails"));
    const btnprivate = document.getElementById("private");

    if (userData["account-visibility"] == "private") {
        btnprivate.textContent = "Disable";
    }
    else {
        btnprivate.textContent = "Enable";
    }

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
            activateButtonElements();
        } catch (error) {
            console.log(error);
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
        setOverlay("optionA", "optionB")
    })
}
function private(private) {
    private.addEventListener("click", (e) => {
        const overlay = setOverlay("Private", "Public");
        const yesBtn = overlay.querySelector("#yes-btn")
        const noBtn = overlay.querySelector("#no-btn")

        yesBtn.addEventListener("click", () => {
            overlay.style.display = "none";
            updateUserPreference(userId, "account-visibility", "private")
                .then(res => {
                    e.target.textContent = "Disable";
                    fetchuserDetails();

                })
                .catch(err => {
                    console.error(err);
                })
        })
        noBtn.addEventListener("click", () => {
            overlay.style.display = "none";
            updateUserPreference(userId, "account-visibility", "public")
                .then(res => {
                    e.target.textContent = "Enable";
                    fetchuserDetails();

                })
                .catch(err => {
                    console.error(err);
                })
        })
    });
}
function manage(manage) {
    manage.addEventListener("click", (e) => {
        console.log(e.target);
        setOverlay("optionA", "optionB")
    })
}
function download(download) {
    download.addEventListener("click", (e) => {
        console.log(e.target);
        setOverlay("optionA", "optionB")
    })
}
function watchHistory(watchHistory) {
    watchHistory.addEventListener("click", (e) => {
        console.log(e.target);
        setOverlay("optionA", "optionB")
    })
}
function searchHistory(searchHistory) {
    searchHistory.addEventListener("click", (e) => {
        console.log(e.target);
        setOverlay("optionA", "optionB")
    })
}
function deleteButton(btndeleteButton) {
    btndeleteButton.addEventListener("click", (e) => {
        console.log(e.target);
        setOverlay("optionA", "optionB")
    })
}
function deactivate(deactivate) {
    deactivate.addEventListener("click", (e) => {
        console.log(e.target);
        setOverlay("optionA", "optionB")
    })
}

function setOverlay(optionA, optionB) {
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    overlay.innerHTML = `
        <section id="history" class="history">
            <h2 class="section-title">Confirm</h2>
            <div class="privacy_checklist">
                <ul class="list_container">
                    <li>
                        <div class="action-btn">
                            <button type="button" id="yes-btn">${optionA}</button>
                        </div>
                    </li>
                    <li>
                        <div class="action-btn">
                            <button type="button" id="no-btn">${optionB}</button>
                        </div>
                    </li>
                </ul>
            </div>
        </section>
    `
    document.getElementById("wrapper-main").append(overlay);
    return overlay;
}

async function updateUserPreference(id, key, value) {
    const dataObj = { key: key, value: value }
    const req = await fetch(`/user/update-preferences/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataObj)
    });

    const res = await req.json();
    const status = req.status;

    // console.log(res);
    // console.log(status);
    return res
}