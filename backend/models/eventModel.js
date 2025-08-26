const mongoose = require('mongoose');
const eventSchema=new mongoose.Schema({
    eventId:{type:Number, required:true, unique:true},
    eventTitle:{type:String, required:true},
    eventDate:{type:Date, required:true},
    eventDescription:{type:String, required:true},
    eventLocation:{type:String, required:true},
    eventImage:{type:String, required:true},
    eventBanner:{type:String, required:true},
    eventUrl:{type:String, required:true},
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
const Event=mongoose.model('Event', eventSchema);
module.exports=Event;
