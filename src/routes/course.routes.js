import express from 'express';
import * as courseController from '../controllers/course.controller.js';
import auth from '../middleware/auth.middleware.js';
import authLenient from '../middleware/auth.lenient.js';
import requireRole from '../middleware/rbac.middleware.js';

const router = express.Router();

// Create course (teacher only)
router.post('/', auth, requireRole('teacher'), courseController.createCourse);

// Get all courses (public with optional auth)
router.get('/', authLenient, courseController.getAllCourses);

// Get course by ID (public with optional auth)
router.get('/:id', authLenient, courseController.getCourseById);

// Update course (teacher or admin)
router.patch('/:id', auth, requireRole(['teacher', 'admin']), courseController.updateCourse);

// Delete course (teacher or admin)
router.delete('/:id', auth, requireRole(['teacher', 'admin']), courseController.deleteCourse);

// Approve course (admin only)
router.patch('/:id/approve', auth, requireRole('admin'), courseController.approveCourse);

// Reject course (admin only)
router.patch('/:id/reject', auth, requireRole('admin'), courseController.rejectCourse);

export default router;
