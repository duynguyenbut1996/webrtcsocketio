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

const peer = Peer(getPeer(), {key: '3jqb18u6ub2fn7b9'});

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
