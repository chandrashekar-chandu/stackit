// @ts-nocheck
import { Link } from 'react-router-dom'
import { MessageSquare, ThumbsUp, Eye, Users, Tag, CheckCircle } from 'lucide-react'

export function Demo() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-3xl">S</span>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to StackIt
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A modern Q&A platform for collaborative learning and knowledge sharing. 
          Built with React, TypeScript, and Tailwind CSS.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/" className="btn btn-primary text-lg px-8 py-3">
            Explore Questions
          </Link>
          <Link to="/register" className="btn btn-outline text-lg px-8 py-3">
            Get Started
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ask Questions</h3>
          <p className="text-gray-600">
            Post detailed questions with rich content and tags to get help from the community.
          </p>
        </div>

        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Answers</h3>
          <p className="text-gray-600">
            Receive helpful answers from experts and accept the best solution for your problem.
          </p>
        </div>

        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <ThumbsUp className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Vote & Rate</h3>
          <p className="text-gray-600">
            Upvote helpful content and downvote poor answers to maintain quality.
          </p>
        </div>

        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Tag className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tag System</h3>
          <p className="text-gray-600">
            Organize content with tags and easily find questions in your area of interest.
          </p>
        </div>

        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">User Profiles</h3>
          <p className="text-gray-600">
            Build your reputation and track your contributions to the community.
          </p>
        </div>

        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Eye className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse & Search</h3>
          <p className="text-gray-600">
            Find answers quickly with powerful search and filtering options.
          </p>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="card p-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Built with Modern Technologies</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold text-xl">R</span>
            </div>
            <h4 className="font-semibold text-gray-900">React 18</h4>
            <p className="text-sm text-gray-600">Modern UI Library</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-xl">TS</span>
            </div>
            <h4 className="font-semibold text-gray-900">TypeScript</h4>
            <p className="text-sm text-gray-600">Type Safety</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <h4 className="font-semibold text-gray-900">Tailwind CSS</h4>
            <p className="text-sm text-gray-600">Utility-First CSS</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <h4 className="font-semibold text-gray-900">Vite</h4>
            <p className="text-sm text-gray-600">Fast Build Tool</p>
          </div>
        </div>
      </div>

      {/* Demo Questions Preview */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Sample Questions</h2>
        <div className="space-y-4">
          <div className="card p-6">
            <div className="flex items-start space-x-4">
              <div className="flex flex-col items-center space-y-2 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <ThumbsUp size={16} />
                  <span>12</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare size={16} />
                  <span>3</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye size={16} />
                  <span>45</span>
                </div>
              </div>
              <div className="flex-1">
                <Link to="/questions/1" className="text-lg font-medium text-gray-900 hover:text-primary-600">
                  How to implement authentication in React?
                </Link>
                <div className="mt-2 text-sm text-gray-600">
                  I'm building a React app and need to implement user authentication. What's the best approach?
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Asked 2 days ago</span>
                    <span>by john_doe</span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">react</span>
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">authentication</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-start space-x-4">
              <div className="flex flex-col items-center space-y-2 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <ThumbsUp size={16} />
                  <span>8</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare size={16} />
                  <span>1</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye size={16} />
                  <span>23</span>
                </div>
              </div>
              <div className="flex-1">
                <Link to="/questions/2" className="text-lg font-medium text-gray-900 hover:text-primary-600">
                  Best practices for TypeScript in Node.js
                </Link>
                <div className="mt-2 text-sm text-gray-600">
                  What are the recommended TypeScript configurations and patterns for Node.js backend development?
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Asked 3 days ago</span>
                    <span>by jane_smith</span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">typescript</span>
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">nodejs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
        <p className="text-lg text-gray-600 mb-8">
          Join the community and start asking questions or helping others.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
            Create Account
          </Link>
          <Link to="/login" className="btn btn-outline text-lg px-8 py-3">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}