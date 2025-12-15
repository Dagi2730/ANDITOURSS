// backend/controllers/userController.js

import asyncHandler from 'express-async-handler'; // Used for simplified error handling
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js'; 

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400); // Bad request
        throw new Error('User already exists');
    }

    // Creates the user (password is automatically hashed by the pre('save') middleware in the model)
    const user = await User.create({
        name,
        email,
        password, 
        role: 'client', // Default role
    });

    if (user) {
        res.status(201).json({ // 201 Created
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            // Send JWT token back to client
            token: generateToken(user._id), 
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});


// @desc    Authenticate user & get token (Login)
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // Check if user exists AND if the password matches (using the matchPassword method from the model)
    if (user && (await user.matchPassword(password))) {
        res.json({ // 200 OK
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401); // Unauthorized
        throw new Error('Invalid email or password');
    }
});

export { registerUser, authUser };