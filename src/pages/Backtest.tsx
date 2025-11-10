import Layout from '../components/Layout'
import { useTacticalStrategy } from '../hooks/useTacticalStrategy'
import { useState, useEffect } from 'react'

// Components
import BacktestResultsModal from '../components/backtest/BacktestResultsModal'
import { StrategyCanvas } from '../components/backtest/StrategyCanvas'

const Backtest = () => {
    const tacticalStrategyHook = useTacticalStrategy();
    const {
        strategy,
        buildBacktestRequests,
    } = tacticalStrategyHook;

    const [backtestResults, setBacktestResults] = useState<any[]>([])
    const [edges, setEdges] = useState<Array<{ source: string; target: string }>>([])
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

        setLoading(true)
        setError('')
        setBacktestResults([])

        try {
            // Build separate requests for each strategy chain
            const backtestRequests = buildBacktestRequests(edges)

            console.log(`Running ${backtestRequests.length} strategy backtest(s)...`)

            // Use correct API endpoint path
            const apiBase = window.location.hostname === 'localhost'
                ? 'http://localhost:8000'
                : 'https://backfolio-backend.azurewebsites.net'

            // Run all backtests in parallel
            const responses = await Promise.all(
                backtestRequests.map(async (request) => {
                    const response = await fetch(`${apiBase}/api/v1/backtest`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(request)
                    })

                    if (!response.ok) {
                        const errorData = await response.json()
                        throw new Error(errorData.error || errorData.detail || 'Backtest failed')
                    }

                    const data = await response.json()

                    if (!data.success) {
                        throw new Error(data.error || 'Backtest failed')
                    }

                    return {
                        ...data,
                        strategyName: request.name
                    }
                })
            )

            // Store all results
            setBacktestResults(responses)
        } catch (error: any) {
            setError(error.message || 'An error occurred while running the backtest')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Layout>
            {/* Full-screen container - override Layout padding */}
            <div className="fixed inset-0 left-16 lg:left-16 flex flex-col overflow-hidden">
                {/* Canvas Area - fills entire space */}
                <div className="flex-1 bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden relative">
                    <div className="absolute inset-0 pb-24">
                        {/* Canvas Mode - Graph-based Strategy Builder */}
                        <StrategyCanvas hook={tacticalStrategyHook} onEdgesChange={setEdges} />

                        {/* Full Results Modal - shows all strategy results */}
                        {backtestResults.length > 0 && (
                            <BacktestResultsModal
                                results={backtestResults}
                                onClose={() => setBacktestResults([])}
                            />
                        )}

                        {/* Error Display */}
                        {error && backtestResults.length === 0 && (
                            <div className="absolute top-4 right-4 w-96 z-40">
                                <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-2xl">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
                                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-red-900">Backtest Failed</h3>
                                        </div>
                                    </div>
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                        <p className="text-red-800 text-sm">{error}</p>
                                    </div>
                                </div>
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
                                        <span>Analyzing Strategies...</span>
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