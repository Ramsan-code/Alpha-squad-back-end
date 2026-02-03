import Student from '../database/models/Student.js';
import Teacher from '../database/models/Teacher.js';
import Transaction from '../database/models/Transaction.js';
import User from '../database/models/User.js';

/**
 * Approve student profile
 * PATCH /api/students/:id/approve
 */
export const approveStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        student.status = 'approved';
        student.verifiedAt = new Date();
        await student.save();

        res.status(200).json({
            success: true,
            message: 'Student approved successfully',
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to approve student'
        });
    }
};

/**
 * Reject student profile
 * PATCH /api/students/:id/reject
 */
export const rejectStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        student.status = 'rejected';
        student.reason = reason || 'No reason provided';
        await student.save();

        res.status(200).json({
            success: true,
            message: 'Student rejected',
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to reject student'
        });
    }
};

/**
 * Approve teacher profile
 * PATCH /api/teachers/:id/approve
 */
export const approveTeacher = async (req, res) => {
    try {
        const { id } = req.params;

        const teacher = await Teacher.findById(id);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        teacher.status = 'approved';
        teacher.verifiedAt = new Date();
        await teacher.save();

        res.status(200).json({
            success: true,
            message: 'Teacher approved successfully',
            data: teacher
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to approve teacher'
        });
    }
};

/**
 * Reject teacher profile
 * PATCH /api/teachers/:id/reject
 */
export const rejectTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const teacher = await Teacher.findById(id);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        teacher.status = 'rejected';
        teacher.reason = reason || 'No reason provided';
        await teacher.save();

        res.status(200).json({
            success: true,
            message: 'Teacher rejected',
            data: teacher
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to reject teacher'
        });
    }
};

/**
 * Approve transaction
 * PATCH /api/transactions/:id/approve
 */
export const approveTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        const transaction = await Transaction.findById(id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        transaction.status = 'approved';
        transaction.verifiedAt = new Date();
        await transaction.save();

        res.status(200).json({
            success: true,
            message: 'Transaction approved successfully',
            data: transaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to approve transaction'
        });
    }
};

/**
 * Reject transaction
 * PATCH /api/transactions/:id/reject
 */
export const rejectTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const transaction = await Transaction.findById(id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        transaction.status = 'rejected';
        transaction.reason = reason || 'No reason provided';
        await transaction.save();

        res.status(200).json({
            success: true,
            message: 'Transaction rejected',
            data: transaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to reject transaction'
        });
    }
};

/**
 * Get all pending approvals
 * GET /api/admin/pending
 */
export const getPendingApprovals = async (req, res) => {
    try {
        const pendingStudents = await Student.find({ status: 'pending' }).populate('userId', 'email');
        const pendingTeachers = await Teacher.find({ status: 'pending' }).populate('userId', 'email');
        const pendingTransactions = await Transaction.find({ status: 'pending' }).populate('userId', 'email');

        res.status(200).json({
            success: true,
            data: {
                students: pendingStudents,
                teachers: pendingTeachers,
                transactions: pendingTransactions
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch pending approvals'
        });
    }
};

/**
 * Get all users
 * GET /api/admin/users
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch users'
        });
    }
};

/**
 * Deactivate user
 * PATCH /api/admin/users/:id/deactivate
 */
export const deactivateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.isActive = false;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User deactivated successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to deactivate user'
        });
    }
};

/**
 * Activate user
 * PATCH /api/admin/users/:id/activate
 */
export const activateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.isActive = true;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User activated successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to activate user'
        });
    }
};
