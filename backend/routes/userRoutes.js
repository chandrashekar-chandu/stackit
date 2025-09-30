const express = require('express');
const { authenticateToken, optionalAuth } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  getUserById,
  getUserQuestions,
  getUserAnswers
} = require('../controllers/userController');

const router = express.Router();

// Public routes (optional auth for user vote info)
router.get('/', optionalAuth, getAllUsers);
router.get('/:id', optionalAuth, getUserById);
router.get('/:id/questions', optionalAuth, getUserQuestions);
router.get('/:id/answers', optionalAuth, getUserAnswers);

module.exports = router; 