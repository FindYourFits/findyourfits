import express from 'express';
import mysql2 from 'mysql2';
import cors from "cors";
import axios from 'axios';
import { configDotenv } from 'dotenv';
import db from './server/db.js';

configDotenv();
const app = express();
app.use(express.json());  // Allows express to parse JSON bodies
app.use(cors());

// Apply CORS middleware to allow requests from your frontend
app.use(cors({
    origin: 'http://127.0.0.1:5500',  // Replace with your frontend URL
    methods: ['GET', 'POST'],
    credentials: true  // If you need to pass cookies or credentials
}));

// Serve static files from the 'frontend' directory
app.use(express.static('frontend'));

const PORT = process.env.PORT || 8100;

// Get all products
app.get("/products", (req, res) => {
    const q = "SELECT * FROM products";
    db.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// Get a specific product by its ID
app.get("/products/:id", (req, res) => {
    const id = req.params.id;
    const q = "SELECT * FROM products WHERE product_id = ?";
    db.query(q, [id], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ message: 'Product not found' });
        return res.json(data[0]);
    });
});

// Add a product to the cart
app.post("/cart", (req, res) => {
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
        return res.status(404).json({ message: `All fields must be completed` });
    }

    const q = "INSERT INTO cart_items (`cart_id`, `product_id`, `quantity`) VALUES (?)";
    const values = [1, product_id, quantity];
    db.query(q, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.listen(PORT, () => {
    console.log(`Port: ${PORT} is running`);
});
