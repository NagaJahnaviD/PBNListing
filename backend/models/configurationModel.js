const mongoose = require('mongoose');
const configurationSchema = new mongoose.Schema({
    configId: { type: Number, required: true, unique: true },
    websiteTitle: { type: String, required: true },
    homePageTitle: { type: String, required: true },
    headerLogo: { type: String, required: true },
    footerLogo: { type: String, required: true },
    bannerCaptionName: { type: String, required: true },
    bannerCaptionLink: { type: String, required: true },
    googleAnalytics: { type: String, required: true },
    websiteContactNumber: { type: String, required: true },
    websiteMobileNumber: { type: String, required: true },
    websiteAddress: { type: String, required: true },
    websiteFaxNumber: { type: String, required: true },
    websiteEmail: { type: String, required: true },
    messageName: { type: String, required: true },
    informationName: { type: String, required: true },
    footerText: { type: String, required: true },
    quickLinks: { type: [String], required: true },
    ourServices: { type: String, required: true },
    technologies: { type: String, required: true },
    usaAddress: { type: String, required: true },
    headerAddress: { type: String, required: true },
    workingOur: { type: String, required: true },
    signallingLinks: { type: [String], required: true },
    footerContact: { type: String, required: true },
    indianContactDetails: { type: String, required: true },
    googleMapEmbeded: { type: String, required: true },
    footerCopyRight: { type: String, required: true },
    teitterLink: { type: String, required: true },
    instagramLink: { type: String, required: true },
    facebookLink: { type: String, required: true },
    linkedinLink: { type: String, required: true },
    youTubeLink: { type: String, required: true },
    underConstruction: { type: Boolean, default: false },
    adminPanelConstruction: { type: Boolean, default: false },
    metaDescription: { type: String, required: true },
    metaKeywords: { type: String, required: true },
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

const Configuration=new mongoose.model('Configuration', configurationSchema);
exports=module.exports=Configuration;