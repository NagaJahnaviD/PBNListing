const mongoose = require('mongoose');
const clientSchema = new mongoose.Schema({
    clientId: { type: String, required: true, unique: true },   
    clientTitle: { type: String, required: true },
    clientDescription: { type: String, required: true },
    clientLocation: { type: String, required: true },
    clientImage: { type: String, required: true },
    clientUrl: { type: String, required: true },
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

const Client=mongoose.model('Client', clientSchema);
exports=module.exports=Client;
