const mongoose = require('mongoose');
const listingSchema = new mongoose.Schema({
    category: { type: String, required: true },
    listingId: { type: Number, required: true, unique: true },
    listingTitle: { type: String, required: true },
    listingDescription: { type: String, required: true },
    lsitingDetails: { type: String, required: true },
    listingLocation: { type: String, required: true },
    listingKeywords: { type: [String], required: true },
    listingUrl: { type: String, required: true },
    listingEmail: { type: String, required: true },
    listingFacebook: { type: String },
    listingTwitter: { type: String },
    listingLinkedin: { type: String },
    listingInstagram: { type: String },
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
const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;