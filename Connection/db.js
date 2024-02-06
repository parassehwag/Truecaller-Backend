import mongoose from "mongoose";

const Connection = async(USERNAME,PASSWORD)=>{
    const URL = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.wemydzg.mongodb.net/?retryWrites=true&w=majority`
    try{
        await mongoose.connect(URL);
        console.log("Database Connected Successfully")
    }
    catch (error){
        console.log("Error While Connecting With The Database :",error);
    }
}

export default Connection;