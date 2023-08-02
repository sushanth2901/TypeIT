    import {connect } from "mongoose";

    export const connectToDatabase = async() =>{
        try {
            await connect(`mongodb+srv://sushanthreddy:${process.env.MONGODB_PASSWORD}@cluster0.llzrcgi.mongodb.net/?retryWrites=true&w=majority`)
        }
        catch(err){
            console.log(err);
            return err;
        }
    }