import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

const sampleProducts = [
    {
        name: "Flame Edition",
        price: 1499,
        description: "Premium black cotton T-shirt with red flame design.",
        images: ["/images/red.jpg"],
        category: "T-Shirt",
        stock: 50,
        sizes: ["S", "M", "L", "XL"],
        inStock: true
    },
    {
        name: "Core Edition",
        price: 1299,
        description: "Classic black essential tee.",
        images: ["/images/blue.jpg"],
        category: "T-Shirt",
        stock: 100,
        sizes: ["S", "M", "L", "XL"],
        inStock: true
    },
    {
        name: "Glow Edition",
        price: 1599,
        description: "Glow in the dark special edition.",
        images: ["/images/white.jpg"],
        category: "T-Shirt",
        stock: 30,
        sizes: ["M", "L"],
        inStock: true
    },
    {
        name: "AI Edition",
        price: 1799,
        description: "Future-ready AI inspired design.",
        images: ["/images/navi.jpg"],
        category: "T-Shirt",
        stock: 25,
        sizes: ["L", "XL"],
        inStock: true
    }
];

const seedDB = async () => {
    try {
        await Product.deleteMany({});
        console.log('Cleared existing products');
        await Product.insertMany(sampleProducts);
        console.log('Sample products inserted!');

        // Seed Admin User
        const adminEmail = 'zenstee@gmail.com';
        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
            const adminUser = new User({
                email: adminEmail,
                password: 'password@123', // Will be hashed by pre-save hook
                isAdmin: true
            });
            await adminUser.save();
            console.log('Admin user created!');
        } else {
            console.log('Admin user already exists.');
        }

        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
