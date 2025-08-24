const mongoose = require("mongoose");

// Blog Schema
const blogSchema = new mongoose.Schema({
    blogId: {
        type: Number,
        required: true,
        unique: true
    },
    blogTitle: {
        type: String,
        required: true
    },
    blogDate: {
        type: Date,
        required: true
    },
    blogDescription: {
        type: String,
        required: true
    },
    blogImage: {
        type: String
    },
    blogAuthor: {
        type: String
    },
    blogBanner: {
        type: String
    },
    blogUrl: {
        type: String
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
const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
