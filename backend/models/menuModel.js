const mongoose = require('mongoose');
const menuSchema=new mongoose.Schema({
    menuId:{type:Number, required:true, unique:true},
    menuParent:{type:Number, required:true},
    menuOrder:{type:Number, required:true},
    menuLocation:{type:String, required:true},
    menuLink:{type:String, required:true},
    menuName:{type:String, required:true},
    websiteStatqus:{type:String, required:true},
    targetStatus:{type:String, required:true},
    class:{type:String, required:true},
    publishStatus:{type:String, required:true},
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
const Menu=mongoose.model('Menu', menuSchema);
module.exports=Menu;