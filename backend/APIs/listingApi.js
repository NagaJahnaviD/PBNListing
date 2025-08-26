const exp=require('express')
const listingApp= exp.Router();
const Listing=require('../models/listingModel');
const expressAsyncHandler=require('express-async-handler');

// Create a new listing
listingApp.post('/listing', expressAsyncHandler(async (req, res) => {
    const newListing = new Listing(req.body);
    const listingObj = await newListing.save();
    res.status(201).send({ message: 'Listing created', payload: listingObj });
}));
// Get all listings
listingApp.get('/listings', expressAsyncHandler(async (req, res) => { 
    const listings = await Listing.find();
    res.status(200).send({ message: 'Listings list', payload: listings });
}));
// Get a single listing by listingId
listingApp.get('/listing/:listingId', expressAsyncHandler(async (req, res) => {
    const listing = await Listing.findOne({ listingId: req.params.listingId });
    if (!listing) return res.status(404).send({ message: 'Listing not found' });
    res.status(200).send({ message: 'Listing found', payload: listing });
}));
// Edit a listing by listingId
listingApp.put('/listing/:listingId', expressAsyncHandler(async (req, res) =>
{
    const modifiedListing = req.body;
    const latestListing = await Listing.findOneAndUpdate(
        { listingId: req.params.listingId },
        { ...modifiedListing },
        { new: true, runValidators: true }
    );
    if (!latestListing) return res.status(404).send({ message: 'Listing not found' });
    res.status(200).send({ message: 'Listing updated', payload: latestListing });
}));
// Delete a listing by listingId
listingApp.delete('/listing/:listingId', expressAsyncHandler(async (req, res) =>
    {
        const deletedListing = await Listing
        .findOneAndDelete({ listingId: req.params.listingId });
        if (!deletedListing) return res.status(404).send({ message: 'Listing not found' });
        res.status(200).send({ message: 'Listing deleted successfully' });   
    }
));
module.exports=listingApp;
