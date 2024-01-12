const ffprobe = require("ffprobe");
const ffprobeStatic = require("ffprobe-static");

function convertTime(timeInSeconds) {
    var wholeHours = Math.floor(timeInSeconds / 3600);
    var remainingSeconds = timeInSeconds % 3600;
    var wholeMinutes = Math.floor(remainingSeconds / 60);
    var wholeSeconds = Math.round(remainingSeconds % 60);

    return `${wholeHours > 0 ? wholeHours + ":": "" }${wholeMinutes < 10 ? "0" + wholeMinutes : wholeMinutes}:${wholeSeconds < 10 ? "0" + wholeSeconds : wholeSeconds}`;
}

exports.getVideoInformation = (videoPath) => {
    return new Promise((resolve, reject) => {
        ffprobe(videoPath, { path: ffprobeStatic.path })
            .then(info => {
                const duration = info.streams[0].duration;
                var actualTime = convertTime(duration);
                resolve({ error: false, duration: actualTime })
            })
            .catch(error => {
                reject({ error: true, message: error })
            })
    })
}
