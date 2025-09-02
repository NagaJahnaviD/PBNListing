const exp = require("express");
const upload = require("../Middleware/uploads"); // Multer middleware
const pageApp = exp.Router();
const Page = require("../models/pageModel");
const expressAsyncHandler = require("express-async-handler");

// -----------------------------
// Create a new page
// -----------------------------
pageApp.post(
  "/page",
  upload.single("pageImage"), // optional upload
  expressAsyncHandler(async (req, res) => {
    try {
      const pageData = req.body;

      // If file uploaded → save path
      if (req.file) {
        pageData.pageImage = `/uploads/${req.file.filename}`;
      }

      const newPage = new Page(pageData);
      const pageObj = await newPage.save();

      res.status(201).send({ message: "Page created", payload: pageObj });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  })
);

// -----------------------------
// Get all pages
// -----------------------------
pageApp.get(
  "/pages",
  expressAsyncHandler(async (req, res) => {
    console.log("Fetching all pages");
    const pages = await Page.find();
    console.log(pages);
    res.status(200).send({ message: "Pages list", payload: pages });
  })
);

// -----------------------------
// Get a single page by pageId
// -----------------------------
pageApp.get(
  "/page/:pageId",
  expressAsyncHandler(async (req, res) => {
    const page = await Page.findOne({ pageId: req.params.pageId });
    if (!page) {
      return res.status(404).send({ message: "Page not found" });
    }
    res.status(200).send({ message: "Page found", payload: page });
  })
);

// -----------------------------
// Edit a page by pageId
// -----------------------------
pageApp.put(
  "/page/:pageId",
  upload.single("pageImage"), 
  expressAsyncHandler(async (req, res) => {
    console.log("Body:", req.body);
    try {
      const modifiedPage = req.body;
        
      // If new file uploaded → overwrite path
      if (req.file) {
        modifiedPage.pageImage = `/uploads/${req.file.filename}`;
      }

      modifiedPage.updatedOn = new Date();

      console.log("Modified Page Data:", modifiedPage);

      const latestPage = await Page.findOneAndUpdate(
        { pageId: Number(req.params.pageId) },
        { ...modifiedPage },
        { new: true, runValidators: true }
      );

      console.log("Latest Page after update:", latestPage);
      if (!latestPage) {
        return res.status(404).send({ message: "Page not found" });
      }

      res.status(200).send({ message: "Page updated", payload: latestPage });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  })
);

// -----------------------------
// Delete a page by pageId
// -----------------------------
pageApp.delete(
  "/page/:pageId",
  expressAsyncHandler(async (req, res) => {
    const deletedPage = await Page.findOneAndDelete({
      pageId: req.params.pageId,
    });

    if (!deletedPage) {
      return res.status(404).send({ message: "Page not found" });
    }
    res.status(200).send({ message: "Page deleted successfully" });
  })
);

module.exports = pageApp;
