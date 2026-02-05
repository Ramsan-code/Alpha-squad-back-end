import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const testConnection = async () => {
    console.log('Testing connection to:', process.env.MONGODB_URI?.replace(/:([^@]+)@/, ':****@'));
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000 // Timeout faster for testing
        });
        console.log('✅ Success: Connected to MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Failure:', error.message);
        process.exit(1);
    }
};

testConnection();
