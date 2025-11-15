import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import Layout from '../components/Layout'
import { useTheme } from '../context/ThemeContext'
import { StrategyCard } from '../components/dashboard/StrategyCard'
import { EmptyStrategyCard } from '../components/dashboard/EmptyStrategyCard'
import { UpgradeCard } from '../components/dashboard/UpgradeCard'
import { AlertCard } from '../components/dashboard/AlertCard'
import { PerformanceSnapshot } from '../components/dashboard/PerformanceSnapshot'
import { DashboardEmptyState } from '../components/dashboard/DashboardEmptyState'
import { mockDashboardDataPro } from '../data/mockDashboard'

const Dashboard = () => {
    const { user } = useAuth()
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    // Toggle between Pro user with data and Free user for testing
    const [dashboardData] = useState(mockDashboardDataPro)

    const hasStrategies = dashboardData.deployedStrategies.length > 0
    const canDeployMore = dashboardData.deployedStrategies.length < dashboardData.maxStrategies

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className={`text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Dashboard
                    </h1>
                    <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Welcome back, {user?.email}
                    </p>
                </div>

                {/* Conditional Rendering: Empty State or Active Dashboard */}
                {!hasStrategies ? (
                    <DashboardEmptyState />
                ) : (
                    <>
                        {/* Active Strategies Section */}
                        <div className="mb-12">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className={`text-2xl font-semibold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        Active Strategies
                                    </h2>
                                    <p className={`text-sm mt-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {dashboardData.userTier === 'pro' && (
                                            <>{dashboardData.deployedStrategies.length} of {dashboardData.maxStrategies} strategies deployed</>
                                        )}
                                        {dashboardData.userTier === 'premium' && (
                                            <>{dashboardData.deployedStrategies.length} of {dashboardData.maxStrategies} strategies deployed</>
                                        )}
                                    </p>
                                </div>
                                {canDeployMore && (
                                    <Link
                                        to="/backtest"
                                        className={`py-2.5 px-5 rounded-lg text-sm font-medium transition-all duration-200 ${isDark
                                            ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/50'
                                            : 'bg-purple-600 text-white hover:bg-purple-700'
                                            }`}
                                    >
                                        Deploy New Strategy
                                    </Link>
                                )}
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {dashboardData.deployedStrategies.map((strategy) => (
                                    <StrategyCard key={strategy.id} strategy={strategy} />
                                ))}

                                {canDeployMore && <EmptyStrategyCard />}

                                {!canDeployMore && (
                                    <UpgradeCard
                                        userTier={dashboardData.userTier}
                                        deployedCount={dashboardData.deployedStrategies.length}
                                        maxStrategies={dashboardData.maxStrategies}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Alerts & Signals Feed */}
                        <div className="mb-12">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className={`text-2xl font-semibold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        Recent Alerts
                                    </h2>
                                    <p className={`text-sm mt-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Latest signals and notifications from your strategies
                                    </p>
                                </div>
                                <button className={`text-sm font-medium transition-all duration-200 ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
                                    }`}>
                                    View All
                                </button>
                            </div>

                            <div className="space-y-4">
                                {dashboardData.recentAlerts.map((alert) => (
                                    <AlertCard key={alert.id} alert={alert} />
                                ))}
                            </div>
                        </div>

                        {/* Performance Snapshot */}
                        {dashboardData.performanceMetrics && (
                            <div className="mb-12">
                                <div className="mb-6">
                                    <h2 className={`text-2xl font-semibold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        Performance Overview
                                    </h2>
                                    <p className={`text-sm mt-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Aggregate performance across all active strategies
                                    </p>
                                </div>
                                <PerformanceSnapshot metrics={dashboardData.performanceMetrics} />
                            </div>
                        )}
                    </>
                )}

                {/* Quick Actions - Always Visible */}
                <div className="mt-8">
                    <div className="mb-6">
                        <h2 className={`text-2xl font-semibold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                            Quick Actions
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        <Link
                            to="/backtest"
                            className={`backdrop-blur-2xl rounded-lg p-6 transition-all duration-300 block group ${isDark
                                ? 'bg-white/[0.02] border border-white/[0.15] hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]'
                                : 'bg-white border border-gray-200 hover:border-purple-300 hover:shadow-lg'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors ${isDark
                                ? 'bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20'
                                : 'bg-purple-100 text-purple-600 group-hover:bg-purple-200'
                                }`}>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className={`text-base font-semibold mb-2 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'
                                }`}>
                                Start New Backtest
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Test strategies against historical data
                            </p>
                        </Link>

                        <Link
                            to="/portfolios"
                            className={`backdrop-blur-2xl rounded-lg p-6 transition-all duration-300 block group ${isDark
                                ? 'bg-white/[0.02] border border-white/[0.15] hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]'
                                : 'bg-white border border-gray-200 hover:border-purple-300 hover:shadow-lg'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors ${isDark
                                ? 'bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20'
                                : 'bg-purple-100 text-purple-600 group-hover:bg-purple-200'
                                }`}>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className={`text-base font-semibold mb-2 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'
                                }`}>
                                Manage Strategies
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                View and organize your strategy library
                            </p>
                        </Link>

                        <a
                            href="#"
                            className={`backdrop-blur-2xl rounded-lg p-6 transition-all duration-300 block group ${isDark
                                ? 'bg-white/[0.02] border border-white/[0.15] hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]'
                                : 'bg-white border border-gray-200 hover:border-purple-300 hover:shadow-lg'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors ${isDark
                                ? 'bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20'
                                : 'bg-purple-100 text-purple-600 group-hover:bg-purple-200'
                                }`}>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className={`text-base font-semibold mb-2 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'
                                }`}>
                                Documentation
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Learn best practices and tutorials
                            </p>
                        </a>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard
