import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';
import {
  getReferralStats,
  requestCashout,
  getShareLink
} from '../controllers/referralController';

const router = express.Router();

// Get referral statistics
router.get('/stats', getReferralStats);

// Get shareable referral link
router.get('/share-link', getShareLink);

// Request cashout
router.post('/cashout',
  validate([
    body('paypalEmail').isEmail().normalizeEmail().withMessage('Valid PayPal email is required'),
    body('firstName').notEmpty().trim().withMessage('First name is required'),
    body('lastName').notEmpty().trim().withMessage('Last name is required')
  ]),
  requestCashout
);

export default router;