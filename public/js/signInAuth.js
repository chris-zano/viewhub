async function checkLoginState() {
    const loginState = localStorage.getItem("loginState");
    if (!loginState) {
        const req = await fetch('/login');
        const res = await req.json();

        console.log(res);
    }
}

 checkLoginState()