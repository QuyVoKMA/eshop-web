import Mongoose from 'mongoose'
const {Schema}= Mongoose

import {CART_ITEM_STATUS} from '../constants/index.js'

const CartItemSchema = new Schema({
    rpoduct:{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity:{
        type: Number
    },
    purchasePrice:{
        type: Number, 
        default: 0
    },
    totalPrice:{
        type: Number, 
        default: 0
    },
    priceWithTax:{
        type: Number, 
        default: 0
    },
    totalTax:{
        type: Number, 
        default: 0
    },
    status:{
        type: String,
        default: CART_ITEM_STATUS.Not_processed,
        enum:[
            CART_ITEM_STATUS.Not_processed, 
            CART_ITEM_STATUS.Processing, 
            CART_ITEM_STATUS.Shipped, 
            CART_ITEM_STATUS.Delivered, 
            CART_ITEM_STATUS.Cancelled, 
        ]
    }
})

export const cartItem = Mongoose.model('CartItem', CartItemSchema)


const CartSchema = new Schema({
    products: [CartItemSchema],
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    updated:{
        type: Date
    },
    created:{
        type: Date,
        default: Date.now
    },
})


export default Mongoose.model('Cart', CartSchema)