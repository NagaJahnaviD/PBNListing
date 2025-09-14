const exp = require("express");
const blogApp = exp.Router();
const adminAuth = require("../Middleware/adminAuthMiddleware");
const upload = require("../Middleware/uploads"); // Multer middleware
const Blog = require("../models/blogModel");
const expressAsyncHandler = require("express-async-handler");

// -----------------------------
// Create a new blog
// -----------------------------
blogApp.post(
  "/blog",
  adminAuth,
  upload.fields([
    { name: "blogImage", maxCount: 1 },
    { name: "blogBanner", maxCount: 1 },
  ]),
  expressAsyncHandler(async (req, res) => {
    try {
      const blogData = req.body;

      // If files uploaded → save paths
      if (req.files?.blogImage) {
        blogData.blogImage = `/uploads/${req.files.blogImage[0].filename}`;
      }
      if (req.files?.blogBanner) {
        blogData.blogBanner = `/uploads/${req.files.blogBanner[0].filename}`;
      }

      // track creator & audit info
      blogData.createdBy = req.admin.adminId;
      blogData.updatedBy = req.admin.adminId;
      blogData.createdOn = new Date();
      blogData.updatedOn = new Date();

      const newBlog = new Blog(blogData);
      const blogObj = await newBlog.save();

      res.status(201).send({ message: "Blog created", payload: blogObj });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  })
);

// -----------------------------
// Edit a blog by blogId
// -----------------------------
blogApp.put(
  "/blog/:blogId",
  adminAuth,
  upload.fields([
    { name: "blogImage", maxCount: 1 },
    { name: "blogBanner", maxCount: 1 },
  ]),
  expressAsyncHandler(async (req, res) => {
    try {
      const modifiedBlog = { ...req.body };

      // If new files uploaded → overwrite paths
      if (req.files?.blogImage) {
        modifiedBlog.blogImage = `/uploads/${req.files.blogImage[0].filename}`;
      }
      if (req.files?.blogBanner) {
        modifiedBlog.blogBanner = `/uploads/${req.files.blogBanner[0].filename}`;
      }

      // audit info
      modifiedBlog.updatedBy = req.admin.adminId;
      modifiedBlog.updatedOn = new Date();

      const latestBlog = await Blog.findOneAndUpdate(
        { blogId: Number(req.params.blogId) },
        modifiedBlog,
        { new: true, runValidators: true }
      );

      if (!latestBlog) {
        return res.status(404).send({ message: "Blog not found" });
      }

      res.status(200).send({ message: "Blog updated", payload: latestBlog });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  })
);

// -----------------------------
// Get all blogs
// -----------------------------
blogApp.get(
  "/blogs",
  adminAuth,
  expressAsyncHandler(async (req, res) => {
    const blogs = await Blog.find();
    res.status(200).send({ message: "Blogs fetched successfully", payload: blogs });
  })
);

module.exports = blogApp;
