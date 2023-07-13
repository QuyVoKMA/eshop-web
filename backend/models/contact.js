import Mongoose from 'mongoose'
const {Schema}= Mongoose


const ContactSchema = new Schema({
    name:{
        type: String,
        trim: true
    },
    email:{
        type: String,
    },
    message:{
        type: String,
        trim: true
    },
    updated:{
        type: Date
    },
    created:{
        type: Date,
        default: Date.now
    }
})

export default  Mongoose.model('Contact', ContactSchema)