import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher'
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        amount: {
            type: Number,
            required: [true, 'Transaction amount is required'],
            min: 0
        },
        currency: {
            type: String,
            default: 'USD',
            uppercase: true
        },
        transactionType: {
            type: String,
            enum: ['enrollment', 'refund', 'payment', 'withdrawal'],
            required: true
        },
        paymentMethod: {
            type: String,
            enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'wallet'],
            required: true
        },
        transactionId: {
            type: String,
            unique: true,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'completed', 'failed', 'refunded'],
            default: 'pending'
        },
        reason: {
            type: String
        },
        verifiedAt: {
            type: Date
        },
        completedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

// Generate unique transaction ID before saving
transactionSchema.pre('save', async function (next) {
    if (!this.transactionId) {
        this.transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
    next();
});

export default mongoose.model('Transaction', transactionSchema);
