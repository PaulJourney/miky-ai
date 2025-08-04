import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';
import {
  getProfile,
  updateProfile,
  getCredits,
  verifyReferralCode
} from '../controllers/userController';

const router = express.Router();

// Get user profile
router.get('/profile', getProfile);

// Update user profile
router.put('/profile',
  validate([
    body('firstName').optional().trim().isLength({ min: 1 }).withMessage('First name cannot be empty'),
    body('lastName').optional().trim().isLength({ min: 1 }).withMessage('Last name cannot be empty'),
    body('language').optional().isIn(['en', 'it', 'es', 'de', 'ja', 'ko', 'pt']).withMessage('Invalid language')
  ]),
  updateProfile
);

// Get credit balance
router.get('/credits', getCredits);

// Verify referral code
router.post('/verify-referral',
  validate([
    body('referralCode').notEmpty().withMessage('Referral code is required')
  ]),
  verifyReferralCode
);

export default router;