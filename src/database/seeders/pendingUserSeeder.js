import dotenv from 'dotenv';
import connectDB from '../connection.js';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';

dotenv.config();

const seedPendingUsers = async () => {
    try {
        await connectDB();
        console.log('🚀 Seeding pending users for approval testing...');

        // 1. Create a pending student
        const studentUser = await User.create({
            email: 'pending.student@example.com',
            password: 'Password123!',
            role: 'student',
            isActive: true
        });

        await Student.create({
            userId: studentUser._id,
            firstName: 'Pending',
            lastName: 'Student',
            status: 'pending',
            gradeLevel: 'Graduate'
        });

        // 2. Create a pending instructor
        const teacherUser = await User.create({
            email: 'pending.teacher@example.com',
            password: 'Password123!',
            role: 'teacher',
            isActive: true
        });

        await Teacher.create({
            userId: teacherUser._id,
            firstName: 'Demo',
            lastName: 'Instructor',
            status: 'pending',
            specialization: ['AI & Robotics'],
            experience: 12,
            bio: 'Expert in neuro-symbolic AI systems.'
        });

        console.log('✅ Pending users seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
};

seedPendingUsers();
