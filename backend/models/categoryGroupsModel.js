const mongoose = require("mongoose");

// Blog Schema
const categoryGroupSchema = new mongoose.Schema({
    categoryGroupId: {
        type: Number,
        required: true,
        unique: true
    },
    serviceId: {
        type: Number,
        required: true
    },
    categoryGroupName: {
        type: String,
        required: true
    },
    categoryOrder: {
        type: Number,
        required: true
    },
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

//export 
const CategoryGroup = mongoose.model("CategoryGroup", categoryGroupSchema);
module.exports = CategoryGroup;
