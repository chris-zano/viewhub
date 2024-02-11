if (document.readyState == "loading")
    document.addEventListener("DOMContentLoaded", main);
else
    main();

function main() {

    document.getElementById("sendCodeFrm").addEventListener("submit", (e) => {
        const email = document.getElementById("auth_email").value;
        e.preventDefault();

        try {
            authenticateUserEmail(email)
                .then(response => {
                    if (response.message == "an error occurred") {
                        sendVerificationCodeViaEmail(email)
                            .then(response => {
                                if (response.message == "code generated successfully") {
                                    if (enableVerificationButton().return_status == 1) {
                                        location.href = `/error/${enableVerificationButton().error}`
                                    }
                                    else {
                                        document.getElementById("verifyCodeForm").addEventListener("submit", (e) => {
                                            e.preventDefault();

                                            const code = document.getElementById("verification_code").value;
                                            verifyCodeWithEmailAndCode(email, code)//verify the input code with email and code
                                                .then(response => {
                                                    if (response.message == "verified") {
                                                        console.log("/user/password_change/authorized");
                                                    }
                                                })
                                                .catch(error => {
                                                    location.href = `/error/${error}`;
                                                })
                                        })
                                    }
                                }
                            })
                            .catch(error => {
                                location.href = `/error/${error}`
                            })
                    }
                    else if (response.message == "invalid auth credentials" || response.message == "an error occurred") {
                        alert("The email you provided cannot be verified")
                        alert("Your account will temporarily be suspended, pending review")
                    }

                })
                .catch(error => {
                    location.href = `/error/${error}`;
                })
        } catch (error) {
            console.debug(error)
        }
    })

    return (0);
}

/**
 * enables the verification button
 * @returns {object}0 on success, 1 on failure with error message
 */
function enableVerificationButton() {
    try {
        document.getElementById("verifyBtn").removeAttribute("disabled")
    } catch (error) {
        return ({ error: error, return_status: 1 });
    }
    return ({ error: false, return_status: 0 });
}

async function authenticateUserEmail(email) {
    try {
        const req = await fetch(`/user/auth/email/${email}`);
        const res = await req.json();
        return (res);
    }
    catch (error) {
        location.href = `/error/${error}`;
    }

}

/**
 * request for a verification code
 * @param {string} email 
 * @returns {object} response object
 */
async function sendVerificationCodeViaEmail(email) {
    try {
        const req = await fetch(`/user/getverificationcode/${email}`);
        const res = await req.json();

        return (res)
    } catch (error) {
        location.href = `/error/${error}`;
    }
}

/**
 * verify code
 * @param {string} email 
 * @param {string} code 
 * 
 * @returns {object} returns response object
 */
async function verifyCodeWithEmailAndCode(email, code) {
    try {
        const req = await fetch(`/user/verifycodeandemail/${email}/${code}`);
        const res = await req.json();

        return (res);
    } catch (error) {
        location.href = `/error/${error}`;
    }
}