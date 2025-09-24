const exp=require('express')
const menuApp= exp.Router();
const Menu=require('../models/menuModel');
const expressAsyncHandler=require('express-async-handler');
const adminAuth = require("../Middleware/adminAuthMiddleware");

// Create a new menu
menuApp.post('/menu',adminAuth, expressAsyncHandler(async (req, res) => {
    const newMenu = new Menu(req.body);
    const menuObj = await newMenu.save();
    res.status(201).send({ message: 'Menu created', payload: menuObj });
}));

// Get all menus
menuApp.get('/menus',adminAuth, expressAsyncHandler(async (req, res) => { 
    const menus = await Menu.find();
    res.status(200).send({ message: 'Menus list', payload: menus });
}));
menuApp.get('/users/menus', expressAsyncHandler(async (req, res) => { 
    const menus = await Menu.find();
    res.status(200).send({ message: 'Menus list', payload: menus });
}));
// Get a single menu by menuId
menuApp.get('/menu/:menuId',adminAuth, expressAsyncHandler(async (req, res) => {
    const menu = await Menu.findOne({ menuId: req.params.menuId });
    if (!menu) return res.status(404).send({ message: 'Menu not found' });
    res.status(200).send({ message: 'Menu found', payload: menu });
}
));
// Edit a menu by menuId
// Reorder menus in bulk
menuApp.put(
  "/menus/reorder",
  adminAuth,
  expressAsyncHandler(async (req, res) => {
    // req.body should be an array of { menuId, menuParent, menuOrder }
    const updates = req.body;
    console.log("here");
    const bulk = updates.map(u => ({
      updateOne: {
        filter: { menuId: u.menuId },
        update: {
          menuParent: u.menuParent,
          menuOrder: u.menuOrder,
          updatedOn: new Date()
        }
      }
    }));
    await Menu.bulkWrite(bulk);
    res.status(200).send({ message: "Menu order updated" });
  })
);

// Delete a menu by menuId
menuApp.delete('/menu/:menuId',adminAuth, expressAsyncHandler(async (req, res) =>
    {
        const deletedMenu = await Menu
        .findOneAndDelete({ menuId: req.params.menuId });
        if (!deletedMenu) return res.status(404).send({ message: 'Menu not found' });
        res.status(200).send({ message: 'Menu deleted successfully' });   
    }
));
module.exports=menuApp;
