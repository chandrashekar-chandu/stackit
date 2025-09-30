const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, optionalAuth } = require('../middleware/authMiddleware');
const {
  createAnswer,
  getAnswers,
  updateAnswer,
  deleteAnswer,
  acceptAnswer
} = require('../controllers/answerController');

const router = express.Router();

// Validation middleware
const answerValidation = [
  body('content')
    .trim()
    .isLength({ min: 10, max: 10000 })
    .withMessage('Answer content must be between 10 and 10000 characters')
];

// Public routes (optional auth for user vote info)
router.get('/questions/:id/answers', optionalAuth, getAnswers);

// Protected routes
router.post('/questions/:id/answers', authenticateToken, answerValidation, createAnswer);
router.put('/answers/:id', authenticateToken, answerValidation, updateAnswer);
router.delete('/answers/:id', authenticateToken, deleteAnswer);
router.patch('/answers/:id/accept', authenticateToken, acceptAnswer);

module.exports = router; 