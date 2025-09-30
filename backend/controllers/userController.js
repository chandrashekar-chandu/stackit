const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select('-password')
      .sort({ reputation: -1, createdAt: -1 });

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's questions and answers
    const questions = await Question.find({ user_id: id })
      .sort({ createdAt: -1 })
      .limit(10);

    const answers = await Answer.find({ user_id: id })
      .populate('question_id', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      user,
      questions,
      answers
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
};

// Get user questions
const getUserQuestions = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const questions = await Question.find({ user_id: id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Question.countDocuments({ user_id: id });

    res.json({
      success: true,
      questions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user questions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user questions'
    });
  }
};

// Get user answers
const getUserAnswers = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const answers = await Answer.find({ user_id: id })
      .populate('question_id', 'title')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Answer.countDocuments({ user_id: id });

    res.json({
      success: true,
      answers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user answers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user answers'
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserQuestions,
  getUserAnswers
}; 