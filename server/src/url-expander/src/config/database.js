// src/config/database.js
import mongoose from "mongoose";
// mongodb://localhost:27017/66ff653c70290e2fc3a0ed19

const connectDB = async () => {
    const username = process.env.MONGO_USERNAME || 'mongo_user'
    const password = process.env.MONGO_PASSWORD || 'mongo_password'
    const port = process.env.MONGO_PORT || '27017'
    const host = process.env.MONGO_HOST || 'localhost'
    try {
        await mongoose.connect(`mongodb://${host}:${port}/Url`, {
            autoIndex: true, // Không tự động tạo chỉ mục
            serverSelectionTimeoutMS: 5000, // Giảm thời gian chờ chọn server xuống 5 giây
            socketTimeoutMS: 45000, // Thời gian chờ socket mặc định là 45 giây
            family: 4, // Chỉ sử dụng IPv4
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