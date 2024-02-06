import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type:String
    },
    phone_number: { 
        type: Number, 
        required:true,
        unique: true 
    },
    password:{
        type: String,
        required:true
    },
    spamReports:{
        type:Number,
        required:true
    }
})

const User = mongoose.model("User",userSchema);

export default User;