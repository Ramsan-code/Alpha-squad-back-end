import express from 'express';
import * as reviewController from '../controllers/review.controller.js';
import auth from '../middleware/auth.middleware.js';
import authLenient from '../middleware/auth.lenient.js';
import requireRole from '../middleware/rbac.middleware.js';

const router = express.Router();

// Create review (student only)
router.post('/', auth, requireRole('student'), reviewController.createReview);

// Get all reviews (public with optional auth)
router.get('/', authLenient, reviewController.getAllReviews);

// Get review by ID (public with optional auth)
router.get('/:id', authLenient, reviewController.getReviewById);

// Update review (student owner or admin)
router.patch('/:id', auth, reviewController.updateReview);

// Delete review (student owner or admin)
router.delete('/:id', auth, reviewController.deleteReview);

export default router;
