import Layout from '../components/Layout'
import { useTacticalStrategy } from '../hooks/useTacticalStrategy'
import { useState, useEffect } from 'react'

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

    // Override body/html overflow for this page to prevent scrolling
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, []);

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
            {/* Full-screen container - override Layout padding */}
            <div className="fixed inset-0 left-16 lg:left-16 flex flex-col overflow-hidden">
                {/* Canvas Area - fills entire space */}
                <div className="flex-1 bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden relative">
                    <div className="absolute inset-0 pb-24">
                        {/* Canvas Mode - Graph-based Strategy Builder */}
                        <StrategyCanvas hook={tacticalStrategyHook} />

                        {/* Results Overlay (if results exist) */}
                        {(result || error) && (
                            <div className="absolute top-4 right-4 w-96 max-h-[calc(100vh-240px)] overflow-y-auto z-40">
                                <BacktestResultsPanel
                                    result={result}
                                    error={error}
                                    loading={loading}
                                />
                            </div>
                        )}

                        {/* Run Button - Fixed Bottom with safe spacing */}
                        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-50">
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