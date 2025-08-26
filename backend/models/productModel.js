const mongoose = require('mongoose');
const productSchema=new mongoose.Schema({
    productId:{type:Number, required:true, unique:true},
    productTitle:{type:String, required:true},
    productDescription:{type:String, required:true},
    productImage:{type:String, required:true},
    productUrl:{type:String, required:true},
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
const Product=mongoose.model('Product', productSchema);
module.exports=Product;