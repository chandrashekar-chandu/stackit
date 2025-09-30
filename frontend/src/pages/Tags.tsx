// @ts-nocheck
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { Tag, MessageSquare, TrendingUp, Clock, Eye, ThumbsUp } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

interface TagData {
  name: string
  count: number
  questions: any[]
}

export function Tags() {
  const [tags, setTags] = useState<TagData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [questionsLoading, setQuestionsLoading] = useState(false)

  useEffect(() => {
    fetchTags()
  }, [])

  useEffect(() => {
    if (selectedTag) {
      fetchQuestionsByTag(selectedTag)
    }
  }, [selectedTag])

  const fetchTags = async () => {
    try {
      setLoading(true)
      const response = await api.get('/questions')
      const allQuestions = response.data.data?.questions || response.data.questions || []
      
      // Extract unique tags and count questions
      const tagCounts: { [key: string]: number } = {}
      allQuestions.forEach((question: any) => {
        if (question.tags) {
          question.tags.forEach((tag: any) => {
            const tagName = typeof tag === 'string' ? tag : tag.name
            tagCounts[tagName] = (tagCounts[tagName] || 0) + 1
          })
        }
      })
      
      const tagsData = Object.entries(tagCounts).map(([name, count]) => ({
        name,
        count,
        questions: allQuestions.filter((q: any) => 
          q.tags && q.tags.some((t: any) => (typeof t === 'string' ? t : t.name) === name)
        )
      }))
      
      setTags(tagsData.sort((a, b) => b.count - a.count))
      toast.success(`Found ${tagsData.length} tags!`)
    } catch (error) {
      console.error('Failed to fetch tags:', error)
      toast.error('Failed to load tags')
    } finally {
      setLoading(false)
    }
  }

  const fetchQuestionsByTag = async (tagName: string) => {
    try {
      setQuestionsLoading(true)
      const response = await api.get(`/questions?tag=${encodeURIComponent(tagName)}`)
      setQuestions(response.data.data?.questions || response.data.questions || [])
    } catch (error) {
      console.error('Failed to fetch questions by tag:', error)
      toast.error('Failed to load questions for this tag')
    } finally {
      setQuestionsLoading(false)
    }
  }

  const handleTagClick = (tagName: string) => {
    setSelectedTag(tagName)
  }

  const clearSelection = () => {
    setSelectedTag(null)
    setQuestions([])
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tags...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tags</h1>
            <p className="text-gray-600">
              Browse questions by topic and technology
            </p>
          </div>
          {selectedTag && (
            <button
              onClick={clearSelection}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Back to all tags
            </button>
          )}
        </div>
      </motion.div>

      {selectedTag ? (
        /* Questions by Tag */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Questions tagged "{selectedTag}"
            </h2>
            <p className="text-gray-600">
              {questions.length} question{questions.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {questionsLoading ? (
            <div className="flex items-center justify-center min-h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question) => (
                <motion.div
                  key={question._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card p-6 hover:shadow-lg transition-shadow"
                >
                  <Link 
                    to={`/questions/${question._id}`}
                    className="block"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 mb-2">
                      {question.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <ThumbsUp size={14} />
                        <span>{question.voteCount || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare size={14} />
                        <span>{question.answerCount || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye size={14} />
                        <span>{question.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
              
              {questions.length === 0 && (
                <div className="text-center py-12">
                  <Tag size={64} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No questions found</h3>
                  <p className="text-gray-600 mb-6">
                    No questions are tagged with "{selectedTag}" yet.
                  </p>
                  <Link 
                    to="/ask" 
                    className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-lg hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Ask a Question
                  </Link>
                </div>
              )}
            </div>
          )}
        </motion.div>
      ) : (
        /* All Tags Grid */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {tags.map((tag, index) => (
            <motion.div
              key={tag.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="card p-6 cursor-pointer hover:shadow-lg transition-all duration-200"
              onClick={() => handleTagClick(tag.name)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                    <Tag className="text-primary-600" size={20} />
                  </div>
                  <span className="font-semibold text-gray-900">{tag.name}</span>
                </div>
                <span className="text-sm text-gray-500">{tag.count}</span>
              </div>
              <p className="text-sm text-gray-600">
                {tag.count} question{tag.count !== 1 ? 's' : ''}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
} 