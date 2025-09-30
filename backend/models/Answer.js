const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 10000
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  isAccepted: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Virtual for vote count
answerSchema.virtual('voteCount').get(function() {
  return this.votes.upvotes.length - this.votes.downvotes.length;
});

// Method to check if user has voted
answerSchema.methods.hasUserVoted = function(userId) {
  return this.votes.upvotes.includes(userId) || this.votes.downvotes.includes(userId);
};

// Method to get user's vote
answerSchema.methods.getUserVote = function(userId) {
  if (this.votes.upvotes.includes(userId)) return 'upvote';
  if (this.votes.downvotes.includes(userId)) return 'downvote';
  return null;
};

// Method to add vote
answerSchema.methods.addVote = function(userId, voteType) {
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

// Method to accept answer
answerSchema.methods.accept = async function() {
  this.isAccepted = true;
  
  // Update question's accepted answer
  const Question = mongoose.model('Question');
  await Question.findByIdAndUpdate(this.question, {
    acceptedAnswer: this._id
  });
  
  // Give reputation to answer author
  const User = mongoose.model('User');
  await User.findByIdAndUpdate(this.author, {
    $inc: { reputation: 15 }
  });
  
  return this.save();
};

// Method to unaccept answer
answerSchema.methods.unaccept = async function() {
  this.isAccepted = false;
  
  // Remove from question's accepted answer
  const Question = mongoose.model('Question');
  await Question.findByIdAndUpdate(this.question, {
    $unset: { acceptedAnswer: 1 }
  });
  
  // Remove reputation from answer author
  const User = mongoose.model('User');
  await User.findByIdAndUpdate(this.author, {
    $inc: { reputation: -15 }
  });
  
  return this.save();
};

// Ensure virtuals are serialized
answerSchema.set('toJSON', { virtuals: true });
answerSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Answer', answerSchema); 