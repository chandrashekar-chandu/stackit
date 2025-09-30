const { validationResult } = require('express-validator');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Create a new question
const createQuestion = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { title, description, tags } = req.body;

    const question = new Question({
      title,
      description,
      tags: tags || [],
      author: req.user._id
    });

    await question.save();

    // Populate author details
    await question.populate('author', 'username reputation');

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: {
        question
      }
    });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create question'
    });
  }
};

// Get all questions with filtering and pagination
const getQuestions = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      tag, 
      search, 
      sort = 'newest' 
    } = req.query;

    const query = { isDeleted: false };
    
    // Filter by tag
    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'newest':
        sortObj = { createdAt: -1 };
        break;
      case 'oldest':
        sortObj = { createdAt: 1 };
        break;
      case 'votes':
        sortObj = { voteCount: -1 };
        break;
      case 'views':
        sortObj = { views: -1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const questions = await Question.find(query)
      .populate('author', 'username reputation')
      .populate('acceptedAnswer')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Add vote count and answer count
    const questionsWithCounts = await Promise.all(
      questions.map(async (question) => {
        const answerCount = await Answer.countDocuments({
          question: question._id,
          isDeleted: false
        });
        
        return {
          ...question,
          voteCount: question.votes.upvotes.length - question.votes.downvotes.length,
          answerCount
        };
      })
    );

    const total = await Question.countDocuments(query);

    res.json({
      success: true,
      data: {
        questions: questionsWithCounts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalQuestions: total,
          hasNext: skip + questions.length < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch questions'
    });
  }
};

// Get a single question with answers
const getQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id)
      .populate('author', 'username reputation bio')
      .populate('acceptedAnswer')
      .populate('votes.upvotes', 'username')
      .populate('votes.downvotes', 'username');

    if (!question || question.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Increment view count
    question.views += 1;
    await question.save();

    // Get answers
    const answers = await Answer.find({
      question: id,
      isDeleted: false
    })
      .populate('author', 'username reputation')
      .populate('votes.upvotes', 'username')
      .populate('votes.downvotes', 'username')
      .sort({ isAccepted: -1, voteCount: -1, createdAt: 1 })
      .lean();

    // Add vote counts to answers
    const answersWithCounts = answers.map(answer => ({
      ...answer,
      voteCount: answer.votes.upvotes.length - answer.votes.downvotes.length
    }));

    // Add user's vote info if authenticated
    let userVote = null;
    if (req.user) {
      userVote = question.getUserVote(req.user._id);
    }

    res.json({
      success: true,
      data: {
        question: {
          ...question.toObject(),
          voteCount: question.voteCount,
          userVote
        },
        answers: answersWithCounts
      }
    });
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch question'
    });
  }
};

// Update a question
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags } = req.body;

    const question = await Question.findById(id);

    if (!question || question.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if user is author or admin
    if (!question.author.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this question'
      });
    }

    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (tags) updates.tags = tags;

    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('author', 'username reputation');

    res.json({
      success: true,
      message: 'Question updated successfully',
      data: {
        question: updatedQuestion
      }
    });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update question'
    });
  }
};

// Delete a question (soft delete)
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);

    if (!question || question.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if user is author or admin
    if (!question.author.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this question'
      });
    }

    question.isDeleted = true;
    await question.save();

    res.json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete question'
    });
  }
};

// Vote on a question
const voteQuestion = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { vote } = req.body;
    const userId = req.user._id;

    const question = await Question.findById(id);
    if (!question || question.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if user is voting on their own question
    if (question.author.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot vote on your own question'
      });
    }

    // Remove existing vote
    question.votes.upvotes = question.votes.upvotes.filter(
      voteId => voteId.toString() !== userId.toString()
    );
    question.votes.downvotes = question.votes.downvotes.filter(
      voteId => voteId.toString() !== userId.toString()
    );

    // Add new vote
    if (vote === 1) {
      question.votes.upvotes.push(userId);
    } else if (vote === -1) {
      question.votes.downvotes.push(userId);
    }

    await question.save();

    // Calculate new vote count
    const voteCount = question.votes.upvotes.length - question.votes.downvotes.length;

    res.json({
      success: true,
      message: vote === 0 ? 'Vote removed' : `Vote ${vote > 0 ? 'up' : 'down'} recorded`,
      data: {
        voteCount,
        userVote: vote
      }
    });
  } catch (error) {
    console.error('Vote question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record vote'
    });
  }
};

module.exports = {
  createQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  voteQuestion
}; 