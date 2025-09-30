// @ts-nocheck
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { AlertCircle, Tag, X, ChevronDown, Sparkles, Lightbulb, BookOpen } from 'lucide-react'
import { RichTextEditor } from '../components/RichTextEditor'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export function AskQuestion() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [showTagDropdown, setShowTagDropdown] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Available tags for selection
  const availableTags = [
    'react', 'javascript', 'typescript', 'nodejs', 'python', 'java', 'c++', 'c#',
    'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'dart', 'flutter',
    'html', 'css', 'sass', 'less', 'bootstrap', 'tailwind', 'material-ui',
    'vue', 'angular', 'svelte', 'nextjs', 'nuxt', 'gatsby',
    'mongodb', 'postgresql', 'mysql', 'sqlite', 'redis', 'elasticsearch',
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'heroku',
    'git', 'github', 'gitlab', 'bitbucket', 'jenkins', 'travis',
    'webpack', 'vite', 'rollup', 'babel', 'eslint', 'prettier',
    'testing', 'jest', 'cypress', 'selenium', 'unit-testing', 'e2e-testing',
    'api', 'rest', 'graphql', 'websocket', 'authentication', 'authorization',
    'security', 'encryption', 'hashing', 'oauth', 'jwt', 'session'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/questions', {
        title,
        description: content,
        tags: tags.map(tag => tag.name)
      })
      
      toast.success('Question posted successfully! 🎉')
      const questionId = response.data.data?.question?._id || response.data.question?._id || response.data.id
      navigate(`/questions/${questionId}`)
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create question'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const addTag = (tagName) => {
    const tag = { name: tagName.toLowerCase(), id: Date.now() }
    if (!tags.find(t => t.name === tag.name)) {
      setTags([...tags, tag])
      toast.success(`Added tag: ${tagName}`)
    }
    setTagInput('')
    setShowTagDropdown(false)
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag.id !== tagToRemove.id))
    toast.success(`Removed tag: ${tagToRemove.name}`)
  }

  const filteredTags = availableTags.filter(tag => 
    tag.toLowerCase().includes(tagInput.toLowerCase()) && 
    !tags.find(t => t.name === tag.toLowerCase())
  )

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg mr-4"
          >
            <Sparkles className="text-white" size={32} />
          </motion.div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-2">
          Ask a Question
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Share your knowledge and help others by asking a well-formulated question. 
          Be specific and provide context for better answers!
        </p>
      </motion.div>

      {/* Tips Section */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Lightbulb className="text-blue-600 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Tips for a great question:</h3>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• Be specific and provide context</li>
                <li>• Include code examples if relevant</li>
                <li>• Mention what you've already tried</li>
                <li>• Use appropriate tags to help others find your question</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-200"
          >
            <AlertCircle size={20} />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Title Section */}
        <motion.div variants={itemVariants} className="card p-6 shadow-lg border-0">
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-3">
            Title *
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input w-full text-lg border-2 border-gray-200 focus:border-primary-500 transition-colors"
            placeholder="What's your question? Be specific."
            maxLength={300}
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-gray-500">
              {title.length}/300 characters
            </p>
            <div className="flex items-center space-x-2">
              <BookOpen size={14} className="text-gray-400" />
              <span className="text-xs text-gray-400">Be specific and clear</span>
            </div>
          </div>
        </motion.div>

        {/* Content Section */}
        <motion.div variants={itemVariants} className="card p-6 shadow-lg border-0">
          <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-3">
            Description *
          </label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Provide all the information someone would need to answer your question..."
          />
          <p className="mt-3 text-sm text-gray-500 flex items-center">
            <Sparkles size={14} className="mr-1" />
            Use the toolbar above to format your text, add links, images, and emojis.
          </p>
        </motion.div>

        {/* Tags Section */}
        <motion.div variants={itemVariants} className="card p-6 shadow-lg border-0">
          <label htmlFor="tags" className="block text-sm font-semibold text-gray-700 mb-3">
            Tags
          </label>
          <div className="relative">
            <div className="flex items-center">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Tag className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="tags"
                type="text"
                value={tagInput}
                onChange={(e) => {
                  setTagInput(e.target.value)
                  setShowTagDropdown(true)
                }}
                onFocus={() => setShowTagDropdown(true)}
                className="input pl-12 pr-12 border-2 border-gray-200 focus:border-primary-500 transition-colors"
                placeholder="Search and select tags..."
                disabled={tags.length >= 5}
              />
              <button
                type="button"
                onClick={() => setShowTagDropdown(!showTagDropdown)}
                className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ChevronDown size={16} />
              </button>
            </div>
            
            {/* Tag Dropdown */}
            {showTagDropdown && filteredTags.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto"
              >
                {filteredTags.slice(0, 10).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <span className="font-medium">{tag}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
          
          {/* Selected Tags */}
          {tags.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex flex-wrap gap-2"
            >
              {tags.map((tag) => (
                <motion.span
                  key={tag.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 border border-primary-300"
                >
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-primary-600 hover:bg-primary-300 hover:text-primary-800 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </motion.span>
              ))}
            </motion.div>
          )}
          <p className="mt-3 text-sm text-gray-500">
            {tags.length}/5 tags • Select from popular tags or type to search
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
          >
            Cancel
          </button>
          <motion.button
            type="submit"
            disabled={loading || !title.trim() || !content.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 border border-transparent rounded-xl hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Posting Question...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Sparkles size={16} />
                <span>Post Question</span>
              </div>
            )}
          </motion.button>
        </motion.div>
      </motion.form>
    </motion.div>
  )
} 