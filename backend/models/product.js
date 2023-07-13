import Mongoose from 'mongoose'
const {Schema}= Mongoose
import slug from 'mongoose-slug-updater'


const options = {
    separator:'-',
    lang: 'en',
    truncate: 120
}
Mongoose.plugin(slug, options)

const ProductSchema = new Schema({
    sku:{
        type: String
    },
    name:{
        type: String,
        trim: true
    },
    slug:{
        type: String,
        slug: 'name',
        unique: true
    },
    imageUrl:{
        type: String
    },
    imageKey:{
        type: String
    },
    description:{
        type: String,
        trim: true
    },
    quantity:{
        type: Number,
    },
    price:{
        type: Number,
    },
    taxable:{
        type: Boolean,
        default: false
    },
    isActive:{
        type: Boolean,
        default: true
    },
    brand:{
        type: Schema.Types.ObjectId,
        ref: 'Brand',
        default:  null
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        default:  null
    },
    updated:{
        type: Date
    },
    created:{
        type: Date,
        default: Date.now
    }
})

export default  Mongoose.model('Product', ProductSchema)