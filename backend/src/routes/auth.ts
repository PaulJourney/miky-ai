import express from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validation';
import {
  signup,
  signin,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout
} from '../controllers/authController';

const router = express.Router();

// Signup
router.post('/signup',
  validate([
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('firstName').optional().trim().isLength({ min: 1 }).withMessage('First name cannot be empty'),
    body('lastName').optional().trim().isLength({ min: 1 }).withMessage('Last name cannot be empty'),
    body('referralCode').optional().isLength({ min: 6, max: 12 }).withMessage('Invalid referral code format'),
    body('language').optional().isIn(['en', 'it', 'es', 'de', 'ja', 'ko', 'pt']).withMessage('Invalid language')
  ]),
  signup
);

// Signin
router.post('/signin',
  validate([
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ]),
  signin
);

// Verify email
router.post('/verify-email',
  validate([
    body('token').notEmpty().withMessage('Verification token is required')
  ]),
  verifyEmail
);

// Forgot password
router.post('/forgot-password',
  validate([
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
  ]),
  forgotPassword
);

// Reset password
router.post('/reset-password',
  validate([
    body('token').notEmpty().withMessage('Reset token is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  ]),
  resetPassword
);

// Refresh token
router.post('/refresh-token',
  validate([
    body('refreshToken').notEmpty().withMessage('Refresh token is required')
  ]),
  refreshToken
);

// Logout
router.post('/logout', logout);

export default router;