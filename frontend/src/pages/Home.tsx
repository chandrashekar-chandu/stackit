// @ts-nocheck
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { 
  MessageSquare, TrendingUp, Clock, Eye, ThumbsUp, Users, Tag, 
  Search, BookOpen, Award, Shield, Zap, Heart, Star, ArrowRight,
  CheckCircle, Users2, Lightbulb, Code, Globe, Rocket, Bell
} from 'lucide-react'
import { FiltersBar } from '../components/FiltersBar'
import { QuestionItem } from '../components/QuestionItem'
import { Pagination } from '../components/Pagination'
import { motion, useScroll, useTransform } from 'framer-motion'
import toast from 'react-hot-toast'

interface Question {
  id: number
  title: string
  content: string
  views: number
  votes: number
  is_answered: boolean
  created_at: string
  user_id: number
  username: string
  reputation: number
  answer_count: number
  tags?: { name: string }[]
}

interface PaginationType {
  page: number
  limit: number
  total: number
  pages: number
}

export function Home() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [pagination, setPagination] = useState<PaginationType | null>(null)
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('newest')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showQuestions, setShowQuestions] = useState(false)

  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 300], [0, -50])

  useEffect(() => {
    setPage(1)
  }, [sort, search])

  useEffect(() => {
    fetchQuestions(page)
  }, [sort, search, page])

  const fetchQuestions = async (pageToFetch = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pageToFetch.toString(),
        limit: '10',
        sort,
        ...(search && { search })
      })
      const response = await api.get(`/questions?${params}`)
      
      if (response.data && (response.data.data?.questions || response.data.questions)) {
        const questions = response.data.data?.questions || response.data.questions
        const pagination = response.data.data?.pagination || response.data.pagination
        setQuestions(questions)
        setPagination(pagination)
        if (pageToFetch === 1) {
          toast.success(`Found ${questions.length} questions!`)
        }
      } else {
        setQuestions([])
        setPagination(null)
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error)
      toast.error('Failed to load questions')
      setQuestions([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const features = [
    {
      icon: MessageSquare,
      title: "Rich Q&A Experience",
      description: "Ask and answer questions with our powerful rich text editor supporting formatting, images, and code blocks.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Tag,
      title: "Smart Tagging System",
      description: "Organize content with relevant tags and discover questions by technology, framework, or topic.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: ThumbsUp,
      title: "Voting & Recognition",
      description: "Upvote helpful answers and accept the best solution. Build reputation through quality contributions.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Bell,
      title: "Real-time Notifications",
      description: "Stay updated with instant notifications for answers, mentions, and community activity.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Shield,
      title: "Community Moderation",
      description: "Safe and respectful environment with admin moderation and content quality controls.",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Zap,
      title: "Fast & Responsive",
      description: "Lightning-fast performance with modern UI/UX designed for seamless knowledge sharing.",
      color: "from-yellow-500 to-yellow-600"
    }
  ]

  const stats = [
    { icon: MessageSquare, label: 'Questions', value: '12.5K', color: 'from-blue-500 to-blue-600' },
    { icon: Users, label: 'Active Users', value: '8.2K', color: 'from-green-500 to-green-600' },
    { icon: ThumbsUp, label: 'Answers', value: '45.3K', color: 'from-purple-500 to-purple-600' },
    { icon: Tag, label: 'Tags', value: '1.2K', color: 'from-orange-500 to-orange-600' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-blue-50 to-indigo-100 py-20"
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-24 h-24 bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-6"
              >
                <MessageSquare className="text-white" size={48} />
              </motion.div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
                Welcome to StackIt
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                The ultimate Q&A platform for developers. Ask questions, share knowledge, and build a thriving community of learners and experts.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link 
                to="/ask"
                className="group bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-xl hover:from-primary-700 hover:to-primary-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-semibold text-lg"
              >
                <div className="flex items-center space-x-2">
                  <MessageSquare size={20} />
                  <span>Ask a Question</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
              <button
                onClick={() => setShowQuestions(true)}
                className="bg-white text-primary-600 px-8 py-4 rounded-xl hover:bg-gray-50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-semibold text-lg border-2 border-primary-200"
              >
                <div className="flex items-center space-x-2">
                  <Search size={20} />
                  <span>Browse Questions</span>
                </div>
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                      <stat.icon className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose StackIt?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for developers, by developers. Experience the perfect balance of simplicity and powerful features.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                  <feature.icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes and start contributing to the community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Ask a Question",
                description: "Post your question with rich formatting, code examples, and relevant tags.",
                icon: MessageSquare,
                color: "from-blue-500 to-blue-600"
              },
              {
                step: "2",
                title: "Get Answers",
                description: "Receive answers from the community with voting and acceptance features.",
                icon: Users2,
                color: "from-green-500 to-green-600"
              },
              {
                step: "3",
                title: "Build Reputation",
                description: "Earn reputation by providing helpful answers and contributing to discussions.",
                icon: Award,
                color: "from-purple-500 to-purple-600"
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <span className="text-white font-bold text-2xl">{step.step}</span>
                </div>
                <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <step.icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Questions Section - Only show when requested */}
      {showQuestions && (
        <motion.section 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="py-20 bg-white"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Recent Questions
              </h2>
              <p className="text-gray-600">
                Explore the latest questions from our community
              </p>
            </motion.div>

            {/* Filters Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <FiltersBar
                sort={sort}
                setSort={setSort}
                search={search}
                setSearch={setSearch}
                onAsk={() => {}}
              />
            </motion.div>

            {/* Questions List */}
            {loading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center min-h-64"
              >
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading questions...</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {questions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    <QuestionItem question={question} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {pagination && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <Pagination
                  page={pagination.page}
                  pages={pagination.pages}
                  onPageChange={handlePageChange}
                />
              </motion.div>
            )}

            {/* Empty State */}
            {questions.length === 0 && !loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare size={48} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No questions found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {search ? `No questions match "${search}". Try different keywords or browse all questions.` : 'Be the first to ask a question and start the conversation!'}
                </p>
                <div className="flex justify-center space-x-4">
                  <Link 
                    to="/ask" 
                    className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-lg hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    Ask Question
                  </Link>
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.section>
      )}
    </div>
  )
} 