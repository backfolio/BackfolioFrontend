import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

const Dashboard = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <div className="min-h-screen bg-premium-50 flex">
            {/* Vertical Sidebar Navigation */}
            <aside className="w-64 glass-sidebar fixed left-0 top-0 h-screen flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-premium-200">
                    <div className="text-xl font-semibold text-premium-900">
                        Back<span className="text-primary-600">folio</span>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-3 space-y-1">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-3 py-2 rounded-md bg-primary-50 text-primary-700 font-medium text-sm transition-all"
                    >
                        <span className="text-lg">📊</span>
                        <span>Dashboard</span>
                    </Link>
                    <Link
                        to="/portfolios"
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-premium-700 hover:bg-premium-100 font-medium text-sm transition-all"
                    >
                        <span className="text-lg">💼</span>
                        <span>Portfolios</span>
                    </Link>
                    <Link
                        to="/backtest"
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-premium-700 hover:bg-premium-100 font-medium text-sm transition-all"
                    >
                        <span className="text-lg">🔬</span>
                        <span>Backtest</span>
                    </Link>
                    <Link
                        to="/ai-chat"
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-premium-700 hover:bg-premium-100 font-medium text-sm transition-all"
                    >
                        <span className="text-lg">🤖</span>
                        <span>AI Chat</span>
                    </Link>
                    <Link
                        to="/settings"
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-premium-700 hover:bg-premium-100 font-medium text-sm transition-all"
                    >
                        <span className="text-lg">⚙️</span>
                        <span>Settings</span>
                    </Link>
                </nav>

                {/* User Section at Bottom */}
                <div className="p-3 border-t border-premium-200">
                    <div className="flex items-center gap-3 mb-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-purple-light flex items-center justify-center text-white text-sm font-semibold">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-premium-900 truncate">{user?.email}</p>
                            <p className="text-xs text-premium-500">Premium</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-premium-300 text-premium-700 hover:bg-premium-100 text-sm font-medium transition-all"
                    >
                        <span className="text-sm">🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold text-premium-900 mb-2">Dashboard</h1>
                        <p className="text-sm text-premium-600">Welcome back, {user?.email}</p>
                    </div>

                    {/* Portfolio Summary Cards */}
                    <div className="grid md:grid-cols-4 gap-6 mb-8">
                        <div className="card-professional rounded-lg p-6 hover-professional">
                            <div className="text-xs font-semibold text-premium-500 uppercase tracking-wider mb-2">Total Value</div>
                            <div className="stat-number text-2xl font-semibold text-premium-900 mb-1">$0.00</div>
                            <div className="text-xs text-premium-600">0% change</div>
                        </div>
                        <div className="card-professional rounded-lg p-6 hover-professional">
                            <div className="text-xs font-semibold text-premium-500 uppercase tracking-wider mb-2">Total Return</div>
                            <div className="stat-number text-2xl font-semibold text-success-600 mb-1">$0.00</div>
                            <div className="text-xs text-success-600">+0.00%</div>
                        </div>
                        <div className="card-professional rounded-lg p-6 hover-professional">
                            <div className="text-xs font-semibold text-premium-500 uppercase tracking-wider mb-2">Day Change</div>
                            <div className="stat-number text-2xl font-semibold text-premium-900 mb-1">$0.00</div>
                            <div className="text-xs text-premium-600">0.00%</div>
                        </div>
                        <div className="card-professional rounded-lg p-6 hover-professional">
                            <div className="text-xs font-semibold text-premium-500 uppercase tracking-wider mb-2">Assets</div>
                            <div className="stat-number text-2xl font-semibold text-premium-900 mb-1">0</div>
                            <div className="text-xs text-premium-600">0 positions</div>
                        </div>
                    </div>

                    {/* Holdings Table */}
                    <div className="card-professional rounded-lg overflow-hidden mb-8">
                        <div className="px-6 py-4 border-b border-premium-200">
                            <h2 className="text-lg font-semibold text-premium-900">Holdings</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table-professional w-full">
                                <thead>
                                    <tr>
                                        <th className="text-left">Symbol</th>
                                        <th className="text-left">Name</th>
                                        <th className="text-right">Shares</th>
                                        <th className="text-right">Price</th>
                                        <th className="text-right">Value</th>
                                        <th className="text-right">Day Change</th>
                                        <th className="text-right">Total Return</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan={7} className="text-center text-premium-500 py-12">
                                            No holdings yet. Add your first position to get started.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <Link to="/portfolios" className="card-professional rounded-lg p-6 hover-professional block">
                            <div className="text-2xl mb-3">�</div>
                            <h3 className="text-base font-semibold text-premium-900 mb-2">Manage Portfolios</h3>
                            <p className="text-sm text-premium-600">Create and organize your investment portfolios</p>
                        </Link>
                        <Link to="/backtest" className="card-professional rounded-lg p-6 hover-professional block">
                            <div className="text-2xl mb-3">�</div>
                            <h3 className="text-base font-semibold text-premium-900 mb-2">Backtest Strategies</h3>
                            <p className="text-sm text-premium-600">Test your strategies against historical data</p>
                        </Link>
                        <Link to="/ai-chat" className="card-professional rounded-lg p-6 hover-professional block">
                            <div className="text-2xl mb-3">🤖</div>
                            <h3 className="text-base font-semibold text-premium-900 mb-2">AI Assistant</h3>
                            <p className="text-sm text-premium-600">Get insights and analysis powered by AI</p>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Dashboard
