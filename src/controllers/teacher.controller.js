import Teacher from '../database/models/Teacher.js';
import User from '../database/models/User.js';

/**
 * Get all teachers
 * GET /api/teachers
 */
export const getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find().populate('userId', 'email isActive');

        res.status(200).json({
            success: true,
            data: teachers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch teachers'
        });
    }
};

/**
 * Get teacher by ID
 * GET /api/teachers/:id
 */
export const getTeacherById = async (req, res) => {
    try {
        const { id } = req.params;

        const teacher = await Teacher.findById(id).populate('userId', 'email isActive');

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        res.status(200).json({
            success: true,
            data: teacher
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch teacher'
        });
    }
};

/**
 * Update teacher profile
 * PATCH /api/teachers/:id
 */
export const updateTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Prevent updating sensitive fields
        delete updates.userId;
        delete updates.status;
        delete updates.verifiedAt;

        const teacher = await Teacher.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        ).populate('userId', 'email isActive');

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Teacher profile updated successfully',
            data: teacher
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update teacher'
        });
    }
};

/**
 * Delete teacher
 * DELETE /api/teachers/:id
 */
export const deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;

        const teacher = await Teacher.findById(id);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        // Delete associated user account
        await User.findByIdAndDelete(teacher.userId);

        // Delete teacher profile
        await Teacher.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Teacher deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete teacher'
        });
    }
};
