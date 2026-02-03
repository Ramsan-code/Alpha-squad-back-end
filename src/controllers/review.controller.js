import Review from '../database/models/Review.js';
import Student from '../database/models/Student.js';

export const createReview = async (req, res) => {
    try {
        const { courseId, rating, comment } = req.body;

        const student = await Student.findOne({ userId: req.user._id });

        if (!student) {
            return res.status(403).json({
                success: false,
                message: 'Only students can create reviews'
            });
        }

        const review = await Review.create({
            userId: req.user._id,
            studentId: student._id,
            courseId,
            rating,
            comment
        });

        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            data: review
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this course'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create review'
        });
    }
};

export const getAllReviews = async (req, res) => {
    try {
        const { courseId } = req.query;
        const filter = courseId ? { courseId } : {};

        const reviews = await Review.find(filter)
            .populate('userId', 'email')
            .populate('studentId', 'firstName lastName')
            .populate('courseId', 'title');

        res.status(200).json({
            success: true,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch reviews'
        });
    }
};

export const getReviewById = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findById(id)
            .populate('userId', 'email')
            .populate('studentId', 'firstName lastName')
            .populate('courseId', 'title');

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            data: review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch review'
        });
    }
};

export const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        delete updates.userId;
        delete updates.studentId;
        delete updates.courseId;

        const review = await Review.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Review updated successfully',
            data: review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update review'
        });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findByIdAndDelete(id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete review'
        });
    }
};
