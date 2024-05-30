import mongoose from "mongoose";

const connectDB = () => {
    return mongoose.connect(process.env.MONGO_URI);
}

export default connectDB;