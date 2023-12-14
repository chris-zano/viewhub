function renderListOverlay() {
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    overlay.classList.add("overlay-list");
    overlay.innerHTML = `
        <section id="overlayList" class="overlayList">
            <h2 class="section-title" style="text-align: center;">Genre</h2>
            <button type="button" id="exit-overlay">x</button>
            <div class="checklist">
                <ul class="overlay-list_container">
                    <li>
                        <button type="button" data-state="unset" value="Action">Action</button>
                    </li>
                    <li>
                        <button type="button" data-state="unset" value="Comedy">Comedy</button>
                    </li>
                    <li>
                        <button type="button" data-state="unset" value="Drama">Drama</button>
                    </li>
                    <li>
                        <button type="button" data-state="unset" value="Fiction">Science Fiction</button>
                    </li>
                    <li>
                        <button type="button" data-state="unset" value="Documentary">Documentary</button>
                    </li>
                    <li>
                        <button type="button" data-state="unset" value="Animation">Animation</button>
                    </li>
                    <li>
                        <button type="button" data-state="unset" value="Horror">Horror</button>
                    </li>
                    <li>
                        <button type="button" data-state="unset" value="Fantasy">Fantasy</button>
                    </li>
                    <li>
                        <button type="button" data-state="unset" value="Romance">Romance</button>
                    </li>
                    <li>
                        <button type="button" data-state="unset" value="Thriller">Mystery/Thriller</button>
                    </li>
                </ul>
            </div>
            <h2 class="section-title" style="text-align: center;">Content-Type</h2>
            <div class="checklist">
                <ul class="overlay-list_container">
                    <li>
                        <button type="button" data-state="unset" value="Short_Videos">Short Videos</button>
                    </li>
                    <li>
                        <button type="button" data-state="unset" value="Long_Videos">Long Videos</button>
                    </li>
                    <li>
                        <button type="button" data-state="unset" value="Live_Streams">Live Streams</button>
                    </li>
                    <li>
                        <button type="button" data-state="unset" value="Web_Series">Web Series</button>
                    </li>
                    <li>
                        <button type="button" data-state="unset" value="Movies">Movies</button>
                    </li>
                    <li>
                        <button type="button" data-state="unset" value="Music_Videos">Music Videos</button>
                    </li>
                </ul>
            </div>
        </section>
    `;
    document.getElementById("wrapper-main").append(overlay);
    return overlay;
}


function setOverlay(optionA, optionB) {
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    overlay.innerHTML = `
        <section id="history" class="history">
            <h2 class="section-title">Confirm</h2>
            <div class="privacy_checklist">
                <ul class="list_container">
                    <li>
                        <div class="action-btn">
                            <button type="button" id="yes-btn">${optionA}</button>
                        </div>
                    </li>
                    <li>
                        <div class="action-btn">
                            <button type="button" id="no-btn">${optionB}</button>
                        </div>
                    </li>
                </ul>
            </div>
        </section>
    `
    document.getElementById("wrapper-main").append(overlay);
    return overlay;
}