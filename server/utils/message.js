var moment = require('moment');

var generateMessage = (from, text)=>{
    return {
        from,
        text,
        //createdAt: new Date().getTime()
        createdAt: moment().valueOf()
    };
};

var generateLocationMessage = (from, latitute, longitude)=>{
    return {
        from,
        url:`https://www.google.com/maps?q=${latitute},${longitude}`,
        createdAt: moment().valueOf()
    };
};

module.exports = {generateMessage, generateLocationMessage};