import { useTheme } from '../../context/ThemeContext'
import { Link } from 'react-router-dom'

export const EmptyStrategyCard = () => {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    return (
        <div className={`backdrop-blur-2xl rounded-lg p-8 transition-all duration-300 text-center group ${isDark
            ? 'bg-white/[0.02] border border-white/[0.15] hover:border-purple-500/40'
            : 'bg-white border border-gray-200 hover:border-purple-300'
            }`}>
            <div className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center transition-colors ${isDark
                    ? 'bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20'
                    : 'bg-purple-100 text-purple-600 group-hover:bg-purple-200'
                }`}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </div>
            <h3 className={`text-lg font-semibold mb-2 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'
                }`}>
                Deploy New Strategy
            </h3>
            <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Turn your backtest into live alerts
            </p>
            <Link
                to="/backtest"
                className={`inline-block py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${isDark
                    ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/50'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
            >
                Browse Backtests
            </Link>
        </div>
    )
}
