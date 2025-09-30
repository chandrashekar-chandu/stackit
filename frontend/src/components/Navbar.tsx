// @ts-nocheck
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, User, Plus, Home, Bell, ChevronDown, Settings, Search, Tag, TrendingUp, Users, BookOpen, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'John Doe answered your question about React hooks', read: false, link: '/questions/1', type: 'answer' },
    { id: 2, message: 'Jane Smith upvoted your answer on TypeScript', read: false, link: '/questions/2', type: 'vote' },
    { id: 3, message: 'You were mentioned in a comment by @alex_dev', read: true, link: '/questions/3', type: 'mention' },
    { id: 4, message: 'Your question "Best practices for Node.js" got 5 new views', read: false, link: '/questions/4', type: 'view' }
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const handleLogout = () => {
    logout()
    navigate('/')
    setShowProfileDropdown(false)
    toast.success('Successfully logged out!')
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
    toast.success('All notifications marked as read!')
  }

  const handleNotificationClick = (notification) => {
    setNotifications(notifications.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    ))
    navigate(notification.link)
    setShowNotifications(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`)
      setShowSearch(false)
      setSearchQuery('')
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'answer': return '💬'
      case 'vote': return '👍'
      case 'mention': return '@'
      case 'view': return '👁️'
      default: return '🔔'
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowProfileDropdown(false)
      setShowNotifications(false)
      setShowSearch(false)
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg"
            >
              <span className="text-white font-bold text-xl">S</span>
            </motion.div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                StackIt
              </span>
              <p className="text-xs text-gray-500 -mt-1">Q&A Platform</p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search questions, tags, or users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </form>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {/* Mobile Search Button */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <Search size={20} />
            </button>

            {/* Navigation Links */}
            <Link to="/" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Home size={18} />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link to="/tags" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Tag size={18} />
              <span className="hidden sm:inline">Tags</span>
            </Link>

            <Link to="/trending" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <TrendingUp size={18} />
              <span className="hidden sm:inline">Trending</span>
            </Link>

            <Link to="/users" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Users size={18} />
              <span className="hidden sm:inline">Users</span>
            </Link>

            <Link to="/help" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <BookOpen size={18} />
              <span className="hidden sm:inline">Help</span>
            </Link>
            
            {user ? (
              <>
                {/* Admin Link - Show for admin users */}
                {user.role === 'admin' && (
                  <Link to="/admin" className="flex items-center space-x-1 text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors">
                    <Shield size={18} />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )}

                {/* Ask Question Button */}
                <Link 
                  to="/ask" 
                  className="flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-lg hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline">Ask Question</span>
                </Link>
                
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowNotifications(!showNotifications)
                      setShowProfileDropdown(false)
                    }}
                    className="relative p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </motion.span>
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                          <h3 className="font-semibold text-gray-900">Notifications</h3>
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllAsRead}
                              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                              Mark all read
                            </button>
                          )}
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {notifications.length > 0 ? (
                            notifications.map((notification) => (
                              <motion.button
                                key={notification.id}
                                whileHover={{ backgroundColor: '#f9fafb' }}
                                onClick={() => handleNotificationClick(notification)}
                                className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                                  !notification.read ? 'bg-blue-50' : ''
                                }`}
                              >
                                <div className="flex items-start space-x-3">
                                  <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-900 leading-relaxed">{notification.message}</p>
                                    {!notification.read && (
                                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    )}
                                  </div>
                                </div>
                              </motion.button>
                            ))
                          ) : (
                            <div className="px-4 py-8 text-center">
                              <Bell size={32} className="mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-500">No notifications yet</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowProfileDropdown(!showProfileDropdown)
                      setShowNotifications(false)
                    }}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 px-2 py-1 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-sm">
                        {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="hidden sm:inline font-medium">{user?.username || 'User'}</span>
                    <ChevronDown size={16} />
                  </button>
                  
                  <AnimatePresence>
                    {showProfileDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-900">{user?.username || 'User'}</p>
                          <p className="text-xs text-gray-500">{user?.email || 'No email'}</p>
                          {user?.role === 'admin' && (
                            <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                              Admin
                            </span>
                          )}
                        </div>
                        
                        <Link
                          to={`/users/${user.id}`}
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <User size={16} />
                          <span>View Profile</span>
                        </Link>
                        
                        <Link
                          to="/settings"
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <Settings size={16} />
                          <span>Settings</span>
                        </Link>
                        
                        <hr className="my-2" />
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left transition-colors"
                        >
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-lg hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-3 border-t border-gray-200"
            >
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search questions, tags, or users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
} 