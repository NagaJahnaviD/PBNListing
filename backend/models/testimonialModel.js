const mongoose=require('mongoose');
const testimonialSchema=new mongoose.Schema({
    testimonialId:{type:Number,required:true,unique:true},
    userId:{type:Number,required:true},
    serviceId:{type:Number,required:true},
    userName:{type:String,required:true},
    testimonialTitle:{type:String,required:true},
    testimonialDescription:{type:String,required:true},
    testimonialAuthor:{type:String,required:true},
    testimonialImage:{type:String},
    authorCity:{type:String},
    reviewValue:{type:Number,required:true},
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
const Testimonial=mongoose.model('Testimonial',testimonialSchema)
module.exports=Testimonial;