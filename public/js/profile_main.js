if(document.readyState == "loading")
    document.addEventListener("DOMContentLoaded", main);
else
    main();

function main() {
    console.log("Hello user");

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