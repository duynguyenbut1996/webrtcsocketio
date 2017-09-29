const Peer = require('peerjs');

const uid = require('uid');

const $ = require('jquery');

const openCamera = require('./openCamera');

const playVideo = require('./playVideo');

function getPeer(){
    const id = uid(10);
    $('#peer-id').append(id);
    return id;
}

var customConfig;


var https = require("https");
var options = {
      host: "global.xirsys.net",
      path: "/_turn/default",
      method: "PUT",
      headers: {
          "Authorization": "Basic " + new Buffer("duynguyenbut1996:e44c5edc-a1e0-11e7-8ff9-07de7e02ee98").toString("base64")
      }
};
var httpreq = https.request(options, function(httpres) {
      var str = "";
      httpres.on("data", function(data){ str += data; });
      httpres.on("error", function(e){ console.log("error: ",e); });
      httpres.on("end", function(){ 
          console.log("ICE List: ", str);
      });
});
httpreq.end();

const connectionObj = {key: '3jqb18u6ub2fn7b9'}

const peer = Peer(getPeer(), connectionObj);

$('#btnConnect').click(() => {
    const Yourid =  $('#tokenID').val();
    openCamera(stream => {
        playVideo(stream, 'loadvideo');
        const call = peer.call(Yourid , stream);
        call.on('stream',remoteStream => playVideo(remoteStream,'loadvideoSc'));
    });
});


peer.on('call',(call) =>{
    openCamera(stream => {
        playVideo(stream, 'loadvideo');
        call.answer(stream);
        call.on('stream',remoteStream => playVideo(remoteStream,'loadvideoSc'));
    });
});
