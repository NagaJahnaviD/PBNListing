const exp= require("express");
const upload=require("../Middleware/uploads"); // Multer middleware
const testimonialApp=exp.Router();
const Testimonial=require("../models/testimonialModel");
const expressAsyncHandler=require("express-async-handler");

// -----------------------------            
// Create a new testimonial
// -----------------------------
testimonialApp.post("/testimonial",upload.single("testimonialImage"),expressAsyncHandler(async(req,res)=>{
    try{
        const testimonialData=req.body;
        if(req.file){
            testimonialData.testimonialImage=`/uploads/${req.file.filename}`;
        }
        const newTestimonial=new Testimonial(testimonialData);
        const testimonialObj=await newTestimonial.save();
        res.status(201).send({message:"Testimonial created",payload:testimonialObj});
    }catch(err){
        res.status(400).send({error:err.message});
    }
}))

// -----------------------------
// Get all testimonials
// -----------------------------
testimonialApp.get("/testimonials",expressAsyncHandler(async(req,res)=>{
    console.log("Fetching all testimonials");
    const testimonials=await Testimonial.find();
    res.status(200).send({message:"Testimonials list",payload:testimonials});
}))

// -----------------------------
// Get a single testimonial by testimonialId
// -----------------------------
testimonialApp.get("/testimonial/:testimonialId",expressAsyncHandler(async(req,res)=>{
    const testimonial=await Testimonial.findOne({testimonialId:req.params.testimonialId});
    if(!testimonial){
        return res.status(404).send({message:"Testimonial not found"});
    }
    res.status(200).send({message:"Testimonial found",payload:testimonial});
}))

// -----------------------------
// Edit a testimonial by testimonialId
// -----------------------------    
testimonialApp.put("/testimonial/:testimonialId",upload.single("testimonialImage"),expressAsyncHandler(async(req,res)=>{
    console.log("Body:", req.body);
    try{
        const modifiedTestimonial=req.body;
        if(req.file){
            modifiedTestimonial.testimonialImage=`/uploads/${req.file.filename}`;
        }
        if (modifiedTestimonial.reviewValue) {
            modifiedTestimonial.reviewValue = Number(modifiedTestimonial.reviewValue);
        }
        modifiedTestimonial.updatedOn=new Date();
        console.log("Modified Testimonial Data:", modifiedTestimonial);
        const latestTestimonial=await Testimonial.findOneAndUpdate(
            {testimonialId:Number(req.params.testimonialId)},
            {...modifiedTestimonial},   
            {new:true,runValidators:true}
        );
        console.log("Latest Testimonial after update:", latestTestimonial);
        if(!latestTestimonial){
            return res.status(404).send({message:"Testimonial not found"});
        }
        res.status(200).send({message:"Testimonial updated",payload:latestTestimonial});
    }catch(err){
        res.status(400).send({error:err.message});
    }       
}))
module.exports=testimonialApp;
