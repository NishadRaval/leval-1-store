import mongoose from 'mongoose';
import dotenv from 'dotenv';
import products from './data/products.js';
import Product from './models/productModel.js';
import connectDB from './config/db.js';

dotenv.config();

// We need a separate connection for the script
const importData = async () => {
    await connectDB();
    try {
        // Clear existing products
        await Product.deleteMany();

        // Insert the new product data
        await Product.insertMany(products);

        console.log('✅ Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    await connectDB();
    try {
        await Product.deleteMany();

        console.log('✅ Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error}`);
        process.exit(1);
    }
};

// This allows us to run the script with commands from the terminal
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}

