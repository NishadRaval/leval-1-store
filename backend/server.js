import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './config/db.js';

// Import Route Files
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware to allow cross-origin requests and parse JSON
app.use(cors());
app.use(express.json());

// --- API Endpoints ---
app.get('/', (req, res) => {
    res.send('Leval 1 API is running...');
});

// Use the route files
// Any request to /api/products will be handled by productRoutes
app.use('/api/products', productRoutes);
// Any request to /api/users will be handled by userRoutes
app.use('/api/users', userRoutes);


// --- Start the Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});