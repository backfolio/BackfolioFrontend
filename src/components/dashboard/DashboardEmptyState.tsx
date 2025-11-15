import { useTheme } from '../../context/ThemeContext'
import { Link } from 'react-router-dom'

export const DashboardEmptyState = () => {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    return (
        <div className={`backdrop-blur-2xl rounded-lg p-12 text-center transition-all duration-300 ${isDark
            ? 'bg-white/[0.02] border border-white/[0.15]'
            : 'bg-white border border-gray-200'
            }`}>
            <div className="max-w-2xl mx-auto">
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${isDark ? 'bg-purple-500/10' : 'bg-purple-100'
                    }`}>
                    <svg className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>

                <h2 className={`text-3xl font-bold mb-4 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                    Deploy Your First Strategy
                </h2>

                <p className={`text-lg mb-10 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    You've backtested your ideas. Now bring them to life with automated monitoring and instant alerts when it's time to rebalance.
                </p>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    <div className={`p-6 rounded-lg ${isDark ? 'bg-white/[0.03]' : 'bg-gray-50'
                        }`}>
                        <div className={`w-10 h-10 mx-auto mb-3 rounded-lg flex items-center justify-center ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-600'
                            }`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <div className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            24/7 Rule Monitoring
                        </div>
                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            We watch your strategy conditions around the clock
                        </div>
                    </div>

                    <div className={`p-6 rounded-lg ${isDark ? 'bg-white/[0.03]' : 'bg-gray-50'
                        }`}>
                        <div className={`w-10 h-10 mx-auto mb-3 rounded-lg flex items-center justify-center ${isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-100 text-green-600'
                            }`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Instant Email Alerts
                        </div>
                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Get notified the moment conditions trigger
                        </div>
                    </div>

                    <div className={`p-6 rounded-lg ${isDark ? 'bg-white/[0.03]' : 'bg-gray-50'
                        }`}>
                        <div className={`w-10 h-10 mx-auto mb-3 rounded-lg flex items-center justify-center ${isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-100 text-purple-600'
                            }`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Never Miss an Opportunity
                        </div>
                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Execute rebalances at the perfect time
                        </div>
                    </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/backtest"
                        className={`py-3 px-6 rounded-lg text-base font-medium transition-all duration-200 ${isDark
                            ? 'bg-purple-500 text-white hover:bg-purple-600 shadow-[0_0_30px_rgba(168,85,247,0.3)]'
                            : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg'
                            }`}
                    >
                        Browse Your Backtests
                    </Link>

                    <Link
                        to="/backtest"
                        className={`py-3 px-6 rounded-lg text-base font-medium transition-all duration-200 ${isDark
                            ? 'bg-white/[0.05] text-gray-300 hover:bg-white/[0.1] border border-white/[0.1]'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                            }`}
                    >
                        Start New Backtest
                    </Link>
                </div>
            </div>
        </div>
    )
}
