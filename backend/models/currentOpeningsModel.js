const mongoose = require('mongoose');
const currentOpeningsSchema=new mongoose.Schema({
    jobId:{type:Number, required:true, unique:true},
    jobTitle:{type:String, required:true},
    jobDescription:{type:String, required:true},
    jobCode:{type:String, required:true},
    status: {
        type: String,
        maxlength: 1,
        default: "A"
    },
    createdBy: {
        type: Number
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: Number
    },
    updatedOn: {
        type: Date,
        default: Date.now
    }
}, { strict: "throw" });
const CurrentOpenings=mongoose.model('CurrentOpenings', currentOpeningsSchema);
