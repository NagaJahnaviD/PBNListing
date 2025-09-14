const exp = require('express');
const clientApp = exp.Router();
const upload = require("../Middleware/uploads");
const adminAuth = require('../Middleware/adminAuthMiddleware');
const Client = require('../models/clientModel');
const expressAsyncHandler = require('express-async-handler');

// Create a new client
clientApp.post(
  '/client',
  adminAuth,
  upload.single("clientImage"),
  expressAsyncHandler(async (req, res) => {
    try {
      const clientData = req.body;

      // If file uploaded → save path
      if (req.file) {
        clientData.clientImage = `/uploads/${req.file.filename}`;
      }

      // 👇 add creator/updater info from token
      clientData.createdBy = req.admin.adminId;
      clientData.updatedBy = req.admin.adminId;
      clientData.createdOn = new Date();
      clientData.updatedOn = new Date();

      const newClient = new Client(clientData);
      const clientObj = await newClient.save();

      res.status(201).send({ message: "Client created", payload: clientObj });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  })
);

// Get all clients
clientApp.get(
  '/clients',
  adminAuth,
  expressAsyncHandler(async (req, res) => {
    const clients = await Client.find();
    res.status(200).send({ message: "Clients list", payload: clients });
  })
);

// Get a single client by clientId
clientApp.get(
  '/client/:clientId',
  adminAuth,
  expressAsyncHandler(async (req, res) => {
    const client = await Client.findOne({ clientId: req.params.clientId });
    if (!client) {
      return res.status(404).send({ message: "Client not found" });
    }
    res.status(200).send({ message: "Client found", payload: client });
  })
);

// Edit a client by clientId
clientApp.put(
  "/client/:clientId",
  adminAuth,
  upload.single("clientImage"),
  expressAsyncHandler(async (req, res) => {
    try {
      const updateFields = {
        clientTitle: req.body.clientTitle,
        clientDescription: req.body.clientDescription,
        clientLocation: req.body.clientLocation,
        clientUrl: req.body.clientUrl,
        status: req.body.status,
        updatedOn: new Date(),
        updatedBy: req.admin.adminId   // 👈 add updater info
      };

      // If new file uploaded → overwrite path
      if (req.file) {
        updateFields.clientImage = `/uploads/${req.file.filename}`;
      } else {
        // keep old image
        const existing = await Client.findOne({ clientId: req.params.clientId });
        if (existing?.clientImage) {
          updateFields.clientImage = existing.clientImage;
        }
      }
      console.log("mod client", updateFields);

      const latestClient = await Client.findOneAndUpdate(
        { clientId: req.params.clientId },
        updateFields,
        { new: true, runValidators: true }
      );

      if (!latestClient) {
        return res.status(404).send({ message: "Client not found" });
      }

      res.status(200).send({ message: "Client updated", payload: latestClient });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  })
);

// Delete a client by clientId
clientApp.delete(
  '/client/:clientId',
  adminAuth,
  expressAsyncHandler(async (req, res) => {
    const deletedClient = await Client.findOneAndDelete({ clientId: req.params.clientId });
    if (!deletedClient) {
      return res.status(404).send({ message: "Client not found" });
    }
    res.status(200).send({ message: "Client deleted successfully" });
  })
);

module.exports = clientApp;
