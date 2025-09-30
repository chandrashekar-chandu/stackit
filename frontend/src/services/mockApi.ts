// Mock API service for frontend-only development
import { User } from '../contexts/AuthContext'

// Mock data
let mockUsers: User[] = [
  {
    id: 1,
    username: 'john_doe',
    email: 'john@example.com',
    role: 'user',
    reputation: 150
  },
  {
    id: 2,
    username: 'jane_smith',
    email: 'jane@example.com',
    role: 'admin',
    reputation: 300
  }
]

let mockQuestions = [
  {
    id: 1,
    title: 'How to implement authentication in React?',
    content: 'I\'m building a React app and need to implement user authentication. What\'s the best approach?',
    views: 45,
    votes: 12,
    is_answered: true,
    created_at: '2024-01-15T10:30:00Z',
    user_id: 1,
    username: 'john_doe',
    reputation: 150,
    answer_count: 3,
    tags: [{ name: 'react' }, { name: 'authentication' }]
  },
  {
    id: 2,
    title: 'Best practices for TypeScript in Node.js',
    content: 'What are the recommended TypeScript configurations and patterns for Node.js backend development?',
    views: 23,
    votes: 8,
    is_answered: false,
    created_at: '2024-01-14T15:20:00Z',
    user_id: 2,
    username: 'jane_smith',
    reputation: 300,
    answer_count: 1,
    tags: [{ name: 'typescript' }, { name: 'nodejs' }]
  },
  {
    id: 3,
    title: 'Database design for Q&A platform',
    content: 'I\'m designing a database schema for a Q&A platform similar to Stack Overflow. Any suggestions?',
    views: 67,
    votes: 15,
    is_answered: true,
    created_at: '2024-01-13T09:15:00Z',
    user_id: 1,
    username: 'john_doe',
    reputation: 150,
    answer_count: 2,
    tags: [{ name: 'database' }, { name: 'design' }]
  }
]

let mockAnswers = [
  {
    id: 1,
    content: 'I recommend using React Context API with JWT tokens for authentication. Here\'s a simple implementation...',
    question_id: 1,
    user_id: 2,
    votes: 8,
    is_accepted: true,
    created_at: '2024-01-15T11:00:00Z',
    username: 'jane_smith',
    reputation: 300
  },
  {
    id: 2,
    content: 'You can also use libraries like Auth0 or Firebase Auth for a more robust solution.',
    question_id: 1,
    user_id: 1,
    votes: 5,
    is_accepted: false,
    created_at: '2024-01-15T11:30:00Z',
    username: 'john_doe',
    reputation: 150
  }
]

let currentUser: User | null = null
let authToken: string | null = localStorage.getItem('token')

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API functions
export const mockApi = {
  // Auth endpoints
  auth: {
    register: async (username: string, email: string, _password: string) => {
      await delay(500)
      
      if (mockUsers.find(u => u.email === email || u.username === username)) {
        throw new Error('User with this email or username already exists')
      }

      const newUser: User = {
        id: mockUsers.length + 1,
        username,
        email,
        role: 'user',
        reputation: 0
      }

      mockUsers.push(newUser)
      currentUser = newUser
      authToken = 'mock-token-' + Date.now()
      localStorage.setItem('token', authToken)

      return {
        user: newUser,
        token: authToken
      }
    },

    login: async (email: string, _password: string) => {
      await delay(500)
      
      const user = mockUsers.find(u => u.email === email)
      if (!user) {
        throw new Error('Invalid credentials')
      }

      currentUser = user
      authToken = 'mock-token-' + Date.now()
      localStorage.setItem('token', authToken)

      return {
        user,
        token: authToken
      }
    },

    me: async () => {
      await delay(200)
      
      if (!authToken) {
        throw new Error('No token provided')
      }

      if (!currentUser) {
        throw new Error('User not found')
      }

      return { user: currentUser }
    }
  },

  // Questions endpoints
  questions: {
    getAll: async (params: any = {}) => {
      await delay(300)
      
      let filteredQuestions = [...mockQuestions]
      
      // Apply filters
      if (params.tag) {
        filteredQuestions = filteredQuestions.filter(q => 
          q.tags.some(tag => tag.name.toLowerCase().includes(params.tag.toLowerCase()))
        )
      }

      // Apply search filter
      if (params.search) {
        const searchTerm = params.search.toLowerCase()
        filteredQuestions = filteredQuestions.filter(q =>
          q.title.toLowerCase().includes(searchTerm) ||
          q.content.toLowerCase().includes(searchTerm)
        )
      }

      // Apply sorting
      switch (params.sort) {
        case 'votes':
          filteredQuestions.sort((a, b) => b.votes - a.votes)
          break
        case 'views':
          filteredQuestions.sort((a, b) => b.views - a.views)
          break
        case 'unanswered':
          filteredQuestions.sort((a, b) => Number(a.is_answered) - Number(b.is_answered))
          break
        default:
          filteredQuestions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      }

      // Pagination
      const page = parseInt(params.page) || 1
      const limit = parseInt(params.limit) || 10
      const offset = (page - 1) * limit
      const paginatedQuestions = filteredQuestions.slice(offset, offset + limit)

      return {
        questions: paginatedQuestions,
        pagination: {
          page,
          limit,
          total: filteredQuestions.length,
          pages: Math.ceil(filteredQuestions.length / limit)
        }
      }
    },

    getById: async (id: string) => {
      await delay(200)
      
      const question = mockQuestions.find(q => q.id === parseInt(id))
      if (!question) {
        throw new Error('Question not found')
      }

      // Increment views
      question.views++

      const questionAnswers = mockAnswers.filter(a => a.question_id === parseInt(id))

      return {
        question,
        answers: questionAnswers
      }
    },

    create: async (data: { title: string; content: string; tags: string[] }) => {
      await delay(500)
      
      if (!currentUser) {
        throw new Error('Authentication required')
      }

      const newQuestion = {
        id: mockQuestions.length + 1,
        ...data,
        views: 0,
        votes: 0,
        is_answered: false,
        created_at: new Date().toISOString(),
        user_id: currentUser.id,
        username: currentUser.username,
        reputation: currentUser.reputation,
        answer_count: 0,
        tags: data.tags.map(name => ({ name }))
      }

      mockQuestions.unshift(newQuestion)

      return { question: newQuestion }
    },

    vote: async (id: string, voteType: 'upvote' | 'downvote') => {
      await delay(200)
      
      const question = mockQuestions.find(q => q.id === parseInt(id))
      if (!question) {
        throw new Error('Question not found')
      }

      if (voteType === 'upvote') {
        question.votes++
      } else {
        question.votes--
      }

      return { votes: question.votes }
    }
  },

  // Answers endpoints
  answers: {
    create: async (data: { content: string; questionId: number }) => {
      await delay(500)
      
      if (!currentUser) {
        throw new Error('Authentication required')
      }

      const newAnswer = {
        id: mockAnswers.length + 1,
        content: data.content,
        question_id: data.questionId,
        user_id: currentUser.id,
        votes: 0,
        is_accepted: false,
        created_at: new Date().toISOString(),
        username: currentUser.username,
        reputation: currentUser.reputation
      }

      mockAnswers.push(newAnswer)

      // Update answer count
      const question = mockQuestions.find(q => q.id === data.questionId)
      if (question) {
        question.answer_count++
      }

      return { answer: newAnswer }
    },

    vote: async (id: string, voteType: 'upvote' | 'downvote') => {
      await delay(200)
      
      const answer = mockAnswers.find(a => a.id === parseInt(id))
      if (!answer) {
        throw new Error('Answer not found')
      }

      if (voteType === 'upvote') {
        answer.votes++
      } else {
        answer.votes--
      }

      return { votes: answer.votes }
    },

    accept: async (id: string) => {
      await delay(200)
      
      const answer = mockAnswers.find(a => a.id === parseInt(id))
      if (!answer) {
        throw new Error('Answer not found')
      }

      // Unaccept other answers for this question
      mockAnswers.forEach(a => {
        if (a.question_id === answer.question_id) {
          a.is_accepted = false
        }
      })

      // Accept this answer
      answer.is_accepted = true

      // Mark question as answered
      const question = mockQuestions.find(q => q.id === answer.question_id)
      if (question) {
        question.is_answered = true
      }

      return { message: 'Answer accepted successfully' }
    }
  },

  // Users endpoints
  users: {
    getById: async (id: string) => {
      await delay(200)
      
      const user = mockUsers.find(u => u.id === parseInt(id))
      if (!user) {
        throw new Error('User not found')
      }

      const userQuestions = mockQuestions.filter(q => q.user_id === parseInt(id))
      const userAnswers = mockAnswers.filter(a => a.user_id === parseInt(id))

      return {
        user,
        questions: userQuestions,
        answers: userAnswers
      }
    }
  }
}

