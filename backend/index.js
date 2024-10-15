import express from 'express';
import cors from "cors";
import { configDotenv } from 'dotenv';
import db from './server/db.js';

configDotenv();
const app = express();
app.use(express.json()); // Allows express to parse JSON bodies


// Apply CORS middleware to allow requests from your frontend
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
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
        return res.status(404).json({ message: 'All fields must be completed' });
    }

    const q = "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)";
    db.query(q, [1, product_id, quantity], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "Item added to cart", data });
    });

});

// Update quantity of a product in the cart
app.put("/cart", (req, res) => {
    const { product_id, quantity } = req.body;

    if (!product_id || quantity === undefined) {
        return res.status(404).json({ message: "All fields must be completed" });
    }

    const q = "UPDATE cart_items SET quantity = ? WHERE product_id = ? AND cart_id = ?";
    db.query(q, [quantity, product_id, 1], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "Quantity updated", data });
    });
});

// Delete an item from the cart
app.delete("/cart/:product_id", (req, res) => {
    const { product_id } = req.params;

    const q = "DELETE FROM cart_items WHERE product_id = ? AND cart_id = ?";
    db.query(q, [product_id, 1], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "Item removed from cart", data });
    });
});

// Empty the cart
app.delete("/cart", (req, res) => {
    const q = "DELETE FROM cart_items WHERE cart_id = ?";
    db.query(q, [1], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "Cart emptied", data });
    });
});

// Fetch all cart items
// Fetch all cart items
app.get("/cart-items", (req, res) => {
    console.log("Received request for cart items"); // Debug log
    const q = `SELECT cart_items.product_id, cart_items.quantity, products.name, products.price 
               FROM cart_items
               JOIN products ON cart_items.product_id = products.product_id
               WHERE cart_items.cart_id = ?`;

    db.query(q, [1], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(200).json([]); // Return an empty array instead of 404

        return res.json(data);
    });
});



app.listen(PORT, () => {
    console.log(`Port: ${PORT} is running`);
});
