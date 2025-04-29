"use client"

import { createContext, useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  profilePicture?: string | null
  address?: string
  emergencyContact?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (identifier: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  setAuth: (token: string, user: User) => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  updateUser: () => {},
  setAuth: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")
    
    // Only parse if the values are not null or undefined
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
        axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`
      } catch (error) {
        console.error("Error parsing user from localStorage", error)
      }
    }
  }, [])

  const login = async (identifier: string, password: string) => {
    try {
      // Check if identifier is an email or phone number
      const isEmail = identifier.includes('@')
      const payload = isEmail 
        ? { email: identifier, password } 
        : { phone: identifier, password }

      const res = await axios.post("http://localhost:5000/api/auth/signin", payload)
      const { token, user } = res.data

      // Format user object to match our interface
      const formattedUser: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        emergencyContact: user.emergencyContact
      }

      setUser(formattedUser)
      setIsAuthenticated(true)
      localStorage.setItem("user", JSON.stringify(formattedUser))
      localStorage.setItem("token", token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

      navigate("/profile")
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed")
    }
  }

  const setAuth = (token: string, user: User) => {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))
    setUser(user)
    setIsAuthenticated(true)
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"]
    navigate("/signin")
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateUser, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}