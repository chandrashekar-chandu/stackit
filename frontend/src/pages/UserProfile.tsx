import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import { MessageSquare, ThumbsUp, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export function UserProfile() {
  const { id } = useParams()
  const [user, setUser] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [answers, setAnswers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUserProfile()
  }, [id])

  const fetchUserProfile = async () => {
    try {
          const response = await api.get(`/users/${id}`)
    if ('user' in response.data && 'questions' in response.data && 'answers' in response.data) {
      setUser(response.data.user)
      setQuestions(response.data.questions)
      setAnswers(response.data.answers)
    }
    } catch (error) {
      setError('Failed to load user profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">User not found</h3>
        <Link to="/" className="text-primary-600 hover:text-primary-500">
          Back to questions
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* User Info */}
      <div className="card p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
            <p className="text-gray-600">Member since {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-sm text-gray-500">Reputation: {user.reputation}</span>
              {user.role === 'admin' && (
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Questions */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Questions ({questions.length})</h2>
          <div className="space-y-4">
            {questions.map((question) => (
              <div key={question.id} className="card p-4">
                <Link 
                  to={`/questions/${question.id}`}
                  className="text-lg font-medium text-gray-900 hover:text-primary-600"
                >
                  {question.title}
                </Link>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <ThumbsUp size={14} />
                    <span>{question.votes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare size={14} />
                    <span>{question.answer_count || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{formatDistanceToNow(new Date(question.created_at), { addSuffix: true })}</span>
                  </div>
                  {question.is_answered && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      Answered
                    </span>
                  )}
                </div>
              </div>
            ))}
            {questions.length === 0 && (
              <p className="text-gray-500 text-center py-8">No questions yet</p>
            )}
          </div>
        </div>

        {/* Answers */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Answers ({answers.length})</h2>
          <div className="space-y-4">
            {answers.map((answer) => (
              <div key={answer.id} className="card p-4">
                <Link 
                  to={`/questions/${answer.question_id}`}
                  className="text-lg font-medium text-gray-900 hover:text-primary-600"
                >
                  {answer.question_title}
                </Link>
                <div className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {answer.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                </div>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <ThumbsUp size={14} />
                    <span>{answer.votes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{formatDistanceToNow(new Date(answer.created_at), { addSuffix: true })}</span>
                  </div>
                  {answer.is_accepted && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      Accepted
                    </span>
                  )}
                </div>
              </div>
            ))}
            {answers.length === 0 && (
              <p className="text-gray-500 text-center py-8">No answers yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 