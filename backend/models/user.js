import Mongoose from 'mongoose'
import {ROLES, EMAIL_PROVIDER} from '../constants/index.js'
const {Schema}= Mongoose

const UserSchema = new Schema({
    email:{
        type: String,
         required: function(){return this.provider !== 'gmail' ? false : true;}
      
    },
    phoneNumber:{
        type: String
    },
    firstName:{
        type: String
    },
    lastName:{
        type: String
    },
    password:{
        type: String
    },
    merchant:{
        type: Schema.Types.ObjectId,
        ref: 'Merchant',
        default: null
    },
    provider:{
        type: String,
        required: true,
        default: EMAIL_PROVIDER.Email
    },
    googleId:{
        type: String
    },
    facebookId:{
        type: String
    },
    avatar:{
        type: String
    },
    role:{
        type: String,
        default: ROLES.Member,
        enum: [ROLES.Admin, ROLES.Member, ROLES.Merchant]
    },
    resetPasswordToken:{
        type: String
    },
    resetPasswordExpires:{
        type: Date
    },
    updated:{
        type: Date
    },
    created:{
        type: Date,
        default: Date.now
    },
    
})

export default Mongoose.model('User', UserSchema)