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
                    <h1 className="text-4xl font-bold text-premium-900 mb-3 tracking-tight">Dashboard</h1>
                    <p className="text-premium-600 text-lg">Welcome back, {user?.email}</p>
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
        </Layout>
    )
}

export default Dashboard
