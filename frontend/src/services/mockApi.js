// @ts-nocheck
import axios from 'axios'

// Mock data
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@stackit.com',
    password: 'admin123',
    role: 'admin',
    reputation: 5000,
    created_at: '2024-01-01T00:00:00Z',
    avatar: null,
    bio: 'Platform Administrator'
  },
  {
    id: 2,
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    reputation: 1250,
    created_at: '2024-01-15T00:00:00Z',
    avatar: null,
    bio: 'Full-stack developer passionate about React and Node.js'
  },
  {
    id: 3,
    username: 'jane_smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
    reputation: 890,
    created_at: '2024-02-01T00:00:00Z',
    avatar: null,
    bio: 'Frontend developer specializing in Vue.js and TypeScript'
  }
]

const mockQuestions = [
  {
    id: 1,
    title: 'How to implement authentication in React with JWT?',
    content: `I'm building a React application and need to implement JWT authentication. 

**What I've tried so far:**
- Using localStorage to store tokens
- Basic axios interceptors for requests

**My current setup:**
\`\`\`javascript
// Auth context
const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // ... rest of implementation
}
\`\`\`

I'm looking for best practices and security considerations. Any help would be appreciated!`,
    user_id: 2,
    username: 'john_doe',
    reputation: 1250,
    views: 156,
    votes: 12,
    answer_count: 3,
    is_answered: true,
    created_at: '2024-03-15T10:30:00Z',
    tags: [
      { name: 'react' },
      { name: 'jwt' },
      { name: 'authentication' }
    ]
  },
  {
    id: 2,
    title: 'Best practices for TypeScript error handling',
    content: `I'm working on a TypeScript project and want to implement proper error handling patterns.

**Questions:**
1. Should I create custom error classes?
2. How to handle async errors effectively?
3. What's the best way to type error responses?

**Example of what I'm doing:**
\`\`\`typescript
try {
  const result = await apiCall()
  return result
} catch (error) {
  // How should I handle this?
  console.error(error)
}
\`\`\`

Looking for TypeScript-specific patterns and examples.`,
    user_id: 3,
    username: 'jane_smith',
    reputation: 890,
    views: 89,
    votes: 8,
    answer_count: 2,
    is_answered: false,
    created_at: '2024-03-14T15:45:00Z',
    tags: [
      { name: 'typescript' },
      { name: 'error-handling' }
    ]
  },
  {
    id: 3,
    title: 'Vue 3 Composition API vs Options API',
    content: `I'm starting a new Vue 3 project and trying to decide between Composition API and Options API.

**What I know:**
- Composition API is newer and more flexible
- Options API is more familiar to Vue 2 developers
- Both are supported in Vue 3

**My concerns:**
- Learning curve for team members
- Performance differences
- Migration path from Vue 2

Which approach would you recommend for a new project with a team that has Vue 2 experience?`,
    user_id: 2,
    username: 'john_doe',
    reputation: 1250,
    views: 234,
    votes: 15,
    answer_count: 4,
    is_answered: true,
    created_at: '2024-03-13T09:20:00Z',
    tags: [
      { name: 'vue' },
      { name: 'vue3' },
      { name: 'composition-api' }
    ]
  }
]

const mockAnswers = [
  {
    id: 1,
    question_id: 1,
    content: `Here's a comprehensive approach to JWT authentication in React:

## 1. Create a secure auth context

\`\`\`javascript
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on app start
    const token = localStorage.getItem('token')
    if (token) {
      validateToken(token)
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials)
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      setUser(user)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
\`\`\`

## 2. Set up axios interceptors

\`\`\`javascript
// api.js
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
\`\`\`

## Security Considerations:
- Store tokens in httpOnly cookies for production
- Implement token refresh logic
- Use HTTPS in production
- Validate tokens on the server side

This approach provides a solid foundation for JWT authentication in React!`,
    user_id: 3,
    username: 'jane_smith',
    reputation: 890,
    votes: 8,
    is_accepted: true,
    created_at: '2024-03-15T11:00:00Z'
  }
]

