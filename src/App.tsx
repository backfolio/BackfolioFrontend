import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import Backtest from './pages/Backtest'
import Portfolios from './pages/Portfolios'
import AIChat from './pages/AIChat'
import Settings from './pages/Settings'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/backtest"
                        element={
                            <ProtectedRoute>
                                <Backtest />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/portfolios"
                        element={
                            <ProtectedRoute>
                                <Portfolios />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/ai-chat"
                        element={
                            <ProtectedRoute>
                                <AIChat />
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
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
