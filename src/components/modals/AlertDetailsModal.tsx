import { useTheme } from '../../context/ThemeContext'
import { AllocationPieChart } from '../charts'
import type { Alert } from '../../types/dashboard'

interface AlertDetailsModalProps {
    alert: Alert
    isOpen: boolean
    onClose: () => void
}

export const AlertDetailsModal = ({ alert, isOpen, onClose }: AlertDetailsModalProps) => {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    if (!isOpen) return null

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp)
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })
    }

    const getTypeConfig = () => {
        switch (alert.type) {
            case 'warning':
                return {
                    label: 'Warning',
                    color: 'text-yellow-400',
                    bg: 'bg-yellow-500/20',
                    border: 'border-yellow-500/50',
                    icon: (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    )
                }
            case 'success':
                return {
                    label: 'Success',
                    color: 'text-green-400',
                    bg: 'bg-green-500/20',
                    border: 'border-green-500/50',
                    icon: (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )
                }
            case 'info':
                return {
                    label: 'Info',
                    color: 'text-blue-400',
                    bg: 'bg-blue-500/20',
                    border: 'border-blue-500/50',
                    icon: (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )
                }
            case 'upgrade':
                return {
                    label: 'Upgrade',
                    color: 'text-purple-400',
                    bg: 'bg-purple-500/20',
                    border: 'border-purple-500/50',
                    icon: (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    )
                }
        }
    }

    const typeConfig = getTypeConfig()

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div
                className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${isDark ? 'bg-gray-900 border border-white/10' : 'bg-white border border-gray-200'
                    }`}
            >
                {/* Header */}
                <div className={`sticky top-0 z-10 px-8 py-6 border-b backdrop-blur-xl ${isDark ? 'bg-gray-900/95 border-white/10' : 'bg-white/95 border-gray-200'
                    }`}>
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${typeConfig.bg} ${typeConfig.color}`}>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    {typeConfig.icon}
                                </svg>
                            </div>
                            <div className="flex-1">
                                <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mb-2 ${typeConfig.bg} ${typeConfig.color} border ${typeConfig.border}`}>
                                    {typeConfig.label}
                                </div>
                                <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {alert.title}
                                </h2>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {formatTimestamp(alert.timestamp)}
                                    {alert.strategyName && ` • ${alert.strategyName}`}
                                </p>
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
                    {/* Alert Details */}
                    <div>
                        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Alert Details
                        </h3>
                        <div className={`p-6 rounded-lg ${isDark ? 'bg-white/[0.02] border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                            <p className={`text-base mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                {alert.message}
                            </p>
                            {alert.triggerReason && (
                                <div className="space-y-2">
                                    <div className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Trigger Reason
                                    </div>
                                    <div className={`p-4 rounded-lg ${isDark ? 'bg-white/[0.05]' : 'bg-white'}`}>
                                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {alert.triggerReason}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recommended Action - New Allocation */}
                    {alert.newAllocation && alert.newAllocation.length > 0 && (
                        <div>
                            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Recommended Action
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className={`p-6 rounded-lg ${isDark ? 'bg-white/[0.02] border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                                    <div className={`text-sm font-medium mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        New Allocation
                                    </div>
                                    <AllocationPieChart
                                        data={alert.newAllocation}
                                        size="medium"
                                        showLegend={false}
                                    />
                                </div>
                                <div className={`p-6 rounded-lg ${isDark ? 'bg-white/[0.02] border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                                    <div className={`text-sm font-medium mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Allocation Breakdown
                                    </div>
                                    <div className="space-y-3">
                                        {alert.newAllocation.map((asset) => (
                                            <div key={asset.symbol} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded bg-purple-500" />
                                                    <div>
                                                        <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                            {asset.symbol}
                                                        </div>
                                                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                            {asset.name}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    {asset.percentage}%
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Performance Impact */}
                    {alert.performanceSinceLastRebalance !== undefined && (
                        <div>
                            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Performance Impact
                            </h3>
                            <div className={`p-6 rounded-lg ${isDark ? 'bg-white/[0.02] border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Since Last Rebalance
                                        </div>
                                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                            Performance since the previous allocation change
                                        </p>
                                    </div>
                                    <div className={`text-4xl font-bold ${alert.performanceSinceLastRebalance >= 0
                                            ? isDark ? 'text-green-400' : 'text-green-600'
                                            : isDark ? 'text-red-400' : 'text-red-600'
                                        }`}>
                                        {alert.performanceSinceLastRebalance > 0 ? '+' : ''}
                                        {alert.performanceSinceLastRebalance.toFixed(1)}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Market Context (Pro/Premium feature teaser) */}
                    {alert.type === 'warning' && (
                        <div className={`p-6 rounded-lg border ${isDark ? 'bg-purple-500/5 border-purple-500/30' : 'bg-purple-50 border-purple-200'}`}>
                            <div className="flex items-start gap-4">
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                                    <svg className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h4 className={`font-semibold mb-2 ${isDark ? 'text-purple-300' : 'text-purple-900'}`}>
                                        Upgrade for AI-Powered Context
                                    </h4>
                                    <p className={`text-sm mb-3 ${isDark ? 'text-purple-200/80' : 'text-purple-800/80'}`}>
                                        Get market commentary, confidence scores, and alternative strategies with every alert.
                                    </p>
                                    <button className={`text-sm font-medium ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}>
                                        Learn More →
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className={`sticky bottom-0 px-8 py-6 border-t backdrop-blur-xl ${isDark ? 'bg-gray-900/95 border-white/10' : 'bg-white/95 border-gray-200'
                    }`}>
                    {alert.actions ? (
                        <div className="flex gap-3 justify-end flex-wrap">
                            {alert.actions.map((action, idx) => (
                                <button
                                    key={idx}
                                    onClick={action.variant === 'ghost' ? onClose : undefined}
                                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${action.variant === 'primary'
                                            ? isDark
                                                ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/50'
                                                : 'bg-purple-600 text-white hover:bg-purple-700'
                                            : action.variant === 'secondary'
                                                ? isDark
                                                    ? 'bg-white/[0.05] text-gray-300 hover:bg-white/[0.1] border border-white/[0.15]'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                                                : isDark
                                                    ? 'text-gray-400 hover:text-gray-300 hover:bg-white/[0.05]'
                                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                        }`}
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    ) : (
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
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
