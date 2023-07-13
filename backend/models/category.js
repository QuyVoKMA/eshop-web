import Mongoose from 'mongoose'
const {Schema}= Mongoose
import slug from 'mongoose-slug-updater'


const options = {
    separator:'-',
    lang: 'en',
    truncate: 120
}
Mongoose.plugin(slug, options)

const CategorySchema = new Schema({
    _id:{
        type: Schema.ObjectId,
        auto: true
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
    image:{
        date: Buffer,
        contentType: String
    },
    description:{
        type: String,
        trim: true
    },
    isActive:{
        type: Boolean,
        default: true
    },
    products:{
        type: Schema.Types.ObjectId,
        ref: 'Product',
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
export default  Mongoose.model('Category', CategorySchema)