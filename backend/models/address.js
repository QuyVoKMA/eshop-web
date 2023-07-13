import Mongoose from 'mongoose'
const {Schema}= Mongoose

const AddressSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    address:{
        type: String
    },
    city:{
        type: String
    },
    state:{
        type: String
    },
    country:{
        type: String
    },
    zipCode:{
        type: String
    },
    isDefault:{
        type: Boolean,
        default: false
    },
    updated:{
        type: Date
    },
    created:{
        type: Date,
        default: Date.now
    }
})

export default Mongoose.model('Address', AddressSchema)