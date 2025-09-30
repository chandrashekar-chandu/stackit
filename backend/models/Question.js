const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 20,
    maxlength: 5000
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 20
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  votes: {
    upvotes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    downvotes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  isClosed: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  acceptedAnswer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer',
    default: null
  }
}, {
  timestamps: true
});

// Virtual for vote count
questionSchema.virtual('voteCount').get(function() {
  return this.votes.upvotes.length - this.votes.downvotes.length;
});

// Virtual for answer count
questionSchema.virtual('answerCount', {
  ref: 'Answer',
  localField: '_id',
  foreignField: 'question',
  count: true
});

// Index for search
questionSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Method to check if user has voted
questionSchema.methods.hasUserVoted = function(userId) {
  return this.votes.upvotes.includes(userId) || this.votes.downvotes.includes(userId);
};

// Method to get user's vote
questionSchema.methods.getUserVote = function(userId) {
  if (this.votes.upvotes.includes(userId)) return 'upvote';
  if (this.votes.downvotes.includes(userId)) return 'downvote';
  return null;
};

// Method to add vote
questionSchema.methods.addVote = function(userId, voteType) {
  // Remove existing vote
  this.votes.upvotes = this.votes.upvotes.filter(id => !id.equals(userId));
  this.votes.downvotes = this.votes.downvotes.filter(id => !id.equals(userId));
  
  // Add new vote
  if (voteType === 'upvote') {
    this.votes.upvotes.push(userId);
  } else if (voteType === 'downvote') {
    this.votes.downvotes.push(userId);
  }
};

// Ensure virtuals are serialized
questionSchema.set('toJSON', { virtuals: true });
questionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Question', questionSchema); 