const exp = require('express');
const upload = require("../Middleware/uploads"); 
const listingApp = exp.Router();
const adminAuth = require('../Middleware/adminAuthMiddleware');
const Listing = require('../models/listingModel');
const expressAsyncHandler = require('express-async-handler'); 

// Create a new listing
listingApp.post(
  '/listing',
  adminAuth,
  upload.single("listingImage"), // optional image field
  expressAsyncHandler(async (req, res) => {
    try {
      const listingData = req.body;

      // If file uploaded → save path
      if (req.file) {
        listingData.listingImage = `/uploads/${req.file.filename}`;
      }

      // 👇 add creator/updater info from token
      listingData.createdBy = req.admin.adminId;
      listingData.updatedBy = req.admin.adminId;
      listingData.createdOn = new Date();
      listingData.updatedOn = new Date();

      const newListing = new Listing(listingData);
      const listingObj = await newListing.save();

      res.status(201).send({ message: "Listing created", payload: listingObj });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  })
);

// Get all listings
listingApp.get(
  '/listings',
  adminAuth,
  expressAsyncHandler(async (req, res) => {
    const listings = await Listing.find();
    res.status(200).send({ message: 'Listings list', payload: listings });
  })
);

listingApp.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const listings = await Listing.find();
    res.status(200).send({ message: 'Listings list', payload: listings });
  })
);

// Edit a listing by listingId
listingApp.put(
  '/listing/:listingId',
  adminAuth,
  upload.single("listingImage"), // optional image field
  expressAsyncHandler(async (req, res) => {
    try {
      const modifiedListing = req.body;

      // If new file uploaded → overwrite path
      if (req.file) {
        modifiedListing.listingImage = `/uploads/${req.file.filename}`;
      }

      // 👇 add updater info
      modifiedListing.updatedBy = req.admin.adminId;
      modifiedListing.updatedOn = new Date();

      const latestListing = await Listing.findOneAndUpdate(
        { listingId: Number(req.params.listingId) },
        { ...modifiedListing },
        { new: true, runValidators: true }
      );

      if (!latestListing) {
        return res.status(404).send({ message: "Listing not found" });
      }

      res.status(200).send({ message: "Listing updated", payload: latestListing });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  })
);

module.exports = listingApp;
