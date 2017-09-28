function playVideo(stream ,idVideo){
    const video = document.getElementById(idVideo);
    video.srcOject = stream;
    video.onloadedmetadata = function(){
        video.play();
    };
}

module.exports = playVideo;