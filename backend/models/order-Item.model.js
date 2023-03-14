import mongoose from "mongoose";

const orderItemSchema = mongoose.Schema({
    quanlity:{
        type: Number,
        required: true
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
})

export default mongoose.model('OrderItem', orderItemSchema)