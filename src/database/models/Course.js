import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Course title is required'],
            trim: true
        },
        description: {
            type: String,
            required: [true, 'Course description is required']
        },
        author: {
            type: String,
            trim: true
        },
        thumbnail: {
            type: String,
            trim: true
        },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher',
            required: true
        },
        price: {
            type: Number,
            required: [true, 'Course price is required'],
            min: 0
        },
        courseName: {
            type: String,
            trim: true
        },
        category: {
            type: String,
            trim: true
        },
        duration: {
            type: Number, // in hours
            min: 0
        },
        level: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            default: 'beginner'
        },
        documents: [{
            title: String,
            url: String,
            type: String
        }],
        syllabus: [{
            module: String,
            topics: [String],
            duration: Number
        }],
        enrolledStudents: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        }],
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'suspended'],
            default: 'pending'
        },
        reason: {
            type: String
        },
        verifiedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Course', courseSchema);
