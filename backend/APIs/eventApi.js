const exp= require('express');
const eventApp= exp.Router();
const Event=require('../models/eventModel');
const expressAsyncHandler=require('express-async-handler');

// Create a new event
eventApp.post('/event', expressAsyncHandler(async (req, res) => {
    const newEvent = new Event(req.body);
    const eventObj = await newEvent.save();
    res.status(201).send({ message: 'Event created', payload: eventObj });
}
));
// Get all events
eventApp.get('/events', expressAsyncHandler(async (req, res) => { 
    const events = await Event.find();
    res.status(200).send({ message: 'Events list', payload: events });
}));
// Get a single event by eventId
eventApp.get('/event/:eventId', expressAsyncHandler(async (req, res) => {
    const event = await Event.findOne({ eventId: req.params.eventId });
    if (!event) return res.status(404).send({ message: 'Event not found' });
    res.status(200).send({ message: 'Event found', payload: event });
}
));
// Edit an event by eventId
eventApp.put('/event/:eventId', expressAsyncHandler(async (req, res) => {
    const modifiedEvent = req.body;
    const latestEvent = await Event.findOneAndUpdate(
        { eventId: req.params.eventId },
        { ...modifiedEvent },
        { new: true, runValidators: true }
    );
    if (!latestEvent) return res.status(404).send({ message: 'Event not found' });
    res.status(200).send({ message: 'Event updated', payload: latestEvent });
}));
// Delete an event by eventId
eventApp.delete('/event/:eventId', expressAsyncHandler(async (req, res) =>
    {
        const deletedEvent = await Event
        .findOneAndDelete({ eventId: req.params.eventId });
        if (!deletedEvent) return res.status(404).send({ message: 'Event not found' });
        res.status(200).send({ message: 'Event deleted successfully' });   
    }
));
module.exports=eventApp;