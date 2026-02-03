import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import auth from '../middleware/auth.middleware.js';
import { validate, validationRules } from '../utils/validation.js';

const router = express.Router();

// Student registration
router.post(
    '/register/student',
    validate([
        validationRules.email,
        validationRules.password
    ]),
    authController.registerStudent
);

// Teacher registration
router.post(
    '/register/teacher',
    validate([
        validationRules.email,
        validationRules.password
    ]),
    authController.registerTeacher
);

// Review user registration (auto-approved)
router.post(
    '/register/review',
    validate([
        validationRules.email,
        validationRules.password
    ]),
    authController.registerReview
);

// Login
router.post(
    '/login',
    validate([
        validationRules.email,
        validationRules.password
    ]),
    authController.login
);

// Get current user profile (protected)
router.get('/me', auth, authController.getMe);

export default router;
