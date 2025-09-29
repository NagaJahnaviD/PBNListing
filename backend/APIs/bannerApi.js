const exp = require("express");
const bannerApp = exp.Router();
const upload = require("../Middleware/uploads");
const adminAuth = require("../Middleware/adminAuthMiddleware");
const Banner = require("../models/bannerModel");
const expressAsyncHandler = require("express-async-handler");

// Create a new banner
bannerApp.post(
  "/",
  adminAuth,
  upload.single("bannerImage"),
  expressAsyncHandler(async (req, res) => {
    try {
      const bannerData = req.body;

      if (req.file) {
        bannerData.bannerImage = `/uploads/${req.file.filename}`;
      }

      // 👇 force creator info from token
      bannerData.createdBy = req.admin.adminId;
      bannerData.updatedBy = req.admin.adminId;
      bannerData.createdOn = new Date();
      bannerData.updatedOn = new Date();

      const newBanner = new Banner(bannerData);
      const bannerObj = await newBanner.save();

      res.status(201).send({ message: "Banner created", payload: bannerObj });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  })
);


// Get all banners
bannerApp.get(
  "/admin/banners",
  adminAuth,
  expressAsyncHandler(async (req, res) => {
    const banners = await Banner.find();
    res.status(200).send({ message: "Banners list", payload: banners });
  })
);

bannerApp.get(
  "/banners",
  expressAsyncHandler(async (req, res) => {
    const banners = await Banner.find();
    res.status(200).send({ message: "Banners list", payload: banners });
  })
);
// Get a single banner by bannerId
bannerApp.get(
  "/:bannerId",
  adminAuth,
  expressAsyncHandler(async (req, res) => {
    const banner = await Banner.findOne({ bannerId: req.params.bannerId });
    if (!banner) {
      return res.status(404).send({ message: "Banner not found" });
    }
    res.status(200).send({ message: "Banner found", payload: banner });
  })
);

// Edit a banner by bannerId
bannerApp.put(
  "/:bannerId",
  adminAuth,
  upload.single("bannerImage"),
  expressAsyncHandler(async (req, res) => {
    try {
      const modifiedBanner = { ...req.body };

      if (req.file) {
        modifiedBanner.bannerImage = `/uploads/${req.file.filename}`;
      }

      modifiedBanner.updatedBy = req.admin.adminId;
      modifiedBanner.updatedOn = new Date();

      const latestBanner = await Banner.findOneAndUpdate(
        { bannerId: req.params.bannerId },
        modifiedBanner,
        { new: true, runValidators: true }
      );

      if (!latestBanner) {
        return res.status(404).send({ message: "Banner not found" });
      }

      res.status(200).send({ message: "Banner updated", payload: latestBanner });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  })
);


// Delete a banner by bannerId
bannerApp.delete(
  "/:bannerId",
  adminAuth,
  expressAsyncHandler(async (req, res) => {
    const deletedBanner = await Banner.findOneAndDelete({
      bannerId: req.params.bannerId,
    });
    if (!deletedBanner) {
      return res.status(404).send({ message: "Banner not found" });
    }
    res.status(200).send({ message: "Banner deleted successfully" });
  })
);

module.exports = bannerApp;
