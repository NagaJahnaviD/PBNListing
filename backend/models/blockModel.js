const mongoose=require("mongoose");
// Block Schema
const blockSchema=new mongoose.Schema({ 
    blockId:{
        type:Number,
        required:true,      
        unique:true
    },
    blockTitle:{
        type:String,
    },
    blockSubtitle:{
        type:String,
    },
    blockVisibility:{ 
        type: Boolean,
        default: true
    },
    blockContent:{
        type:String,
        required:true
    },
    blockImage:{
        type:String
    },
    blockLink:{
        type:String
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

const Block=mongoose.model("Block",blockSchema);
module.exports=Block;