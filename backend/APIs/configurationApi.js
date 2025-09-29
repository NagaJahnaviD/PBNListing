const exp = require('express');
const configurationApp = exp.Router();
const Configuration = require('../models/configurationModel');
const expressAsyncHandler = require('express-async-handler');
const upload = require('../Middleware/uploads');
const adminAuth = require('../Middleware/adminAuthMiddleware');

// Edit a configuration by configId    
configurationApp.put(
  '/configuration/:configId',
  adminAuth,
  upload.fields([
    { name: "headerLogo", maxCount: 1 },
    { name: "footerLogo", maxCount: 1 }
  ]),
  expressAsyncHandler(async (req, res) => {
    const modifiedConfiguration = {
      ...req.body,
      updatedBy: req.admin.adminId,
      updatedOn: new Date()
    };

    // Handle uploaded files
    if (req.files) {
      if (req.files.headerLogo && req.files.headerLogo[0]) {
        modifiedConfiguration.headerLogo = `/uploads/${req.files.headerLogo[0].filename}`;
      }
      if (req.files.footerLogo && req.files.footerLogo[0]) {
        modifiedConfiguration.footerLogo = `/uploads/${req.files.footerLogo[0].filename}`;
      }
    }

    const latestConfiguration = await Configuration.findOneAndUpdate(
      { configId: req.params.configId },
      modifiedConfiguration,
      { new: true, runValidators: true }
    );

    if (!latestConfiguration)
      return res.status(404).send({ message: 'Configuration not found' });

    console.log("Updated configuration:", latestConfiguration);
    res.status(200).send({
      message: 'Configuration updated',
      payload: latestConfiguration
    });
  })
);

// Get latest configuration
configurationApp.get(
  '/latest-configuration',
  adminAuth,
  expressAsyncHandler(async (req, res) => {
    const latestConfiguration = await Configuration.findOne().sort({ createdAt: -1 });
    if (!latestConfiguration)
      return res.status(404).send({ message: 'No configuration found' });

    res.status(200).send({
      message: 'Latest configuration',
      payload: latestConfiguration
    });
  })
);

// routes/configurationApp.js
configurationApp.get(
  '/latest-public',
  expressAsyncHandler(async (req, res) => {
    const latestConfiguration = await Configuration.findOne().sort({ createdOn: -1 });
    if (!latestConfiguration)
      return res.status(404).send({ message: 'No configuration found' });

    res.status(200).send({
      message: 'Latest configuration',
      payload: latestConfiguration
    });
  })
);


module.exports = configurationApp;
