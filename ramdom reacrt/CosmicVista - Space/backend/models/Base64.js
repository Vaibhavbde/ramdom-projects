const mongoose = require("mongoose")
const {Schema} = mongoose;

const  Baseimageschema = new Schema({
    intialstate : {
        type : String,
        required : true
    },
    midstate : {
        type : String,
        required : true
    },
    humanaffect : {
        type : String,
        required : true
    },
    date  : {
        type : Date,
        default : Date.now
    }
})

const Image = mongoose.model("Base64",Baseimageschema)
module.exports = Image