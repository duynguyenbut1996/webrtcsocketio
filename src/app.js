const Peer = require('peerjs');

const uid = require('uid');

const $ = require('jquery');

const openCamera = require('./openCamera');

const playVideo = require('./playVideo');

const socket = io('http://localhost:5000');


$('#dChat').hide();

// display username 
socket.on('Active_User',(arrUserInfo) => {
    // event hiding show
    $('#dChat').show();
    $('#dDK').hide();

    // take user information and display screen
    arrUserInfo.forEach((user) => {
        const {Ten , peerID} = user;
        
        $('#ulUser').append(`<li id="${peerID}" class="list-group-item" style:":hover {background: blue;}"> ${Ten} </li>`);
    });

    // everyone can connection
    socket.on('New_User',(user) => {
        const {Ten , peerID} = user;
        $('#ulUser').append(`<li id="${peerID}" class="list-group-item"> ${Ten} </li>`);
    });

    // User disconnect
    socket.on('User_disconnect',(peerID) => {
        $(`#${peerID}`).remove();
    })
});

socket.on('Already_exists', () => alert('Tên Người Dùng Đã Tồn Tại,Vui Lòng Chọn UserName Khác'));

socket.emit("sendData", () => {
    return $('#txtUsername').val();
})




// event function when an extra person wants to online
function getPeer(){
    const id = uid(10);
    $('#peer-id').append(id);
    $('#btnSignUp').click(() => {
        const username = $('#txtUsername').val();
        socket.emit('Active_User',{Ten :username, peerID:id});
    });
    return id;
}

// key peerjs
const connectionObj = {key: '3jqb18u6ub2fn7b9'};

const peer = Peer(getPeer(), connectionObj);

// caller
// $('#btnConnect').click(() => {
//     const Yourid =  $('#tokenID').val();
//     openCamera(stream => {
//         playVideo(stream, 'loadvideo');
//         const call = peer.call(Yourid , stream);
//         call.on('stream',remoteStream => playVideo(remoteStream,'loadvideoSc'));
//     });
// });

// people listen
peer.on('call',(call) =>{
    openCamera(stream => {
        playVideo(stream, 'loadvideo');
        call.answer(stream);
        call.on('stream',remoteStream => playVideo(remoteStream,'loadvideoSc'));
    });
});


// Click Caller update

$('#ulUser').on('click','li',function(){
    const ids = $(this).attr('id');
    openCamera(stream => {
        playVideo(stream, 'loadvideo');
        const call = peer.call(ids , stream);
        call.on('stream',remoteStream => playVideo(remoteStream,'loadvideoSc'));
    });
});

function sendData() {
    return $('#txtSend').val();
}

socket.on("Server-send-data", function(result){
    console.log(result);
    
     $('#ContentChat').append(result.user.ten+":"+ result.msg + "<br />" );
});

$(document).ready(function () {
    $('#btnSend').click(function () {
        const text = sendData();
        socket.emit("Client-send-data", text);
    });
});
