const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  voteAnswer,
  voteQuestion,
  removeVote,
  getUserVoteStats
} = require('../controllers/voteController');

const router = express.Router();

// Validation middleware
const voteValidation = [
  body('voteType')
    .isIn(['upvote', 'downvote'])
    .withMessage('Vote type must be either "upvote" or "downvote"')
];

// Vote routes
router.post('/answers/:id/vote', authenticateToken, voteValidation, voteAnswer);
router.post('/questions/:id/vote', authenticateToken, voteValidation, voteQuestion);
router.delete('/:type/:id/vote', authenticateToken, removeVote); // type can be 'question' or 'answer'

// Vote statistics
router.get('/stats/:userId', authenticateToken, getUserVoteStats);

module.exports = router; 