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

class Tview {
    constructor(videoObject) {
        this.videoObject = videoObject;
    }

    renderObjectTemlate() {
        const divElement = document.createElement("div");
        setattribute(divElement, "id", this.videoObject._id);
        const date = new Date(this.videoObject.createdAt);
        date.toDateString();

        divElement.innerHTML = `
        <a href="/tview/stream/video/${this.videoObject._id}">
        <img src="${this.videoObject.thumbnailUrl}" alt="profilePicUrl" width="150px" height="150px" style="border-radius: 10px;">
        <p>${this.videoObject.title}</p>
        <p>${this.videoObject.description}</p>
        <p>${this.videoObject.views}</p>
        <p>${this.videoObject.likes}</p>
        <p>${this.videoObject.comments}</p>
        <p>${date}</p>
        </a>
        `;

        return (divElement);
    }
}