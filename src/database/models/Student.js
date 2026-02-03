import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
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
        dateOfBirth: {
            type: Date
        },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        },
        enrolledCourses: [{
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

export default mongoose.model('Student', studentSchema);
