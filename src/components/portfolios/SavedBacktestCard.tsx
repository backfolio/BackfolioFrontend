import { useTheme } from '../../context/ThemeContext'
import type { SavedBacktest } from '../../data/mockPortfolios'

interface SavedBacktestCardProps {
    backtest: SavedBacktest
}

export const SavedBacktestCard = ({ backtest }: SavedBacktestCardProps) => {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    const getRiskBadge = () => {
        switch (backtest.riskLevel) {
            case 'aggressive':
                return (
                    <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${isDark
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                    >
                        Aggressive
                    </span>
                )
            case 'defensive':
                return (
                    <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${isDark
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                    >
                        Defensive
                    </span>
                )
            case 'balanced':
                return (
                    <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${isDark
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : 'bg-green-50 text-green-700 border border-green-200'
                            }`}
                    >
                        Balanced
                    </span>
                )
        }
    }

    return (
        <div
            className={`backdrop-blur-2xl rounded-lg p-5 transition-all duration-300 ${isDark
                ? 'bg-white/[0.02] border border-white/[0.15] hover:border-purple-500/50'
                : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
        >
            <div className="flex gap-4">
                {/* Timestamp */}
                <div
                    className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'
                        }`}
                >
                    <div className="whitespace-nowrap">{backtest.timestamp.split(',')[0]}</div>
                    <div className="whitespace-nowrap">{backtest.timestamp.split(',')[1]}</div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3
                                className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'
                                    }`}
                            >
                                {backtest.name}
                                {backtest.version > 1 && ` (v${backtest.version})`}
                            </h3>
                            {backtest.isDeployed && (
                                <span
                                    className={`px-2 py-0.5 rounded text-xs font-medium ${isDark
                                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                        : 'bg-purple-50 text-purple-700 border border-purple-200'
                                        }`}
                                >
                                    DEPLOYED
                                </span>
                            )}
                            {getRiskBadge()}
                        </div>
                    </div>

                    {/* Metrics */}
                    <div
                        className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}
                    >
                        Return: <span className="font-medium">{backtest.totalReturn >= 0 ? '+' : ''}{backtest.totalReturn}%</span> •
                        Sharpe: <span className="font-medium">{backtest.sharpeRatio.toFixed(2)}</span> •
                        Max DD: <span className="font-medium">{backtest.maxDrawdown}%</span>
                    </div>

                    {/* Rules */}
                    <div
                        className={`text-xs mb-3 ${isDark ? 'text-gray-500' : 'text-gray-500'
                            }`}
                    >
                        Rules: {backtest.rules}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                        {!backtest.isDeployed ? (
                            <>
                                <button
                                    className={`py-1.5 px-3 rounded text-xs font-medium transition-all duration-200 ${isDark
                                        ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/50'
                                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                                        }`}
                                >
                                    Deploy Strategy
                                </button>
                                <button
                                    className={`py-1.5 px-3 rounded text-xs font-medium transition-all duration-200 ${isDark
                                        ? 'bg-white/[0.02] text-gray-400 hover:bg-white/[0.05] border border-white/[0.15]'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                        }`}
                                >
                                    View Results
                                </button>
                                <button
                                    className={`py-1.5 px-3 rounded text-xs font-medium transition-all duration-200 ${isDark
                                        ? 'text-gray-400 hover:text-gray-300'
                                        : 'text-gray-600 hover:text-gray-700'
                                        }`}
                                >
                                    Edit
                                </button>
                                <button
                                    className={`py-1.5 px-3 rounded text-xs font-medium transition-all duration-200 ${isDark
                                        ? 'text-red-400 hover:text-red-300'
                                        : 'text-red-600 hover:text-red-700'
                                        }`}
                                >
                                    Delete
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className={`py-1.5 px-3 rounded text-xs font-medium transition-all duration-200 ${isDark
                                        ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/50'
                                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                                        }`}
                                >
                                    View Live Status
                                </button>
                                <button
                                    className={`py-1.5 px-3 rounded text-xs font-medium transition-all duration-200 ${isDark
                                        ? 'bg-white/[0.02] text-gray-400 hover:bg-white/[0.05] border border-white/[0.15]'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                        }`}
                                >
                                    View Backtest
                                </button>
                                <button
                                    className={`py-1.5 px-3 rounded text-xs font-medium transition-all duration-200 ${isDark
                                        ? 'text-gray-400 hover:text-gray-300'
                                        : 'text-gray-600 hover:text-gray-700'
                                        }`}
                                >
                                    Archive
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
