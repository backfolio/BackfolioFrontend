import { useState } from 'react'
import { Alert } from '../../types/dashboard'
import { useTheme } from '../../context/ThemeContext'
import { AlertDetailsModal } from '../modals'

interface AlertCardProps {
    alert: Alert
}

export const AlertCard = ({ alert }: AlertCardProps) => {
    const { theme } = useTheme()
    const isDark = theme === 'dark'
    const [isModalOpen, setIsModalOpen] = useState(false)

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

        if (diffInHours < 1) {
            return 'Just now'
        } else if (diffInHours < 24) {
            return `${diffInHours} hours ago`
        } else {
            const diffInDays = Math.floor(diffInHours / 24)
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
        }
    }

    const typeConfig = {
        warning: {
            bgClass: isDark ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200',
            iconBgClass: isDark ? 'bg-yellow-500/20' : 'bg-yellow-100',
            iconColor: isDark ? 'text-yellow-400' : 'text-yellow-600',
            titleColor: isDark ? 'text-yellow-300' : 'text-yellow-800'
        },
        success: {
            bgClass: isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200',
            iconBgClass: isDark ? 'bg-green-500/20' : 'bg-green-100',
            iconColor: isDark ? 'text-green-400' : 'text-green-600',
            titleColor: isDark ? 'text-green-300' : 'text-green-800'
        },
        info: {
            bgClass: isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200',
            iconBgClass: isDark ? 'bg-blue-500/20' : 'bg-blue-100',
            iconColor: isDark ? 'text-blue-400' : 'text-blue-600',
            titleColor: isDark ? 'text-blue-300' : 'text-blue-800'
        },
        upgrade: {
            bgClass: isDark ? 'bg-purple-500/10 border-purple-500/30' : 'bg-purple-50 border-purple-200',
            iconBgClass: isDark ? 'bg-purple-500/20' : 'bg-purple-100',
            iconColor: isDark ? 'text-purple-400' : 'text-purple-600',
            titleColor: isDark ? 'text-purple-300' : 'text-purple-800'
        }
    }

    const config = typeConfig[alert.type]

    const renderIcon = () => {
        const iconProps = { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }

        switch (alert.type) {
            case 'warning':
                return (
                    <svg {...iconProps}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                )
            case 'success':
                return (
                    <svg {...iconProps}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )
            case 'info':
                return (
                    <svg {...iconProps}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )
            case 'upgrade':
                return (
                    <svg {...iconProps}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                )
        }
    }

    return (
        <>
            <AlertDetailsModal
                alert={alert}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <div className={`backdrop-blur-2xl rounded-lg p-4 transition-all duration-300 border ${config.bgClass}`}>
                <div className="flex gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${config.iconBgClass} ${config.iconColor}`}>
                        {renderIcon()}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {/* Title */}
                        <h4 className={`font-semibold mb-1 ${config.titleColor}`}>
                            {alert.title}
                        </h4>

                        {/* Timestamp and Strategy */}
                        <div className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {formatTimestamp(alert.timestamp)}
                            {alert.strategyName && ` • ${alert.strategyName}`}
                            {alert.triggerReason && ` • ${alert.triggerReason}`}
                        </div>

                        {/* Message */}
                        <p className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {alert.message}
                        </p>

                        {/* New Allocation */}
                        {alert.newAllocation && (
                            <div className={`text-xs mb-3 p-2 rounded ${isDark ? 'bg-white/[0.05]' : 'bg-white/50'
                                }`}>
                                <div className={`font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    New allocation:
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {alert.newAllocation.map((asset) => (
                                        <span key={asset.symbol} className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                            {asset.percentage}% {asset.symbol}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Performance */}
                        {alert.performanceSinceLastRebalance !== undefined && (
                            <div className={`text-xs mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Performance: {alert.performanceSinceLastRebalance > 0 ? '+' : ''}
                                {alert.performanceSinceLastRebalance.toFixed(1)}% since last rebalance
                            </div>
                        )}

                        {/* Actions */}
                        {alert.actions && (
                            <div className="flex flex-wrap gap-2">
                                {alert.actions.map((action, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            if (action.variant === 'primary') {
                                                setIsModalOpen(true)
                                            }
                                        }}
                                        className={`py-1 px-3 rounded text-xs font-medium transition-all duration-200 ${action.variant === 'primary'
                                            ? isDark
                                                ? 'bg-purple-500 text-white hover:bg-purple-600'
                                                : 'bg-purple-600 text-white hover:bg-purple-700'
                                            : action.variant === 'secondary'
                                                ? isDark
                                                    ? 'bg-white/[0.1] text-gray-300 hover:bg-white/[0.15] border border-white/[0.2]'
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
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
