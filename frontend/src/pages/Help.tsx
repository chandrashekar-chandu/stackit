import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, MessageSquare, ThumbsUp, Tag, Award, Users, Search, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { motion } from 'framer-motion'

interface FAQItem {
  question: string
  answer: string
}

export function Help() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const faqs: FAQItem[] = [
    {
      question: "How do I ask a question?",
      answer: "Click the 'Ask Question' button in the navigation bar. Make sure to provide a clear title, detailed description, and relevant tags to help others find and answer your question."
    },
    {
      question: "How does voting work?",
      answer: "You can upvote or downvote questions and answers. Upvoting helps good content rise to the top, while downvoting helps filter out poor quality content. Your votes affect the reputation of the content creator."
    },
    {
      question: "How do I earn reputation?",
      answer: "You earn reputation by receiving upvotes on your questions and answers. You can also earn reputation by having your answer accepted as the best answer to a question."
    },
    {
      question: "What are tags and how do I use them?",
      answer: "Tags help categorize questions and make them easier to find. When asking a question, add relevant tags like 'react', 'javascript', or 'nodejs'. You can also browse questions by tag on the Tags page."
    },
    {
      question: "How do I accept an answer?",
      answer: "If you're the author of a question, you can accept one answer as the best solution. Look for the 'Accept' button next to answers. Only one answer can be accepted per question."
    },
    {
      question: "Can I edit my questions and answers?",
      answer: "Currently, you can only edit your own questions and answers. Look for the edit button (pencil icon) next to your content."
    },
    {
      question: "How do I search for questions?",
      answer: "Use the search bar in the navigation to search for questions by title, content, or tags. You can also use advanced search filters on the home page."
    },
    {
      question: "What should I do if I see inappropriate content?",
      answer: "If you encounter inappropriate content, use the flag button to report it. Our moderation team will review flagged content and take appropriate action."
    }
  ]

  const features = [
    {
      icon: MessageSquare,
      title: "Ask Questions",
      description: "Post well-formulated questions with rich text formatting, code examples, and relevant tags.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: ThumbsUp,
      title: "Vote & Rate",
      description: "Upvote helpful content and downvote poor quality posts to maintain community standards.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Tag,
      title: "Tag System",
      description: "Organize content with tags and discover questions by technology, framework, or topic.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Award,
      title: "Build Reputation",
      description: "Earn reputation through quality contributions and accepted answers.",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: Users,
      title: "Community",
      description: "Connect with other developers, share knowledge, and grow together.",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: Search,
      title: "Smart Search",
      description: "Find answers quickly with our powerful search and filtering system.",
      color: "from-indigo-500 to-indigo-600"
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <div className="flex items-center justify-center mb-6">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl flex items-center justify-center shadow-2xl mr-6"
          >
            <BookOpen className="text-white" size={40} />
          </motion.div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-4">
          Help Center
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Learn how to use StackIt effectively and get the most out of our Q&A platform
        </p>
      </motion.div>

      {/* Quick Start Guide */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Start Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              step: "1",
              title: "Create an Account",
              description: "Sign up to start asking questions and contributing to the community.",
              action: "Sign Up",
              link: "/register"
            },
            {
              step: "2",
              title: "Ask Your First Question",
              description: "Use the 'Ask Question' button to post your first question with proper formatting.",
              action: "Ask Question",
              link: "/ask"
            },
            {
              step: "3",
              title: "Explore & Answer",
              description: "Browse questions, provide helpful answers, and build your reputation.",
              action: "Browse Questions",
              link: "/"
            }
          ].map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6 text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">{item.step}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <Link 
                to={item.link}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200"
              >
                <span>{item.action}</span>
                <Plus size={16} />
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="card p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                <feature.icon className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                {openFAQ === index ? (
                  <ChevronUp className="text-gray-500" size={20} />
                ) : (
                  <ChevronDown className="text-gray-500" size={20} />
                )}
              </button>
              {openFAQ === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-gray-200"
                >
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Contact */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
          <p className="text-gray-600 mb-6">
            If you couldn't find the answer you're looking for, feel free to reach out to our support team.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              to="/ask" 
              className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-lg hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Ask a Question
            </Link>
            <a 
              href="mailto:support@stackit.com" 
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  )
} 