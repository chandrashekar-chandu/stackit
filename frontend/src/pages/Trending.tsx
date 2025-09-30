import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { TrendingUp, MessageSquare, Clock, Eye, ThumbsUp, Flame, Zap, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

interface Question {
  _id: string
  title: string
  description: string
  views: number
  voteCount: number
  answerCount: number
  acceptedAnswer: any
  createdAt: string
  author: {
    _id: string
    username: string
    reputation: number
  }
  tags?: string[]
}

export function Trending() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState('week') // week, month, year

  useEffect(() => {
    fetchTrendingQuestions()
  }, [timeFilter])

  const fetchTrendingQuestions = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/questions?sort=votes&time=${timeFilter}`)
      
      if (response.data && (response.data.data?.questions || response.data.questions)) {
        const questions = response.data.data?.questions || response.data.questions
        setQuestions(questions)
        toast.success(`Found ${questions.length} trending questions!`)
      } else {
        setQuestions([])
      }
    } catch (error) {
      console.error('Failed to fetch trending questions:', error)
      toast.error('Failed to load trending questions')
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }

  const getTimeFilterLabel = (filter: string) => {
    switch (filter) {
      case 'week': return 'This Week'
      case 'month': return 'This Month'
      case 'year': return 'This Year'
      default: return 'This Week'
    }
  }

  const getTrendingScore = (question: Question) => {
    // Simple trending score based on votes, answers, and recency
    const daysSinceCreation = (Date.now() - new Date(question.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    const recencyFactor = Math.max(1, 10 - daysSinceCreation)
    return ((question.voteCount || 0) * 2 + (question.answerCount || 0) * 3) * recencyFactor
  }

  const sortedQuestions = [...questions].sort((a, b) => getTrendingScore(b) - getTrendingScore(a))

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trending questions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Trending Questions</h1>
            <p className="text-gray-600">
              Discover the most popular and active discussions in our community
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Flame className="text-orange-500" size={24} />
            <span className="text-sm text-gray-500">Trending</span>
          </div>
        </div>

        {/* Time Filter */}
        <div className="flex space-x-2">
          {[
            { key: 'week', label: 'This Week', icon: Zap },
            { key: 'month', label: 'This Month', icon: Star },
            { key: 'year', label: 'This Year', icon: TrendingUp }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTimeFilter(key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeFilter === key
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Questions List */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        {sortedQuestions.map((question, index) => (
          <motion.div
            key={question._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6 hover:shadow-lg transition-all duration-200"
          >
            <Link 
              to={`/questions/${question._id}`}
              className="block"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                  {question.title}
                </h3>
                {index < 3 && (
                  <div className="flex items-center space-x-1">
                    <Flame className="text-orange-500" size={16} />
                    <span className="text-xs text-orange-600 font-medium">#{index + 1}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center space-x-1">
                  <ThumbsUp size={14} />
                  <span>{question.voteCount || 0} votes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare size={14} />
                  <span>{question.answerCount || 0} answers</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye size={14} />
                  <span>{question.views} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock size={14} />
                  <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Tags */}
              {question.tags && question.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {question.tags.slice(0, 3).map((tag, i) => (
                    <span 
                      key={i} 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 border border-primary-300"
                    >
                      {typeof tag === 'string' ? tag : tag.name}
                    </span>
                  ))}
                  {question.tags.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{question.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Author Info */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">
                      {(question.author?.username || 'A').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">{question.author?.username || 'Anonymous'}</span>
                  <span className="text-xs text-gray-400">• Rep: {question.author?.reputation || 0}</span>
                </div>
                
                {question.acceptedAnswer && (
                  <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    <span>✓</span>
                    <span>Answered</span>
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        ))}

        {/* Empty State */}
        {sortedQuestions.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <TrendingUp size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No trending questions</h3>
            <p className="text-gray-600 mb-6">
              No questions are trending {getTimeFilterLabel(timeFilter).toLowerCase()} yet.
            </p>
            <div className="flex justify-center space-x-4">
              <Link 
                to="/" 
                className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-lg hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Browse All Questions
              </Link>
              <Link 
                to="/ask" 
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Ask a Question
              </Link>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
} 