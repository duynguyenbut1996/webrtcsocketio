const express = require("express");

const app = express();

app.set('view engine','ejs' );

app.set('views' , './views');

app.use(express.static('public'));

const server = require("http").createServer(app);

const io = require("socket.io")(server);

server.listen(5000,() => console.log('server start'));

io.on("connection",(socket)=>{
    console.log("co nguoi ket noi");
});

app.get('/', (req,res) => res.render('home'));
