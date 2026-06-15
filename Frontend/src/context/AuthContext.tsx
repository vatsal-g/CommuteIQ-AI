import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

interface User {
  name: string
  email: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (email: string, _password: string) => boolean
  register: (name: string, email: string, _password: string) => boolean
  logout: () => void
  updateProfile: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('commuteiq_user')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  const isAuthenticated = user !== null

  useEffect(() => {
    if (user) localStorage.setItem('commuteiq_user', JSON.stringify(user))
    else localStorage.removeItem('commuteiq_user')
  }, [user])

  const login = (email: string, password: string) => {
    if (email === 'admin@commuteiq.com' && password === '123456') {
      setUser({ name: 'Admin', email })
      return true
    }
    return false
  }

  const register = (name: string, email: string, _password: string) => {
    if (!name || !email) return false
    setUser({ name, email })
    return true
  }

  const logout = () => setUser(null)

  const updateProfile = (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
