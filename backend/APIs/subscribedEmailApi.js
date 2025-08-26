const exp=require('express');
const subscribedEmailApp= exp.Router();
const SubscribedEmail=require('../models/subscribedEmailModel');
const expressAsyncHandler=require('express-async-handler');
// Create a new subscribed email
subscribedEmailApp.post('/subscribedEmail', expressAsyncHandler(async (req, res) => {
    const newSubscribedEmail = new SubscribedEmail(req.body);
    const subscribedEmailObj = await newSubscribedEmail.save();
    res.status(201).send({ message: 'Subscribed Email created', payload: subscribedEmailObj });
}));
// Get all subscribed emails
subscribedEmailApp.get('/subscribedEmails', expressAsyncHandler(async (req, res)=>
    {
        const subscribedEmails = await SubscribedEmail.find();
        res.status(200).send({ message: 'Subscribed Emails list', payload: subscribedEmails });
    }
));
// Get a single subscribed email by emailId
subscribedEmailApp.get('/subscribedEmail/:emailId', expressAsyncHandler(async (req
, res) => {
    const subscribedEmail = await SubscribedEmail.findOne({ emailId: req.params.emailId });
    if (!subscribedEmail) return res.status(404).send({ message: 'Subscribed Email not found' });
    res.status(200).send({ message: 'Subscribed Email found', payload: subscribedEmail });
}
));
// Edit a subscribed email by emailId
subscribedEmailApp.put('/subscribedEmail/:emailId', expressAsyncHandler(async (req
, res) => {
    const modifiedSubscribedEmail = req.body;
    const latestSubscribedEmail = await SubscribedEmail.findOneAndUpdate(
        { emailId: req.params.emailId },
        { ...modifiedSubscribedEmail },
        { new: true, runValidators: true }
    );
    if (!latestSubscribedEmail) return res.status(404).send({ message: 'Subscribed Email not found' });
    res.status(200).send({ message: 'Subscribed Email updated', payload: latestSubscribedEmail });
}
));
// Delete a subscribed email by emailId
subscribedEmailApp.delete('/subscribedEmail/:emailId', expressAsyncHandler(async (req
, res) =>
    {
        const deletedSubscribedEmail = await SubscribedEmail
        .findOneAndDelete({ emailId: req.params.emailId });
        if (!deletedSubscribedEmail) return res.status(404).send({ message: 'Subscribed Email not found' });
        res.status(200).send({ message: 'Subscribed Email deleted successfully' });   
    }
));
module.exports=subscribedEmailApp;