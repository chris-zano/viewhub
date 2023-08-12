function checkLoginState() {
    const loginState = localStorage.getItem("loginState");
    if (!loginState) {
        window.location.href = "/login";
    }
    else {
        if (JSON.parse(loginState).isLoggedIn == true) {
            console.log("User is Logged in succesffully");
        }
    }
}

 checkLoginState()