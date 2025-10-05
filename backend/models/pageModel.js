const mongoose = require('mongoose');
const pageSchema = new mongoose.Schema({
    pageId: { type: Number, required: true, unique: true },
    pageContentId: { type: Number, required: true, unique: true },
    pageTitle: { type: String, required: true, unique: true },
    bannerCaption: { type: String, required: true },
    pageContent: { type: String,},
    pageUrl: { type: String, required: true },
    pageBanner: { type: String },
    pageImage: { type: String },
    pageTopContent: { type: String },
    pageBottomContent: { type: String },
    sendEmail: { type: String, default: false },
    providedMenuLink: { type: String },
    class: { type: String },
    metaDescrition: { type: String },
    metaKeywords: { type: String },
    templateId: { type: Number },
    publishStatus: {type:Boolean, default:false},
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
const Page = mongoose.model('Page', pageSchema);
module.exports = Page;