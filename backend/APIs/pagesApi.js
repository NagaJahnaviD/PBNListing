const exp = require("express");
const upload = require("../Middleware/uploads"); // Multer middleware
const pageApp = exp.Router();
const Page = require("../models/pageModel");
const expressAsyncHandler = require("express-async-handler");
const adminAuth = require("../Middleware/adminAuthMiddleware");

// -----------------------------
// Create a new page
// -----------------------------
pageApp.post(
  "/page",
  adminAuth,
  upload.fields([
    { name: "pageImage", maxCount: 1 },
    { name: "pageBanner", maxCount: 1 },
  ]),
  expressAsyncHandler(async (req, res) => {
    try {
      const pageData = req.body;

      // If files uploaded → save paths
      if (req.files?.pageImage) {
        pageData.pageImage = `/uploads/${req.files.pageImage[0].filename}`;
      }
      if (req.files?.pageBanner) {
        pageData.pageBanner = `/uploads/${req.files.pageBanner[0].filename}`;
      }

      // track creator
      pageData.createdBy = req.admin.adminId;
      pageData.createdOn = new Date();

      const newPage = new Page(pageData);
      const pageObj = await newPage.save();

      res.status(201).send({ message: "Page created", payload: pageObj });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  })
);

// -----------------------------
// Edit a page by pageId
// -----------------------------
pageApp.put(
  "/page/:pageId",
  adminAuth,
  upload.fields([
    { name: "pageImage", maxCount: 1 },
    { name: "pageBanner", maxCount: 1 },
  ]),
  expressAsyncHandler(async (req, res) => {
    try {
      const modifiedPage = { ...req.body };
      // If new files uploaded → overwrite paths
      if (req.files?.pageImage) {
        modifiedPage.pageImage = `/uploads/${req.files.pageImage[0].filename}`;
      }
      if (req.files?.pageBanner) {
        modifiedPage.pageBanner = `/uploads/${req.files.pageBanner[0].filename}`;
      }

      // audit info
      modifiedPage.updatedBy = req.admin.adminId;
      modifiedPage.updatedOn = new Date();

      const latestPage = await Page.findOneAndUpdate(
        { pageId: Number(req.params.pageId) },
        modifiedPage,
        { new: true, runValidators: true }
      );
      console.log("latestPage", latestPage);
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
// Get all pages
// -----------------------------
pageApp.get(
  "/pages",
  adminAuth,
  expressAsyncHandler(async (req, res) => {
    const pages = await Page.find();
    res.status(200).send({ message: "Pages list", payload: pages });
  })
);
pageApp.get(
  "/pages",
  expressAsyncHandler(async (req, res) => {
    const pages = await Page.find();
    res.status(200).send({ message: "Pages list", payload: pages });
  })
);
// -----------------------------
// Get a single page by pageUrl
// -----------------------------
pageApp.get(
  "/pages/:pageUrl",
  expressAsyncHandler(async (req, res) => {
    const page = await Page.findOne({ pageUrl: req.params.pageUrl, publishStatus: true });
    if (!page) {
      return res.status(404).send({ message: "Page not found" });
    }
    res.status(200).send({ message: "Page details", payload: page });
  })
);


module.exports = pageApp;
