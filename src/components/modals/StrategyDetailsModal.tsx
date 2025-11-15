import { useTheme } from '../../context/ThemeContext'
import { AllocationPieChart, PerformanceSparkline } from '../charts'
import type { DeployedStrategy } from '../../data/mockPortfolios'

interface StrategyDetailsModalProps {
    strategy: DeployedStrategy
    isOpen: boolean
    onClose: () => void
}

// Mock historical performance data
const generateHistoricalData = (currentPerformance: number) => {
    const data = []
    const days = 90
    for (let i = 0; i < days; i++) {
        const progress = i / (days - 1)
        const value = currentPerformance * progress + (Math.random() - 0.5) * 3
        data.push({
            date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            value: Number(value.toFixed(2))
        })
    }
    return data
}

export const StrategyDetailsModal = ({ strategy, isOpen, onClose }: StrategyDetailsModalProps) => {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    if (!isOpen) return null

    const historicalData = generateHistoricalData(strategy.ytdPerformance)
    const executionRate = strategy.alertsTriggered > 0
        ? (strategy.alertsExecuted / strategy.alertsTriggered) * 100
        : 0

    const getStatusConfig = () => {
        switch (strategy.status) {
            case 'active':
                return { label: 'Active', color: 'text-green-400', bg: 'bg-green-500/20', dot: 'bg-green-500' }
            case 'alert':
                return { label: 'Alert Pending', color: 'text-yellow-400', bg: 'bg-yellow-500/20', dot: 'bg-yellow-500' }
            case 'paused':
                return { label: 'Paused', color: 'text-gray-400', bg: 'bg-gray-500/20', dot: 'bg-gray-500' }
        }
    }

    const statusConfig = getStatusConfig()

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div
                className={`relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${isDark ? 'bg-gray-900 border border-white/10' : 'bg-white border border-gray-200'
                    }`}
            >
                {/* Header */}
                <div className={`sticky top-0 z-10 px-8 py-6 border-b backdrop-blur-xl ${isDark ? 'bg-gray-900/95 border-white/10' : 'bg-white/95 border-gray-200'
                    }`}>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {strategy.name}
                            </h2>
                            <div className="flex items-center gap-3">
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg}`}>
                                    <span className={`w-2 h-2 rounded-full ${statusConfig.dot} ${strategy.status === 'alert' ? 'animate-pulse' : ''}`}></span>
                                    <span className={statusConfig.color}>{statusConfig.label}</span>
                                </div>
                                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Deployed {strategy.deployedDate} • Running for {strategy.runningDays} days
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                                }`}
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-8 py-6 space-y-8">
                    {/* Performance Overview */}
                    <div>
                        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Performance Overview
                        </h3>
                        <div className="grid md:grid-cols-3 gap-6 mb-6">
                            <div className={`p-6 rounded-lg ${isDark ? 'bg-white/[0.02] border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                                <div className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    YTD Performance
                                </div>
                                <div className={`text-3xl font-bold ${strategy.ytdPerformance >= 0
                                        ? isDark ? 'text-green-400' : 'text-green-600'
                                        : isDark ? 'text-red-400' : 'text-red-600'
                                    }`}>
                                    {strategy.ytdPerformance >= 0 ? '+' : ''}{strategy.ytdPerformance.toFixed(1)}%
                                </div>
                            </div>
                            <div className={`p-6 rounded-lg ${isDark ? 'bg-white/[0.02] border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                                <div className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Backtest Projection
                                </div>
                                <div className={`text-3xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                                    {strategy.backtestProjection >= 0 ? '+' : ''}{strategy.backtestProjection.toFixed(1)}%
                                </div>
                            </div>
                            <div className={`p-6 rounded-lg ${isDark ? 'bg-white/[0.02] border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                                <div className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    vs Projection
                                </div>
                                <div className={`text-3xl font-bold ${strategy.ytdPerformance >= strategy.backtestProjection
                                        ? isDark ? 'text-green-400' : 'text-green-600'
                                        : isDark ? 'text-yellow-400' : 'text-yellow-600'
                                    }`}>
                                    {strategy.ytdPerformance - strategy.backtestProjection >= 0 ? '+' : ''}
                                    {(strategy.ytdPerformance - strategy.backtestProjection).toFixed(1)}%
                                </div>
                            </div>
                        </div>

                        {/* Performance Chart */}
                        <div className={`p-6 rounded-lg ${isDark ? 'bg-white/[0.02] border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                            <div className={`text-sm font-medium mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                90-Day Performance History
                            </div>
                            <div className="h-48">
                                <PerformanceSparkline
                                    data={historicalData}
                                    color="#8b5cf6"
                                    showGrid={true}
                                    showAxis={true}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Current Allocation */}
                    <div>
                        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Current Allocation
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className={`p-6 rounded-lg ${isDark ? 'bg-white/[0.02] border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                                <AllocationPieChart
                                    data={strategy.currentAllocation}
                                    size="large"
                                    showLegend={false}
                                />
                            </div>
                            <div className={`p-6 rounded-lg ${isDark ? 'bg-white/[0.02] border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                                <div className="space-y-4">
                                    {strategy.currentAllocation.map((asset) => (
                                        <div key={asset.symbol}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded ${asset.color}`} />
                                                    <div>
                                                        <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                            {asset.symbol}
                                                        </div>
                                                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                            {asset.name}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    {asset.percentage}%
                                                </div>
                                            </div>
                                            <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-gray-200'}`}>
                                                <div
                                                    className={`h-full ${asset.color} transition-all duration-300`}
                                                    style={{ width: `${asset.percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Alert Activity */}
                    <div>
                        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Alert Activity
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className={`p-6 rounded-lg ${isDark ? 'bg-white/[0.02] border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                                <div className={`text-sm font-medium mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Execution Rate
                                </div>
                                <div className={`text-4xl font-bold mb-4 ${executionRate >= 80 ? isDark ? 'text-green-400' : 'text-green-600' : isDark ? 'text-yellow-400' : 'text-yellow-600'
                                    }`}>
                                    {executionRate.toFixed(0)}%
                                </div>
                                <div className={`h-3 rounded-full overflow-hidden mb-4 ${isDark ? 'bg-white/5' : 'bg-gray-200'}`}>
                                    <div
                                        className={`h-full transition-all duration-300 ${executionRate >= 80 ? 'bg-green-500' : 'bg-yellow-500'
                                            }`}
                                        style={{ width: `${executionRate}%` }}
                                    />
                                </div>
                                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {strategy.alertsExecuted} of {strategy.alertsTriggered} alerts executed
                                </div>
                            </div>
                            <div className={`p-6 rounded-lg ${isDark ? 'bg-white/[0.02] border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Alerts Triggered</span>
                                        <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {strategy.alertsTriggered}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Alerts Executed</span>
                                        <span className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                                            {strategy.alertsExecuted}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Alerts Ignored</span>
                                        <span className={`text-2xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                                            {strategy.alertsIgnored}
                                        </span>
                                    </div>
                                    <div className={`pt-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                                        <div className="flex justify-between items-center">
                                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Next Check</span>
                                            <span className={`text-sm font-medium ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                                                {strategy.nextCheck}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className={`sticky bottom-0 px-8 py-6 border-t backdrop-blur-xl ${isDark ? 'bg-gray-900/95 border-white/10' : 'bg-white/95 border-gray-200'
                    }`}>
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={onClose}
                            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isDark
                                    ? 'bg-white/[0.05] text-gray-300 hover:bg-white/[0.1] border border-white/[0.15]'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                                }`}
                        >
                            Close
                        </button>
                        {strategy.status === 'active' && (
                            <button
                                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isDark
                                        ? 'bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 border border-gray-500/50'
                                        : 'bg-gray-600 text-white hover:bg-gray-700'
                                    }`}
                            >
                                Pause Strategy
                            </button>
                        )}
                        <button
                            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isDark
                                    ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/50'
                                    : 'bg-purple-600 text-white hover:bg-purple-700'
                                }`}
                        >
                            Edit Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
