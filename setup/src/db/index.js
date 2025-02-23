
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    console.log(`\n MongoDB connect !! DB HOST : ${connectionInstance.connection.host}`)
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};