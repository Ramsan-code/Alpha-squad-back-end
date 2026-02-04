import Student from '../database/models/Student.js';
import User from '../database/models/User.js';

/**
 * Get all students
 * GET /api/students
 */
export const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().populate('userId', 'email isActive');

        res.status(200).json({
            success: true,
            data: students
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch students'
        });
    }
};

/**
 * Get student by ID
 * GET /api/students/:id
 */
export const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findById(id).populate('userId', 'email isActive');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch student'
        });
    }
};

/**
 * Update student profile
 * PATCH /api/students/:id
 */
export const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Prevent updating sensitive fields
        delete updates.userId;
        delete updates.status;
        delete updates.verifiedAt;

        const student = await Student.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        ).populate('userId', 'email isActive');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Student profile updated successfully',
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update student'
        });
    }
};

/**
 * Delete student
 * DELETE /api/students/:id
 */
export const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Delete associated user account
        await User.findByIdAndDelete(student.userId);

        // Delete student profile
        await Student.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete student'
        });
    }
};
/**
 * Enroll student in a course
 * POST /api/students/courses/:courseId/enroll
 */
export const enrollInCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;

        const student = await Student.findOne({ userId });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        // Check if already enrolled
        const isEnrolled = student.enrolledCourses.some(
            enrollment => enrollment.courseId.toString() === courseId
        );

        if (isEnrolled) {
            return res.status(400).json({
                success: false,
                message: 'You are already enrolled in this course'
            });
        }

        // Add to enrolled courses
        student.enrolledCourses.push({
            courseId,
            progress: 0,
            lastAccessed: new Date()
        });

        await student.save();

        res.status(200).json({
            success: true,
            message: 'Successfully enrolled in course',
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to enroll in course'
        });
    }
};
