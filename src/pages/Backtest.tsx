import Layout from '../components/Layout'
import { useTacticalStrategy } from '../hooks/useTacticalStrategy'
import { useState } from 'react'

// Components
import BacktestResultsPanel from '../components/backtest/BacktestResultsPanel'
import { StrategyCanvas } from '../components/backtest/StrategyCanvas'

const Backtest = () => {
    const tacticalStrategyHook = useTacticalStrategy();
    const {
        strategy,
        buildBacktestRequests,
        resetStrategy
    } = tacticalStrategyHook;

    const [result, setResult] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>('')

    const runBacktest = async () => {
        // Validate directly using current strategy state
        const allocationGroups = Object.keys(strategy.allocations);
        if (allocationGroups.length === 0) {
            setError('Please add at least one portfolio allocation');
            return;
        }

        if (!strategy.fallback_allocation || !allocationGroups.includes(strategy.fallback_allocation)) {
            setError('Please select a fallback allocation');
            return;
        }

        setLoading(true)
        setError('')
        setResult(null)

        try {
            const backtestRequests = buildBacktestRequests()

            // For now, run the first enabled strategy
            // Later we can support multiple strategy comparison
            const backtestRequest = backtestRequests[0]

            // Use correct API endpoint path
            const apiBase = window.location.hostname === 'localhost'
                ? 'http://localhost:8000'
                : 'https://backfolio-backend.azurewebsites.net'

            const response = await fetch(`${apiBase}/api/v1/backtest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(backtestRequest)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || errorData.detail || 'Backtest failed')
            }

            const data = await response.json()

            if (!data.success) {
                throw new Error(data.error || 'Backtest failed')
            }

            // Transform API v2.0 response to match UI expectations
            const apiResult = data.result
            const transformedResult = {
                request: backtestRequest,
                metrics: {
                    total_return: apiResult.metrics.cumulative_return * 100, // Convert to percentage
                    annual_return: apiResult.metrics.cagr * 100,
                    volatility: apiResult.metrics.volatility * 100,
                    sharpe_ratio: apiResult.metrics.sharpe_ratio,
                    max_drawdown: apiResult.metrics.max_drawdown * 100,
                    calmar_ratio: apiResult.metrics.calmar_ratio,
                    win_rate: apiResult.metrics.win_rate * 100,
                    profit_factor: undefined // Not available in API v2.0
                },
                portfolio_values: Object.entries(apiResult.portfolio_log || {}).map(([date, value]) => ({
                    date,
                    value: value as number
                })),
                benchmark_values: undefined, // Not available in simple format
                warnings: apiResult.warnings || []
            }

            setResult(transformedResult)
        } catch (error: any) {
            setError(error.message || 'An error occurred while running the backtest')
        } finally {
            setLoading(false)
        }
    }

    const hasResults = result || error

    return (
        <Layout>
            <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
                {/* Enhanced Header */}
                <div className="border-b border-slate-200/60 bg-white/90 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
                    <div className="max-w-[1600px] mx-auto px-8 py-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                            Strategy Backtester
                                        </h1>
                                        {!hasResults && (
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                                <span className="text-xs font-semibold text-emerald-700">Ready</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-slate-600 text-sm mt-0.5">
                                        {hasResults ? 'Analysis complete - Review your results below' : 'Design and test your investment strategies'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={resetStrategy}
                                    className="flex items-center gap-2 px-4 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200 text-sm font-medium border border-slate-200 hover:border-slate-300"
                                    title="Reset to default settings"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span>Reset</span>
                                </button>
                                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200/50 rounded-xl text-sm font-medium text-purple-700">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <span>AI-Powered</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-8">
                    {/* Canvas Mode - Graph-based Strategy Builder */}
                    <div className="relative h-[calc(100vh-200px)]">
                        <StrategyCanvas hook={tacticalStrategyHook} />

                        {/* Results Overlay (if results exist) */}
                        {(result || error) && (
                            <div className="absolute top-4 right-4 w-96 max-h-[80vh] overflow-y-auto z-40">
                                <BacktestResultsPanel
                                    result={result}
                                    error={error}
                                    loading={loading}
                                />
                            </div>
                        )}

                        {/* Run Button - Fixed Bottom */}
                        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
                            <button
                                onClick={runBacktest}
                                disabled={loading}
                                className="group px-10 py-4 font-bold text-base rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center gap-3 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Analyzing Strategy...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        <span>Run Backtest Analysis</span>
                                        <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Backtest