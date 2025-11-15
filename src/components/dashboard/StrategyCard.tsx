import { useState } from 'react'
import { DeployedStrategy } from '../../types/dashboard'
import { useTheme } from '../../context/ThemeContext'
import { StrategyDetailsModal } from '../modals'

interface StrategyCardProps {
    strategy: DeployedStrategy
}

export const StrategyCard = ({ strategy }: StrategyCardProps) => {
    const { theme } = useTheme()
    const isDark = theme === 'dark'
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Convert dashboard strategy to portfolio format for modal
    const strategyForModal = {
        ...strategy,
        status: strategy.status === 'healthy' ? 'active' as const : strategy.status,
        ytdPerformance: strategy.ytdReturn,
        lastAlert: new Date(strategy.lastAlertDate).toLocaleDateString(),
        nextCheck: strategy.nextCheckTime,
        runningDays: Math.floor((Date.now() - new Date(strategy.deployedDate).getTime()) / (1000 * 60 * 60 * 24)),
        currentAllocation: strategy.currentAllocation.map(a => ({ ...a, color: 'bg-purple-500' }))
    }

    const statusConfig = {
        healthy: {
            label: 'On Track',
            colorClass: isDark ? 'text-green-400' : 'text-green-600',
            bgClass: isDark ? 'bg-green-500/10' : 'bg-green-50',
            dotClass: 'bg-green-500'
        },
        alert: {
            label: 'Action Required',
            colorClass: isDark ? 'text-yellow-400' : 'text-yellow-600',
            bgClass: isDark ? 'bg-yellow-500/10' : 'bg-yellow-50',
            dotClass: 'bg-yellow-500'
        },
        paused: {
            label: 'Paused',
            colorClass: isDark ? 'text-gray-400' : 'text-gray-600',
            bgClass: isDark ? 'bg-gray-500/10' : 'bg-gray-50',
            dotClass: 'bg-gray-500'
        }
    }

    const status = statusConfig[strategy.status]
    const performanceDiff = strategy.ytdReturn - strategy.backtestProjection
    const isOutperforming = performanceDiff >= 0

    return (
        <>
            <StrategyDetailsModal
                strategy={strategyForModal}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <div className={`backdrop-blur-2xl rounded-lg p-6 transition-all duration-300 ${isDark
                ? 'bg-white/[0.02] border border-white/[0.15] hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]'
                : 'bg-white border border-gray-200 hover:shadow-lg'
                }`}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <h3 className={`text-lg font-semibold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {strategy.name}
                    </h3>
                </div>

                {/* Status */}
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 ${status.bgClass}`}>
                    <span className={`w-2 h-2 rounded-full ${status.dotClass} ${strategy.status === 'alert' ? 'animate-pulse' : ''}`}></span>
                    <span className={`text-xs font-medium ${status.colorClass}`}>
                        {status.label}
                    </span>
                </div>

                {/* Performance */}
                <div className="mb-4">
                    <div className={`text-2xl font-bold mb-1 ${isDark ? 'text-purple-400' : 'text-purple-600'
                        }`}>
                        {strategy.ytdReturn > 0 ? '+' : ''}{strategy.ytdReturn.toFixed(1)}% YTD
                    </div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        vs Backtest: <span className={isOutperforming
                            ? isDark ? 'text-green-400' : 'text-green-600'
                            : isDark ? 'text-red-400' : 'text-red-600'
                        }>{isOutperforming ? '+' : ''}{performanceDiff.toFixed(1)}%</span>
                    </div>
                </div>

                {/* Current Allocation */}
                <div className="mb-4">
                    <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        Current Allocation
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {strategy.currentAllocation.map((asset) => (
                            <div
                                key={asset.symbol}
                                className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-white/[0.05] text-gray-300' : 'bg-gray-100 text-gray-700'
                                    }`}
                            >
                                {asset.percentage}% {asset.symbol}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className={`text-xs mb-4 pt-3 border-t ${isDark ? 'border-white/[0.1] text-gray-400' : 'border-gray-200 text-gray-600'
                    }`}>
                    <div>Last alert: {new Date(strategy.lastAlertDate).toLocaleDateString()}</div>
                    <div>Next check: {strategy.nextCheckTime}</div>
                </div>

                {/* Action Button */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className={`w-full py-2 px-4 rounded text-sm font-medium transition-all duration-200 ${strategy.status === 'alert'
                        ? isDark
                            ? 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 border border-yellow-500/50'
                            : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200'
                        : isDark
                            ? 'bg-white/[0.05] text-gray-300 hover:bg-white/[0.1] border border-white/[0.1]'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}>
                    {strategy.status === 'alert' ? 'View Alert' : 'View Details'}
                </button>
            </div>
        </>
    )
}
