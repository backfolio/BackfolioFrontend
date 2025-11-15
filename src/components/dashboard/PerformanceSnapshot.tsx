import { PerformanceMetrics } from '../../types/dashboard'
import { useTheme } from '../../context/ThemeContext'
import { PerformanceSparkline } from '../charts'

interface PerformanceSnapshotProps {
    metrics: PerformanceMetrics
}

// Mock performance data for sparkline
const generatePerformanceData = (finalValue: number) => {
    const data = []
    const points = 30
    for (let i = 0; i < points; i++) {
        const progress = i / (points - 1)
        const value = finalValue * progress + (Math.random() - 0.5) * 2
        data.push({
            date: `Day ${i + 1}`,
            value: Number(value.toFixed(1))
        })
    }
    return data
}

export const PerformanceSnapshot = ({ metrics }: PerformanceSnapshotProps) => {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    const performanceData = generatePerformanceData(metrics.last30Days)

    return (
        <div className="grid md:grid-cols-2 gap-6">
            {/* Performance Card with Chart */}
            <div className={`backdrop-blur-2xl rounded-lg p-6 transition-all duration-300 ${isDark
                ? 'bg-white/[0.02] border border-white/[0.15] hover:border-purple-500/40'
                : 'bg-white border border-gray-200 hover:shadow-md'
                }`}>
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">📊</span>
                    <h3 className={`text-lg font-semibold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                        Your Performance
                    </h3>
                </div>

                {/* 30-Day Performance Chart */}
                <div className="mb-4 h-24">
                    <PerformanceSparkline
                        data={performanceData}
                        color="#8b5cf6"
                        showGrid={false}
                        showAxis={false}
                    />
                </div>

                <div className="space-y-4">
                    <div>
                        <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                            Last 30 Days
                        </div>
                        <div className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'
                            }`}>
                            {metrics.last30Days > 0 ? '+' : ''}{metrics.last30Days.toFixed(1)}%
                        </div>
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            vs Backtest: {metrics.vsBacktest > 0 ? '+' : ''}{metrics.vsBacktest.toFixed(1)}%
                        </div>
                    </div>

                    <div className={`pt-3 border-t ${isDark ? 'border-white/[0.1]' : 'border-gray-200'}`}>
                        <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                            YTD
                        </div>
                        <div className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                            {metrics.ytd > 0 ? '+' : ''}{metrics.ytd.toFixed(1)}%
                        </div>
                    </div>
                </div>

                <button className={`w-full mt-4 py-2 px-4 rounded text-sm font-medium transition-all duration-200 ${isDark
                    ? 'bg-white/[0.05] text-gray-300 hover:bg-white/[0.1] border border-white/[0.1]'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}>
                    View Full Report
                </button>
            </div>

            {/* Execution Metrics Card */}
            <div className={`backdrop-blur-2xl rounded-lg p-6 transition-all duration-300 ${isDark
                ? 'bg-white/[0.02] border border-white/[0.15] hover:border-purple-500/40'
                : 'bg-white border border-gray-200 hover:shadow-md'
                }`}>
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🎯</span>
                    <h3 className={`text-lg font-semibold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                        Execution Metrics
                    </h3>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Alerts Triggered
                        </span>
                        <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {metrics.alertsTriggered}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Alerts Executed
                        </span>
                        <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {metrics.alertsExecuted}
                        </span>
                    </div>

                    <div className={`pt-3 border-t ${isDark ? 'border-white/[0.1]' : 'border-gray-200'}`}>
                        <div className="flex justify-between items-center mb-2">
                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Execution Rate
                            </span>
                            <span className={`text-lg font-semibold ${metrics.executionRate >= 80
                                ? isDark ? 'text-green-400' : 'text-green-600'
                                : isDark ? 'text-yellow-400' : 'text-yellow-600'
                                }`}>
                                {metrics.executionRate}%
                            </span>
                        </div>
                        <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/[0.1]' : 'bg-gray-200'
                            }`}>
                            <div
                                className={`h-full transition-all duration-500 ${metrics.executionRate >= 80
                                    ? 'bg-green-500'
                                    : 'bg-yellow-500'
                                    }`}
                                style={{ width: `${metrics.executionRate}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-3">
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Avg Response Time
                        </span>
                        <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {metrics.avgResponseTimeHours}h
                        </span>
                    </div>
                </div>

                <button className={`w-full mt-4 py-2 px-4 rounded text-sm font-medium transition-all duration-200 ${isDark
                    ? 'bg-white/[0.05] text-gray-300 hover:bg-white/[0.1] border border-white/[0.1]'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}>
                    View Alert History
                </button>
            </div>
        </div>
    )
}