// Type definitions for API responses
interface AuthResponse {
  user: User
  token: string
}

interface AuthMeResponse {
  user: User
}

interface QuestionsResponse {
  questions: any[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

interface QuestionDetailResponse {
  question: any
  answers: any[]
}

interface UserResponse {
  user: any
  questions: any[]
  answers: any[]
}

interface QuestionCreateResponse {
  question: any
}

interface VoteResponse {
  votes: number
}

interface AnswerResponse {
  answer: any
}

interface AcceptResponse {
  message: string
}

// Replace axios with mock API
export const mockAxios = {
  get: async (url: string): Promise<{ data: AuthMeResponse | QuestionDetailResponse | QuestionsResponse | UserResponse }> => {
    const path = url.replace('/api', '')
    
    if (path.startsWith('/auth/me')) {
      return { data: await mockApi.auth.me() }
    }
    
    if (path.startsWith('/questions/')) {
      const id = path.split('/')[2]
      return { data: await mockApi.questions.getById(id) }
    }
    
    if (path.startsWith('/questions')) {
      const params = new URLSearchParams(path.split('?')[1] || '')
      return { data: await mockApi.questions.getAll(Object.fromEntries(params)) }
    }
    
    if (path.startsWith('/users/')) {
      const id = path.split('/')[2]
      return { data: await mockApi.users.getById(id) }
    }
    
    throw new Error('Endpoint not found')
  },

  post: async (url: string, data: any): Promise<{ data: AuthResponse | QuestionCreateResponse | VoteResponse | AnswerResponse | AcceptResponse }> => {
    const path = url.replace('/api', '')
    
    if (path === '/auth/register') {
      return { data: await mockApi.auth.register(data.username, data.email, data.password) }
    }
    
    if (path === '/auth/login') {
      return { data: await mockApi.auth.login(data.email, data.password) }
    }
    
    if (path === '/questions') {
      return { data: await mockApi.questions.create(data) }
    }
    
    if (path.startsWith('/questions/') && path.endsWith('/vote')) {
      const id = path.split('/')[2]
      return { data: await mockApi.questions.vote(id, data.voteType) }
    }
    
    if (path === '/answers') {
      return { data: await mockApi.answers.create(data) }
    }
    
    if (path.startsWith('/answers/') && path.endsWith('/vote')) {
      const id = path.split('/')[2]
      return { data: await mockApi.answers.vote(id, data.voteType) }
    }
    
    if (path.startsWith('/answers/') && path.endsWith('/accept')) {
      const id = path.split('/')[2]
      return { data: await mockApi.answers.accept(id) }
    }
    
    throw new Error('Endpoint not found')
  }
} 