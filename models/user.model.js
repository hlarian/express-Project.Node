var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
   
    firstName:{
       type:String,
       required: true
   },
   lastName:{
    type:String,
    required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'active',
        enum: ['active', 'inactive', 'block']
    },
    role: {
        type: String,
        required: true,
        default: 'student',
        enum: ['teacher', 'student']
    },
    Course:{
        type: [String]
    }
});


module.exports = mongoose.model('user', userSchema);