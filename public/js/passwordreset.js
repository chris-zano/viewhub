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

        if (current_password == new_password) {
            alert("Your old password cannot be the same as your new password");
            document.getElementById("new_password").value = '';
            return;
        }

        else {
            //TODO request for a password change
            requestPasswordChange(current_password, new_password)
            .then(response => {
                console.log(response);
                if (response.message == "password updated") {
                    alert("Password Updated succesfully");
                    location.href = "/"
                }
                else {
                    console.log(response.message);
                }
            })
        }
        console.log("old=> ", current_password);
        console.log("new=> ", new_password);
    })
}

/**
 * sends a request to change the user's password
 * @param {string} current_password 
 * @param {string} new_password 
 * 
 * @returns {object} a response object with error status and message set appropriately
 */
async function requestPasswordChange(current_password, new_password)
{
    try {
        const req = await fetch(`/admin/update/password/${JSON.parse(localStorage.getItem("loginState")).userId}/${current_password}/${new_password}`);
        const res = await req.json();
        return (res);
    }
    catch(error) {
        location.href = `/error/${error}`;
    }
}