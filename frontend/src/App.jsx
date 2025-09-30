import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { AskQuestion } from './pages/AskQuestion'
import { QuestionDetail } from './pages/QuestionDetail'
import { UserProfile } from './pages/UserProfile'
import { Settings } from './pages/Settings'
import { Tags } from './pages/Tags'
import { Trending } from './pages/Trending'
import { UsersPage } from './pages/Users'
import { Help } from './pages/Help'
import { Admin } from './pages/Admin'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/questions/:id" element={<QuestionDetail />} />
              <Route path="/users/:id" element={<UserProfile />} />
              <Route path="/tags" element={<Tags />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/help" element={<Help />} />
              <Route 
                path="/ask" 
                element={
                  <ProtectedRoute>
                    <AskQuestion />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '14px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App 