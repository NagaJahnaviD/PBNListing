const exp=require('express')
const menuApp= exp.Router();
const Menu=require('../models/menuModel');
const expressAsyncHandler=require('express-async-handler');

// Create a new menu
menuApp.post('/menu', expressAsyncHandler(async (req, res) => {
    const newMenu = new Menu(req.body);
    const menuObj = await newMenu.save();
    res.status(201).send({ message: 'Menu created', payload: menuObj });
}));

// Get all menus
menuApp.get('/menus', expressAsyncHandler(async (req, res) => { 
    const menus = await Menu.find();
    res.status(200).send({ message: 'Menus list', payload: menus });
}));
// Get a single menu by menuId
menuApp.get('/menu/:menuId', expressAsyncHandler(async (req, res) => {
    const menu = await Menu.findOne({ menuId: req.params.menuId });
    if (!menu) return res.status(404).send({ message: 'Menu not found' });
    res.status(200).send({ message: 'Menu found', payload: menu });
}
));
// Edit a menu by menuId
menuApp.put('/menu/:menuId', expressAsyncHandler(async (req, res) => {
    const modifiedMenu = req.body;
    const latestMenu = await Menu.findOneAndUpdate(
        { menuId: req.params.menuId },
        { ...modifiedMenu },
        { new: true, runValidators: true }
    );
    if (!latestMenu) return res.status(404).send({ message: 'Menu not found' });
    res.status(200).send({ message: 'Menu updated', payload: latestMenu });
}));
// Delete a menu by menuId
menuApp.delete('/menu/:menuId', expressAsyncHandler(async (req, res) =>
    {
        const deletedMenu = await Menu
        .findOneAndDelete({ menuId: req.params.menuId });
        if (!deletedMenu) return res.status(404).send({ message: 'Menu not found' });
        res.status(200).send({ message: 'Menu deleted successfully' });   
    }
));
module.exports=menuApp;
