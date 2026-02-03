import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // useNewUrlParser and useUnifiedTopology are no longer needed in Mongoose 6+
            // but keeping them for compatibility if user is on older version, 
            // though package.json says ^8.0.3 so they are technically deprecated options warnings.
            // I'll leave them if they were there, but clean up imports mainly.
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
