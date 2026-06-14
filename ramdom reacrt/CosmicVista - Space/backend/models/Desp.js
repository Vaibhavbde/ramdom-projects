const mongoose = require("mongoose")
const {Schema} = mongoose;

const  DespSchema = new Schema({
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

const Desp = mongoose.model("Desp",DespSchema)
module.exports = Desp