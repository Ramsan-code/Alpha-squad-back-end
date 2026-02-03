import express from 'express';
import * as adminController from '../controllers/admin.controller.js';
import auth from '../middleware/auth.middleware.js';
import requireRole from '../middleware/rbac.middleware.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(auth, requireRole('admin'));

// Approval workflows
router.patch('/students/:id/approve', adminController.approveStudent);
router.patch('/students/:id/reject', adminController.rejectStudent);
router.patch('/teachers/:id/approve', adminController.approveTeacher);
router.patch('/teachers/:id/reject', adminController.rejectTeacher);
router.patch('/transactions/:id/approve', adminController.approveTransaction);
router.patch('/transactions/:id/reject', adminController.rejectTransaction);

// Get pending approvals
router.get('/pending', adminController.getPendingApprovals);

// User management
router.get('/users', adminController.getAllUsers);
router.patch('/users/:id/deactivate', adminController.deactivateUser);
router.patch('/users/:id/activate', adminController.activateUser);

export default router;
