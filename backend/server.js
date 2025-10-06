import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Product from './models/productModel.js';
import userRoutes from './routes/userRoutes.js'; // <-- IMPORT USER ROUTES

// Initial configuration
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json()); // Allows the server to accept JSON data in requests

// Connect to the database
connectDB();

// --- API Endpoints ---

app.get('/', (req, res) => {
    res.send('Leval 1 API is running...');
});

// Use the routes
app.use('/api/users', userRoutes); // <-- USE THE USER ROUTES

// --- Product Routes (will be moved later) ---

// GET all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET a single product by its ID
app.get('/api/products/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: 'Product not found (Invalid ID format)' });
        }
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found in database' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});

