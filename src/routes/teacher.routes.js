import express from 'express';
import * as teacherController from '../controllers/teacher.controller.js';
import auth from '../middleware/auth.middleware.js';
import requireRole from '../middleware/rbac.middleware.js';

const router = express.Router();

// Get all teachers (public or authenticated)
router.get('/', teacherController.getAllTeachers);

// Get teacher by ID (public)
router.get('/:id', teacherController.getTeacherById);

// Update teacher profile (admin or self)
router.patch('/:id', auth, teacherController.updateTeacher);

// Delete teacher (admin only)
router.delete('/:id', auth, requireRole('admin'), teacherController.deleteTeacher);

export default router;
