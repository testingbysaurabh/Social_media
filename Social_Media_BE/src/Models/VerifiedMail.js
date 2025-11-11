const mongoose = require("mongoose")
const validator = require("validator")
const VerifiedMailSchema = mongoose.Schema({
    mail : {
        type : String,
        required : true,
        trim : true,
        validate : function(val)
        {
            const isMailValid = validator.isEmail(val)
            if(!isMailValid)
            {
                throw new Error("Please Enter a valid email")
            }
        }
    }
}, { timestamps: true })

const VerfiedMail = mongoose.model("verified-mail", VerifiedMailSchema)

module.exports = {
    VerfiedMail
}