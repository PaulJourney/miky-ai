import express from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validation';
import {
  getConversations,
  createConversation,
  getConversation,
  updateConversation,
  deleteConversation,
  searchConversations
} from '../controllers/conversationController';

const router = express.Router();

// Get user conversations with optional filtering and pagination
router.get('/',
  validate([
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('persona').optional().isIn(['academic', 'marketer', 'engineer', 'coach', 'sensei', 'lawyer', 'medical', 'god-mode', 'richman', 'general']).withMessage('Invalid persona'),
    query('search').optional().isString().trim().isLength({ min: 1 }).withMessage('Search query cannot be empty')
  ]),
  getConversations
);

// Search conversations
router.get('/search',
  validate([
    query('q').notEmpty().withMessage('Search query is required'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
  ]),
  searchConversations
);

// Get specific conversation
router.get('/:id',
  validate([
    param('id').isUUID().withMessage('Invalid conversation ID')
  ]),
  getConversation
);

// Create new conversation
router.post('/',
  validate([
    body('title').notEmpty().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
    body('persona').isIn(['academic', 'marketer', 'engineer', 'coach', 'sensei', 'lawyer', 'medical', 'god-mode', 'richman', 'general']).withMessage('Invalid persona')
  ]),
  createConversation
);

// Update conversation (title only)
router.put('/:id',
  validate([
    param('id').isUUID().withMessage('Invalid conversation ID'),
    body('title').notEmpty().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters')
  ]),
  updateConversation
);

// Delete conversation
router.delete('/:id',
  validate([
    param('id').isUUID().withMessage('Invalid conversation ID')
  ]),
  deleteConversation
);

export default router;