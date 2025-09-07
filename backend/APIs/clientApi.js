const exp= require('express');
const clientApp= exp.Router();
const adminAuth=require('../Middleware/adminAuthMiddleware');
const Client=require('../models/clientModel');
const expressAsyncHandler=require('express-async-handler');
// Create a new client
clientApp.post('/client', adminAuth,expressAsyncHandler(async (req, res) => {
    const newClient = new Client(req.body);
    const clientObj = await newClient.save();
    res.status(201).send({ message: 'Client created', payload: clientObj });
}));
// Get all clients
clientApp.get('/clients',adminAuth, expressAsyncHandler(async (req, res) => { 
    const clients = await Client.find();
    res.status(200).send({ message: 'Clients list', payload: clients });
}
));
// Get a single client by clientId
clientApp.get('/client/:clientId',adminAuth, expressAsyncHandler(async (req, res) => {
    const client = await Client.findOne({ clientId: req.params.clientId });
    if (!client) return res.status(404).send({ message: 'Client not found' });
    res.status(200).send({ message: 'Client found', payload: client });
}));
// Edit a client by clientId
clientApp.put('/client/:clientId',adminAuth, expressAsyncHandler(async (req, res) => {
    const modifiedClient = req.body;
    const latestClient = await Client.findOneAndUpdate(
        { clientId: req.params.clientId },
        { ...modifiedClient },
        { new: true, runValidators: true }
    );
    if (!latestClient) return res.status(404).send({ message: 'Client not found' });
    res.status(200).send({ message: 'Client updated', payload: latestClient });
}));
// Delete a client by clientId
clientApp.delete('/client/:clientId',adminAuth, expressAsyncHandler(async (req, res) =>
    {
        const deletedClient = await Client
        .findOneAndDelete({ clientId: req.params.clientId });
        if (!deletedClient) return res.status(404).send({ message: 'Client not found' });
        res.status(200).send({ message: 'Client deleted successfully' });   
    }
));
module.exports=clientApp;
