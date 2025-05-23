import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://manikas329:stricklandA1@usermanager.lqgbcxh.mongodb.net/?retryWrites=true&w=majority&appName=UserManager');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB; 