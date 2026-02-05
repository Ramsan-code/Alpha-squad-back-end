import express from 'express';
import * as aiController from '../controllers/ai.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

// AI routes require authentication
router.post('/grade', auth, aiController.gradeSubmission);
router.get('/insights', auth, aiController.getAIInsights);

export default router;
