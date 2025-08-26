const exp=require('express');
const configurationApp= exp.Router();   
const Configuration=require('../models/configurationModel');
const expressAsyncHandler=require('express-async-handler');

// Create a new configuration
configurationApp.post('/configuration', expressAsyncHandler(async (req, res) => {
    const newConfiguration = new Configuration(req.body);
    const configurationObj = await newConfiguration.save();
    res.status(201).send({ message: 'Configuration created', payload: configurationObj });
}));

// Get all configurations
configurationApp.get('/configurations', expressAsyncHandler(async (req, res) => { 
    const configurations = await Configuration.find();
    res.status(200).send({ message: 'Configurations list', payload: configurations });
}));

// Get a single configuration by configId
configurationApp.get('/configuration/:configId', expressAsyncHandler(async (req, res) =>        
{
    const configuration = await Configuration.findOne({ configId: req.params.configId });
    if (!configuration) return res.status(404).send({ message: 'Configuration not found' });
    res.status(200).send({ message: 'Configuration found', payload: configuration });     
}));
// Edit a configuration by configId    
configurationApp.put('/configuration/:configId', expressAsyncHandler(async (req, res) =>    
{
    const modifiedConfiguration = req.body;
    const latestConfiguration = await Configuration.findOneAndUpdate(
        { configId: req.params.configId },
        { ...modifiedConfiguration },
        { new: true, runValidators: true }
    );
    if (!latestConfiguration) return res.status(404).send({ message: 'Configuration not found' });
    res.status(200).send({ message: 'Configuration updated', payload: latestConfiguration });
}
));
// Delete a configuration by configId
configurationApp.delete('/configuration/:configId', expressAsyncHandler(async (req, res) =>    
    {
        const deletedConfiguration = await Configuration
        .findOneAndDelete({ configId: req.params.configId });
        if (!deletedConfiguration) return res.status(404).send({ message: 'Configuration not found' });
        res.status(200).send({ message: 'Configuration deleted successfully' });   
    }   
));

//get latest configuration
configurationApp.get('/latest-configuration', expressAsyncHandler(async (req, res) => {
    const latestConfiguration = await Configuration.findOne().sort({ createdAt: -1 });
    if (!latestConfiguration) return res.status(404).send({ message: 'No configuration found' });
    res.status(200).send({ message: 'Latest configuration', payload: latestConfiguration });
}));
module.exports=configurationApp;