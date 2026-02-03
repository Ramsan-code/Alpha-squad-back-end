import express from 'express';
import * as transactionController from '../controllers/transaction.controller.js';
import auth from '../middleware/auth.middleware.js';
import requireRole from '../middleware/rbac.middleware.js';

const router = express.Router();

// Create transaction (authenticated users)
router.post('/', auth, transactionController.createTransaction);

// Get all transactions (admin only)
router.get('/', auth, requireRole('admin'), transactionController.getAllTransactions);

// Get transaction by ID (admin or owner)
router.get('/:id', auth, transactionController.getTransactionById);

// Update transaction (admin only)
router.patch('/:id', auth, requireRole('admin'), transactionController.updateTransaction);

export default router;
