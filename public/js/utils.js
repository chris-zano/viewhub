/**
 * fetches the user profile
 * @param {string} id 
 * @returns {object}
 */
async function getUserProfile(id) {
    try {
        const req = await fetch(`/get/profile/userbyId/${id}`);
        const res = await req.json();

        return (res);
    }
    catch (error) {
        location.href = `/error/${error}`;
    }
}

function fetchuserDetails() {
    const loginState = localStorage.getItem("loginState");
    getUserProfile(JSON.parse(loginState).userId)
        .then(res => {
            localStorage.setItem("userDetails", JSON.stringify(res.document[0]));
            const username = res.document[0].username;
            const ppURL = res.document[0].profilePicUrl;
            document.getElementById("current-user-name").textContent = username.trim();
            document.getElementById("big_img").setAttribute("src", ppURL.trim())
        })
        .catch(error => {
            console.log(error);
        })
}

/**
 * reports an error that was encountered at runtime to be logged.
 * so a fix can be made.
 * @param {JSON} reportObject 
 * @returns the status of the post request from the server as well as a json.
 */
async function reportError(reportObject) {
    const req = await fetch("/admin/error/report", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reportObject)
    });
    const status = await req.status;
    const res = await req.json()

    return ({ status: status, json: res })
}

/**
 * 
 * @param {HTMLElement} element 
 * @param {HTMLElementEventMap} event 
 * @param {CallableFunction} callback 
 */
function addeventlistener(element, event, callback) {
    return element.addEventListener(event, callback)
}

/**
 * simplifies document.getElementById
 * @param {HTMLElement.id} id 
 * @returns {HTMLElement | null}
 */
function getId(id) {
    return document.getElementById(id);
}

/**
 * get attribute of an element
 * @param {HTMLElement} element 
 * @param {HTMLElement.attribute} attribute 
 */
function getattribute(element, attribute) {
    return element.getAttribute(attribute);
}

/**
 * sets the attribute of an element
 * @param {HTMLElement} element
 * @param {HTMLElement.attributeKey} key
 * @param {HTMLElement.attributeValue} value
 */

function setattribute(element, key, value) {
    return element.setAttribute(key, value);
}

/**
 * simplifies localstorage.getItem
 * @param {WindowLocalStorage.key} key 
 */
function getLocalStorage(key) {
    return localStorage.getItem(key);
}

/**
 * simplifies localstorage.setItem
 * @param {WindowLocalStorage.key} key
 * @param {WindowLocalStorage.value} value
 */
function setLocalStorage(key, value) {
    return localStorage.setItem(key, value);
}

function setTheme() {
    try {
        const themeStatus = JSON.parse(localStorage.getItem("userDetails")).theme;
        const rootHead = document.querySelector("head")

        if (themeStatus == "enabled") {
            rootHead.removeChild(rootHead.querySelector("#root-css"));
            const rootUrl = document.createElement("link")
            rootUrl.setAttribute("rel", "stylesheet");
            rootUrl.setAttribute("id", "root-css");
            rootUrl.setAttribute("href", "/css/root-dark");

            rootHead.append(rootUrl);
        }
        else if (themeStatus == "disabled") {
            rootHead.removeChild(rootHead.querySelector("#root-css"));

            const rootUrl = document.createElement("link")
            rootUrl.setAttribute("rel", "stylesheet");
            rootUrl.setAttribute("id", "root-css");
            rootUrl.setAttribute("href", "/css/root");

            rootHead.append(rootUrl);
        }
    } catch (error) {
        console.log(error);
    }
}
setTheme()


function getPastTime(time) {
    try {
        const now = new Date();

        const timestamp = Math.floor((now - time) / 1000);

        if (timestamp < 60) {
            return Math.floor(timestamp) + " seconds";
        }
        else if (timestamp < 3600) {
            return Math.floor(timestamp / 60) + " minutes";
        }
        else if (timestamp < 86400) {
            return Math.floor(timestamp / 3600) + " hours";
        }
        else if (timestamp < 604800) {
            return Math.floor(timestamp / 86400) + " days";
        }
        else if (timestamp < 2419200) {
            let weeks = Math.floor(timestamp / 604800)
            return `${weeks}  ${weeks == 1 ? " week" : " weeks"}`
        }
        else if (timestamp < 29030400) {
            if (Math.floor(timestamp / 2419200) == 1) {
                return Math.floor(timestamp / 2419200) + " month";
            }
            else {
                return Math.floor(timestamp / 2419200) + " months";
            }
        }
        else {
            return Math.floor(timestamp / 29030400) + " years";
        }
    } catch (error) {
        location.href = `/error/${error}`;
    }
}

function convertTime(timeInSeconds) {
    var wholeHours = Math.floor(timeInSeconds / 3600);
    var remainingSeconds = timeInSeconds % 3600;
    var wholeMinutes = Math.floor(remainingSeconds / 60);
    var wholeSeconds = Math.round(remainingSeconds % 60);

    return `${wholeHours}:${wholeMinutes < 10 ? "0" + wholeMinutes : wholeMinutes}:${wholeSeconds < 10 ? "0" + wholeSeconds : wholeSeconds}`;
}