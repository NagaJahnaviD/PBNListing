const mongoose = require("mongoose");

// Banner Schema
const bannerSchema = new mongoose.Schema({
    bannerId: {
        type: Number,
        required: true,
        unique: true
    },
    bannerTitle: {
        type: String,
        required: true
    },
    bannerVisibility: {
        type: Boolean,
        default: true
    },
    bannerContent: {
        type: String,
        required: true
    },
    bannerImage: {
        type: String
    },
    bannerLink: {
        type: String
    },
    status: {
        type: String,
        maxlength: 1,
        default: "A"   
    },
    createdBy: {
        type: Number,
        default: 1
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: Number,
        default: 1
    },
    updatedOn: {
        type: Date,
        default: Date.now
    }
}, { strict: "throw" });

//export 
const Banner = mongoose.model("Banner", bannerSchema);
module.exports = Banner;
