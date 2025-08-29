const mongoose = require('mongoose');
const subscribedEmailSchema = new mongoose.Schema({
    subscribedEmail: { type: String, required: true, unique: true },
    userEmail: { type: String, required: true },
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
const SubscribedEmail = mongoose.model('SubscribedEmail', subscribedEmailSchema);
module.exports = SubscribedEmail;