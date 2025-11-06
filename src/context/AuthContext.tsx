import { createContext, useContext, useState, ReactNode } from 'react'

interface AuthContextType {
    isAuthenticated: boolean
    user: { email: string } | null
    login: (email: string, password: string) => Promise<boolean>
    signup: (email: string, password: string) => Promise<boolean>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState<{ email: string } | null>(null)

    const login = async (email: string, password: string): Promise<boolean> => {
        // This is a mock implementation
        // In production, you would call your Azure AD B2C or backend API here
        if (email && password) {
            setIsAuthenticated(true)
            setUser({ email })
            return true
        }
        return false
    }

    const signup = async (email: string, password: string): Promise<boolean> => {
        // This is a mock implementation
        // In production, you would call your Azure AD B2C or backend API here
        if (email && password) {
            setIsAuthenticated(true)
            setUser({ email })
            return true
        }
        return false
    }

    const logout = () => {
        setIsAuthenticated(false)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
