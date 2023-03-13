import mongoose from "mongoose";

const categorySchema =mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    icon:{
        type: String,
    },
    color:{
        type: String,
    },
})

export default mongoose.model('Category', categorySchema);