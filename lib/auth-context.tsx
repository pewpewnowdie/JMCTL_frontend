"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api-client"

interface AuthContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const router = useRouter()

  React.useEffect(() => {
    // Check if user is authenticated on mount
    const authenticated = api.auth.isAuthenticated()
    setIsAuthenticated(authenticated)
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    await api.auth.login(username, password)
    setIsAuthenticated(true)
    router.push("/")
  }

  const register = async (username: string, password: string) => {
    await api.auth.register(username, password)
    // After registration, auto-login
    await login(username, password)
  }

  const logout = () => {
    api.auth.logout()
    setIsAuthenticated(false)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, register, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
