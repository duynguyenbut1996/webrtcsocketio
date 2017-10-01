const Peer = require('peerjs');

const uid = require('uid');

const $ = require('jquery');

const openCamera = require('./openCamera');

const playVideo = require('./playVideo');

const socket = io('http://localhost:5000');

function getPeer(){
    const id = uid(10);
    $('#peer-id').append(id);
    return id;
}

var customConfig;

// $.ajax({
// url: "https://global.xirsys.net",
// data: {
//   ident: "duynguyenbut1996",
//   secret: "e44c5edc-a1e0-11e7-8ff9-07de7e02ee98",
//   channel: "MyFirstApp",
//   secure: 1
// },
// success: function (data, status) {
//   // data.v is where the iceServers object lives
//   customConfig = data.v;
//   console.log(customConfig);
// },
// async: false
// });

const connectionObj = {key: '3jqb18u6ub2fn7b9'};


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
