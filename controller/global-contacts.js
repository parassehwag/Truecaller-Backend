import {Contact} from "../model/contacts.js";

//to add registered user contacts to global Contact DB 
const addContacts =async(req,res)=>{
    try{
        const newContact = new Contact({
            name:req.body.name,
            phone_number:req.body.phone_number
        })
        newContact.save();
        return res.status(200).json({msg:'Contact added in Global DB'})
    }
    catch(error){
        return res.status(500).json({msg:"Error while adding Contact in Global DB"})
    }
}

export {addContacts};