import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


const authenticateToken = (req,res,next) =>{
    const token = req.headers['authorization'];

    if(token == null){
        return res.status(401).json({msg:'token is missing'});
    }

    jwt.verify(token,process.env.ACCESS_SECRET_KEY, (error,user) =>{
        if(error){
            return res.status(403).json({msg:'Invalid token'})
        }
        next();
    })
}

export default authenticateToken;