const exp= require('express');
const userApp= exp.Router();
const User=require('../models/userModel');
const expressAsyncHandler=require('express-async-handler');

// Create a new user
userApp.post('/user', expressAsyncHandler(async (req, res) => {
    const newUser = new User(req.body);
    const userObj = await newUser.save();
    res.status(201).send({ message: 'User created', payload: userObj });
}));        
// Get all users
userApp.get('/users', expressAsyncHandler(async (req, res) => { 
    const users = await User.find();
    res.status(200).send({ message: 'Users list', payload: users });
}));
// Get a single user by userId
userApp.get('/user/:userId', expressAsyncHandler(async (req, res) =>    {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).send({ message: 'User not found' });
    res.status(200).send({ message: 'User found', payload: user });     
}));
// Edit a user by userId    
userApp.put('/user/:userId', expressAsyncHandler(async (req, res) => {
    const modifiedUser = req.body;
    const latestUser = await User.findOneAndUpdate(
        { userId: req.params.userId },
        { ...modifiedUser },
        { new: true, runValidators: true }
    );
    if (!latestUser) return res.status(404).send({ message: 'User not found' });
    res.status(200).send({ message: 'User updated', payload: latestUser });
}));
// Delete a user by userId
userApp.delete('/user/:userId', expressAsyncHandler(async (req, res) =>
    {
        const deletedUser = await User
        .findOneAndDelete({ userId: req.params.userId });
        if (!deletedUser) return res.status(404).send({ message: 'User not found' });
        res.status(200).send({ message: 'User deleted successfully' });   
    }   
));
module.exports=userApp;