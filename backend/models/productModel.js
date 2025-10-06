import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    new: {
        type: Boolean,
        required: true,
        default: false
    },
    images: {
        type: [String],
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Automatically adds 'createdAt' and 'updatedAt' fields
});

const Product = mongoose.model('Product', productSchema);

export default Product;