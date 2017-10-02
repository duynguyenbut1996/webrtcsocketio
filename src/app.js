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
        $('#ulUser').append(`<li id="${peerID}" class="list-group-item"> ${Ten} </li>`);
    });

    // everyone can connection and 
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
