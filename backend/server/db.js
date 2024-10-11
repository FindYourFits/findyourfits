import mysql2 from 'mysql2'
import { configDotenv } from 'dotenv';

const db = mysql2.createConnection({
    host: process.env.DB_HOST || "localhost",  // Make sure you have these in your .env file
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "1234",
    database: process.env.DB_NAME || "ecommerce"
})


db.connect((err)=>{
    if (err){
        console.log('Error connecting to the database', err);
    }
    else{
        console.log('Connected to Database')
    }
})

export default db;
