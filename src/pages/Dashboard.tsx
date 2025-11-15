import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { NavigationMenu } from '../components/NavigationMenu'
import { useTheme } from '../context/ThemeContext'

const Dashboard = () => {
    const { user } = useAuth()
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    return (
        <Layout>
            <NavigationMenu />
            <div className="max-w-7xl mx-auto p-8">{/* Header */}
                {/* Header */}
                <div className="mb-8">
                    <h1 className={`text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Dashboard</h1>
                    <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Welcome back, {user?.email}</p>
                </div>

                {/* Portfolio Summary Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className={`backdrop-blur-2xl rounded-lg p-6 transition-all duration-300 ${isDark ? 'bg-white/[0.02] border border-white/[0.15] hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]' : 'bg-white border border-gray-200 hover:shadow-md'}`}>
                        <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Value</div>
                        <div className={`text-2xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>$0.00</div>
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>0% change</div>
                    </div>
                    <div className={`backdrop-blur-2xl rounded-lg p-6 transition-all duration-300 ${isDark ? 'bg-white/[0.02] border border-white/[0.15] hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]' : 'bg-white border border-gray-200 hover:shadow-md'}`}>
                        <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Return</div>
                        <div className={`text-2xl font-semibold mb-1 ${isDark ? 'text-purple-400' : 'text-success-500'}`}>$0.00</div>
                        <div className={`text-xs ${isDark ? 'text-purple-400' : 'text-success-500'}`}>+0.00%</div>
                    </div>
                    <div className={`backdrop-blur-2xl rounded-lg p-6 transition-all duration-300 ${isDark ? 'bg-white/[0.02] border border-white/[0.15] hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]' : 'bg-white border border-gray-200 hover:shadow-md'}`}>
                        <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Day Change</div>
                        <div className={`text-2xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>$0.00</div>
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>0.00%</div>
                    </div>
                    <div className={`backdrop-blur-2xl rounded-lg p-6 transition-all duration-300 ${isDark ? 'bg-white/[0.02] border border-white/[0.15] hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]' : 'bg-white border border-gray-200 hover:shadow-md'}`}>
                        <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Assets</div>
                        <div className={`text-2xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>0</div>
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>0 positions</div>
                    </div>
                </div>

                {/* Holdings Table */}
                <div className={`backdrop-blur-2xl rounded-lg overflow-hidden mb-8 shadow-[0_0_50px_rgba(255,255,255,0.06)] ${isDark ? 'bg-white/[0.02] border border-white/[0.15]' : 'bg-white border border-gray-200'}`}>
                    <div className={`px-6 py-4 border-b ${isDark ? 'border-white/[0.1]' : 'border-gray-200'}`}>
                        <h2 className={`text-lg font-semibold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Holdings</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className={`border-b ${isDark ? 'border-white/[0.1] bg-white/[0.01]' : 'border-gray-200 bg-gray-50'}`}>
                                <tr>
                                    <th className={`text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Symbol</th>
                                    <th className={`text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Name</th>
                                    <th className={`text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Shares</th>
                                    <th className={`text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Price</th>
                                    <th className={`text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Value</th>
                                    <th className={`text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Day Change</th>
                                    <th className={`text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Return</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan={7} className={`text-center py-12 px-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        No holdings yet. Add your first position to get started.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Link to="/portfolios" className={`backdrop-blur-2xl rounded-lg p-6 transition-all duration-300 block ${isDark ? 'bg-white/[0.02] border border-white/[0.15] hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]' : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md'}`}>
                        <h3 className={`text-base font-semibold mb-2 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Manage Portfolios</h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Create and organize your investment portfolios</p>
                    </Link>
                    <Link to="/backtest" className={`backdrop-blur-2xl rounded-lg p-6 transition-all duration-300 block ${isDark ? 'bg-white/[0.02] border border-white/[0.15] hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]' : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md'}`}>
                        <h3 className={`text-base font-semibold mb-2 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Backtest Strategies</h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Test your strategies against historical data</p>
                    </Link>
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard
