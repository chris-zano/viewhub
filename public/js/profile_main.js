if(document.readyState == "loading")
    document.addEventListener("DOMContentLoaded", main);
else
    main();

function main() {
    document.getElementById("changePassword").addEventListener("click", (e)=> {
        getUserProfile(e.target.getAttribute("data-userId").trim())
        .then(response => {
            if (response.error == false) {//the user has been autheticated
                if(response.userId == e.target.getAttribute("data-userId").trim()) {//check if id matches cached id
                    location.href = `/user/password/reset/${e.target.getAttribute("data-userId").trim()}`;
                }
            }
        })
        .catch(error => {
            location.href = `/error/${error}`;
        })
    })

    fetch_C_Up(document.getElementById("userId").textContent)
    .then(response => {
        console.log(response);
    })
    .catch (error => {
        location.href = `/error/${error}`;
    })
}

async function fetch_C_Up(id) {
    const req = await fetch(`/get/creator/uploads/${id}`);
    const res = await req.json();
    return (res);
}

