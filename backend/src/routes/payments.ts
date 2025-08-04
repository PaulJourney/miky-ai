import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import {
  createSubscription,
  updateSubscription,
  cancelSubscription,
  buyCredits,
  stripeWebhook
} from '../controllers/paymentController';

const router = express.Router();

// Create subscription (protected)
router.post('/create-subscription',
  authenticateToken,
  validate([
    body('priceId').notEmpty().withMessage('Price ID is required'),
    body('plan').isIn(['plus', 'business']).withMessage('Invalid plan')
  ]),
  createSubscription
);

// Update subscription (protected)
router.put('/update-subscription',
  authenticateToken,
  validate([
    body('newPriceId').notEmpty().withMessage('New price ID is required'),
    body('newPlan').isIn(['free', 'plus', 'business']).withMessage('Invalid plan')
  ]),
  updateSubscription
);

// Cancel subscription (protected)
router.post('/cancel-subscription',
  authenticateToken,
  cancelSubscription
);

// Buy credits (protected)
router.post('/buy-credits',
  authenticateToken,
  validate([
    body('credits').isInt({ min: 100, max: 10000 }).withMessage('Credits must be between 100 and 10000'),
    body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0')
  ]),
  buyCredits
);

// Stripe webhook (not protected)
router.post('/webhook', stripeWebhook);

export default router;