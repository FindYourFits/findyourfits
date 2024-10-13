import express from 'express';
import mysql2 from 'mysql2';
import cors from "cors";
import axios from 'axios';
import { configDotenv } from 'dotenv';
import db from './server/db.js';  // Import the db connection from server.js


//put this in a .env file ('port' //put this in a .env file ('port)
configDotenv();
const app = express();
app.use(express.json());  // This allows express to parse JSON bodies

//Setting Port
const PORT = process.env.PORT || 8100;


app.get("/products", (req, res)=>{
    const q = "SELECT * FROM products"
    db.query(q, (err, data)=>{
        if (err) return res.json(err)
        return res.json(data)
    })
})

// app.get('/cart', (req, res)=>{
//     res.send('Hello world')
//     console.log('hi')
// })

app.post("/cart", (req, res)=>{

    const {product_id, quantity} = req.body

    if (!product_id || !quantity){
        return res.status(404).json({message: `All fields must be completed`})
    }

    const q = " INSERT INTO cart_items (`cart_id`, `product_id`, `quantity`) VALUES (?)"
    const values=[1,product_id,quantity]
    db.query(q, [values], (err,data)=>{
        if (err) return res.json(err)
        return res.json(data)
    })
})



app.listen(PORT, ()=>{
    console.log(`Port: ${PORT} is running`);
});

