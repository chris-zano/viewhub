const ffprobe = require("ffprobe");
const ffprobeStatic = require("ffprobe-static");

exports.getVideoInformation = (videoPath) => {
    return new Promise((resolve, reject) => {
        ffprobe(videoPath, { path: ffprobeStatic.path })
            .then(info => {
                const duration = info.streams[0].duration
                const inminutes = duration / 60;
                const minutes = String(inminutes).slice(0, String(inminutes).indexOf("."))
                const seconds = Math.floor((Number(String(inminutes).slice(String(inminutes).indexOf(".") + 1, String(inminutes).indexOf(".") + 4)) / 1000) * 60)
                console.log(`${minutes}:${seconds}`);
                resolve({error: false, duration:`${minutes}:${seconds}`})
            })
            .catch(error => {
                reject({error: true, message: error})
            })
    })
}
