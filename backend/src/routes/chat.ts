import express from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validation';
import { sendMessage } from '../controllers/chatController';

const router = express.Router();

// Send message and get AI response
router.post('/send',
  validate([
    body('message').notEmpty().trim().isLength({ min: 1, max: 4000 }).withMessage('Message must be between 1 and 4000 characters'),
    body('persona').isIn(['academic', 'marketer', 'engineer', 'coach', 'sensei', 'lawyer', 'medical', 'god-mode', 'richman', 'general']).withMessage('Invalid persona'),
    body('conversationId').optional().isUUID().withMessage('Invalid conversation ID')
  ]),
  sendMessage
);

export default router;