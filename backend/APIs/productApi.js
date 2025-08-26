const exp=require('express')
const pageApp= exp.Router();
const Page=require('../models/pageModel');
const expressAsyncHandler=require('express-async-handler');

// Create a new page
pageApp.post('/page', expressAsyncHandler(async (req, res) => {
    const newPage = new Page(req.body);
    const pageObj = await newPage.save();
    res.status(201).send({ message: 'Page created', payload: pageObj });
}
));
// Get all pages
pageApp.get('/pages', expressAsyncHandler(async (req, res) => { 
    const pages = await Page.find();
    res.status(200).send({ message: 'Pages list', payload: pages });
}));
// Get a single page by pageId
pageApp.get('/page/:pageId', expressAsyncHandler(async (req, res) => {
    const page = await Page.findOne({ pageId: req.params.pageId });
    if (!page) return res.status(404).send({ message: 'Page not found' });
    res.status(200).send({ message: 'Page found', payload: page });
}
));
// Edit a page by pageId
pageApp.put('/page/:pageId', expressAsyncHandler(async (req, res) =>
{
    const modifiedPage = req.body;
    const latestPage = await Page.findOneAndUpdate(
        { pageId: req.params.pageId },
        { ...modifiedPage },
        { new: true, runValidators: true }
    );
    if (!latestPage) return res.status(404).send({ message: 'Page not found' });
    res.status(200).send({ message: 'Page updated', payload: latestPage });
}
));
// Delete a page by pageId
pageApp.delete('/page/:pageId', expressAsyncHandler(async (req, res) =>
    {
        const deletedPage = await Page
        .findOneAndDelete({ pageId: req.params.pageId });
        if (!deletedPage) return res.status(404).send({ message: 'Page not found' });
        res.status(200).send({ message: 'Page deleted successfully' });   
    }
));
module.exports=pageApp;
