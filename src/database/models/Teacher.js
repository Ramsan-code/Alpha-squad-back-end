import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        firstName: {
            type: String,
            trim: true
        },
        lastName: {
            type: String,
            trim: true
        },
        phoneNumber: {
            type: String,
            trim: true
        },
        bio: {
            type: String,
            maxlength: 1000
        },
        specialization: [{
            type: String
        }],
        qualifications: [{
            degree: String,
            institution: String,
            year: Number
        }],
        experience: {
            type: Number, // years of experience
            default: 0
        },
        coursesCreated: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
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

export default mongoose.model('Teacher', teacherSchema);
