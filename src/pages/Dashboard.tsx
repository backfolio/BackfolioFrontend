import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

const Dashboard = () => {
    const { user } = useAuth()

    return (
        <Layout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white tracking-tight">Dashboard</h1>
                    <p className="text-white/60 text-lg">Welcome back, {user?.email}</p>
                </div>

                {/* Portfolio Summary Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/[0.03] border border-white/[0.15] rounded-lg p-6 hover:bg-white/[0.05] transition-all duration-300">
                        <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Total Value</div>
                        <div className="text-2xl font-semibold text-white mb-1">$0.00</div>
                        <div className="text-xs text-white/60">0% change</div>
                    </div>
                    <div className="bg-white/[0.03] border border-white/[0.15] rounded-lg p-6 hover:bg-white/[0.05] transition-all duration-300">
                        <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Total Return</div>
                        <div className="text-2xl font-semibold text-success-500 mb-1">$0.00</div>
                        <div className="text-xs text-success-500">+0.00%</div>
                    </div>
                    <div className="bg-white/[0.03] border border-white/[0.15] rounded-lg p-6 hover:bg-white/[0.05] transition-all duration-300">
                        <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Day Change</div>
                        <div className="text-2xl font-semibold text-white mb-1">$0.00</div>
                        <div className="text-xs text-white/60">0.00%</div>
                    </div>
                    <div className="bg-white/[0.03] border border-white/[0.15] rounded-lg p-6 hover:bg-white/[0.05] transition-all duration-300">
                        <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Assets</div>
                        <div className="text-2xl font-semibold text-white mb-1">0</div>
                        <div className="text-xs text-white/60">0 positions</div>
                    </div>
                </div>

                {/* Holdings Table */}
                <div className="bg-white/[0.03] border border-white/[0.15] rounded-lg overflow-hidden mb-8">
                    <div className="px-6 py-4 border-b border-white/[0.08]">
                        <h2 className="text-lg font-semibold text-white tracking-tight">Holdings</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-white/[0.08]">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-white/60 uppercase tracking-wider">Symbol</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-white/60 uppercase tracking-wider">Name</th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-white/60 uppercase tracking-wider">Shares</th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-white/60 uppercase tracking-wider">Price</th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-white/60 uppercase tracking-wider">Value</th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-white/60 uppercase tracking-wider">Day Change</th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-white/60 uppercase tracking-wider">Total Return</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan={7} className="text-center text-white/50 py-12 px-6">
                                        No holdings yet. Add your first position to get started.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Link to="/portfolios" className="bg-white/[0.02] border border-white/[0.08] rounded-lg p-6 hover:bg-white/[0.03] hover:border-white/[0.15] transition-all duration-300 block">
                        <div className="text-2xl mb-3">💼</div>
                        <h3 className="text-base font-semibold text-white mb-2 tracking-tight">Manage Portfolios</h3>
                        <p className="text-sm text-white/60">Create and organize your investment portfolios</p>
                    </Link>
                    <Link to="/backtest" className="bg-white/[0.02] border border-white/[0.08] rounded-lg p-6 hover:bg-white/[0.03] hover:border-white/[0.15] transition-all duration-300 block">
                        <div className="text-2xl mb-3">📊</div>
                        <h3 className="text-base font-semibold text-white mb-2 tracking-tight">Backtest Strategies</h3>
                        <p className="text-sm text-white/60">Test your strategies against historical data</p>
                    </Link>
                    <Link to="/ai-chat" className="bg-white/[0.02] border border-white/[0.08] rounded-lg p-6 hover:bg-white/[0.03] hover:border-white/[0.15] transition-all duration-300 block">
                        <div className="text-2xl mb-3">🤖</div>
                        <h3 className="text-base font-semibold text-white mb-2 tracking-tight">AI Assistant</h3>
                        <p className="text-sm text-white/60">Get insights and analysis powered by AI</p>
                    </Link>
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard
