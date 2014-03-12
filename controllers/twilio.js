var twilio = require('twilio'),
    Message = require('../models/Message');

// Handle incoming voice calls
exports.voice = function(request, response) {
    var twiml = new twilio.TwimlResponse();

    twiml.say('Hey there, you\'ve reached Joe Mauer. I\'m getting ready for the season right now, but please leave a message after the beep.')
        .record({
            maxLength:20,
            action:'/recording'
        });

    response.send(twiml);
};

// Handle recordings
exports.recording = function(request, response) {
    // Create a new saved message object from the Twilio data
    var msg = new Message({
        sid: request.param('CallSid'),
        type:'call',
        recordingUrl: request.param('RecordingUrl'),
        recordingDuration: Number(request.param('RecordingDuration')),
        fromCity:request.param('FromCity'),
        fromState:request.param('FromState'),
        fromCountry:request.param('FromCountry')
    });

    // Save it to our MongoDB 
    msg.save(function(err, model) {
        var twiml = new twilio.TwimlResponse()
            .say('Thanks for leaving Joe a message - your message should appear on the web site soon.  Goodbye!', {
                voice:'alice'
            })
            .hangup();
        response.send(twiml);
    });
};

// Handle inbound SMS
exports.sms = function(request, response) {
    // Create a new saved message object from the Twilio data
    var msg = new Message({
        sid: request.param('MessageSid'),
        type:'text',
        textMessage:request.param('Body'),
        fromCity:request.param('FromCity'),
        fromState:request.param('FromState'),
        fromCountry:request.param('FromCountry')
    });

    // Save it to our MongoDB
    msg.save(function(err, model) {
        var twiml = new twilio.TwimlResponse()
            .message('Thanks for sending Joe a message! It should appear on the web site soon.');
        response.send(twiml);
    });
};