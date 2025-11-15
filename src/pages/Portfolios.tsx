import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useTheme } from '../context/ThemeContext'
import {
    DeployedStrategyCard,
    SavedBacktestCard,
    UpgradePrompt,
    StrategyComparisonTable,
} from '../components/portfolios'
import { AllocationPieChart, MetricsBarChart } from '../components/charts'
import { mockPortfolioData } from '../data/mockPortfolios'

type Tab = 'deployed' | 'saved' | 'compare'
type SortOption = 'recent' | 'return' | 'sharpe' | 'drawdown' | 'name'
type FilterOption = 'all' | 'deployed' | 'not-deployed' | 'aggressive' | 'defensive' | 'balanced'

const Portfolios = () => {
    const { theme } = useTheme()
    const isDark = theme === 'dark'
    const [activeTab, setActiveTab] = useState<Tab>('deployed')
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<SortOption>('recent')
    const [filterBy, setFilterBy] = useState<FilterOption>('all')

    const portfolioData = mockPortfolioData
    const canDeployMore = portfolioData.deployedStrategies.length < portfolioData.maxDeployedStrategies

    // Filter and sort backtests
    const filteredBacktests = portfolioData.savedBacktests
        .filter((backtest) => {
            // Search filter
            if (searchQuery && !backtest.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false
            }
            // Status filter
            if (filterBy === 'deployed' && !backtest.isDeployed) return false
            if (filterBy === 'not-deployed' && backtest.isDeployed) return false
            if (filterBy === 'aggressive' && backtest.riskLevel !== 'aggressive') return false
            if (filterBy === 'defensive' && backtest.riskLevel !== 'defensive') return false
            if (filterBy === 'balanced' && backtest.riskLevel !== 'balanced') return false
            return true
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'return':
                    return b.totalReturn - a.totalReturn
                case 'sharpe':
                    return b.sharpeRatio - a.sharpeRatio
                case 'drawdown':
                    return a.maxDrawdown - b.maxDrawdown // Lower is better
                case 'name':
                    return a.name.localeCompare(b.name)
                case 'recent':
                default:
                    return 0 // Already in chronological order
            }
        })

    const tabButtonClass = (tab: Tab) =>
        `px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab
            ? isDark
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-lg shadow-purple-500/10'
                : 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
            : isDark
                ? 'text-gray-400 hover:text-gray-300 hover:bg-white/[0.05] border border-transparent'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent'
        }`

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-8">
                {/* Header */}
                <div className="mb-12">
                    <h1 className={`text-4xl font-bold tracking-tight mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Strategy Library
                    </h1>
                    <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Manage, deploy, and compare your trading strategies
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className={`flex gap-3 mb-8 border-b pb-1 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                    <button onClick={() => setActiveTab('deployed')} className={tabButtonClass('deployed')}>
                        Deployed
                        {portfolioData.deployedStrategies.length > 0 && (
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === 'deployed'
                                ? isDark ? 'bg-purple-500/30' : 'bg-white/20'
                                : isDark ? 'bg-white/10' : 'bg-gray-200'
                                }`}>
                                {portfolioData.deployedStrategies.length}
                            </span>
                        )}
                    </button>
                    <button onClick={() => setActiveTab('saved')} className={tabButtonClass('saved')}>
                        Saved Backtests
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === 'saved'
                            ? isDark ? 'bg-purple-500/30' : 'bg-white/20'
                            : isDark ? 'bg-white/10' : 'bg-gray-200'
                            }`}>
                            {portfolioData.savedBacktests.length}
                        </span>
                    </button>
                    <button onClick={() => setActiveTab('compare')} className={tabButtonClass('compare')}>
                        Compare
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'deployed' && (
                    <div>
                        {/* Portfolio Overview - Show when strategies are deployed */}
                        {portfolioData.deployedStrategies.length > 0 && (
                            <div className="grid lg:grid-cols-3 gap-6 mb-8">
                                {/* Combined Allocation Pie Chart */}
                                <div className={`backdrop-blur-2xl rounded-lg p-6 ${isDark
                                    ? 'bg-white/[0.02] border border-white/[0.15]'
                                    : 'bg-white border border-gray-200'
                                    }`}>
                                    <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Portfolio Allocation
                                    </h3>
                                    <AllocationPieChart
                                        data={portfolioData.deployedStrategies.flatMap(s => s.currentAllocation)}
                                        size="medium"
                                        showLegend={true}
                                    />
                                </div>

                                {/* Performance Metrics */}
                                <div className={`backdrop-blur-2xl rounded-lg p-6 ${isDark
                                    ? 'bg-white/[0.02] border border-white/[0.15]'
                                    : 'bg-white border border-gray-200'
                                    }`}>
                                    <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Strategy Performance
                                    </h3>
                                    <MetricsBarChart
                                        data={portfolioData.deployedStrategies.map(s => ({
                                            label: s.name.split(' ')[0],
                                            value: s.ytdPerformance,
                                            target: s.backtestProjection
                                        }))}
                                        color="#8b5cf6"
                                        showTarget={true}
                                    />
                                </div>

                                {/* Alert Summary */}
                                <div className={`backdrop-blur-2xl rounded-lg p-6 ${isDark
                                    ? 'bg-white/[0.02] border border-white/[0.15]'
                                    : 'bg-white border border-gray-200'
                                    }`}>
                                    <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Alert Activity
                                    </h3>
                                    <div className="space-y-4">
                                        {portfolioData.deployedStrategies.map(strategy => {
                                            const executionRate = strategy.alertsTriggered > 0
                                                ? (strategy.alertsExecuted / strategy.alertsTriggered) * 100
                                                : 0
                                            return (
                                                <div key={strategy.id}>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                            {strategy.name.split(' ')[0]}
                                                        </span>
                                                        <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                            {executionRate.toFixed(0)}%
                                                        </span>
                                                    </div>
                                                    <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                                                        <div
                                                            className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300"
                                                            style={{ width: `${executionRate}%` }}
                                                        />
                                                    </div>
                                                    <div className={`flex gap-4 mt-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                                        <span>{strategy.alertsTriggered} triggered</span>
                                                        <span>{strategy.alertsExecuted} executed</span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Header */}
                        <div className="flex items-start justify-between mb-8">
                            <div>
                                <h2 className={`text-2xl font-bold tracking-tight mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Live Strategies
                                </h2>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {portfolioData.deployedStrategies.length} of {portfolioData.maxDeployedStrategies} deployed
                                    {portfolioData.userTier === 'pro' && ' • 24/7 monitoring with email alerts'}
                                    {portfolioData.userTier === 'premium' && ' • Multi-strategy monitoring with AI insights'}
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

                        {/* Deployed Strategies Grid */}
                        {portfolioData.deployedStrategies.length === 0 ? (
                            <div
                                className={`backdrop-blur-2xl rounded-lg p-16 text-center ${isDark
                                    ? 'bg-white/[0.02] border border-white/[0.15]'
                                    : 'bg-white border border-gray-200'
                                    }`}
                            >
                                <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${isDark ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
                                    <svg className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Deploy Your First Strategy
                                </h3>
                                <p className={`text-sm mb-8 max-w-md mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Turn your backtests into live monitoring with automated alerts when it's time to rebalance.
                                </p>
                                <div className="flex gap-3 justify-center">
                                    <button
                                        onClick={() => setActiveTab('saved')}
                                        className={`py-2.5 px-5 rounded-lg text-sm font-medium transition-all duration-200 ${isDark
                                            ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/50'
                                            : 'bg-purple-600 text-white hover:bg-purple-700'
                                            }`}
                                    >
                                        Browse Your Backtests
                                    </button>
                                    <Link
                                        to="/backtest"
                                        className={`py-2.5 px-5 rounded-lg text-sm font-medium transition-all duration-200 ${isDark
                                            ? 'bg-white/[0.05] text-gray-300 hover:bg-white/[0.08] border border-white/[0.15]'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                            }`}
                                    >
                                        Start New Backtest
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {portfolioData.deployedStrategies.map((strategy) => (
                                    <DeployedStrategyCard key={strategy.id} strategy={strategy} />
                                ))}
                                {!canDeployMore && (
                                    <UpgradePrompt
                                        userTier={portfolioData.userTier}
                                        deployedCount={portfolioData.deployedStrategies.length}
                                        maxStrategies={portfolioData.maxDeployedStrategies}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'saved' && (
                    <div>
                        {/* Header with Search and Filters */}
                        <div className="mb-8">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className={`text-2xl font-bold tracking-tight mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Saved Backtests
                                    </h2>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {portfolioData.savedBacktests.length} strategies in your library
                                    </p>
                                </div>
                                <Link
                                    to="/backtest"
                                    className={`py-2.5 px-5 rounded-lg text-sm font-medium transition-all duration-200 ${isDark
                                        ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/50'
                                        : 'bg-purple-600 text-white hover:bg-purple-700'
                                        }`}
                                >
                                    New Backtest
                                </Link>
                            </div>

                            {/* Search and Filter Bar */}
                            <div className="flex gap-3">
                                <div className="flex-1 relative">
                                    <svg className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search strategies..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${isDark
                                            ? 'bg-white/[0.05] border border-white/[0.15] text-white placeholder-gray-500 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20'
                                            : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20'
                                            }`}
                                    />
                                </div>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                                    className={`px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${isDark
                                        ? 'bg-white/[0.05] border border-white/[0.15] text-white focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20'
                                        : 'bg-white border border-gray-300 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20'
                                        }`}
                                >
                                    <option value="recent">Recent First</option>
                                    <option value="return">Best Return</option>
                                    <option value="sharpe">Best Sharpe</option>
                                    <option value="drawdown">Lowest Drawdown</option>
                                    <option value="name">Name (A-Z)</option>
                                </select>
                                <select
                                    value={filterBy}
                                    onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                                    className={`px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${isDark
                                        ? 'bg-white/[0.05] border border-white/[0.15] text-white focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20'
                                        : 'bg-white border border-gray-300 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20'
                                        }`}
                                >
                                    <option value="all">All Strategies</option>
                                    <option value="deployed">Deployed</option>
                                    <option value="not-deployed">Not Deployed</option>
                                    <option value="aggressive">Aggressive</option>
                                    <option value="defensive">Defensive</option>
                                    <option value="balanced">Balanced</option>
                                </select>
                            </div>
                        </div>

                        {/* Backtests List */}
                        {filteredBacktests.length === 0 ? (
                            <div
                                className={`backdrop-blur-2xl rounded-lg p-16 text-center ${isDark
                                    ? 'bg-white/[0.02] border border-white/[0.15]'
                                    : 'bg-white border border-gray-200'
                                    }`}
                            >
                                <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-500/10' : 'bg-gray-100'}`}>
                                    <svg className={`w-8 h-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    No strategies found
                                </h3>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Try adjusting your search or filters
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredBacktests.map((backtest) => (
                                    <SavedBacktestCard key={backtest.id} backtest={backtest} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'compare' && (
                    <div>
                        {/* Header */}
                        <div className="mb-8">
                            <h2 className={`text-2xl font-bold tracking-tight mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Strategy Comparison
                            </h2>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Compare performance metrics side-by-side to find your best strategy
                            </p>
                        </div>

                        {/* Comparison Table */}
                        <StrategyComparisonTable strategies={portfolioData.comparisonStrategies} />
                    </div>
                )}
            </div>
        </Layout>
    )
}

export default Portfolios
