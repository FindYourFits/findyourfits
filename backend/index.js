import express from 'express';
import mysql2 from 'mysql2';
import cors from "cors";
import axios from 'axios';
import { configDotenv } from 'dotenv';
import db from './server/db.js';  // Import the db connection from server.js


//put this in a .env file ('port' //put this in a .env file ('port)
 
const app = express();
const PORT = process.env.PORT || 8100;


app.get("/products", (req, res)=>{
    const q = "SELECT * FROM products"
    db.query(q, (err, data)=>{
        if (err) return res.json(err)
        return res.json(data)
    })
})

app.post("/cart", (req, res)=>{
    const q = " INSERT INTO cart_items (`cart_id`, `product_id`, `quantity`) VALUES (?)"
    const values=[1,1,1]
    db.query(q, [values], (err,data)=>{
        if (err) return res.json(err)
        return res.json(data)
    })
})

app.get('/', (req, res)=>{
    res.send('Hello world')
})

app.listen(PORT, ()=>{
    console.log(`Port: ${PORT} is running`);
});

