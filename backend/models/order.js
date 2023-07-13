import Mongoose from 'mongoose'
const {Schema}= Mongoose

const OrderSchema = new Schema({
    cart:{
        type: Schema.Types.ObjectId,
        ref: "Cart"
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    user:{
        type: Number,
        default: 0
    },
    updated:{
        type: Date
    },
    created:{
        type: Date,
        default: Date.now
    }
})

export default  Mongoose.model('Order', OrderSchema)