import Course from '../database/models/Course.js';
import Teacher from '../database/models/Teacher.js';

export const createCourse = async (req, res) => {
    try {
        const courseData = req.body;
        const teacher = await Teacher.findOne({ userId: req.user._id });

        if (!teacher) {
            return res.status(403).json({
                success: false,
                message: 'Only approved teachers can create courses'
            });
        }

        courseData.teacherId = teacher._id;
        const course = await Course.create(courseData);

        teacher.coursesCreated.push(course._id);
        await teacher.save();

        res.status(201).json({
            success: true,
            message: 'Course created successfully. Awaiting admin approval.',
            data: course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create course'
        });
    }
};

export const getAllCourses = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = {};

        if (!req.user || req.user.role !== 'admin') {
            filter.status = 'approved';
        } else if (status) {
            filter.status = status;
        }

        const courses = await Course.find(filter).populate('teacherId', 'firstName lastName');

        res.status(200).json({
            success: true,
            data: courses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch courses'
        });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id).populate('teacherId', 'firstName lastName bio');

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch course'
        });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        delete updates.teacherId;
        delete updates.status;
        delete updates.verifiedAt;

        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        ).populate('teacherId', 'firstName lastName');

        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            data: updatedCourse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update course'
        });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findByIdAndDelete(id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete course'
        });
    }
};

export const approveCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        course.status = 'approved';
        course.verifiedAt = new Date();
        await course.save();

        res.status(200).json({
            success: true,
            message: 'Course approved successfully',
            data: course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to approve course'
        });
    }
};

export const rejectCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        course.status = 'rejected';
        course.reason = reason || 'No reason provided';
        await course.save();

        res.status(200).json({
            success: true,
            message: 'Course rejected',
            data: course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to reject course'
        });
    }
};
