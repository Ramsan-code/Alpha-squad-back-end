import Transaction from '../database/models/Transaction.js';

export const createTransaction = async (req, res) => {
    try {
        const transactionData = {
            ...req.body,
            userId: req.user._id
        };

        const transaction = await Transaction.create(transactionData);

        res.status(201).json({
            success: true,
            message: 'Transaction created successfully',
            data: transaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create transaction'
        });
    }
};

export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate('userId', 'email')
            .populate('studentId')
            .populate('teacherId')
            .populate('courseId');

        res.status(200).json({
            success: true,
            data: transactions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch transactions'
        });
    }
};

export const getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findById(id)
            .populate('userId', 'email')
            .populate('studentId')
            .populate('teacherId')
            .populate('courseId');

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        res.status(200).json({
            success: true,
            data: transaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch transaction'
        });
    }
};

export const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        delete updates.userId;
        delete updates.transactionId;

        const transaction = await Transaction.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Transaction updated successfully',
            data: transaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update transaction'
        });
    }
};
