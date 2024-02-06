import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: {
    type:String
  },
  phone_number: {
    type:Number,
    required:true
  },
  spamReports: {
    type:Number,
    default:0
  }
});

const Contact = mongoose.model("Contact",contactSchema);

export {Contact};