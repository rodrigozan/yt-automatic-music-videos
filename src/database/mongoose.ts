import mongoose from "mongoose";

export class Connection {
    static async connect() {
        try {
            const uri = process.env.DB_URI || "mongodb://localhost:27017/yt-automatic-music-videos";
            await mongoose.connect(uri);
            console.log('Dabatase connected'); 
            
        } catch (error) {
            throw new Error(error)
        }
    }

    static async disconnect() {
        try {
            await mongoose.disconnect();
        } catch (error) {
            throw new Error(error)
        }
    }
}