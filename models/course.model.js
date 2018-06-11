var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var courseSchema = new Schema({
   
    courseName: {
        type: String,
        required: true
    },
    course_ID:{
        type: Number,
        required: true,
    },
    teacher_ID: {
        type: Schema.ObjectId,
        ref: 'user',
        required: true
    },
    
    Students_list:{
        type: [String]
    }
   
});



module.exports = mongoose.model('course', courseSchema);