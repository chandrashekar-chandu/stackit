const Answer = require('../models/Answer');
const Question = require('../models/Question');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Vote on an answer
const voteAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body; // 'upvote' or 'downvote'

    if (!['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vote type. Must be "upvote" or "downvote"'
      });
    }

    const answer = await Answer.findById(id);

    if (!answer || answer.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found'
      });
    }

    // Check if user is voting on their own answer
    if (answer.author.equals(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot vote on your own answer'
      });
    }

    // Check if user has already voted
    const hasVoted = answer.hasUserVoted(req.user._id);
    const previousVote = answer.getUserVote(req.user._id);

    // Add vote
    answer.addVote(req.user._id, voteType);
    await answer.save();

    // Calculate reputation change
    let reputationChange = 0;
    if (!hasVoted) {
      // First time voting
      reputationChange = voteType === 'upvote' ? 10 : -2;
    } else if (previousVote !== voteType) {
      // Changed vote
      reputationChange = voteType === 'upvote' ? 12 : -12; // +10 for new upvote, -2 for removing downvote
    }

    // Update author reputation
    if (reputationChange !== 0) {
      await User.findByIdAndUpdate(answer.author, {
        $inc: { reputation: reputationChange }
      });
    }

    // Create notification for answer author (only for new votes, not vote changes)
    if (!hasVoted) {
      await Notification.createNotification({
        recipient: answer.author,
        sender: req.user._id,
        type: 'vote',
        title: 'Someone voted on your answer',
        message: `${req.user.username} ${voteType}d your answer`,
        relatedAnswer: answer._id
      });
    }

    res.json({
      success: true,
      message: 'Vote recorded successfully',
      data: {
        voteCount: answer.voteCount,
        userVote: voteType,
        previousVote,
        reputationChange
      }
    });
  } catch (error) {
    console.error('Vote answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record vote'
    });
  }
};

// Vote on a question
const voteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body; // 'upvote' or 'downvote'

    if (!['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vote type. Must be "upvote" or "downvote"'
      });
    }

    const question = await Question.findById(id);

    if (!question || question.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if user is voting on their own question
    if (question.author.equals(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot vote on your own question'
      });
    }

    // Check if user has already voted
    const hasVoted = question.hasUserVoted(req.user._id);
    const previousVote = question.getUserVote(req.user._id);

    // Add vote
    question.addVote(req.user._id, voteType);
    await question.save();

    // Calculate reputation change
    let reputationChange = 0;
    if (!hasVoted) {
      // First time voting
      reputationChange = voteType === 'upvote' ? 5 : -1;
    } else if (previousVote !== voteType) {
      // Changed vote
      reputationChange = voteType === 'upvote' ? 6 : -6; // +5 for new upvote, -1 for removing downvote
    }

    // Update author reputation
    if (reputationChange !== 0) {
      await User.findByIdAndUpdate(question.author, {
        $inc: { reputation: reputationChange }
      });
    }

    res.json({
      success: true,
      message: 'Vote recorded successfully',
      data: {
        voteCount: question.voteCount,
        userVote: voteType,
        previousVote,
        reputationChange
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

// Remove vote from an answer or question
const removeVote = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query; // 'question' or 'answer'

    if (!['question', 'answer'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid type. Must be "question" or "answer"'
      });
    }

    let item;
    if (type === 'answer') {
      item = await Answer.findById(id);
    } else {
      item = await Question.findById(id);
    }

    if (!item || item.isDeleted) {
      return res.status(404).json({
        success: false,
        message: `${type === 'answer' ? 'Answer' : 'Question'} not found`
      });
    }

    // Check if user has voted
    const previousVote = item.getUserVote(req.user._id);
    if (!previousVote) {
      return res.status(400).json({
        success: false,
        message: 'No vote to remove'
      });
    }

    // Remove vote
    item.addVote(req.user._id, null); // This removes the vote
    await item.save();

    // Update author reputation
    const reputationChange = previousVote === 'upvote' ? -5 : 1; // Reverse the previous vote
    await User.findByIdAndUpdate(item.author, {
      $inc: { reputation: reputationChange }
    });

    res.json({
      success: true,
      message: 'Vote removed successfully',
      data: {
        voteCount: item.voteCount,
        userVote: null,
        previousVote,
        reputationChange
      }
    });
  } catch (error) {
    console.error('Remove vote error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove vote'
    });
  }
};

// Get vote statistics for a user
const getUserVoteStats = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get questions voted on
    const questionsVoted = await Question.find({
      $or: [
        { 'votes.upvotes': userId },
        { 'votes.downvotes': userId }
      ],
      isDeleted: false
    }).select('title _id');

    // Get answers voted on
    const answersVoted = await Answer.find({
      $or: [
        { 'votes.upvotes': userId },
        { 'votes.downvotes': userId }
      ],
      isDeleted: false
    }).select('content _id');

    // Count upvotes and downvotes
    const questionUpvotes = await Question.countDocuments({
      'votes.upvotes': userId,
      isDeleted: false
    });
    const questionDownvotes = await Question.countDocuments({
      'votes.downvotes': userId,
      isDeleted: false
    });
    const answerUpvotes = await Answer.countDocuments({
      'votes.upvotes': userId,
      isDeleted: false
    });
    const answerDownvotes = await Answer.countDocuments({
      'votes.downvotes': userId,
      isDeleted: false
    });

    res.json({
      success: true,
      data: {
        questionsVoted: questionsVoted.length,
        answersVoted: answersVoted.length,
        totalUpvotes: questionUpvotes + answerUpvotes,
        totalDownvotes: questionDownvotes + answerDownvotes,
        questionStats: {
          upvotes: questionUpvotes,
          downvotes: questionDownvotes
        },
        answerStats: {
          upvotes: answerUpvotes,
          downvotes: answerDownvotes
        }
      }
    });
  } catch (error) {
    console.error('Get user vote stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get vote statistics'
    });
  }
};

module.exports = {
  voteAnswer,
  voteQuestion,
  removeVote,
  getUserVoteStats
}; 