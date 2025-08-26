const exp=require('express');
const blockApp=exp.Router();
const Block=require('../models/blockModel');
const expressAsyncHandler=require('express-async-handler'); 
// Create a new block
blockApp.post('/block',expressAsyncHandler(async(req,res)=>{
    const newBlock=new Block(req.body);
    const blockObj=await newBlock.save();
    res.status(201).send({message:'Block created',payload:blockObj});
}));
// Get all blocks       
blockApp.get('/blocks',expressAsyncHandler(async(req,res)=>{
    const blocks=await Block.find();
    res.status(200).send({message:'Blocks list',payload:blocks});
}));
// Get a single block by blockId
blockApp.get('/block/:blockId',expressAsyncHandler(async(req,res)=>{
    const block=await Block.findOne({blockId:req.params.blockId});
    if(!block) return res.status(404).send({message:'Block not found'});
    res.status(200).send({message:'Block found',payload:block});
}));
// Edit a block by blockId
blockApp.put('/block/:blockId',expressAsyncHandler(async(req,res)=>{
    const modifiedBlock=req.body;
    const latestBlock=await Block.findOneAndUpdate(
        {blockId:req.params.blockId},
        {...modifiedBlock},
        {new:true,runValidators:true}
    );
    if(!latestBlock) return res.status(404).send({message:'Block not found'});
    res.status(200).send({message:'Block updated',payload:latestBlock});
}));
// Delete a block by blockId
blockApp.delete('/block/:blockId',expressAsyncHandler(async(req,res)=>{
    const deletedBlock=await Block.findOneAndDelete({blockId:req.params.blockId});
    if(!deletedBlock) return res.status(404).send({message:'Block not found'});
    res.status(200).send({message:'Block deleted successfully'});
}));
module.exports=blockApp;