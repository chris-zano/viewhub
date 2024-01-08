if (document.readyState == "loading") document.addEventListener("DOMContentLoaded", main);
else main();
var userId
if (!localStorage.getItem("userDetails")) {
    userId = null
}
else {
    userId = JSON.parse(localStorage.getItem("userDetails"))._id
}


function main() {
    const userData = JSON.parse(localStorage.getItem("userDetails"));
    setDefaultProfilesForButton(userData);

    if (userData) {

        const name = `${userData.firstname} ${userData.lastname}`,
            dob = new Date(userData.dob).toDateString(),
            username = `${userData.username}`,
            userId = userData._id,
            imgUrl = userData.profilePicUrl;

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
            document.getElementById("profilePicUrl").setAttribute("src", imgUrl)

            const editButton = document.getElementById("edit_profile_button")
            editButton.setAttribute("href", `/user/profile/${userId}`)

            //add functionality to button elements
            activateButtonElements();
        } catch (error) {
            console.log(error);
        }
    }
    else {
        // console.log("Lol");
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
            // getEmail(id);
        }
    }
    catch (error) {
        // getEmail(id);
    }
}

function activateButtonElements() {

    const btnprivate = document.getElementById("private"),
        btnmanage = document.getElementById("manage"),
        btnwatchHistory = document.getElementById("watchHistory"),
        btnsearchHistory = document.getElementById("searchHistory"),
        btndeleteButton = document.getElementById("delete-btn"),
        btndeactivate = document.getElementById("deactivate");


    private(btnprivate); manage(btnmanage); watchHistory(btnwatchHistory); searchHistory(btnsearchHistory); deleteButton(btndeleteButton); deactivate(btndeactivate);

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
    manage.addEventListener("click", () => {

        const overlay = renderListOverlay();
        const btnsCollection = overlay.querySelectorAll("button");

        const exitBtn = document.getElementById("exit-overlay")
        exitBtn.addEventListener("click", () => {
            document.getElementById("wrapper-main").removeChild(overlay)
        })

        for (let button of btnsCollection) {
            const btnValue = button.value;
            const btnState = JSON.parse(localStorage.getItem("userDetails"))[btnValue];

            if (btnState == true) {
                button.setAttribute("data-state", "set")
                button.classList.add("data-state-true")
            }
        }

        for (let button of btnsCollection) {
            button.addEventListener("click", (e) => {
                const btnValue = e.target.value;
                const btnState = e.target.getAttribute("data-state");

                if (btnState == "unset") {
                    updateUserPreference(userId, btnValue, true)
                        .then(res => {
                            e.target.setAttribute("data-state", "set")
                            e.target.classList.add("data-state-true")
                            fetchuserDetails();
                        })
                        .catch(error => {
                            console.log(error);
                        })
                }
                else {
                    updateUserPreference(userId, btnValue, false)
                        .then(res => {
                            e.target.setAttribute("data-state", "unset")
                            e.target.classList.remove("data-state-true")
                            fetchuserDetails();
                        })
                        .catch(error => {
                            console.log(error);
                        })
                }
            })
        }
    })
}

function watchHistory(watchHistory) {
    watchHistory.addEventListener("click", (e) => {
        const overlay = setOverlay("Enable", "Disable");
        const yesBtn = overlay.querySelector("#yes-btn")
        const noBtn = overlay.querySelector("#no-btn")

        yesBtn.addEventListener("click", () => {
            overlay.style.display = "none";
            updateUserPreference(userId, "watch-history", "enabled")
                .then(res => {
                    e.target.textContent = "Disable";
                    e.target.parentElement.parentElement.querySelector("small").textContent = "Watch history is currently on - want to turn it off?"
                    fetchuserDetails();

                })
                .catch(err => {
                    console.error(err);
                })
        })
        noBtn.addEventListener("click", () => {
            overlay.style.display = "none";
            updateUserPreference(userId, "watch-history", "disabled")
                .then(res => {
                    e.target.textContent = "Enable";
                    e.target.parentElement.parentElement.querySelector("small").textContent = "Watch history is currently off - want to turn it on?"
                    fetchuserDetails();

                })
                .catch(err => {
                    console.error(err);
                })
        })
    })
}
function searchHistory(searchHistory) {
    searchHistory.addEventListener("click", (e) => {
        const overlay = setOverlay("Enable", "Disable");
        const yesBtn = overlay.querySelector("#yes-btn")
        const noBtn = overlay.querySelector("#no-btn")

        yesBtn.addEventListener("click", () => {
            overlay.style.display = "none";
            updateUserPreference(userId, "search-history", "enabled")
                .then(res => {
                    e.target.textContent = "Disable";
                    e.target.parentElement.parentElement.querySelector("small").textContent = "Search history is currently off - want to turn it on?"
                    fetchuserDetails();

                })
                .catch(err => {
                    console.error(err);
                })
        })
        noBtn.addEventListener("click", () => {
            overlay.style.display = "none";
            updateUserPreference(userId, "search-history", "disabled")
                .then(res => {
                    e.target.textContent = "Enable";
                    e.target.parentElement.parentElement.querySelector("small").textContent = "Search history is currently off - want to turn it on?"
                    fetchuserDetails();

                })
                .catch(err => {
                    console.error(err);
                })
        })
    })
}
function deleteButton(btndeleteButton) {
    btndeleteButton.addEventListener("click", (e) => {
        const overlay = setOverlay("Yes", "No");
        const yesBtn = overlay.querySelector("#yes-btn")
        const noBtn = overlay.querySelector("#no-btn")

        yesBtn.addEventListener("click", async () => {
            try {
                const req = await fetch(`/admin/delete-user-account?userId=${userId}`);
                const res = await req.json();
                const status = req.status;

                localStorage.clear()

                alert("Session Expired. Please Login again to continue");
                window.location.href = "/";
            }
            catch (error) {
                console.debug(error);
            }
        })

        noBtn.addEventListener("click", ()=> overlay.style.display = "none" )
    })
}
function deactivate(deactivate) {
    deactivate.addEventListener("click", (e) => {
        // setOverlay("optionA", "optionB")
    })
}




function setDefaultProfilesForButton(userDataObject) {

    if (!userDataObject) return
    //privacy buttons
    const btnprivate = document.getElementById("private");
    const btnWatchHistory = document.getElementById("watchHistory");
    const btnSearchHistory = document.getElementById("searchHistory");

    if (userDataObject["account-visibility"] == "private") {
        btnprivate.textContent = "Disable";
    }
    else {
        btnprivate.textContent = "Enable";
    }

    //watch history
    if (userDataObject["watch-history"] == "enabled") {
        btnWatchHistory.textContent = "Disable";
        btnWatchHistory.parentElement.parentElement.querySelector("small").textContent = "Watch history is currently on - want to turn it off?"
    }
    else {
        btnWatchHistory.textContent = "Enable";
        btnWatchHistory.parentElement.parentElement.querySelector("small").textContent = "Watch history is currently off - want to turn it on?"
    }

    //search history
    if (userDataObject["search-history"] == "enabled") {
        btnSearchHistory.textContent = "Disable";
        btnSearchHistory.parentElement.parentElement.querySelector("small").textContent = "Search history is currently on - want to turn it off?"
    }
    else {
        btnSearchHistory.textContent = "Enable";
        btnSearchHistory.parentElement.parentElement.querySelector("small").textContent = "Search history is currently off - want to turn it on?"
    }

}