
/**
 * checkLoginState - Authenticates the User before making subsequent request to the database
 * for restricted data, or app usage
 */
function checkLoginState() {
    // fetch login state from local storage
    const loginState = localStorage.getItem("loginState");
    var logoutBtn;

    if (!loginState) {

        //get login-btn-show
        const navParent = document.getElementById("main-header-nav");
        const ulChild = document.getElementById("ul-li-a");

        const loginElement = document.createElement("div");
        loginElement.classList.add("login-btn");
        loginElement.setAttribute("id", "login-btn-show");
        loginElement.innerHTML =
            `
            <li>
                <a href="/login">Login</a>
            </li>
        `;

        navParent.removeChild(ulChild);
        navParent.appendChild(loginElement);
    }

    else {
        if (JSON.parse(loginState).isLoggedIn == true) {
            //if user is logged in, check if session has expired
            // expiration set to 7days after login
            const expiration_date = JSON.parse(loginState).expiration

            if (Date.now >= expiration_date) {
                localStorage.removeItem("loginState");
                alert("Session Expired. Please Login again to continue");
                window.location.href = "/login";

            }
            else {

                const count = localStorage.getItem("loginNotification");

                if (count == null) {
                    return;
                }
                else {
                    if (JSON.parse(count).count == 1) {
                        window.Notification.requestPermission().then(permission => {
                            if (permission != 'granted')
                                return;

                            const notification = new Notification('Session Manager',
                                {
                                    body: "Login successful!!"
                                })
                        });
                        localStorage.setItem("loginNotification", JSON.stringify({ count: 2 }));
                    }
                    else {
                        localStorage.setItem("loginNotification", JSON.stringify({ count: 2 }));
                    }

                }

            }

            getUserProfile(JSON.parse(loginState).userId)
            .then(res => {
                localStorage.setItem("userDetails", JSON.stringify(res.document[0]));
                const username = res.document[0].username;
                const ppURL = res.document[0].profilePicUrl;
                document.getElementById("current-user-name").textContent = username.trim();
                document.getElementById("big_img").setAttribute("src", ppURL.trim())
            })
        }
    }

    //add listener to the logout button
    try {
        logoutBtn = document.getElementById("logoutBtn");
        logoutBtn.addEventListener("click", () => {
            listenOnLogout(JSON.parse(loginState).userId)
                .then(response => {
                    if (response.error == false && response.message == "User Logged Out Successfully") {

                        localStorage.removeItem("loginState");
                        localStorage.setItem("loginNotification", JSON.stringify({ count: 1 }));
                        alert("Session Expired. Please Login again to continue");
                        window.location.href = "/login";
                    }
                    else {
                        //TODO:notify developer of error
                        reportError(response)
                            .then(res => {
                                console.log(res.status);
                                console.log(res.json);
                            })
                            .catch(err => {
                                console.log("failed to send error message: ", err);
                            })

                        localStorage.clear();
                        alert("Session Expired. Please Login again to continue");
                        window.location.href = "/login";
                    }
                })
        })
    } catch (error) {
        reportError(error)
            .then(res => {
                console.log(res.status);
                console.log(res.json);
            })
            .catch(err => {
                console.log("failed to send error message: ", err);
            })
        localStorage.clear();
        alert("Session Expired. Please Login again to continue");
        window.location.href = "/login";
    }

    //add listener to the profile button
    try {
        const profileBtn = document.getElementById("profileBtn");
        profileBtn.addEventListener("click", () => {
            getUserProfile(JSON.parse(loginState).userId)
                .then(response => {
                    if (response.error == false) {//the user has been autheticated
                        if (response.userId == JSON.parse(loginState).userId) {//check if id matches cached id
                            location.href = `/user/profile/${response.userId}`
                        }
                        else {
                            location.href = "/login";
                        }
                    }
                    else {
                        logoutBtn.click();
                    }
                })
                .catch(err => {
                    reportError(err)
                        .then(res => {
                            console.log(res.status);
                            console.log(res.json);
                        })
                        .catch(err => {
                            console.log("failed to send error message: ", err);
                        })
                    location.href = `/login`;
                })
        })
    } catch (error) {
        reportError(err)
            .then(res => {
                console.log(res.status);
                console.log(res.json);
            })
            .catch(err => {
                console.log("failed to send error message: ", err);
            })
        location.href = `/login`;
    }
}

async function listenOnLogout(id) {
    try {
        const req = await fetch(`/userLogout/${id}`);
        const res = await req.json();

        return (res);
    } catch (error) {
        console.error(error);
    }
}

checkLoginState()