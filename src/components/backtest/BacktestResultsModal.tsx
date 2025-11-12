import React, { useState } from 'react'
import { BacktestResultsModalProps, TabType } from './types/backtestResults'
import { useBacktestChartData } from './hooks/useBacktestChartData'
import { formatMetric, formatCurrency, handleExport } from './utils/backtestFormatters'
import { MetricCard } from './components/MetricCard'
import { PortfolioChart } from './components/PortfolioChart'
import { ReturnsChart } from './components/ReturnsChart'
import { DrawdownChart } from './components/DrawdownChart'
import { AllocationPieChart } from './components/AllocationPieChart'

const BacktestResultsModal: React.FC<BacktestResultsModalProps> = ({ results, onClose }) => {
    const [activeTab, setActiveTab] = useState<TabType>('overview')
    const [selectedStrategyIndex, setSelectedStrategyIndex] = useState(0)
    const [visibleStrategies, setVisibleStrategies] = useState<boolean[]>(
        results ? results.map(() => true) : []
    )

    if (!results || results.length === 0) return null

    const result = results[selectedStrategyIndex]
    if (!result || !result.success) return null

    const { result: apiResult } = result
    const { metrics, risk_metrics, allocation_efficiency, transaction_analysis, data_quality } = apiResult

    // Use custom hook for data transformations
    const {
        portfolioData,
        returnsData,
        drawdownData,
        allocationData,
        multiStrategyPortfolioData,
        multiStrategyDrawdownData
    } = useBacktestChartData(results, selectedStrategyIndex)

    const toggleStrategyVisibility = (index: number) => {
        setVisibleStrategies(prev => {
            const newVisibility = [...prev]
            newVisibility[index] = !newVisibility[index]
            return newVisibility
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xl p-4">
            <div className="bg-white border border-gray-200 rounded-3xl shadow-2xl w-full max-w-7xl h-[95vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="relative px-8 py-6 border-b border-gray-200 flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-purple-500/5 to-blue-500/5"></div>
                    <div className="absolute top-0 left-20 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl"></div>
                    <div className="absolute top-0 right-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>

                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-14 h-14 bg-gray-100 backdrop-blur-xl border border-gray-200 rounded-2xl">
                                <svg className="w-7 h-7 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Backtest Analysis</h2>
                                <p className="text-gray-600 text-sm">{portfolioData.length} data points • Historical performance</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {results.length > 1 && (
                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 backdrop-blur-xl rounded-xl">
                                    <span className="text-sm text-gray-600 font-medium">Strategy:</span>
                                    <select
                                        value={selectedStrategyIndex}
                                        onChange={(e) => setSelectedStrategyIndex(parseInt(e.target.value))}
                                        className="bg-white text-gray-900 text-sm font-medium rounded-lg px-3 py-1.5 border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                                    >
                                        {results.map((r, idx) => (
                                            <option key={idx} value={idx}>
                                                {r.strategyName || `Strategy ${idx + 1}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <button
                                onClick={() => handleExport('csv', result, portfolioData, returnsData)}
                                className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 backdrop-blur-xl text-gray-600 hover:text-gray-900 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm font-medium">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                CSV
                            </button>
                            <button
                                onClick={() => handleExport('json', result, portfolioData, returnsData)}
                                className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 backdrop-blur-xl text-gray-600 hover:text-gray-900 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm font-medium">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                </svg>
                                JSON
                            </button>
                            <button
                                onClick={onClose}
                                className="flex items-center justify-center w-10 h-10 bg-gray-50 hover:bg-gray-100 border border-gray-200 backdrop-blur-xl rounded-xl transition-all duration-300 group">
                                <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 px-8 bg-gray-50 backdrop-blur-xl flex-shrink-0">
                    <div className="flex gap-2">
                        {[
                            { id: 'overview', label: 'Overview', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
                            { id: 'charts', label: 'Charts', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg> },
                            { id: 'analytics', label: 'Analytics', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg> },
                            { id: 'allocations', label: 'Allocations', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg> }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={`px-5 py-3 font-medium text-sm rounded-t-xl transition-all duration-300 flex items-center gap-2 ${activeTab === tab.id
                                    ? 'bg-white text-gray-900 border-b-2 border-primary-500'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-white">
                    <div className="fixed inset-0 pointer-events-none">
                        <div className="absolute top-40 left-20 w-96 h-96 bg-primary-500/3 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-20 right-40 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl"></div>
                    </div>

                    {activeTab === 'overview' && (
                        <div className="relative space-y-6">
                            {/* Hero Chart Section - Portfolio Performance */}
                            <PortfolioChart
                                data={results.length > 1 ? multiStrategyPortfolioData : portfolioData}
                                results={results}
                                visibleStrategies={visibleStrategies}
                                onToggleStrategy={toggleStrategyVisibility}
                            />

                            {/* Key Metrics Row - Prominent Display */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <MetricCard
                                    icon={<svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                                    label="Total Return"
                                    value={formatMetric(metrics.cumulative_return * 100, true)}
                                    badge={metrics.cumulative_return >= 0 ? '↑' : '↓'}
                                    badgeColor="emerald"
                                    valueColor={metrics.cumulative_return >= 0 ? 'emerald' : 'red'}
                                />
                                <MetricCard
                                    icon={<svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                    label="Annual Return"
                                    value={formatMetric(metrics.cagr * 100, true)}
                                    badge="CAGR"
                                    badgeColor="blue"
                                    valueColor={metrics.cagr >= 0 ? 'blue' : 'red'}
                                />
                                <MetricCard
                                    icon={<svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
                                    label="Sharpe Ratio"
                                    value={formatMetric(metrics.sharpe_ratio)}
                                    badge="Risk"
                                    badgeColor="purple"
                                    valueColor="purple"
                                />
                                <MetricCard
                                    icon={<svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>}
                                    label="Max Drawdown"
                                    value={formatMetric(metrics.max_drawdown * 100, true)}
                                    badge="Risk"
                                    badgeColor="red"
                                    valueColor="red"
                                />
                            </div>

                            {/* Allocation Pie Chart for Single Strategy */}
                            {results.length === 1 && allocation_efficiency && (
                                <AllocationPieChart allocationPercentages={allocation_efficiency.allocation_percentages} />
                            )}

                            {/* Strategy Comparison Table for Multiple Strategies */}
                            {results.length > 1 && (
                                <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-sm">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        Strategy Comparison
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Metric</th>
                                                    {results.map((r, idx) => (
                                                        <th key={idx} className="text-right py-3 px-4 text-gray-700 font-semibold">
                                                            {r.strategyName || `Strategy ${idx + 1}`}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[
                                                    { key: 'cumulative_return', label: 'Total Return', isPercent: true, colorCode: true },
                                                    { key: 'cagr', label: 'CAGR', isPercent: true, colorCode: true },
                                                    { key: 'sharpe_ratio', label: 'Sharpe Ratio', isPercent: false, colorCode: false },
                                                    { key: 'sortino_ratio', label: 'Sortino Ratio', isPercent: false, colorCode: false },
                                                    { key: 'max_drawdown', label: 'Max Drawdown', isPercent: true, colorCode: true },
                                                    { key: 'volatility', label: 'Volatility', isPercent: true, colorCode: false },
                                                    { key: 'calmar_ratio', label: 'Calmar Ratio', isPercent: false, colorCode: false },
                                                    { key: 'win_rate', label: 'Win Rate', isPercent: true, colorCode: false }
                                                ].map((metric) => {
                                                    const values = results.map(r => r.result.metrics[metric.key as keyof typeof r.result.metrics] as number)
                                                    const bestValue = metric.key === 'max_drawdown' || metric.key === 'volatility'
                                                        ? Math.min(...values)
                                                        : Math.max(...values)

                                                    return (
                                                        <tr key={metric.key} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                            <td className="py-3 px-4 text-gray-700 font-medium">{metric.label}</td>
                                                            {results.map((r, idx) => {
                                                                const value = r.result.metrics[metric.key as keyof typeof r.result.metrics] as number
                                                                const isBest = value === bestValue
                                                                const displayValue = metric.isPercent ? formatMetric(value * 100, true) : formatMetric(value)

                                                                let textColor = 'text-gray-800'
                                                                if (metric.colorCode) {
                                                                    if (metric.key === 'max_drawdown') {
                                                                        textColor = 'text-red-600'
                                                                    } else {
                                                                        textColor = value >= 0 ? 'text-emerald-600' : 'text-red-600'
                                                                    }
                                                                }

                                                                return (
                                                                    <td key={idx} className={`py-3 px-4 text-right font-semibold ${textColor} ${isBest ? 'bg-primary-50 border-l-2 border-primary-500' : ''}`}>
                                                                        {displayValue}
                                                                        {isBest && <span className="ml-2 text-xs text-primary-400">★</span>}
                                                                    </td>
                                                                )
                                                            })}
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Additional Metrics Grid */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">
                                    Additional Performance Metrics
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <MetricCard
                                        icon={<svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>}
                                        label="Volatility"
                                        value={formatMetric(metrics.volatility * 100, true)}
                                        badge="Ann."
                                        badgeColor="amber"
                                        valueColor="amber"
                                    />
                                    <MetricCard
                                        icon={<svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                                        label="Sortino Ratio"
                                        value={formatMetric(metrics.sortino_ratio)}
                                        badge="Ratio"
                                        badgeColor="cyan"
                                        valueColor="cyan"
                                    />
                                    <MetricCard
                                        icon={<svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>}
                                        label="Calmar Ratio"
                                        value={formatMetric(metrics.calmar_ratio)}
                                        badge="Perf."
                                        badgeColor="indigo"
                                        valueColor="indigo"
                                    />
                                    <MetricCard
                                        icon={<svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                        label="Win Rate"
                                        value={formatMetric(metrics.win_rate * 100, true)}
                                        badge="%"
                                        badgeColor="emerald"
                                        valueColor="emerald"
                                    />
                                </div>
                            </div>

                            {/* Data Quality & Transaction Analysis */}
                            {(data_quality || transaction_analysis) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {data_quality && (
                                        <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-xl p-6 shadow-sm">
                                            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Data Quality
                                            </h4>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">Total Days</span>
                                                    <span className="font-semibold text-gray-900">{data_quality.total_days}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">Missing Days</span>
                                                    <span className="font-semibold text-gray-900">{data_quality.missing_days}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">Data Completeness</span>
                                                    <span className="font-semibold text-emerald-600">{formatMetric(data_quality.data_completeness * 100, true)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {transaction_analysis && (
                                        <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-xl p-6 shadow-sm">
                                            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                </svg>
                                                Transaction Analysis
                                            </h4>
                                            <div className="space-y-3">
                                                {transaction_analysis.total_trades !== undefined && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600">Total Trades</span>
                                                        <span className="font-semibold text-gray-900">{transaction_analysis.total_trades}</span>
                                                    </div>
                                                )}
                                                {transaction_analysis.avg_holding_period !== undefined && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600">Avg Holding Period</span>
                                                        <span className="font-semibold text-gray-900">{transaction_analysis.avg_holding_period.toFixed(1)} days</span>
                                                    </div>
                                                )}
                                                {transaction_analysis.turnover_ratio !== undefined && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600">Turnover Ratio</span>
                                                        <span className="font-semibold text-gray-900">{formatMetric(transaction_analysis.turnover_ratio * 100, true)}</span>
                                                    </div>
                                                )}
                                                {transaction_analysis.total_commissions !== undefined && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600">Total Commissions</span>
                                                        <span className="font-semibold text-red-600">{formatCurrency(transaction_analysis.total_commissions)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'charts' && (
                        <div className="relative space-y-6">
                            <ReturnsChart data={returnsData} />
                            <DrawdownChart
                                data={results.length > 1 ? multiStrategyDrawdownData : drawdownData}
                                results={results}
                                visibleStrategies={visibleStrategies}
                                onToggleStrategy={toggleStrategyVisibility}
                            />
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <div className="relative space-y-6">
                            {/* Risk Metrics */}
                            {risk_metrics && Object.keys(risk_metrics).length > 0 && (
                                <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-sm">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        Advanced Risk Metrics
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {risk_metrics.value_at_risk_95 !== undefined && (
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                                <div className="text-sm text-gray-600 mb-1">VaR (95%)</div>
                                                <div className="text-xl font-bold text-gray-900">{formatMetric(risk_metrics.value_at_risk_95 * 100, true)}</div>
                                            </div>
                                        )}
                                        {risk_metrics.conditional_var_95 !== undefined && (
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                                <div className="text-sm text-gray-600 mb-1">CVaR (95%)</div>
                                                <div className="text-xl font-bold text-gray-900">{formatMetric(risk_metrics.conditional_var_95 * 100, true)}</div>
                                            </div>
                                        )}
                                        {risk_metrics.downside_deviation !== undefined && (
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                                <div className="text-sm text-gray-600 mb-1">Downside Deviation</div>
                                                <div className="text-xl font-bold text-gray-900">{formatMetric(risk_metrics.downside_deviation * 100, true)}</div>
                                            </div>
                                        )}
                                        {risk_metrics.upside_potential !== undefined && (
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                                <div className="text-sm text-gray-600 mb-1">Upside Potential</div>
                                                <div className="text-xl font-bold text-emerald-600">{formatMetric(risk_metrics.upside_potential * 100, true)}</div>
                                            </div>
                                        )}
                                        {risk_metrics.omega_ratio !== undefined && (
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                                <div className="text-sm text-gray-600 mb-1">Omega Ratio</div>
                                                <div className="text-xl font-bold text-gray-900">{formatMetric(risk_metrics.omega_ratio)}</div>
                                            </div>
                                        )}
                                        {risk_metrics.skewness !== undefined && (
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                                <div className="text-sm text-gray-600 mb-1">Skewness</div>
                                                <div className="text-xl font-bold text-gray-900">{formatMetric(risk_metrics.skewness)}</div>
                                            </div>
                                        )}
                                        {risk_metrics.kurtosis !== undefined && (
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                                <div className="text-sm text-gray-600 mb-1">Kurtosis</div>
                                                <div className="text-xl font-bold text-gray-900">{formatMetric(risk_metrics.kurtosis)}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Win/Loss Analysis */}
                            <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    Win/Loss Statistics
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                        <div className="text-sm text-emerald-700 mb-1">Win Rate</div>
                                        <div className="text-2xl font-bold text-emerald-600">{formatMetric(metrics.win_rate * 100, true)}</div>
                                    </div>
                                    {metrics.average_win !== undefined && (
                                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                            <div className="text-sm text-emerald-700 mb-1">Avg Win</div>
                                            <div className="text-2xl font-bold text-emerald-600">{formatMetric(metrics.average_win * 100, true)}</div>
                                        </div>
                                    )}
                                    {metrics.average_loss !== undefined && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <div className="text-sm text-red-700 mb-1">Avg Loss</div>
                                            <div className="text-2xl font-bold text-red-600">{formatMetric(metrics.average_loss * 100, true)}</div>
                                        </div>
                                    )}
                                    {metrics.profit_factor !== undefined && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <div className="text-sm text-blue-700 mb-1">Profit Factor</div>
                                            <div className="text-2xl font-bold text-blue-600">{formatMetric(metrics.profit_factor)}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'allocations' && allocation_efficiency && (
                        <div className="relative space-y-6">
                            {/* Allocation Distribution */}
                            <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                                    </svg>
                                    Allocation Distribution
                                </h3>
                                <div className="space-y-4">
                                    {Object.entries(allocation_efficiency.allocation_percentages).map(([name, percentage]) => (
                                        <div key={name}>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium text-gray-700">{name}</span>
                                                <span className="text-sm font-bold text-gray-900">{formatMetric(percentage as number, true)}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                                <div
                                                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Allocation Efficiency Metrics */}
                            <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                    Switching Statistics
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="text-sm text-blue-700 mb-1">Total Allocation Changes</div>
                                        <div className="text-2xl font-bold text-blue-600">{allocation_efficiency.allocation_changes}</div>
                                    </div>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="text-sm text-blue-700 mb-1">Switching Frequency</div>
                                        <div className="text-2xl font-bold text-blue-600">{formatMetric(allocation_efficiency.switching_frequency * 100, true)}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Allocation Timeline */}
                            {allocationData.length > 0 && (
                                <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-sm">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Allocation Timeline (First 50)
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="text-left py-2 px-3 font-semibold text-gray-700">Date</th>
                                                    <th className="text-left py-2 px-3 font-semibold text-gray-700">Active Allocation</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allocationData.slice(0, 50).map((item, idx) => (
                                                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                                                        <td className="py-2 px-3 text-gray-600">{item.date}</td>
                                                        <td className="py-2 px-3">
                                                            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 border border-purple-300 rounded-full font-medium">
                                                                {item.allocation}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Warnings */}
                    {apiResult.warnings && apiResult.warnings.length > 0 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <h3 className="text-lg font-bold text-amber-900">Warnings</h3>
                            </div>
                            <ul className="space-y-2">
                                {apiResult.warnings.map((warning, idx) => (
                                    <li key={idx} className="text-amber-800 text-sm flex items-start gap-2">
                                        <span className="text-amber-600">•</span>
                                        <span>{warning}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BacktestResultsModal
