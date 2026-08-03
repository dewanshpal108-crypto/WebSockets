import mongoose from "mongoose"

let cachedConnection  = null;

export default async function MongodbConnection(){

    try{
        if(cachedConnection && (cachedConnection.readyState === 1 || cachedConnection.readyState === 2))
        {
            return cachedConnection;
        }
        const db = await mongoose.connect(process.env.MONGODB_URI)
        cachedConnection = db;
        return db;
    } catch(e)
    {
        console.error("Error connecting to MongoDB:", e);
        throw e;
    }
}