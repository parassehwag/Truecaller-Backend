import {Contact} from "../model/contacts.js";
import User from "../model/user.js";

const markSpam = async(req,res) =>{
    try{
        if(!req.body.phone_number || isNaN(req.body.phone_number)){
            return res.status(500).json({msg:"Please Add Valid Phone Number"})
        }

        //if User Already registered , we Update The Spam Count in Both User Db and Global Contacts DB
        const registeredUser= await User.findOne({phone_number:req.body.phone_number});
        if(registeredUser){
            var temp = registeredUser.spamReports+1;
            await User.updateOne({phone_number:req.body.phone_number},{$set:{spamReports:temp}});
        }

        const user = await Contact.findOne({phone_number:req.body.phone_number});
        //if user is in global contact db we increase the spam report number
        if(user){
            var temp = user.spamReports+1;
            await Contact.updateOne({phone_number:req.body.phone_number},{$set:{spamReports:temp}});
        }
        //if user is not in global contact db then we add it and update the spamReportCount
        else{
            const newContact = new Contact({
                phone_number:req.body.phone_number,
                spamReports:1
            })
            await newContact.save();
        }
        return res.status(200).json({msg:'spamStatus Updated'})
    }
    catch(error){
        return res.status(500).json({msg:"Error while updating spamStatus",error:error})
    }
}

export {markSpam};