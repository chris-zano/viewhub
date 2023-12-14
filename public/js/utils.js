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
    const themeStatus = JSON.parse(localStorage.getItem("userDetails")).theme;
    const rootUrl = document.querySelector("head").querySelector("#root-css")

    if (themeStatus == "enabled") {
        rootUrl.setAttribute("href", "/css/root-dark");
    }
    else if( themeStatus == "disabled") {
        rootUrl.setAttribute("href", "/css/root")
    }
}
setTheme()