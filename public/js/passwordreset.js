if (document.readyState == "loading")
    document.addEventListener("DOMContentLoaded", main);
else
    main();

function main() {
    console.log("we're here now !!!");

    document.getElementById("confirm_change").addEventListener("submit", (e) => {
        e.preventDefault();

        let current_password = document.getElementById("current_password").value;
        let new_password = document.getElementById("new_password").value;

        console.log("old=> ", current_password);
        console.log("new=> ", new_password);
    })
}