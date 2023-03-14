import express from 'express';
const app =express();
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config();
import cors from 'cors';
import authJwt from './helpers/jwt.js'
import errorHandler from './helpers/error-handler.js'



const api = process.env.API_URL

app.use(cors())
app.options('*', cors())
//midleware;
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt())
app.use(errorHandler)


import productRoute from './routes/product.route.js'
import categoryRoute from './routes/category.route.js'
import userRoute from './routes/user.route.js'
import orderRoute from './routes/order.route.js'

mongoose.connect(process.env.MONGO,{
    useNewUrlParser: true,
    useUnifiedTopology:true
})
.then(()=>{
    console.log('Database Connection is ready...')
})
.catch((err) =>{
    console.log("Connect db err", err)
})

// routes
app.use(`${api}/product`,productRoute)
app.use(`${api}/categories`,categoryRoute)
app.use(`${api}/user`,userRoute)
app.use(`${api}/orders`,orderRoute)

app.listen(3000, ()=>{
    console.log("server is runing http://localhost:3000")
});