const exp = require('express');
const bannerApp = exp.Router();
const Banner = require('../models/bannerModel');
const expressAsyncHandler = require('express-async-handler');

// Create a new banner
bannerApp.post('/banner', expressAsyncHandler(async (req, res) => {
    const newBanner = new Banner(req.body);
    const bannerObj = await newBanner.save();
    res.status(201).send({ message: 'Banner created', payload: bannerObj });
}));

// Get all banners
bannerApp.get('/banners', expressAsyncHandler(async (req, res) => {
    const banners = await Banner.find();
    res.status(200).send({ message: 'Banners list', payload: banners });
}));

// Get a single banner by bannerId
bannerApp.get('/banner/:bannerId', expressAsyncHandler(async (req, res) => {
    const banner = await Banner.findOne({ bannerId: req.params.bannerId });
    if (!banner) return res.status(404).send({ message: 'Banner not found' });
    res.status(200).send({ message: 'Banner found', payload: banner });
}));

// Edit a banner by bannerId
bannerApp.put('/banner/:bannerId', expressAsyncHandler(async (req, res) => {
    const modifiedBanner = req.body;
    const latestBanner = await Banner.findOneAndUpdate(
        { bannerId: req.params.bannerId },
        { ...modifiedBanner },
        { new: true, runValidators: true }
    );
    if (!latestBanner) return res.status(404).send({ message: 'Banner not found' });
    res.status(200).send({ message: 'Banner updated', payload: latestBanner });
}));

// Delete a banner by bannerId
bannerApp.delete('/banner/:bannerId', expressAsyncHandler(async (req, res) => {
    const deletedBanner = await Banner.findOneAndDelete({ bannerId: req.params.bannerId });
    if (!deletedBanner) return res.status(404).send({ message: 'Banner not found' });
    res.status(200).send({ message: 'Banner deleted successfully' });
}));

module.exports = bannerApp;