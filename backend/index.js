import express from 'express';
const app =express();
import dotenv from 'dotenv'
dotenv.config();
import cors from 'cors';
import compression from 'compression';
import path from 'path'
import helmet from 'helmet' 
import mongoose from 'mongoose';
import bodyParser from 'body-parser'
import keys from './config/keys.js';
import  setupDB  from './utils/db.js';
// import socket from './socket'

app.use(cors()) 
app.options('*', cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(helmet({contentSecurityPolicy: false,
frameguard: true}))

setupDB()


import userRoute from './routes/user.js'
import authRoute from './routes/auth.js'
import merchantRoute from './routes/merchant.js'
import wishlistRoute from './routes/wishlist.js'
import addressRoute from './routes/address.js'
import brandRoute from './routes/brand.js'
import cartRoute from './routes/cart.js'
import categoryRoute from './routes/category.js'
import contactRoute from './routes/contact.js'
import orderRoute from './routes/order.js'
import productRoute from './routes/product.js'
import reviewRoute from './routes/review.js'


app.use('/auth',authRoute)
app.use('/user',userRoute)
app.use('/merchant',merchantRoute)
app.use('/wishlist',wishlistRoute)
app.use('/address',addressRoute)
app.use('/brand',brandRoute)
app.use('/cart',cartRoute)
app.use('/category',categoryRoute)
app.use('/contact',contactRoute)
app.use('/order',orderRoute)
app.use('/product',productRoute)
app.use('/review',reviewRoute)



app.listen(3000, ()=>{
    console.log("server is runing http://localhost:3000")
});