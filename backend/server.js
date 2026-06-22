import express, { application } from 'express'; 
import cors from 'cors';
import { connectDB } from "./config/db.js";
import dotenv from 'dotenv';
import postRoutes from "./routes/post.route.js";
import accountRoutes from "./routes/account.route.js";
import itemRoutes from "./routes/item.route.js";
import orderRoutes from "./routes/order.route.js";
import path from 'path';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000

const __dirname = path.resolve();
app.use(express.json()); // allow JSON data in req.body
//'http://localhost:5173',
app.use(cors({ origin: [
        'https://nathanthai2201.github.io',
        'http://nathan-thai.com',
        'https://nathan-thai.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
 }));

// users, items and orders, order arrays.

// SCHEMA:
//  Accounts: {accountId, email, name, phone number, address}. DONE
//  Order: {order ID, item ID Account ID}. DONE
//  Item: {Item ID, name, price, size, material, image URI, active}


// to reuse,    
//              typingtexts -> orders: id
//              cardarrays -> orders: list of order ids
//              posts = item: name, price, size, material, description, imageuri
app.use("/api/posts",postRoutes);
app.use("/api/accounts",accountRoutes);
app.use("/api/items",itemRoutes);
app.use("/api/orders",orderRoutes);


app.listen(PORT, () => {
    connectDB();
    console.log("Server started at http://localhost:" + PORT);
}); 
