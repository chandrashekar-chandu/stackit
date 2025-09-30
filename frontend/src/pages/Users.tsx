import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { Users, Award, MessageSquare, ThumbsUp, Clock, TrendingUp, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

interface User {
  _id: string
  username: string
  email: string
  role: string
  reputation: number
  avatar?: string
  bio?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('reputation') // reputation, newest, oldest

  useEffect(() => {
    fetchUsers()
  }, [sortBy])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/users')
      
      if (response.data && response.data.users) {
        setUsers(response.data.users)
        toast.success(`Found ${response.data.users.length} users!`)
      } else {
        setUsers([])
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
      toast.error('Failed to load users')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const sortedUsers = [...users].sort((a, b) => {
    switch (sortBy) {
      case 'reputation':
        return b.reputation - a.reputation
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      default:
        return b.reputation - a.reputation
    }
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Members</h1>
            <p className="text-gray-600">
              Meet the developers and contributors in our community
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="text-primary-500" size={24} />
            <span className="text-sm text-gray-500">{users.length} members</span>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex space-x-2">
          {[
            { key: 'reputation', label: 'Top Reputation', icon: Award },
            { key: 'newest', label: 'Newest', icon: Clock },
            { key: 'oldest', label: 'Oldest', icon: TrendingUp }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === key
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

      {/* Users Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {sortedUsers.map((user, index) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="card p-6 hover:shadow-lg transition-all duration-200"
          >
            <Link 
              to={`/users/${user._id}`}
              className="block"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-lg">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-xl">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  {user.role === 'admin' && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1">
                      <Shield size={12} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                    {user.username}
                  </h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Award className="text-yellow-500" size={14} />
                    <span className="text-sm font-medium text-gray-700">
                      {user.reputation} reputation
                    </span>
                  </div>
                </div>
              </div>

              {user.bio && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {user.bio}
                </p>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock size={14} />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {user.isActive ? (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  ) : (
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  )}
                  <span>{user.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {sortedUsers.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Users size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600 mb-6">
            No users are registered yet.
          </p>
          <Link 
            to="/register" 
            className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-lg hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Join the Community
          </Link>
        </motion.div>
      )}
    </div>
  )
} 