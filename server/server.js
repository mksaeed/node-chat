//Built in Node Packages
const path = require('path');
const http = require('http');
//Packages install from npm 
const express = require('express');
const socketIO = require('socket.io');

//setting up relative path for public folder
const publicPath = path.join(__dirname, '../public');

//setting up port number for Heruku and if local server use port 3000
const port = process.env.PORT || 3000;
//Setting up express server
var app = express();
//Setting up server using http Package instead of express. Although express uses same function for setting up server
var Server = http.createServer(app);

//Middleware for html page 
app.use(express.static(publicPath));

//Starting Server at PORT
Server.listen(port, ()=>{
    console.log(`Server Strated At Port ${port}`);
})