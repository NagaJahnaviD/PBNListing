const exp = require('express');
const upload = require("../Middleware/uploads"); 
const blockApp = exp.Router();
const adminAuth = require('../Middleware/adminAuthMiddleware');
const Block = require('../models/blockModel');
const expressAsyncHandler = require('express-async-handler'); 

// Create a new block
blockApp.post(
  '/block',
  adminAuth,
  upload.single("blockImage"),
  expressAsyncHandler(async (req, res) => {
    try {
      
      const blockData = req.body;
      // If file uploaded → save path
      if (req.file) {
        blockData.blockImage = `/uploads/${req.file.filename}`;
      }

      // 👇 add creator/updater info from token
      blockData.createdBy = req.admin.adminId;
      blockData.updatedBy = req.admin.adminId;
      blockData.createdOn = new Date();
      blockData.updatedOn = new Date();

      const newBlock = new Block(blockData);
      const blockObj = await newBlock.save();

      res.status(201).send({ message: "Block created", payload: blockObj });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  })
);

// Get all blocks       
blockApp.get(
  '/blocks',
  adminAuth,
  expressAsyncHandler(async (req, res) => {
    const blocks = await Block.find();
    res.status(200).send({ message: 'Blocks list', payload: blocks });
  })
);

blockApp.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const blocks = await Block.find();
    res.status(200).send({ message: 'Blocks list', payload: blocks });
  })
);

// Edit a block by blockId
blockApp.put(
  '/block/:blockId',
  adminAuth,
  upload.single("blockImage"), 
  expressAsyncHandler(async (req, res) => {
    try {
      const modifiedBlock = req.body;

      // If new file uploaded → overwrite path
      if (req.file) {
        modifiedBlock.blockImage = `/uploads/${req.file.filename}`;
      }

      // 👇 add updater info
      modifiedBlock.updatedBy = req.admin.adminId;
      modifiedBlock.updatedOn = new Date();

      const latestBlock = await Block.findOneAndUpdate(
        { blockId: Number(req.params.blockId) },
        { ...modifiedBlock },
        { new: true, runValidators: true }
      );

      if (!latestBlock) {
        return res.status(404).send({ message: "Block not found" });
      }

      res.status(200).send({ message: "Block updated", payload: latestBlock });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  })
);

module.exports = blockApp;
