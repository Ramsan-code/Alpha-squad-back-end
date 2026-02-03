import express from 'express';
import * as studentController from '../controllers/student.controller.js';
import auth from '../middleware/auth.middleware.js';
import requireRole from '../middleware/rbac.middleware.js';

const router = express.Router();

// Get all students (admin only)
router.get('/', auth, requireRole('admin'), studentController.getAllStudents);

// Get student by ID (admin or self)
router.get('/:id', auth, studentController.getStudentById);

// Update student profile (admin or self)
router.patch('/:id', auth, studentController.updateStudent);

// Delete student (admin only)
router.delete('/:id', auth, requireRole('admin'), studentController.deleteStudent);

export default router;
