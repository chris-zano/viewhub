function checkLoginState() {
    const loginState = localStorage.getItem("loginState");
    if (!loginState) {
        window.location.href = "/login";
    }
}

 checkLoginState()