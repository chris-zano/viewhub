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
                    location.href = `/user/password/reset/${e.target.getAttribute("data-userId").trim()}/null`;
                }
            }
        })
        .catch(error => {
            location.href = `/error/${error}`;
        })
    })
}