// Create a simple mock axios instance
const mockAxios = {
  get: async (url, config) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    if (url.includes('/api/questions') && !url.includes('/questions/')) {
      const { page = 1, limit = 10, sort = 'newest', search = '' } = config?.params || {}
      
      let filteredQuestions = [...mockQuestions]
      
      if (search) {
        filteredQuestions = filteredQuestions.filter(q => 
          q.title.toLowerCase().includes(search.toLowerCase()) ||
          q.content.toLowerCase().includes(search.toLowerCase())
        )
      }
      
      // Sort questions
      filteredQuestions.sort((a, b) => {
        switch (sort) {
          case 'newest':
            return new Date(b.created_at) - new Date(a.created_at)
          case 'oldest':
            return new Date(a.created_at) - new Date(b.created_at)
          case 'votes':
            return b.votes - a.votes
          case 'views':
            return b.views - a.views
          default:
            return new Date(b.created_at) - new Date(a.created_at)
        }
      })
      
      const start = (page - 1) * limit
      const end = start + limit
      const paginatedQuestions = filteredQuestions.slice(start, end)
      
      return {
        data: {
          questions: paginatedQuestions,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: filteredQuestions.length,
            pages: Math.ceil(filteredQuestions.length / limit)
          }
        }
      }
    }
    
    if (url.includes('/api/questions/') && url.includes('/answers')) {
      const questionId = parseInt(url.split('/')[3])
      const answers = mockAnswers.filter(a => a.question_id === questionId)
      return { data: answers }
    }
    
    throw { response: { status: 404, data: { message: 'Not found' } } }
  },

  post: async (url, data) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    if (url === '/api/auth/login') {
      const user = mockUsers.find(u => u.email === data.email && u.password === data.password)
      if (user) {
        return {
          data: {
            user: { ...user, password: undefined },
            token: 'mock-jwt-token-' + user.id
          }
        }
      }
      throw { response: { status: 401, data: { message: 'Invalid credentials' } } }
    }
    
    if (url === '/api/auth/register') {
      const existingUser = mockUsers.find(u => u.email === data.email || u.username === data.username)
      if (existingUser) {
        throw { response: { status: 400, data: { message: 'User already exists' } } }
      }
      
      const newUser = {
        id: mockUsers.length + 1,
        username: data.username,
        email: data.email,
        password: data.password,
        role: 'user',
        reputation: 0,
        created_at: new Date().toISOString(),
        avatar: null,
        bio: ''
      }
      
      mockUsers.push(newUser)
      return {
        data: {
          user: { ...newUser, password: undefined },
          token: 'mock-jwt-token-' + newUser.id
        }
      }
    }
    
    if (url.includes('/api/questions') && data.title) {
      const newQuestion = {
        id: mockQuestions.length + 1,
        ...data,
        user_id: 2,
        username: 'john_doe',
        reputation: 1250,
        views: 0,
        votes: 0,
        answer_count: 0,
        is_answered: false,
        created_at: new Date().toISOString()
      }
      mockQuestions.unshift(newQuestion)
      return { data: newQuestion }
    }
    
    if (url.includes('/api/questions/') && url.includes('/answers')) {
      const questionId = parseInt(url.split('/')[3])
      const newAnswer = {
        id: mockAnswers.length + 1,
        question_id: questionId,
        ...data,
        user_id: 3,
        username: 'jane_smith',
        reputation: 890,
        votes: 0,
        is_accepted: false,
        created_at: new Date().toISOString()
      }
      mockAnswers.push(newAnswer)
      return { data: newAnswer }
    }
    
    throw { response: { status: 404, data: { message: 'Not found' } } }
  },

  put: async (url, data) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    if (url === '/api/users/profile') {
      return {
        data: {
          id: 2,
          username: data.username || 'john_doe',
          email: data.email || 'john@example.com',
          role: 'user',
          reputation: 1250,
          avatar: data.avatar,
          bio: data.bio || 'Full-stack developer passionate about React and Node.js',
          created_at: '2024-01-15T00:00:00Z'
        }
      }
    }
    
    if (url.includes('/api/questions/') && url.includes('/answers/') && url.includes('/accept')) {
      const answerId = parseInt(url.split('/')[5])
      const answer = mockAnswers.find(a => a.id === answerId)
      if (answer) {
        answer.is_accepted = true
      }
      return { data: { success: true } }
    }
    
    throw { response: { status: 404, data: { message: 'Not found' } } }
  },

  delete: async (url) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return { data: { success: true } }
  }
}

export { mockAxios } 