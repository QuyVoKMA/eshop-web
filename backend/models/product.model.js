import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    description:{
        type: String,
        default: ''
    },
    richDescription:{
        type: String,
        require: true
    },
    image:{
        type: String,
        default: ''
    },
    images:[{
        type: String,
    }],
    brand:{
        type: String,
        default: ''
    },
    price:{
        type: Number,
        default: 0
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
        min: 0,
        max: 255
    },
    countInStock:{
        type: Number,
        require: true
    },
    rating:{
        type: Number,
        default: 0
    },
    numReviews:{
        type: Number,
        default: 0
    },
    isFeatured:{
        type: Boolean,
        default: false
    },
    dateCreated:{
        type: Date,
        default: Date.now
    },
})
productSchema.virtual('id').get(function(){
    return this._id.toHexString();
})

productSchema.set('toJSON', {
    virtuals: true,
})

export default mongoose.model('Product', productSchema)