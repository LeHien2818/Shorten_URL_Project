import mongoose from "mongoose";

const connectDB = async () => {
    const username = 'mongo_user'
    const password = 'mongo_password'
    try {
        await mongoose.connect(`mongodb://localhost:27017/Url`, {
            autoIndex: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4,
            authSource: "admin",
            user: username,
            pass: password,
        });
        console.log('MongoDB connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

export default connectDB