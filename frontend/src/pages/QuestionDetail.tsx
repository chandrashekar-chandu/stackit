// @ts-nocheck
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { RichTextEditor } from '../components/RichTextEditor'
import { 
  ThumbsUp, ThumbsDown, MessageSquare, Clock, User, CheckCircle, 
  Share, Bookmark, Flag, Edit, Trash2, Award, Eye, Tag
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

export function QuestionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [question, setQuestion] = useState(null)
  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAnswerForm, setShowAnswerForm] = useState(false)
  const [answerContent, setAnswerContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [userVote, setUserVote] = useState(0) // -1, 0, 1

  useEffect(() => {
    fetchQuestion()
  }, [id])

  const fetchQuestion = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/questions/${id}`)
      const questionData = response.data.data?.question || response.data.question
      const answersData = response.data.data?.answers || response.data.answers || []
      
      if (!questionData) {
        toast.error('Question not found')
        navigate('/')
        return
      }
      
      setQuestion(questionData)
      setAnswers(answersData)
      toast.success('Question loaded successfully!')
    } catch (error) {
      console.error('Failed to fetch question:', error)
      toast.error('Failed to load question')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (voteType) => {
    if (!user) {
      toast.error('Please login to vote')
      navigate('/login')
      return
    }

    try {
      const newVote = userVote === voteType ? 0 : voteType
      setUserVote(newVote)
      
      // Call the voting API with the correct format
      const response = await api.post(`/questions/${id}/vote`, { vote: newVote })
      
      // Update question votes
      setQuestion(prev => ({
        ...prev,
        voteCount: response.data.data?.voteCount || (prev.voteCount || 0) + (newVote - userVote)
      }))
      
      toast.success(newVote === 0 ? 'Vote removed' : `Vote ${newVote > 0 ? 'up' : 'down'} recorded`)
    } catch (error) {
      console.error('Voting error:', error)
      if (error.response?.status === 401) {
        toast.error('Please login to vote')
        navigate('/login')
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to record vote'
        toast.error(errorMessage)
      }
      setUserVote(userVote) // Revert on error
    }
  }

  const handleSubmitAnswer = async (e) => {
    e.preventDefault()
    if (!answerContent.trim()) {
      toast.error('Please enter an answer')
      return
    }

    if (!user) {
      toast.error('Please login to answer')
      navigate('/login')
      return
    }

    try {
      setSubmitting(true)
      const response = await api.post(`/questions/${id}/answers`, {
        content: answerContent
      })
      
      const newAnswer = response.data.data?.answer || response.data.answer || response.data
      setAnswers([...answers, newAnswer])
      setAnswerContent('')
      setShowAnswerForm(false)
      toast.success('Answer posted successfully! 🎉')
    } catch (error) {
      console.error('Answer submission error:', error)
      if (error.response?.status === 401) {
        toast.error('Please login to answer')
        navigate('/login')
      } else {
      toast.error('Failed to post answer')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleAcceptAnswer = async (answerId) => {
    try {
      await api.patch(`/answers/${answerId}/accept`)
      setAnswers(answers.map(answer => ({
        ...answer,
        isAccepted: answer._id === answerId
      })))
      setQuestion(prev => ({ ...prev, acceptedAnswer: answerId }))
      toast.success('Answer accepted! ✅')
    } catch (error) {
      toast.error('Failed to accept answer')
    }
  }

  const handleDeleteQuestion = async () => {
    if (!confirm('Are you sure you want to delete this question?')) return
    
    try {
      await api.delete(`/questions/${id}`)
      toast.success('Question deleted successfully')
      navigate('/')
    } catch (error) {
      toast.error('Failed to delete question')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading question...</p>
        </div>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Question not found</h2>
        <p className="text-gray-600 mb-4">The question you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          Go Home
        </button>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* Question Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{question.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>Asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye size={14} />
                <span>{question.views} views</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare size={14} />
                <span>{answers.length} answers</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              <Share size={16} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              <Bookmark size={16} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              <Flag size={16} />
            </button>
            {user && user._id === question.author?._id && (
              <>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                  <Edit size={16} />
                </button>
                <button 
                  onClick={handleDeleteQuestion}
                  className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tags */}
        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {question.tags.map((tag, i) => (
              <span 
                key={i} 
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 border border-primary-300 hover:from-primary-200 hover:to-primary-300 transition-all duration-200"
              >
                <Tag size={12} className="mr-1" />
                {typeof tag === 'string' ? tag : tag.name}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Question Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 shadow-lg border-0 mb-8"
      >
        <div className="flex space-x-6">
          {/* Voting */}
          <div className="flex flex-col items-center space-y-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleVote(1)}
              className={`p-2 rounded-lg transition-colors ${
                userVote === 1 
                  ? 'bg-green-100 text-green-600' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ThumbsUp size={20} />
            </motion.button>
            
            <span className="text-xl font-bold text-gray-900">{question.voteCount || 0}</span>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleVote(-1)}
              className={`p-2 rounded-lg transition-colors ${
                userVote === -1 
                  ? 'bg-red-100 text-red-600' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ThumbsDown size={20} />
            </motion.button>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div 
              className="prose max-w-none mb-6"
              dangerouslySetInnerHTML={{ __html: question.description }}
            />
            
            {/* Author Info */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {(question.author?.username || 'Anonymous').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <a 
                    href={`/users/${question.author?._id}`}
                    className="font-medium text-gray-900 hover:text-primary-600 transition-colors"
                  >
                    {question.author?.username || 'Anonymous'}
                  </a>
                  <p className="text-sm text-gray-500">Reputation: {question.author?.reputation || 0}</p>
                </div>
              </div>
              
              {question.acceptedAnswer && (
                <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  <CheckCircle size={14} />
                  <span>Solved</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Answers Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {answers.length} Answer{answers.length !== 1 ? 's' : ''}
          </h2>
          {user && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAnswerForm(!showAnswerForm)}
              className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-lg hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <MessageSquare size={16} className="mr-2 inline" />
              {showAnswerForm ? 'Cancel' : 'Write Answer'}
            </motion.button>
          )}
        </div>

        {/* Answer Form */}
        <AnimatePresence>
          {showAnswerForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="card p-6 shadow-lg border-0 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
              <form onSubmit={handleSubmitAnswer}>
                <RichTextEditor
                  value={answerContent}
                  onChange={setAnswerContent}
                  placeholder="Write your answer here..."
                />
                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowAnswerForm(false)}
                    className="px-4 py-2 text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={submitting || !answerContent.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {submitting ? 'Posting...' : 'Post Answer'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Answers List */}
        <div className="space-y-6">
          {answers.map((answer, index) => (
            <motion.div
              key={answer._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`card p-6 shadow-lg border-0 ${
                answer.isAccepted ? 'ring-2 ring-green-500 bg-green-50' : ''
              }`}
            >
              <div className="flex space-x-6">
                {/* Voting */}
                <div className="flex flex-col items-center space-y-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                    <ThumbsUp size={20} />
                  </button>
                  <span className="text-xl font-bold text-gray-900">{answer.voteCount || 0}</span>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                    <ThumbsDown size={20} />
                  </button>
                  
                  {answer.is_accepted && (
                    <div className="mt-2 p-2 bg-green-100 text-green-600 rounded-lg">
                      <Award size={16} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div 
                    className="prose max-w-none mb-6"
                    dangerouslySetInnerHTML={{ __html: answer.content }}
                  />
                  
                  {/* Author Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">
                          {(answer.author?.username || 'Anonymous').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <a 
                          href={`/users/${answer.author?._id}`}
                          className="font-medium text-gray-900 hover:text-primary-600 transition-colors"
                        >
                          {answer.author?.username || 'Anonymous'}
                        </a>
                        <p className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    
                    {user && user._id === question.author?._id && !question.acceptedAnswer && (
                      <button
                        onClick={() => handleAcceptAnswer(answer._id)}
                        className="flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        <CheckCircle size={14} />
                        <span>Accept</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Answers */}
        {answers.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <MessageSquare size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No answers yet</h3>
            <p className="text-gray-600 mb-6">Be the first to answer this question!</p>
            {user ? (
              <button
                onClick={() => setShowAnswerForm(true)}
                className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-lg hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Write Answer
              </button>
            ) : (
              <p className="text-gray-500">Please login to answer this question.</p>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
} 