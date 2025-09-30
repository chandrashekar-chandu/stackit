const { validationResult } = require('express-validator');
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Create a new answer
const createAnswer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { id: questionId } = req.params;
    const { content } = req.body;

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question || question.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if question is closed
    if (question.isClosed) {
      return res.status(400).json({
        success: false,
        message: 'Cannot answer a closed question'
      });
    }

    const answer = new Answer({
      content,
      question: questionId,
      author: req.user._id
    });

    await answer.save();

    // Populate author details
    await answer.populate('author', 'username reputation');

    // Create notification for question author
    if (!question.author.equals(req.user._id)) {
      await Notification.createNotification({
        recipient: question.author,
        sender: req.user._id,
        type: 'answer',
        title: 'New answer to your question',
        message: `${req.user.username} answered your question: "${question.title}"`,
        relatedQuestion: questionId,
        relatedAnswer: answer._id
      });
    }

    res.status(201).json({
      success: true,
      message: 'Answer posted successfully',
      data: {
        answer
      }
    });
  } catch (error) {
    console.error('Create answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to post answer'
    });
  }
};

// Get answers for a question
const getAnswers = async (req, res) => {
  try {
    const { id: questionId } = req.params;
    const { page = 1, limit = 10, sort = 'votes' } = req.query;

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question || question.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
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
      default:
        sortObj = { isAccepted: -1, voteCount: -1, createdAt: 1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const answers = await Answer.find({
      question: questionId,
      isDeleted: false
    })
      .populate('author', 'username reputation')
      .populate('votes.upvotes', 'username')
      .populate('votes.downvotes', 'username')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Add vote counts and user vote info
    const answersWithCounts = answers.map(answer => ({
      ...answer,
      voteCount: answer.votes.upvotes.length - answer.votes.downvotes.length,
      userVote: req.user ? 
        (answer.votes.upvotes.some(v => v._id.equals(req.user._id)) ? 'upvote' :
         answer.votes.downvotes.some(v => v._id.equals(req.user._id)) ? 'downvote' : null) : null
    }));

    const total = await Answer.countDocuments({
      question: questionId,
      isDeleted: false
    });

    res.json({
      success: true,
      data: {
        answers: answersWithCounts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalAnswers: total,
          hasNext: skip + answers.length < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get answers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch answers'
    });
  }
};

// Update an answer
const updateAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const answer = await Answer.findById(id);

    if (!answer || answer.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found'
      });
    }

    // Check if user is author or admin
    if (!answer.author.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this answer'
      });
    }

    answer.content = content;
    await answer.save();

    await answer.populate('author', 'username reputation');

    res.json({
      success: true,
      message: 'Answer updated successfully',
      data: {
        answer
      }
    });
  } catch (error) {
    console.error('Update answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update answer'
    });
  }
};

// Delete an answer (soft delete)
const deleteAnswer = async (req, res) => {
  try {
    const { id } = req.params;

    const answer = await Answer.findById(id);

    if (!answer || answer.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found'
      });
    }

    // Check if user is author or admin
    if (!answer.author.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this answer'
      });
    }

    answer.isDeleted = true;
    await answer.save();

    res.json({
      success: true,
      message: 'Answer deleted successfully'
    });
  } catch (error) {
    console.error('Delete answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete answer'
    });
  }
};

// Accept an answer
const acceptAnswer = async (req, res) => {
  try {
    const { id } = req.params;

    const answer = await Answer.findById(id);

    if (!answer || answer.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found'
      });
    }

    const question = await Question.findById(answer.question);

    if (!question || question.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if user is question author
    if (!question.author.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Only the question author can accept answers'
      });
    }

    // If answer is already accepted, unaccept it
    if (answer.isAccepted) {
      await answer.unaccept();
      
      res.json({
        success: true,
        message: 'Answer unaccepted successfully',
        data: {
          isAccepted: false
        }
      });
    } else {
      // Unaccept any previously accepted answer
      if (question.acceptedAnswer) {
        const previousAnswer = await Answer.findById(question.acceptedAnswer);
        if (previousAnswer) {
          await previousAnswer.unaccept();
        }
      }

      // Accept this answer
      await answer.accept();

      // Create notification for answer author
      await Notification.createNotification({
        recipient: answer.author,
        sender: req.user._id,
        type: 'accept',
        title: 'Your answer was accepted!',
        message: `${req.user.username} accepted your answer to: "${question.title}"`,
        relatedQuestion: question._id,
        relatedAnswer: answer._id
      });

      res.json({
        success: true,
        message: 'Answer accepted successfully',
        data: {
          isAccepted: true
        }
      });
    }
  } catch (error) {
    console.error('Accept answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept answer'
    });
  }
};

module.exports = {
  createAnswer,
  getAnswers,
  updateAnswer,
  deleteAnswer,
  acceptAnswer
}; 