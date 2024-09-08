const mongoose = require('mongoose')
const TaskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    desc:{
        type:String,
        required:true,
    },
    todo:{
        type:Boolean,
        default:true,
    },
    inProgress:{
        type:Boolean,
        default:false,
    },
    completed:{
        type:Boolean,
        default:false,
    }
}, {timestamps:true} );
module.exports = mongoose.model('task',TaskSchema)