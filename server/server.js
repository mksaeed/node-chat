//Built in Node Packages
const path = require('path');
const http = require('http');
//Packages install from npm 
const express = require('express');
const socketIO = require('socket.io');

//local Packages
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

//setting up relative path for public folder
const publicPath = path.join(__dirname, '../public');

//setting up port number for Heruku and if local server use port 3000
const port = process.env.PORT || 3000;
//Setting up express server
var app = express();
//Setting up server using http Package instead of express. Although express uses same function for setting up server
var server = http.createServer(app);

//we pass the server paramerter because we gona access the server via server argument. and we gona get back is our web socket io
var io = socketIO(server);
var users = new Users();

//Middleware for html page 
app.use(express.static(publicPath));

// io.on register an event lister we can listen specific event and do something when that event occur
io.on('connection', (socket)=>{
    console.log('New User Connected');

    //socket.emit from Admin.. Greating to new user who joined

    // socket.emit('newMessage',{
    //     from: 'Admin',
    //     text: 'Welcome To Chat Application',
    //     createdAt: new Date().getTime()
    // });
    // socket.emit('newMessage',generateMessage('Admin', 'Welcome To Chat Application'));

    //socket.broadcast.emit from admin to rest of chat users that new user joined

    // socket.broadcast.emit('newMessage',{
    //     from: 'Admin',
    //     text: 'New User Joined',
    //     createdAt: new Date().getTime()
    // });
    // socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined'));

    socket.on('join', (params, callback)=>{
        params.room = 'INFOSYS'; //hard coded room name
        if(!isRealString(params.name) || !isRealString(params.room)){
            callback('Name And Room Name Are Required');
        }

        socket.join(params.room); //This is for People for the same room
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        // socket.leave('Room Name') //To kick out of the room

        //io.emit  ===> io.to('Room Name').emit // this will send message to all the ppl Connected to that room
        //socket.broadcast.emit  ===>  socket.broadcast.to('Room Name').emit  //This will send message to all the ppls of room expect to the sender
        //socket.emit //There is no reason to target them by room
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage',generateMessage('Admin', 'Welcome To Chat Application'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has Joined`));
    
        
        callback();
    });


    // // similar to lister event but it emit event instead of listening
    // socket.emit('newEmail', {
    //     from: 'mike@example.com',
    //     text: 'Hey Man.. Whats Up',
    //     createdAt: 123
        
    // });

    // socket.emit('newMessage',{
    //     from: 'Kamran Saeed',
    //     text: 'Hay Man Whats Up...',
    //     createdAt: 1234
    // });

    // //receiving email from client side via socket
    // socket.on('createEmail', (newEmail)=>{
    //     console.log('New Email', newEmail);
    // })

    socket.on('createMessage',(message, callback)=>{
        // console.log('Create Message', message);

        // socket.emit emit message to single connection io.emit emits an event to every connection
        // io.emit('newMessage',{
        //     from : message.from,
        //     text : message.text,
        //     createdAt : new Date().getTime()
        // });
        var user = users.getUser(socket.id);

        if(user && isRealString(message.text)){

            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        
        callback();
    });
     socket.on('createLocationMessage', (coords)=>{
         var user = users.getUser(socket.id);

        if(user){
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitute, coords.longitude));
        }
            
        });

    //when user was disconnected from the server
socket.on('disconnect', ()=>{
    // console.log('Disconnected from the server');
    var user = users.removeUser(socket.id);

    if(user){
        io.to(user.room).emit('updateUserList', users.getUserList(user.room));
        io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
    }
});

});



//Starting Server at PORT
server.listen(port, ()=>{
    console.log(`Server Strated At Port ${port}`);
})

//to write the test case we need to install expect and mocha  --save-dev
//also install nodemon locally with --save-dev flag