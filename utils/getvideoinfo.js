const ffprobe = require("ffprobe");
const ffprobeStatic = require("ffprobe-static");

exports.getVideoInformation = (videoPath) => {
    return new Promise((resolve, reject) => {
        ffprobe(videoPath, { path: ffprobeStatic.path })
            .then(info => {
                const duration = info.streams[0].duration;
                var actualTime;
                const inminutes = duration / 60;
                var minutes = String(inminutes).slice(0, String(inminutes).indexOf("."));
                var secondsb = Math.floor((Number(String(inminutes).slice(String(inminutes).indexOf(".") + 1, String(inminutes).indexOf(".") + 4)) / 1000) * 60);

                if (minutes > 59) {
                    let hours = Math.floor((Number(minutes) / 60));
                    let aminutes = String((Number(minutes) / 60)).slice(String((Number(minutes) / 60)).indexOf("."));
                    minutes = (Number(aminutes) * 60);
                    let secondsa = Math.floor(Number(String(minutes).slice(String(minutes).indexOf(".") + 1) / 1000) * 60);
                    minutes = Number(String(minutes).slice(0, String(minutes).indexOf(".")));
                    actualTime = `${hours}:${minutes}:${secondsa + secondsb}`;
                }

                else {
                    actualTime = `${minutes}:${secondsb}`;
                }

                // in the case the duration property does not exist
                if (actualTime == "Na:NaN") {
                    console.log("here 1");
                    console.log(info);
                    for (let stream of info.streams) {
                        console.log(stream);
                        if (stream.codec_type == 'video') {
                            for (var key in stream.tags) {
                                var regex = /duration/i;
                                if (regex.test(key)) {
                                    actualTime = String(stream.tags[key]).slice(0, String(stream.tags[key]).lastIndexOf("."));
                                }
                            }
                        }
                    }
                    if (actualTime == "Na:NaN") {
                        actualTime = "0:00:00";
                    }
                }
                console.log(actualTime);
                resolve({ error: false, duration: actualTime })
            })
            .catch(error => {
                reject({ error: true, message: error })
            })
    })
}
