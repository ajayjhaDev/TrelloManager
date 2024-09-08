const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    first_name:{
        type:String,
        required:true,
    },
    last_name:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    tasks:[
        {
            type:mongoose.Types.ObjectId,
            ref:"task",
        },
    ]
});
module.exports = mongoose.model('user',UserSchema)