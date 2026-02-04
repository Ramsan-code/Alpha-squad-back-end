import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../connection.js';
import User from '../models/User.js';
import Teacher from '../models/Teacher.js';
import Student from '../models/Student.js';
import Course from '../models/Course.js';
import Review from '../models/Review.js';
import Transaction from '../models/Transaction.js';

dotenv.config();

const clearData = async () => {
    console.log('🧹 Clearing existing data (keeping admin)...');
    await User.deleteMany({ role: { $ne: 'admin' } });
    await Teacher.deleteMany({});
    await Student.deleteMany({});
    await Course.deleteMany({});
    await Review.deleteMany({});
    await Transaction.deleteMany({});
    console.log('✅ Data cleared (Admin preserved)');
};

const teachersData = [
    {
        email: 'john.smith@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Smith',
        bio: 'Expert Web Developer with 10 years of experience in React and Node.js.',
        specialization: ['Web Development', 'JavaScript', 'System Architecture'],
        experience: 10,
        qualifications: [{ degree: 'M.S. Computer Science', institution: 'MIT', year: 2012 }]
    },
    {
        email: 'sarah.jones@example.com',
        password: 'Password123!',
        firstName: 'Sarah',
        lastName: 'Jones',
        bio: 'Data Scientist specializing in Machine Learning and Python.',
        specialization: ['Data Science', 'Python', 'Machine Learning'],
        experience: 7,
        qualifications: [{ degree: 'Ph.D. Statistics', institution: 'Stanford', year: 2015 }]
    },
    {
        email: 'michael.brown@example.com',
        password: 'Password123!',
        firstName: 'Michael',
        lastName: 'Brown',
        bio: 'Professional UI/UX Designer and Frontend Specialist.',
        specialization: ['UI/UX Design', 'Figma', 'CSS Animations'],
        experience: 5,
        qualifications: [{ degree: 'B.F.A Graphic Design', institution: 'RISD', year: 2018 }]
    }
];

const studentsData = [
    { email: 'student1@example.com', password: 'Password123!', firstName: 'Alice', lastName: 'Cooper' },
    { email: 'student2@example.com', password: 'Password123!', firstName: 'Bob', lastName: 'Wilson' },
    { email: 'student3@example.com', password: 'Password123!', firstName: 'Charlie', lastName: 'Davis' },
    { email: 'student4@example.com', password: 'Password123!', firstName: 'Diana', lastName: 'Prince' },
    { email: 'student5@example.com', password: 'Password123!', firstName: 'Ethan', lastName: 'Hunt' }
];

const coursesData = [
    {
        title: 'Complete Web Development Bootcamp',
        description: 'Learn HTML, CSS, JavaScript, React, and Node.js from scratch.',
        price: 99.99,
        category: 'Development',
        duration: 40,
        level: 'beginner',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085'
    },
    {
        title: 'Machine Learning Masterclass',
        description: 'Comprehensive guide to ML algorithms using Python and Scikit-Learn.',
        price: 129.99,
        category: 'Data Science',
        duration: 55,
        level: 'intermediate',
        thumbnail: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc'
    },
    {
        title: 'Modern UI/UX Design Principles',
        description: 'Master Figma and create stunning user interfaces.',
        price: 79.99,
        category: 'Design',
        duration: 25,
        level: 'beginner',
        thumbnail: 'https://images.unsplash.com/photo-1541462608141-ad4d4f942177'
    },
    {
        title: 'Advanced React and Redux',
        description: 'Deep dive into React hooks, performance optimization, and Redux Toolkit.',
        price: 89.99,
        category: 'Development',
        duration: 30,
        level: 'advanced',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee'
    }
];

const seedAll = async () => {
    try {
        await connectDB();
        await clearData();

        console.log('🚀 Seeding process started...');

        // 1. Skip Admin (already seeded)

        // 2. Seed Teachers
        const createdTeachers = [];
        for (const tData of teachersData) {
            const user = await User.create({
                email: tData.email,
                password: tData.password,
                role: 'teacher',
                isActive: true
            });

            const teacher = await Teacher.create({
                userId: user._id,
                firstName: tData.firstName,
                lastName: tData.lastName,
                bio: tData.bio,
                specialization: tData.specialization,
                qualifications: tData.qualifications,
                experience: tData.experience,
                status: 'approved',
                verifiedAt: new Date()
            });
            createdTeachers.push(teacher);
        }
        console.log(`✅ ${createdTeachers.length} Teachers seeded`);

        // 3. Seed Students
        const createdStudents = [];
        for (const sData of studentsData) {
            const user = await User.create({
                email: sData.email,
                password: sData.password,
                role: 'student',
                isActive: true
            });

            const student = await Student.create({
                userId: user._id,
                firstName: sData.firstName,
                lastName: sData.lastName,
                status: 'approved',
                verifiedAt: new Date()
            });
            createdStudents.push(student);
        }
        console.log(`✅ ${createdStudents.length} Students seeded`);

        // 4. Seed Courses
        const createdCourses = [];
        for (let i = 0; i < coursesData.length; i++) {
            const cData = coursesData[i];
            // Distribute courses among teachers
            const teacher = createdTeachers[i % createdTeachers.length];

            const course = await Course.create({
                ...cData,
                teacherId: teacher._id,
                author: `${teacher.firstName} ${teacher.lastName}`,
                status: 'approved',
                verifiedAt: new Date(),
                syllabus: [
                    { module: 'Introduction', topics: ['Course Overview', 'Setting up Environment'], duration: 2 },
                    { module: 'Core Concepts', topics: ['Fundamental Principles', 'Basic Implementation'], duration: 5 }
                ]
            });

            // Update teacher's created courses
            teacher.coursesCreated.push(course._id);
            await teacher.save();

            createdCourses.push(course);
        }
        console.log(`✅ ${createdCourses.length} Courses seeded`);

        // 5. Seed Enrollments, Transactions, and Reviews
        for (let i = 0; i < createdStudents.length; i++) {
            const student = createdStudents[i];

            // Each student enrolls in 1-2 random courses
            const numEnrollments = Math.floor(Math.random() * 2) + 1;
            const shuffledCourses = [...createdCourses].sort(() => 0.5 - Math.random());
            const coursesToEnroll = shuffledCourses.slice(0, numEnrollments);

            for (const course of coursesToEnroll) {
                // Enrollment in Student model
                student.enrolledCourses.push({
                    courseId: course._id,
                    progress: Math.floor(Math.random() * 100),
                    lastAccessed: new Date()
                });

                // Enrollment in Course model
                course.enrolledStudents.push(student._id);
                await course.save();

                // Create Transaction
                await Transaction.create({
                    userId: student.userId,
                    studentId: student._id,
                    courseId: course._id,
                    amount: course.price,
                    transactionType: 'enrollment',
                    paymentMethod: 'credit_card',
                    transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                    status: 'completed',
                    completedAt: new Date()
                });

                // Create Review (some students leave reviews)
                if (Math.random() > 0.3) {
                    await Review.create({
                        userId: student.userId,
                        courseId: course._id,
                        studentId: student._id,
                        rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
                        comment: 'Great course! Very helpful and well-structured.',
                        status: 'approved',
                        verifiedAt: new Date()
                    });
                }
            }
            await student.save();
        }
        console.log('✅ Enrollments, Transactions, and Reviews seeded');

        console.log('\n✨ Database Seeding Completed Successfully! ✨');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedAll();
