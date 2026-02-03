import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../connection.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            console.error('❌ Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env');
            process.exit(1);
        }

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('✅ Admin user already exists');
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            email: adminEmail,
            password: adminPassword,
            role: 'admin',
            isActive: true
        });

        console.log('✅ Admin user created successfully');
        console.log(`Email: ${admin.email}`);
        console.log(`Role: ${admin.role}`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error.message);
        process.exit(1);
    }
};

// Connect to database and seed
await connectDB();
await seedAdmin();
