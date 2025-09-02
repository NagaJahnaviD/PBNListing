const exp=require('express');
const configurationApp= exp.Router();   
const Configuration=require('../models/configurationModel');
const expressAsyncHandler=require('express-async-handler');
const upload = require('../Middleware/uploads');

// Edit a configuration by configId    
configurationApp.put('/configuration/:configId',
  upload.fields([
    { name: "headerLogo", maxCount: 1 },
    { name: "footerLogo", maxCount: 1 }
  ]), expressAsyncHandler(async (req, res) =>    
{
    const modifiedConfiguration = req.body;
    const latestConfiguration = await Configuration.findOneAndUpdate(
        { configId: req.params.configId },
        { ...modifiedConfiguration },
        { new: true, runValidators: true }
    );
    if (!latestConfiguration) return res.status(404).send({ message: 'Configuration not found' });
    console.log("Updated configuration:", latestConfiguration);
    res.status(200).send({ message: 'Configuration updated', payload: latestConfiguration });
}
));


//get latest configuration
configurationApp.get('/latest-configuration', expressAsyncHandler(async (req, res) => {
    const latestConfiguration = await Configuration.findOne().sort({ createdAt: -1 });
    if (!latestConfiguration) return res.status(404).send({ message: 'No configuration found' });
    res.status(200).send({ message: 'Latest configuration', payload: latestConfiguration });
}));
module.exports=configurationApp;