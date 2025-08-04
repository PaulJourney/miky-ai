import express from 'express';
import { body, query } from 'express-validator';
import { validate } from '../middleware/validation';
import { authenticateAdmin } from '../middleware/auth';
import {
  adminLogin,
  getStats,
  getUsers,
  updateUser,
  getConversations,
  getTransactions,
  updateSettings,
  exportData
} from '../controllers/adminController';

const router = express.Router();

// Admin login
router.post('/login',
  validate([
    body('password').notEmpty().withMessage('Password is required')
  ]),
  adminLogin
);

// All other routes require admin authentication
router.use(authenticateAdmin);

// Get system statistics
router.get('/stats', getStats);

// User management
router.get('/users',
  validate([
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('search').optional().isString().trim()
  ]),
  getUsers
);

router.put('/users/:id',
  validate([
    body('credits').optional().isInt({ min: 0 }).withMessage('Credits must be non-negative'),
    body('plan').optional().isIn(['free', 'plus', 'business']).withMessage('Invalid plan'),
    body('suspended').optional().isBoolean().withMessage('Suspended must be boolean')
  ]),
  updateUser
);

// Conversation management
router.get('/conversations',
  validate([
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
  ]),
  getConversations
);

// Transaction management
router.get('/transactions',
  validate([
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('type').optional().isIn(['subscription', 'credits', 'referral', 'cashout']).withMessage('Invalid transaction type')
  ]),
  getTransactions
);

// Settings management
router.put('/settings', updateSettings);

// Data export
router.get('/export/:type',
  validate([
    query('format').optional().isIn(['csv', 'json']).withMessage('Invalid export format')
  ]),
  exportData
);

export default router;