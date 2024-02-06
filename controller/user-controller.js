import User from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Token from "../model/token.js";
import { Contact } from "../model/contacts.js";

const signUpUser = async(req,res)=>{
    try{
        //Search if user has previous spamreports in Global Contact Db and updates it for the registering User
        const GlobalContact= await Contact.findOne({phone_number:req.body.phone_number});
        var GlobalSpamReports=0;
        if(GlobalContact){
            var GlobalSpamReports=GlobalContact.spamReports;
        }

        //checks if user already registered
        const user = await User.findOne({phone_number:req.body.phone_number});
        if(user){
            return res.status(400).json({ msg: 'Phone number already exists' });
        }
        const saltRounds = 10;

        //hashes the password for security purpose and saves the user info in User Db
        bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
            const newUser = new User({
                name:req.body.name,
                email:req.body.email,
                password:hash,
                phone_number:req.body.phone_number,
                spamReports:GlobalSpamReports
            })
            await newUser.save();

            //if we have the  user in Global Contact Db who registered with us, then we update his name with the name he provided 
            const foundContact= await Contact.findOne({phone_number:req.body.phone_number});
            if(foundContact){
                foundContact.name=req.body.name;
                await foundContact.save();
            }
            //if the user is not in the global contact db then we add his info in the global contact db
            else{
                const newContact = new Contact({
                    name:req.body.name,
                    phone_number:req.body.phone_number
                })
                await newContact.save();
            }
            return res.status(200).json({msg:"Signup Successfull"});
        });
    }
    catch (error){
        return res.status(500).json({msg:"Error while signup"})
    }
}

const loginUser= async(req,res)=>{
    let user = await User.findOne({phone_number: req.body.phone_number})
    if(user){
        try{    

            let match = await bcrypt.compare(req.body.password, user.password) 
            
            //checks if user is registered with us
            if(match){
                    const accessToken = jwt.sign(user.toJSON(),process.env.ACCESS_SECRET_KEY,{expiresIn:'15m'});
                    const refreshToken =jwt.sign(user.toJSON(),process.env.REFRESH_SECRET_KEY);
                    
                    const newtoken = new Token({
                        token:refreshToken
                    })

                    await newtoken.save();

                    return res.status(200).json({accessToken: accessToken, refreshToken: refreshToken,name:user.name})

            }
            else{
                        return res.status(400).json({ msg : 'Password Does Not Match'});
            }
        }
        catch(error){
            console.log("Error While Loggin In",error)
        }
    }

    else{
        return res.status(400).json({ msg : 'User is Not registered'});
    }
}

export {signUpUser,loginUser};