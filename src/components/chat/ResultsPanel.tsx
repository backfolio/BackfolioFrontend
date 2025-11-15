import React from 'react'
import { ResultType } from '../../types/chat'

interface ResultsPanelProps {
    resultType: ResultType
    resultData?: any
    isDark?: boolean
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ resultType, resultData, isDark = false }) => {
    // Empty state - no results yet
    if (resultType === 'none' || !resultData) {
        return (
            <div className={`flex flex-col items-center justify-center h-full ${isDark
                    ? 'bg-gradient-to-br from-black to-slate-950'
                    : 'bg-gradient-to-br from-slate-50 to-slate-100'
                } p-12`}>
                <div className="max-w-md text-center">
                    <div className={`w-20 h-20 mx-auto mb-6 ${isDark ? 'bg-white/10' : 'bg-slate-200'
                        } rounded-2xl flex items-center justify-center`}>
                        <svg className={`w-10 h-10 ${isDark ? 'text-white/40' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>

                    <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>
                        Results
                    </h3>
                    <p className={`${isDark ? 'text-white/60' : 'text-slate-600'} text-sm leading-relaxed mb-6`}>
                        Charts, metrics, and visualizations will appear here as you interact with the assistant.
                    </p>

                    <div className="space-y-2 text-left">
                        <div className={`flex items-center gap-3 p-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
                            } rounded-lg border`}>
                            <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Performance charts</p>
                                <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>Equity curves and analytics</p>
                            </div>
                        </div>

                        <div className={`flex items-center gap-3 p-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
                            } rounded-lg border`}>
                            <svg className="w-5 h-5 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                            </svg>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Strategy visuals</p>
                                <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>Node graphs and rule flows</p>
                            </div>
                        </div>

                        <div className={`flex items-center gap-3 p-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
                            } rounded-lg border`}>
                            <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Backtest results</p>
                                <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>Metrics and comparisons</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Chart visualization
    if (resultType === 'chart') {
        return (
            <div className={`h-full ${isDark ? 'bg-black' : 'bg-white'} p-8 overflow-y-auto`}>
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Chart Visualization</h3>
                            <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Generated from AI conversation</p>
                        </div>
                    </div>

                    <div className={`${isDark
                            ? 'bg-white/5 border-white/10'
                            : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200'
                        } border rounded-2xl p-8 min-h-[400px] flex items-center justify-center`}>
                        <p className={isDark ? 'text-white/50' : 'text-slate-500'}>Chart data will render here</p>
                    </div>
                </div>
            </div>
        )
    }

    // Strategy visualization
    if (resultType === 'strategy') {
        return (
            <div className={`h-full ${isDark ? 'bg-black' : 'bg-white'} p-8 overflow-y-auto`}>
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                            </svg>
                        </div>
                        <div>
                            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Strategy Design</h3>
                            <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>AI-generated tactical strategy</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Strategy nodes placeholder */}
                        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'} border rounded-2xl p-6`}>
                            <h4 className={`text-sm font-semibold ${isDark ? 'text-white/70' : 'text-slate-700'} mb-4`}>Portfolio Nodes</h4>
                            <div className="grid gap-3">
                                <div className={`p-4 ${isDark
                                        ? 'bg-emerald-500/10 border-emerald-500/20'
                                        : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200'
                                    } border rounded-xl`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                                        <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Conservative Portfolio</p>
                                    </div>
                                    <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-600'}`}>60% SPY • 40% TLT</p>
                                </div>
                            </div>
                        </div>

                        {/* Rules placeholder */}
                        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'} border rounded-2xl p-6`}>
                            <h4 className={`text-sm font-semibold ${isDark ? 'text-white/70' : 'text-slate-700'} mb-4`}>Switching Rules</h4>
                            <div className={`p-4 ${isDark
                                    ? 'bg-purple-500/10 border-purple-500/20'
                                    : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200'
                                } border rounded-xl`}>
                                <p className={`text-sm font-mono ${isDark ? 'text-white/80' : 'text-slate-700'}`}>SMA(50) &lt; SMA(200) → Switch to Defensive</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Backtest results
    if (resultType === 'backtest') {
        return (
            <div className={`h-full ${isDark ? 'bg-black' : 'bg-white'} p-8 overflow-y-auto`}>
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <div>
                            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Backtest Results</h3>
                            <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Historical performance analysis</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'} border rounded-xl p-4`}>
                            <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'} mb-1`}>Total Return</p>
                            <p className="text-2xl font-bold text-emerald-600">+24.8%</p>
                        </div>
                        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'} border rounded-xl p-4`}>
                            <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'} mb-1`}>Sharpe Ratio</p>
                            <p className="text-2xl font-bold text-purple-600">1.85</p>
                        </div>
                        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'} border rounded-xl p-4`}>
                            <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'} mb-1`}>Max Drawdown</p>
                            <p className="text-2xl font-bold text-red-600">-12.4%</p>
                        </div>
                    </div>

                    <div className={`${isDark
                            ? 'bg-white/5 border-white/10'
                            : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200'
                        } border rounded-2xl p-8 min-h-[300px] flex items-center justify-center`}>
                        <p className={isDark ? 'text-white/50' : 'text-slate-500'}>Equity curve will render here</p>
                    </div>
                </div>
            </div>
        )
    }

    // Comparison view
    if (resultType === 'comparison') {
        return (
            <div className={`h-full ${isDark ? 'bg-black' : 'bg-white'} p-8 overflow-y-auto`}>
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`w-10 h-10 ${isDark ? 'bg-white' : 'bg-slate-900'} rounded-xl flex items-center justify-center`}>
                            <svg className={`w-5 h-5 ${isDark ? 'text-black' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Strategy Comparison</h3>
                            <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Side-by-side performance analysis</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className={`${isDark ? 'bg-emerald-500/10' : 'bg-white'} border-2 border-emerald-500 rounded-xl p-5`}>
                            <div className="flex items-center justify-between mb-3">
                                <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Strategy A</p>
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">Best Risk-Adjusted</span>
                            </div>
                            <div className="grid grid-cols-4 gap-3 text-sm">
                                <div>
                                    <p className={`${isDark ? 'text-white/50' : 'text-slate-500'} mb-1`}>CAGR</p>
                                    <p className="font-bold text-emerald-600">12.4%</p>
                                </div>
                                <div>
                                    <p className={`${isDark ? 'text-white/50' : 'text-slate-500'} mb-1`}>Sharpe</p>
                                    <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>1.85</p>
                                </div>
                                <div>
                                    <p className={`${isDark ? 'text-white/50' : 'text-slate-500'} mb-1`}>Max DD</p>
                                    <p className="font-bold text-red-600">-22%</p>
                                </div>
                                <div>
                                    <p className={`${isDark ? 'text-white/50' : 'text-slate-500'} mb-1`}>Volatility</p>
                                    <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>14%</p>
                                </div>
                            </div>
                        </div>

                        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'} border rounded-xl p-5 opacity-75`}>
                            <div className="flex items-center justify-between mb-3">
                                <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Strategy B</p>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Higher Return</span>
                            </div>
                            <div className="grid grid-cols-4 gap-3 text-sm">
                                <div>
                                    <p className={`${isDark ? 'text-white/50' : 'text-slate-500'} mb-1`}>CAGR</p>
                                    <p className="font-bold text-emerald-600">14.2%</p>
                                </div>
                                <div>
                                    <p className={`${isDark ? 'text-white/50' : 'text-slate-500'} mb-1`}>Sharpe</p>
                                    <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>1.21</p>
                                </div>
                                <div>
                                    <p className={`${isDark ? 'text-white/50' : 'text-slate-500'} mb-1`}>Max DD</p>
                                    <p className="font-bold text-red-600">-35%</p>
                                </div>
                                <div>
                                    <p className={`${isDark ? 'text-white/50' : 'text-slate-500'} mb-1`}>Volatility</p>
                                    <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>18%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Allocation view
    if (resultType === 'allocation') {
        return (
            <div className={`h-full ${isDark ? 'bg-black' : 'bg-white'} p-8 overflow-y-auto`}>
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Portfolio Allocation</h3>
                            <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Asset distribution breakdown</p>
                        </div>
                    </div>

                    <div className={`${isDark
                            ? 'bg-white/5 border-white/10'
                            : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200'
                        } border rounded-2xl p-8`}>
                        <div className="grid gap-3">
                            <div className={`flex items-center gap-3 p-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
                                } rounded-xl border`}>
                                <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">60%</div>
                                <div className="flex-1">
                                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>SPY</p>
                                    <p className={`text-sm ${isDark ? 'text-white/50' : 'text-slate-500'}`}>S&P 500 ETF</p>
                                </div>
                            </div>
                            <div className={`flex items-center gap-3 p-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
                                } rounded-xl border`}>
                                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">40%</div>
                                <div className="flex-1">
                                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>TLT</p>
                                    <p className={`text-sm ${isDark ? 'text-white/50' : 'text-slate-500'}`}>20+ Year Treasury Bonds</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return null
}

export default ResultsPanel
