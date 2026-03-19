import mongoose from "mongoose";
import { Env } from "./env.config.js";

const connctDatabase = async () => {
    try {
        await mongoose.connect(Env.MONGO_URI, {
            serverSelectionTimeoutMS: 8000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 30000,
        });
        return true;
    }
    catch (error) {
        console.error("Error connecting to MongoDB database:", error);
        if (Env.NODE_ENV === "development") {
            console.warn("Continuing without MongoDB in development mode.");
            return false;
        }
        process.exit(1);
    }
};

export default connctDatabase;
