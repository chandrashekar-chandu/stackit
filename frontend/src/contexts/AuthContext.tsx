import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '../services/api'

export interface User {
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

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  // Always refresh user profile on mount or token change
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await api.get('/auth/profile')
          if (response.data.success) {
            const userData = response.data.data.user
            setUser(userData)
            localStorage.setItem('user', JSON.stringify(userData))
          } else {
            // If backend says not success, force logout
            setUser(null)
            setToken(null)
            localStorage.removeItem('token')
            localStorage.removeItem('user')
          }
        } catch (error) {
          // On any error, force logout
          setUser(null)
          setToken(null)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      } else {
        setUser(null)
        setToken(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
      setLoading(false)
    }
    checkAuth()
  }, [token])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      if (response.data.success && response.data.data.token) {
        const { user: userData, token: authToken } = response.data.data
        
        setUser(userData)
        setToken(authToken)
        localStorage.setItem('token', authToken)
        localStorage.setItem('user', JSON.stringify(userData))
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed')
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { username, email, password })
      if (response.data.success && response.data.data.token) {
        const { user: userData, token: authToken } = response.data.data
        
        setUser(userData)
        setToken(authToken)
        localStorage.setItem('token', authToken)
        localStorage.setItem('user', JSON.stringify(userData))
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Registration failed')
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 