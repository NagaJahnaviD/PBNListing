const exp = require('express');
const blogApp = exp.Router();
const Blog = require('../models/blogModel');
const expressAsyncHandler = require('express-async-handler');

// Create a new blog
blogApp.post('/blog', expressAsyncHandler(async (req, res) => {
    const newBlog = new Blog(req.body);
    const blogObj = await newBlog.save();
    res.status(201).send({ message: 'Blog created', payload: blogObj });
}));

// Edit a blog by blogId
blogApp.put('/blog', expressAsyncHandler(async (req, res) => {
    const { blogId, ...modifiedBlog } = req.body;
    if (!blogId) return res.status(400).send({ message: 'blogId is required' });
    const latestBlog = await Blog.findOneAndUpdate(
        { blogId },
        { ...modifiedBlog },
        { new: true, runValidators: true }
    );
    if (!latestBlog) return res.status(404).send({ message: 'Blog not found' });
    res.status(200).send({ message: 'Blog updated', payload: latestBlog });
}));

// Delete a blog by blogId
blogApp.delete('/blog', expressAsyncHandler(async (req, res) => {
    const { blogId } = req.body;
    if (!blogId) return res.status(400).send({ message: 'blogId is required' });
    const deletedBlog = await Blog.findOneAndDelete({ blogId });
    if (!deletedBlog) return res.status(404).send({ message: 'Blog not found' });
    res.status(200).send({ message: 'Blog deleted successfully' });
}));

// Get all blogs
blogApp.get('/blogs', expressAsyncHandler(async (req, res) => {
    const blogs = await Blog.find();
    res.status(200).send({ message: 'Blogs fetched successfully', payload: blogs });
}));

module.exports = blogApp;