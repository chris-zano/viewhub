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
            return Math.floor(timestamp / 604800) + " weeks";
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

class Tview {
    constructor(videoObject) {
        this.videoObject = videoObject;
    }

    renderObjectTemlate() {
        const divElement = document.createElement("div");
        setattribute(divElement, "id", this.videoObject._id);
        setattribute(divElement, "class", "link_object");
        const date = getPastTime(this.videoObject.dateTime);


        divElement.innerHTML = `
        <a href="/tview/stream/video/${this.videoObject._id}" class="object_route">
            <div class="first_child_link">
                <div class="video_thumbnail">
                    <img src="${this.videoObject.thumbnailUrl}" alt="profilePicUrl"
                        style="border-radius: 10px;">
                    <span class="video_duration">${this.videoObject.duration}</span>
                </div>
                <div class="video_details">
                    <div class="creator_profile_image">
                        <img src="${this.videoObject.creatorProfilePic}" alt="profilePicUrl">
                    </div>
                    <div class="video_information_div">
                        <div class="video_title">
                            <p>${this.videoObject.title}</p>
                        </div>
                        <div class="creator_name">
                            <p>Tview</p>
                        </div>
                        <div class="video_view_and_date">
                            <p>${this.videoObject.views} views</p>
                            <p>${date} ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </a>
        `;

        return (divElement);
    }
}