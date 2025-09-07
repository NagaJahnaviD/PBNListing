const exp= require('express');
const currentOpeningsApp= exp.Router();
const CurrentOpening=require('../models/currentOpeningsModel');
const expressAsyncHandler=require('express-async-handler');
const adminAuth=require('../Middleware/adminAuthMiddleware');
// Create a new current opening
currentOpeningsApp.post('/currentOpening', expressAsyncHandler(async (req, res) =>
{
    const newCurrentOpening = new CurrentOpening(req.body);
    const currentOpeningObj = await newCurrentOpening.save();
    res.status(201).send({ message: 'Current Opening created', payload: currentOpeningObj });
}
));
// Get all current openings
currentOpeningsApp.get('/currentOpenings', expressAsyncHandler(async (req, res) => 
{ 
    const currentOpenings = await CurrentOpening.find();
    res.status(200).send({ message: 'Current Openings list', payload: currentOpenings });
}
));
// Get a single current opening by openingId
currentOpeningsApp.get('/currentOpening/:openingId', expressAsyncHandler(async (req,
    res) => 
    {
        const currentOpening = await CurrentOpening.findOne({ openingId: req.params.openingId });
        if (!currentOpening) return res.status(404).send({ message: 'Current Opening not found' });
        res.status(200).send({ message: 'Current Opening found', payload: currentOpening });
    }
));
// Edit a current opening by openingId
currentOpeningsApp.put('/currentOpening/:openingId', expressAsyncHandler(async (req, res) => {
    const modifiedCurrentOpening = req.body;
    const latestCurrentOpening = await CurrentOpening.findOneAndUpdate(
        { openingId: req.params.openingId },
        { ...modifiedCurrentOpening },
        { new: true, runValidators: true }
    );
    if (!latestCurrentOpening) return res.status(404).send({ message: 'Current Opening not found' });
    res.status(200).send({ message: 'Current Opening updated', payload: latestCurrentOpening });
}));
// Delete a current opening by openingId
currentOpeningsApp.delete('/currentOpening/:openingId', expressAsyncHandler(async (req, res) =>
    {
        const deletedCurrentOpening = await CurrentOpening
        .findOneAndDelete({ openingId: req.params.openingId });
        if (!deletedCurrentOpening) return res.status(404).send({ message: 'Current Opening not found' });
        res.status(200).send({ message: 'Current Opening deleted successfully' });   
    }
));
module.exports=currentOpeningsApp;