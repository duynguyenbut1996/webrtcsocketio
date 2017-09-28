const Peer = require('peerjs');

const uid = require('uid');

const $ = require('jquery');

const openStream = require('./openStream');

const playVideo = require('./playVideo');

function getpeer(){
    const id = uid(5);
    $('#peer-id').append(id);
    return id;
}

const peer = Peer(getpeer(), {host :'webrtc30.herokuapp.com', port : 443 ,secure : true , key :'peerjs' });

$('#btnConnect').click(() => {
    const Yourid =  $('#tokenID').val();
    openStream(() => {
        playVideo(stream, '#loadvideo' );
        const call = peer.call(Yourid , stream);
        call.on('stream',remoteStream => (remoteStream,'loadvideoSc'));
    })
});
