var moongose = require('mongoose');
var Schema = moongose.Schema;

var eventSchema = new Schema({
    
    eventName:{
        type: String,
        required: true
    },
    
    course_ID:{
        type: Schema.ObjectId,
        ref:'course',
        required: true
    },

    description:{
        type: String
    },

    date:{
        type: Date,
        default: Date.now()
    }
});

module.exports = moongose.model('event', eventSchema);