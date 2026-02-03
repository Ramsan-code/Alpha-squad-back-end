import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            maxlength: 1000
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'flagged'],
            default: 'approved' // Auto-approved as per requirements
        },
        reason: {
            type: String
        },
        verifiedAt: {
            type: Date,
            default: Date.now // Auto-approved
        }
    },
    {
        timestamps: true
    }
);

// Ensure one review per student per course
reviewSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);
