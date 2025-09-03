import { createContext, useContext, useEffect, useState } from "react"
import API from "../api/api"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token") || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { checkAuth() }, [])

  const checkAuth = async () => {
    try {
      const res = await API.get("/auth/profile")
      setUser(res.data.user)
      setToken(localStorage.getItem("token"))
    } catch {
      setUser(null)
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password })
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token)
      setToken(res.data.token)
    }
    setUser(res.data.user)
  }

  const register = async (payload) => {
    const res = await API.post("/auth/register", payload)
    return res.data
  }

  const logout = async () => {
    await API.post("/auth/logout")
    localStorage.removeItem("token")
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
