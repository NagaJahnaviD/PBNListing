const exp=require('express');
const upload = require("../Middleware/uploads"); 
const blockApp=exp.Router();
const Block=require('../models/blockModel');
const expressAsyncHandler=require('express-async-handler'); 
// Create a new block
blockApp.post('/block',upload.single("blockImage"),expressAsyncHandler(async(req,res)=>{
    try {
      const blockData = req.body;

      // If file uploaded → save path
      if (req.file) {
        blockData.blockImage = `/uploads/${req.file.filename}`;
      }

      const newBlock = new Block(blockData);
      const blockObj = await newBlock.save();

      res.status(201).send({ message: "Block created", payload: blockObj });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
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
blockApp.put('/block/:blockId',
  upload.single("blockImage"), 
  expressAsyncHandler(async(req,res)=>{
    console.log("Body:", req.body);
    try {
      const modifiedBlock = req.body;
        
      // If new file uploaded → overwrite path
      if (req.file) {
        modifiedBlock.blockImage = `/uploads/${req.file.filename}`;
      }

      modifiedBlock.updatedOn = new Date();

      console.log("Modified Block Data:", modifiedBlock);

      const latestBlock = await Block.findOneAndUpdate(
        { blockId: Number(req.params.blockId) },
        { ...modifiedBlock },
        { new: true, runValidators: true }
      );

      console.log("Latest block after update:", latestBlock);
      if (!latestBlock) {
        return res.status(404).send({ message: "Block not found" });
      }

      res.status(200).send({ message: "Block updated", payload: latestBlock });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
}));
// Delete a block by blockId
blockApp.delete('/block/:blockId',expressAsyncHandler(async(req,res)=>{
    const deletedBlock=await Block.findOneAndDelete({blockId:req.params.blockId});
    if(!deletedBlock) return res.status(404).send({message:'Block not found'});
    res.status(200).send({message:'Block deleted successfully'});
}));
module.exports=blockApp;