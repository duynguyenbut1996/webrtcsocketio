const express = require("express");

const app = express();

app.set('view engine','ejs' );

app.set('views' , './views');

app.use(express.static('public'));

const server = require("http").createServer(app);

const io = require("socket.io")(server);

server.listen(5000,() => console.log('server start'));

const arrUserInfo = [];
const users = {};

// catch the event connection 
io.on("connection",(socket) => {
    socket.on('Active_User',(user) => {
        socket.peerID = user.peerID;
        socket.Ten    = user.Ten;
        users[socket.id] = {
            ten: user.Ten 
        };
        console.log(users, socket.id);        
        // validate username
        const isExist = arrUserInfo.some((e) => e.Ten === user.Ten);
        if(isExist) return socket.emit('Already_exists');
        arrUserInfo.push(user);
        socket.emit("Active_User",arrUserInfo);
        socket.broadcast.emit('New_User',user); 
    });
    // catch the event disconnect
    socket.on("disconnect", () => {
        const index = arrUserInfo.findIndex((user) => user.peerID === socket.peerID);
        arrUserInfo.splice(index , 1);
        io.emit('User_disconnect',socket.peerID);
    });

    // Client send data come server
    socket.on("Client-send-data",function(data){
        console.log(socket.id + " Send : " + data);
        const result = {
            user: users[socket.id],
            msg: data
        }
        io.sockets.emit("Server-send-data", result);
    }) 
    // Server return data come client


});


app.get('/', (req,res) => res.render('home'));
