const  mongoose  = require("mongoose");



const msgSchema = new mongoose.Schema({
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    receiver : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    text : {
        type : String,
        required : true,
        trim : true
    }
}, {timestamps : true})


const Msg = mongoose.model("Msg", msgSchema)
module.exports = {
    Msg
}