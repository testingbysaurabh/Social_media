const mongoose = require("mongoose")
const validator = require("validator")

function calculateAge(dateString) {
    const birthDate = new Date(dateString);
    if (isNaN(birthDate)) {
        throw new Error("Invalid date format. Use yyyy-mm-dd");
    }
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
}


const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        minlength : 2,
        maxlength : 15,
        required : true,
        trim : true        
    },
    lastName : {
        type : String,
        minlength : 3,
        maxlength : 15,
        required : true,
        trim : true     
    },
    username : {
        type : String,
        minlength : 2,
        maxlength : 15,
        required : true,
        trim : true,
        unique : true   
    },
    mail : {
        type : String,
        minlength : 6,
        required : true,
        trim : true,
        unique : true,
        immutable : true,
        validate : function(val)
        {
            const isEmail = validator.isEmail(val)
            if(!isEmail)
            {
                throw new Error("Please Enter a valid Email")
            }

        }
    },
    password : {
        required : true,
        type : String,
        minlength : 8,
        trim : true
    },
    dateOfBirth : {
        type : String,
        required : true,
        immutable : true,
        validate : function(val)
        {
            const isDate = validator.isDate(val)
            if(!isDate)
            {
                throw new Error("Please enter a valid date")
            }
            const age = calculateAge(val)
            if(age < 18)
            {
                throw new Error("You must be atleast 18 years old")
            }
        }
    },
    gender : {
        type : String,
        required : true,
        immutable : true,
        enum : {
            values : ["male", "female", "others"],
            message : "{VALUE} is not a valid type for Gender"
        }
    },
    bio : {
        type : String,
        trim : true,
        minlength : 4
    },
    profilePicture : {
        type : String
    } ,
    posts : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Post"
    }],
    followers : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }],
    following : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }],
    blocked : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }],
    isPrivate  : {
        type : Boolean,
        default : false
    }
}, { timestamps: true })


const User = mongoose.model("User", userSchema)
module.exports = {
    User
}