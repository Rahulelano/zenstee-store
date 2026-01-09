import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: [{
        type: String,
        required: true
    }], // Array of image URLs
    category: {
        type: String,
        default: 'T-Shirt'
    },
    stock: {
        type: Number,
        default: 0
    },
    sizes: [{
        type: String
    }], // Available sizes/age ranges
    inStock: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;
