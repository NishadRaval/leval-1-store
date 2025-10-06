import express from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

const router = express.Router();

// @desc    Register a new user
// @route   POST /api/users/register
router.post('/register', asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({ name, email, password });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
}));

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find the user by their email
    const user = await User.findOne({ email });

    // Check if the user exists AND if the password matches
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401); // 401 means Unauthorized
        throw new Error('Invalid email or password');
    }
}));

export default router;