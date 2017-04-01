 // calling native method of io to make connection between servr and client and keep that connection open
        var socket = io();


        // Connected to server event listner
        socket.on('connect', function(){
            console.log('Connected to Server');

            // // similar to lister event but it emit(sending) event instead of listening
            // socket.emit('createEmail',{
            //     to: 'james@yahoo.com',
            //     text:'Hey Man. Where are you... call me'
            // });

            // socket.emit('createMessage', {
            //     from: 'Arslan Shafiq',
            //     text: 'Yahhh... its workiing',
            // });
        });

        // connection terminated from server
        socket.on('disconnect', function(){
            console.log('Disconnected From The Server');

            

        });

        // socket.on('newEmail', function(email) {
        //    console.log('New Email', email); 
        // });

        socket.on('newMessage',function (message) {
            var formattedTime = moment(message.createdAt).format('h:mm a');
            var li = jQuery('<li></li>');
            li.text(`${message.from} ${formattedTime}: ${message.text}`);

            jQuery('#messages').append(li);
        })

        socket.on('newLocationMessage', function (message){
             var formattedTime = moment(message.createdAt).format('h:mm a');
            var li = jQuery('<li></li>');
            var a = jQuery('<a target= "_blank">My Current Location</a>');
            li.text(`${message.from} ${formattedTime}:`);
            a.attr('href', message.url);
            li.append(a);
            jQuery('#messages').append(li);
        });

        jQuery('#message-form').on('submit', function(e){
            e.preventDefault();

            var messageTextbox = jQuery('[name=message]');

            socket.emit('createMessage', {
                from: 'User',
                text:  messageTextbox.val()
            }, function(){
                 messageTextbox.val('')
            });
        });

        // jQuery('#send-location').on('click', function(){

            var locationButton = jQuery('#send-location');
            locationButton.on('click', function(){
            if(!navigator.geolocation){
                return alert('Geolocation is not supported by your browser');
            }

            locationButton.attr('disabled', 'disabled').text('Sending Location...');

            navigator.geolocation.getCurrentPosition(function(position) {
                locationButton.removeAttr('disabled').text('Send Location');
                socket.emit('createLocationMessage', {
                    latitute: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            }, function(){
                locationButton.removeAttr('disabled').text('Send Location');
                alert('Unable to fetch location');
            })
            
        });