import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Navigation */}
            <nav className="bg-black/20 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold text-white">
                        Backfolio
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-300">{user?.email}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] px-4">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 shadow-2xl max-w-2xl w-full text-center">
                    <div className="text-6xl mb-6">🎉</div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Congrats, you're logged in!
                    </h1>
                    <p className="text-xl text-gray-300 mb-8">
                        Welcome to your dashboard, {user?.email}
                    </p>
                    <p className="text-gray-400 mb-8">
                        This is your protected area. The authentication infrastructure is now set up and ready for your features!
                    </p>
                    <button
                        onClick={handleLogout}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
