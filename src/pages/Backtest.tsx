import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

const Backtest = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <div className="min-h-screen bg-gradient-light-subtle flex">
            {/* Vertical Sidebar Navigation */}
            <aside className="w-64 glass-premium-solid border-r border-premium-200 fixed left-0 top-0 h-screen flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-premium-200">
                    <div className="text-2xl font-bold text-premium-900">
                        Back<span className="text-primary-600">folio</span>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-premium-700 hover:bg-premium-100 font-medium transition-all"
                    >
                        <span className="text-xl">📊</span>
                        <span>Dashboard</span>
                    </Link>
                    <Link
                        to="/portfolios"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-premium-700 hover:bg-premium-100 font-medium transition-all"
                    >
                        <span className="text-xl">💼</span>
                        <span>Portfolios</span>
                    </Link>
                    <Link
                        to="/backtest"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-50 text-primary-600 font-medium transition-all"
                    >
                        <span className="text-xl">🔬</span>
                        <span>Backtest</span>
                    </Link>
                    <Link
                        to="/ai-chat"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-premium-700 hover:bg-premium-100 font-medium transition-all"
                    >
                        <span className="text-xl">🤖</span>
                        <span>AI Chat</span>
                    </Link>
                    <Link
                        to="/settings"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-premium-700 hover:bg-premium-100 font-medium transition-all"
                    >
                        <span className="text-xl">⚙️</span>
                        <span>Settings</span>
                    </Link>
                </nav>

                {/* User Section at Bottom */}
                <div className="p-4 border-t border-premium-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-purple-light flex items-center justify-center text-white font-semibold">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-premium-900 truncate">{user?.email}</p>
                            <p className="text-xs text-premium-600">Premium</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-premium-300 text-premium-700 hover:bg-premium-100 font-medium transition-all"
                    >
                        <span>🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="glass-premium-solid rounded-3xl p-12 shadow-premium-xl text-center">
                        <div className="text-6xl mb-6">🔬</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-premium-900 mb-4 tracking-tight">
                            Hello - Backtesting Page
                        </h1>
                        <p className="text-xl text-primary-600 font-medium">
                            Coming soon: Test your trading strategies against historical data
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Backtest
