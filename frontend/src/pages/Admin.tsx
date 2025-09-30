// @ts-nocheck
import { useState, useEffect } from 'react'
import { 
  Shield, Users, MessageSquare, AlertTriangle, CheckCircle, XCircle,
  Download, Send, Ban, Eye, Edit, Trash2, Flag, TrendingUp, BarChart3,
  UserCheck, UserX, MessageCircle, Settings, Activity, FileText
} from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [pendingContent, setPendingContent] = useState([])
  const [users, setUsers] = useState([])
  const [reports, setReports] = useState([])
  const [platformMessage, setPlatformMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Simulate loading admin data
    setTimeout(() => {
      setPendingContent([
        { id: 1, type: 'question', title: 'How to hack into a system?', user: 'suspicious_user', status: 'pending', reason: 'Inappropriate content' },
        { id: 2, type: 'answer', title: 'Spam answer with links', user: 'spammer123', status: 'pending', reason: 'Spam' },
        { id: 3, type: 'user', title: 'User profile', user: 'troll_user', status: 'pending', reason: 'Violation of terms' }
      ])
      
      setUsers([
        { id: 1, username: 'john_doe', email: 'john@example.com', status: 'active', reputation: 1250, questions: 15, answers: 45 },
        { id: 2, username: 'suspicious_user', email: 'suspicious@example.com', status: 'banned', reputation: -50, questions: 2, answers: 1 },
        { id: 3, username: 'spammer123', email: 'spam@example.com', status: 'suspended', reputation: 0, questions: 0, answers: 5 }
      ])
      
      setReports([
        { id: 1, type: 'question', title: 'Inappropriate question content', reporter: 'user1', reportedUser: 'user2', status: 'pending' },
        { id: 2, type: 'answer', title: 'Spam answer reported', reporter: 'user3', reportedUser: 'spammer123', status: 'resolved' }
      ])
    }, 1000)
  }, [])

  const handleApprove = (id) => {
    setPendingContent(prev => prev.filter(item => item.id !== id))
    toast.success('Content approved successfully!')
  }

  const handleReject = (id) => {
    setPendingContent(prev => prev.filter(item => item.id !== id))
    toast.success('Content rejected successfully!')
  }

  const handleBanUser = (userId) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: 'banned' } : user
    ))
    toast.success('User banned successfully!')
  }

  const handleUnbanUser = (userId) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: 'active' } : user
    ))
    toast.success('User unbanned successfully!')
  }

  const handleSendPlatformMessage = () => {
    if (platformMessage.trim()) {
      toast.success('Platform message sent successfully!')
      setPlatformMessage('')
    } else {
      toast.error('Please enter a message')
    }
  }

  const handleDownloadReport = (type) => {
    toast.success(`${type} report downloaded successfully!`)
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'moderation', label: 'Content Moderation', icon: Shield },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'reports', label: 'Reports', icon: Flag },
    { id: 'messages', label: 'Platform Messages', icon: MessageCircle },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ]

  const stats = [
    { label: 'Total Users', value: '8,234', icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Active Questions', value: '12,567', icon: MessageSquare, color: 'from-green-500 to-green-600' },
    { label: 'Pending Reviews', value: pendingContent.length.toString(), icon: AlertTriangle, color: 'from-yellow-500 to-yellow-600' },
    { label: 'Banned Users', value: users.filter(u => u.status === 'banned').length.toString(), icon: UserX, color: 'from-red-500 to-red-600' }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
            <Shield className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your platform and moderate content</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
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

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200"
      >
        {activeTab === 'dashboard' && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Platform Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">Recent Activity</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>5 new questions posted</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>12 answers submitted</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>3 reports received</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                <h3 className="font-semibold text-green-900 mb-2">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left text-sm text-green-700 hover:text-green-900">
                    Review pending content
                  </button>
                  <button className="w-full text-left text-sm text-green-700 hover:text-green-900">
                    Check user reports
                  </button>
                  <button className="w-full text-left text-sm text-green-700 hover:text-green-900">
                    Send platform message
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'moderation' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Content Moderation</h2>
              <button
                onClick={() => handleDownloadReport('moderation')}
                className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download size={16} />
                <span>Download Report</span>
              </button>
            </div>
            
            {pendingContent.length === 0 ? (
              <div className="text-center py-8">
                <Shield size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No pending content to review</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingContent.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.type === 'question' ? 'bg-blue-100 text-blue-800' :
                            item.type === 'answer' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {item.type}
                          </span>
                          <span className="text-sm text-gray-500">by {item.user}</span>
                        </div>
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">Reason: {item.reason}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                          title="Approve"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          onClick={() => handleReject(item.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Reject"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">User Management</h2>
              <button
                onClick={() => handleDownloadReport('users')}
                className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download size={16} />
                <span>Download Report</span>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reputation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' :
                          user.status === 'banned' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.reputation}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.questions} Q, {user.answers} A
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {user.status === 'banned' ? (
                          <button
                            onClick={() => handleUnbanUser(user.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Unban
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBanUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Ban
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">User Reports</h2>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {report.status}
                        </span>
                        <span className="text-sm text-gray-500">{report.type}</span>
                      </div>
                      <h3 className="font-medium text-gray-900">{report.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Reported by {report.reporter} • User: {report.reportedUser}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                        <Ban size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Platform Messages</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Send Platform-wide Message
                </label>
                <textarea
                  value={platformMessage}
                  onChange={(e) => setPlatformMessage(e.target.value)}
                  placeholder="Enter your platform message..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={4}
                />
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    This message will be sent to all active users
                  </p>
                  <button
                    onClick={handleSendPlatformMessage}
                    className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Send size={16} />
                    <span>Send Message</span>
                  </button>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 mb-2">Recent Messages</h3>
                <div className="space-y-2">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-900">Platform maintenance scheduled for tomorrow at 2 AM UTC</p>
                    <p className="text-xs text-gray-500 mt-1">Sent 2 hours ago</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-900">New features are now available! Check out the updated rich text editor.</p>
                    <p className="text-xs text-gray-500 mt-1">Sent 1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Platform Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-4">User Growth</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">This Month</span>
                    <span className="text-sm font-medium text-blue-900">+234 users</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">Last Month</span>
                    <span className="text-sm font-medium text-blue-900">+189 users</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">Total Users</span>
                    <span className="text-sm font-medium text-blue-900">8,234</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                <h3 className="font-semibold text-green-900 mb-4">Content Activity</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">Questions Today</span>
                    <span className="text-sm font-medium text-green-900">45</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">Answers Today</span>
                    <span className="text-sm font-medium text-green-900">127</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">Avg. Response Time</span>
                    <span className="text-sm font-medium text-green-900">2.3 hours</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => handleDownloadReport('analytics')}
                className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download size={16} />
                <span>Download Analytics Report</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
} 