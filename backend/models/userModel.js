const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    userId:{type:Number, required:true, unique:true},
    firstName:{type:String, required:true},
    lastName:{type:String, required:true},
    userEmail:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    message:{type:String},userAddress:{type:String},
    userCity:{type:String},
    userState:{type:String},
    userCountry:{type:String},
    userPincode:{type:String},
    userProfile:{type:String},
    userRole:{type:String, required:true},
    token:{type:Number},
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
})