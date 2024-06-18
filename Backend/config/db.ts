import mongoose from 'mongoose';

// Connect to MongoDB
const connectDB = async () => {
    try {
       
        const conn = await mongoose.connect(process.env.MONGODB_URI as string, {
           
        });
        console.log(`MongoDB connected: ${conn.connection.host}`);

    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1); // Exit the process with failure (1 indicates failure)
    }
};

export default connectDB;
