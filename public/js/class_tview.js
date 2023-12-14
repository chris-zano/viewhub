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

class Tview {
    constructor(videoObject) {
        this.videoObject = videoObject;
    }

    renderObjectTemlate() {
        const userid = JSON.parse(localStorage.getItem("userDetails"))._id;
        const divElement = document.createElement("div");
        setattribute(divElement, "id", this.videoObject._id);
        setattribute(divElement, "class", "link_object");
        const date = getPastTime(this.videoObject.dateTime);


        divElement.innerHTML = `
        <a href="/tview/stream/video/${this.videoObject._id}/${userid}" class="object_route">
            <div class="first_child_link">
                <div class="video_thumbnail">
                    <img src="${this.videoObject.thumbnailUrl}" alt="profilePicUrl" loading="lazy">
                    <span class="video_duration">${this.videoObject.duration}</span>
                </div>
                <div class="video_details">
                    <div class="creator_profile_image">
                        <img src="${this.videoObject.creatorProfilePic}" alt="profilePicUrl">
                        
                    </div>
                    <div class="video_information_div">
                        <div class="creator_name">
                            <p id="first_last-name">Tview</p>
                        </div>
                        <div class="video_title">
                            <p>${this.videoObject.title}</p>
                        </div>
                        
                        <div class="video_view_and_date">
                            <p>${this.videoObject.views} views ~ ${date} ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </a>
        `;

        getUserProfile(this.videoObject.creatorId)
            .then(res => {
                const firstName = res.document[0].firstname;
                const lastName = res.document[0].lastname;

                divElement.querySelector("#first_last-name").textContent = `${firstName} ${lastName}`;
            })
            .catch(error => {
                console.log(error);
            })

        return (divElement);
    }


}
