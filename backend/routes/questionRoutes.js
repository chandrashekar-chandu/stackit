const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, optionalAuth } = require('../middleware/authMiddleware');
const {
  createQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  voteQuestion
} = require('../controllers/questionController');

const router = express.Router();

// Validation middleware
const questionValidation = [
  body('title')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Title must be between 10 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 5000 })
    .withMessage('Description must be between 20 and 5000 characters'),
  body('tags')
    .optional()
    .isArray({ max: 5 })
    .withMessage('Maximum 5 tags allowed')
    .custom((tags) => {
      if (tags) {
        for (let tag of tags) {
          if (typeof tag !== 'string' || tag.length > 20) {
            throw new Error('Each tag must be a string with maximum 20 characters');
          }
        }
      }
      return true;
    })
];

const voteValidation = [
  body('vote')
    .isIn([-1, 0, 1])
    .withMessage('Vote must be -1 (downvote), 0 (remove vote), or 1 (upvote)')
];

// Public routes (optional auth for user vote info)
router.get('/', optionalAuth, getQuestions);
router.get('/:id', optionalAuth, getQuestion);

// Protected routes
router.post('/', authenticateToken, questionValidation, createQuestion);
router.put('/:id', authenticateToken, questionValidation, updateQuestion);
router.delete('/:id', authenticateToken, deleteQuestion);
router.post('/:id/vote', authenticateToken, voteValidation, voteQuestion);

module.exports = router; 