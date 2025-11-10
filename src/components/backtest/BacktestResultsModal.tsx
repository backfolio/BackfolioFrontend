import React, { useState } from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts'

// Types
interface BacktestAPIResult {
    strategyName?: string
    result: {
        is_valid: boolean
        metrics: {
            cumulative_return: number
            cagr: number
            volatility: number
            sharpe_ratio: number
            sortino_ratio: number
            max_drawdown: number
            calmar_ratio: number
            win_rate: number
            profit_factor?: number
            average_win?: number
            average_loss?: number
            max_consecutive_wins?: number
            max_consecutive_losses?: number
        }
        portfolio_log: Record<string, number>
        returns_log: Record<string, number>
        allocation_log?: Record<string, string>
        risk_metrics?: {
            value_at_risk_95?: number
            conditional_var_95?: number
            downside_deviation?: number
            upside_potential?: number
            omega_ratio?: number
            skewness?: number
            kurtosis?: number
        }
        allocation_efficiency?: {
            allocation_percentages: Record<string, number>
            allocation_changes: number
            switching_frequency: number
        }
        transaction_analysis?: {
            total_trades: number
            avg_holding_period: number
            turnover_ratio: number
            total_commissions: number
        }
        data_quality?: {
            total_days: number
            missing_days: number
            data_completeness: number
        }
        warnings?: string[]
        errors?: string[]
    }
    success: boolean
}

interface BacktestResultsModalProps {
    results: BacktestAPIResult[] | null
    onClose: () => void
}

const BacktestResultsModal: React.FC<BacktestResultsModalProps> = ({ results, onClose }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'analytics' | 'allocations'>('overview')
    const [selectedStrategyIndex, setSelectedStrategyIndex] = useState(0)
    const [visibleStrategies, setVisibleStrategies] = useState<boolean[]>(
        results ? results.map(() => true) : []
    )

    if (!results || results.length === 0) return null

    // Get currently selected result
    const result = results[selectedStrategyIndex]
    if (!result || !result.success) return null

    const { result: apiResult } = result
    const { metrics, portfolio_log, returns_log, allocation_log, risk_metrics, allocation_efficiency, transaction_analysis, data_quality } = apiResult

    // Generate colors for multiple strategies
    const strategyColors = [
        { stroke: '#a78bfa', fill: 'portfolioGradient1', stopColor: '#a78bfa' },
        { stroke: '#60a5fa', fill: 'portfolioGradient2', stopColor: '#60a5fa' },
        { stroke: '#34d399', fill: 'portfolioGradient3', stopColor: '#34d399' },
        { stroke: '#fbbf24', fill: 'portfolioGradient4', stopColor: '#fbbf24' },
        { stroke: '#f87171', fill: 'portfolioGradient5', stopColor: '#f87171' },
    ];

    // Transform data for charts
    const portfolioData = Object.entries(portfolio_log).map(([date, value]) => ({
        date,
        value: value as number
    }))

    // Build multi-strategy portfolio data for overlapping chart
    const multiStrategyPortfolioData = () => {
        if (results.length === 1) {
            return portfolioData;
        }

        // Collect all unique dates
        const allDates = new Set<string>();
        results.forEach(r => {
            Object.keys(r.result.portfolio_log).forEach(date => allDates.add(date));
        });

        // Build data points with all strategies
        return Array.from(allDates).sort().map(date => {
            const dataPoint: any = { date };
            results.forEach((r, idx) => {
                dataPoint[`strategy${idx}`] = r.result.portfolio_log[date] || null;
            });
            return dataPoint;
        });
    };

    const returnsData = Object.entries(returns_log || {}).map(([date, returnValue]) => ({
        date,
        return: (returnValue as number) * 100 // Convert to percentage
    }))

    // Calculate drawdown data
    const drawdownData = portfolioData.map((item, idx) => {
        const peak = Math.max(...portfolioData.slice(0, idx + 1).map(p => p.value))
        const drawdown = ((item.value - peak) / peak) * 100
        return {
            date: item.date,
            drawdown
        }
    })

    // Build multi-strategy drawdown data for overlapping chart
    const multiStrategyDrawdownData = () => {
        if (results.length === 1) {
            return drawdownData;
        }

        // Collect all unique dates
        const allDates = new Set<string>();
        results.forEach(r => {
            Object.keys(r.result.portfolio_log).forEach(date => allDates.add(date));
        });

        // Build drawdown for each strategy
        return Array.from(allDates).sort().map(date => {
            const dataPoint: any = { date };

            results.forEach((r, idx) => {
                const portfolioLog = Object.entries(r.result.portfolio_log)
                    .sort(([a], [b]) => a.localeCompare(b));

                const dateIndex = portfolioLog.findIndex(([d]) => d === date);
                if (dateIndex >= 0) {
                    const currentValue = portfolioLog[dateIndex][1];
                    const peak = Math.max(...portfolioLog.slice(0, dateIndex + 1).map(([, v]) => v as number));
                    const drawdown = ((currentValue - peak) / peak) * 100;
                    dataPoint[`strategy${idx}`] = drawdown;
                } else {
                    dataPoint[`strategy${idx}`] = null;
                }
            });

            return dataPoint;
        });
    };

    // Allocation changes over time
    const allocationData = allocation_log
        ? Object.entries(allocation_log).map(([date, allocation]) => ({
            date,
            allocation: allocation as string
        }))
        : []

    // Toggle strategy visibility
    const toggleStrategyVisibility = (index: number) => {
        setVisibleStrategies(prev => {
            const newVisibility = [...prev];
            newVisibility[index] = !newVisibility[index];
            return newVisibility;
        });
    };

    // Strategy legend component
    const StrategyLegend = () => {
        if (results.length === 1) return null;

        return (
            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-200">
                {results.map((r, idx) => (
                    <button
                        key={idx}
                        onClick={() => toggleStrategyVisibility(idx)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${visibleStrategies[idx]
                            ? 'bg-gray-100 border-gray-300 opacity-100'
                            : 'bg-gray-50 border-gray-200 opacity-40'
                            } hover:bg-gray-200`}
                    >
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: strategyColors[idx % strategyColors.length].stroke }}
                        />
                        <span className="text-xs font-medium text-gray-700">
                            {r.strategyName || `Strategy ${idx + 1}`}
                        </span>
                        {!visibleStrategies[idx] && (
                            <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                        )}
                    </button>
                ))}
            </div>
        );
    };

    const formatMetric = (value: number | undefined, isPercentage = false, decimals = 2): string => {
        if (value === undefined || value === null) return 'N/A'
        const formatted = value.toFixed(decimals)
        return isPercentage ? `${formatted}%` : formatted
    }

    const formatCurrency = (value: number | undefined): string => {
        if (value === undefined || value === null) return 'N/A'
        return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }

    const handleExport = (format: 'csv' | 'json') => {
        if (format === 'json') {
            const dataStr = JSON.stringify(result, null, 2)
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
            const exportFileDefaultName = `backtest-results-${new Date().toISOString().split('T')[0]}.json`
            const linkElement = document.createElement('a')
            linkElement.setAttribute('href', dataUri)
            linkElement.setAttribute('download', exportFileDefaultName)
            linkElement.click()
        } else {
            // CSV Export
            const csvRows = [
                ['Date', 'Portfolio Value', 'Daily Return (%)'],
                ...portfolioData.map((item, idx) => [
                    item.date,
                    item.value.toString(),
                    returnsData[idx]?.return?.toString() || ''
                ])
            ]
            const csvContent = csvRows.map(row => row.join(',')).join('\n')
            const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent)
            const exportFileDefaultName = `backtest-results-${new Date().toISOString().split('T')[0]}.csv`
            const linkElement = document.createElement('a')
            linkElement.setAttribute('href', dataUri)
            linkElement.setAttribute('download', exportFileDefaultName)
            linkElement.click()
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xl p-4">
            <div className="bg-white border border-gray-200 rounded-3xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="relative px-8 py-6 border-b border-gray-200">
                    {/* Background gradient effects */}
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
                            {/* Strategy Selector - show only if multiple strategies */}
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
                                onClick={() => handleExport('csv')}
                                className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 backdrop-blur-xl text-gray-600 hover:text-gray-900 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm font-medium">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                CSV
                            </button>
                            <button
                                onClick={() => handleExport('json')}
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
                <div className="border-b border-gray-200 px-8 bg-gray-50 backdrop-blur-xl">
                    <div className="flex gap-2">
                        {[
                            { id: 'overview', label: 'Overview', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
                            { id: 'charts', label: 'Charts', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg> },
                            { id: 'analytics', label: 'Analytics', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg> },
                            { id: 'allocations', label: 'Allocations', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg> }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
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
                    {/* Subtle background effects */}
                    <div className="fixed inset-0 pointer-events-none">
                        <div className="absolute top-40 left-20 w-96 h-96 bg-primary-500/3 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-20 right-40 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl"></div>
                    </div>
                    {activeTab === 'overview' && (
                        <div className="relative space-y-6">
                            {/* Strategy Comparison Table - only show if multiple strategies */}
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
                                                    // Find best value for highlighting
                                                    const values = results.map(r => r.result.metrics[metric.key as keyof typeof r.result.metrics] as number);
                                                    const bestValue = metric.key === 'max_drawdown' || metric.key === 'volatility'
                                                        ? Math.min(...values)
                                                        : Math.max(...values);

                                                    return (
                                                        <tr key={metric.key} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                            <td className="py-3 px-4 text-gray-700 font-medium">{metric.label}</td>
                                                            {results.map((r, idx) => {
                                                                const value = r.result.metrics[metric.key as keyof typeof r.result.metrics] as number;
                                                                const isBest = value === bestValue;
                                                                const displayValue = metric.isPercent ? formatMetric(value * 100, true) : formatMetric(value);

                                                                let textColor = 'text-gray-800';
                                                                if (metric.colorCode) {
                                                                    if (metric.key === 'max_drawdown') {
                                                                        textColor = 'text-red-600';
                                                                    } else {
                                                                        textColor = value >= 0 ? 'text-emerald-600' : 'text-red-600';
                                                                    }
                                                                }

                                                                return (
                                                                    <td key={idx} className={`py-3 px-4 text-right font-semibold ${textColor} ${isBest ? 'bg-primary-50 border-l-2 border-primary-500' : ''}`}>
                                                                        {displayValue}
                                                                        {isBest && <span className="ml-2 text-xs text-primary-400">★</span>}
                                                                    </td>
                                                                );
                                                            })}
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Individual Strategy Stats - Current Strategy */}
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-bold text-gray-900">
                                    {results.length > 1 ? `${result.strategyName || `Strategy ${selectedStrategyIndex + 1}`} - Detailed Metrics` : 'Performance Metrics'}
                                </h3>
                            </div>

                            {/* Quick Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {/* Total Return */}
                                <div className="group bg-white backdrop-blur-xl border border-gray-200 hover:border-gray-300 rounded-2xl p-6 transition-all duration-500 hover:shadow-md">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center justify-center w-11 h-11 bg-emerald-50 border border-emerald-200 rounded-xl group-hover:bg-emerald-100 transition-all duration-300">
                                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                        </div>
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${metrics.cumulative_return >= 0 ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                                            {metrics.cumulative_return >= 0 ? '↑' : '↓'}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium mb-2">Total Return</div>
                                    <div className={`text-3xl font-bold tracking-tight ${metrics.cumulative_return >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {formatMetric(metrics.cumulative_return * 100, true)}
                                    </div>
                                </div>

                                {/* CAGR */}
                                <div className="group bg-white backdrop-blur-xl border border-gray-200 hover:border-gray-300 rounded-2xl p-6 transition-all duration-500 hover:shadow-md">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center justify-center w-11 h-11 bg-blue-50 border border-blue-200 rounded-xl group-hover:bg-blue-100 transition-all duration-300">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 border border-blue-200">CAGR</span>
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium mb-2">Annual Return</div>
                                    <div className={`text-3xl font-bold tracking-tight ${metrics.cagr >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                        {formatMetric(metrics.cagr * 100, true)}
                                    </div>
                                </div>

                                {/* Sharpe Ratio */}
                                <div className="group bg-white backdrop-blur-xl border border-gray-200 hover:border-gray-300 rounded-2xl p-6 transition-all duration-500 hover:shadow-md">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center justify-center w-11 h-11 bg-purple-50 border border-purple-200 rounded-xl group-hover:bg-purple-100 transition-all duration-300">
                                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-purple-100 text-purple-700 border border-purple-200">Risk</span>
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium mb-2">Sharpe Ratio</div>
                                    <div className="text-3xl font-bold text-purple-600 tracking-tight">
                                        {formatMetric(metrics.sharpe_ratio)}
                                    </div>
                                </div>

                                {/* Max Drawdown */}
                                <div className="group bg-white backdrop-blur-xl border border-gray-200 hover:border-gray-300 rounded-2xl p-6 transition-all duration-500 hover:shadow-md">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center justify-center w-11 h-11 bg-red-50 border border-red-200 rounded-xl group-hover:bg-red-100 transition-all duration-300">
                                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                            </svg>
                                        </div>
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-red-100 text-red-700 border border-red-200">Risk</span>
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium mb-2">Max Drawdown</div>
                                    <div className="text-3xl font-bold text-red-600 tracking-tight">
                                        {formatMetric(metrics.max_drawdown * 100, true)}
                                    </div>
                                </div>

                                {/* Volatility */}
                                <div className="group bg-white backdrop-blur-xl border border-gray-200 hover:border-gray-300 rounded-2xl p-6 transition-all duration-500 hover:shadow-md">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center justify-center w-11 h-11 bg-amber-50 border border-amber-200 rounded-xl group-hover:bg-amber-100 transition-all duration-300">
                                            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                            </svg>
                                        </div>
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-100 text-amber-700 border border-amber-200">Ann.</span>
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium mb-2">Volatility</div>
                                    <div className="text-3xl font-bold text-amber-600 tracking-tight">
                                        {formatMetric(metrics.volatility * 100, true)}
                                    </div>
                                </div>

                                {/* Sortino Ratio */}
                                <div className="group bg-white backdrop-blur-xl border border-gray-200 hover:border-gray-300 rounded-2xl p-6 transition-all duration-500 hover:shadow-md">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center justify-center w-11 h-11 bg-cyan-50 border border-cyan-200 rounded-xl group-hover:bg-cyan-100 transition-all duration-300">
                                            <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-cyan-100 text-cyan-700 border border-cyan-200">Ratio</span>
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium mb-2">Sortino Ratio</div>
                                    <div className="text-3xl font-bold text-cyan-600 tracking-tight">
                                        {formatMetric(metrics.sortino_ratio)}
                                    </div>
                                </div>

                                {/* Calmar Ratio */}
                                <div className="group bg-white backdrop-blur-xl border border-gray-200 hover:border-gray-300 rounded-2xl p-6 transition-all duration-500 hover:shadow-md">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center justify-center w-11 h-11 bg-indigo-50 border border-indigo-200 rounded-xl group-hover:bg-indigo-100 transition-all duration-300">
                                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                            </svg>
                                        </div>
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-700 border border-indigo-200">Perf.</span>
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium mb-2">Calmar Ratio</div>
                                    <div className="text-3xl font-bold text-indigo-600 tracking-tight">
                                        {formatMetric(metrics.calmar_ratio)}
                                    </div>
                                </div>

                                {/* Win Rate */}
                                <div className="group bg-white backdrop-blur-xl border border-gray-200 hover:border-gray-300 rounded-2xl p-6 transition-all duration-500 hover:shadow-md">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center justify-center w-11 h-11 bg-emerald-50 border border-emerald-200 rounded-xl group-hover:bg-emerald-100 transition-all duration-300">
                                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200">%</span>
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium mb-2">Win Rate</div>
                                    <div className="text-3xl font-bold text-emerald-600 tracking-tight">
                                        {formatMetric(metrics.win_rate * 100, true)}
                                    </div>
                                </div>
                            </div>

                            {/* Portfolio Performance Chart */}
                            <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-11 h-11 bg-purple-50 border border-purple-200 rounded-xl">
                                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">Portfolio Value Over Time</h3>
                                            <p className="text-xs text-gray-600">Historical performance</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-[400px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={results.length > 1 ? multiStrategyPortfolioData() : portfolioData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                                            <defs>
                                                {strategyColors.map((color, idx) => (
                                                    <linearGradient key={idx} id={color.fill} x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor={color.stopColor} stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor={color.stopColor} stopOpacity={0.05} />
                                                    </linearGradient>
                                                ))}
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} vertical={false} />
                                            <XAxis
                                                dataKey="date"
                                                stroke="#94a3b8"
                                                style={{ fontSize: '11px', fontWeight: 500, fill: '#64748b' }}
                                                tickFormatter={(value) => {
                                                    const date = new Date(value)
                                                    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
                                                }}
                                                interval="preserveStartEnd"
                                                minTickGap={80}
                                                tickLine={false}
                                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                            />
                                            <YAxis
                                                stroke="rgba(255,255,255,0.3)"
                                                style={{ fontSize: '11px', fontWeight: 500, fill: 'rgba(255,255,255,0.5)' }}
                                                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                                                tickLine={false}
                                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                                width={60}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    borderRadius: '12px',
                                                    padding: '12px',
                                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                                                }}
                                                labelStyle={{
                                                    color: 'rgba(255,255,255,0.5)',
                                                    fontWeight: 600,
                                                    marginBottom: '4px',
                                                    fontSize: '11px'
                                                }}
                                                itemStyle={{
                                                    color: '#fff',
                                                    fontWeight: 700,
                                                    fontSize: '14px'
                                                }}
                                                formatter={(value: number, name: string) => {
                                                    if (results.length > 1) {
                                                        const strategyIdx = parseInt(name.replace('strategy', ''));
                                                        const strategyName = results[strategyIdx]?.strategyName || `Strategy ${strategyIdx + 1}`;
                                                        return [formatCurrency(value), strategyName];
                                                    }
                                                    return [formatCurrency(value), 'Portfolio Value'];
                                                }}
                                                labelFormatter={(label) => {
                                                    const date = new Date(label)
                                                    return date.toLocaleDateString('en-US', {
                                                        month: 'long',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })
                                                }}
                                            />
                                            {results.length > 1 ? (
                                                // Multiple strategies - render overlapping lines with visibility control
                                                results.map((_r, idx) =>
                                                    visibleStrategies[idx] ? (
                                                        <Area
                                                            key={idx}
                                                            type="monotone"
                                                            dataKey={`strategy${idx}`}
                                                            stroke={strategyColors[idx % strategyColors.length].stroke}
                                                            strokeWidth={2.5}
                                                            fill={`url(#${strategyColors[idx % strategyColors.length].fill})`}
                                                            fillOpacity={0.3}
                                                            activeDot={{ r: 6, fill: strategyColors[idx % strategyColors.length].stroke, strokeWidth: 2, stroke: '#fff' }}
                                                        />
                                                    ) : null
                                                )
                                            ) : (
                                                // Single strategy - original rendering
                                                <Area
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke="#a78bfa"
                                                    strokeWidth={2.5}
                                                    fill="url(#portfolioGradient1)"
                                                    activeDot={{ r: 6, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                                                />
                                            )}
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                {/* Interactive Strategy Legend - show if multiple strategies */}
                                <StrategyLegend />
                            </div>

                            {/* Data Quality & Transaction Analysis */}
                            {(data_quality || transaction_analysis) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Data Quality */}
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

                                    {/* Transaction Analysis */}
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
                            {/* Returns Distribution Chart */}
                            <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex items-center justify-center w-11 h-11 bg-blue-50 border border-blue-200 rounded-xl">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Daily Returns</h3>
                                        <p className="text-xs text-gray-600">Daily percentage changes</p>
                                    </div>
                                </div>
                                <div className="h-[350px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={returnsData.slice(-100)} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} vertical={false} />
                                            <XAxis
                                                dataKey="date"
                                                stroke="#94a3b8"
                                                style={{ fontSize: '10px', fontWeight: 500, fill: '#64748b' }}
                                                tickFormatter={(value) => {
                                                    const date = new Date(value)
                                                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                                }}
                                                interval="preserveStartEnd"
                                                minTickGap={50}
                                                tickLine={false}
                                                axisLine={{ stroke: '#e2e8f0' }}
                                            />
                                            <YAxis
                                                stroke="#94a3b8"
                                                style={{ fontSize: '11px', fontWeight: 500, fill: '#64748b' }}
                                                tickFormatter={(value) => `${value.toFixed(1)}%`}
                                                tickLine={false}
                                                axisLine={{ stroke: '#e2e8f0' }}
                                                width={50}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    borderRadius: '12px',
                                                    padding: '12px',
                                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                                                }}
                                                labelStyle={{
                                                    color: 'rgba(255,255,255,0.5)',
                                                    fontWeight: 600,
                                                    marginBottom: '4px',
                                                    fontSize: '11px'
                                                }}
                                                itemStyle={{
                                                    color: '#60a5fa',
                                                    fontWeight: 700,
                                                    fontSize: '14px'
                                                }}
                                                formatter={(value: number) => [`${value.toFixed(2)}%`, 'Daily Return']}
                                                labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            />
                                            <Bar
                                                dataKey="return"
                                                fill="#60a5fa"
                                                radius={[4, 4, 0, 0]}
                                                maxBarSize={8}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Drawdown Chart */}
                            <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex items-center justify-center w-11 h-11 bg-red-50 border border-red-200 rounded-xl">
                                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Drawdown Analysis</h3>
                                        <p className="text-xs text-gray-600">Underwater equity curve</p>
                                    </div>
                                </div>
                                <div className="h-[350px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={results.length > 1 ? multiStrategyDrawdownData() : drawdownData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                                            <defs>
                                                {results.length > 1 ? (
                                                    // Multiple gradient definitions for multi-strategy view
                                                    strategyColors.map((color, idx) => (
                                                        <linearGradient key={idx} id={`drawdownGradient${idx}`} x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor={color.stopColor} stopOpacity={0.1} />
                                                            <stop offset="95%" stopColor={color.stopColor} stopOpacity={0.3} />
                                                        </linearGradient>
                                                    ))
                                                ) : (
                                                    <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#f87171" stopOpacity={0.1} />
                                                        <stop offset="95%" stopColor="#f87171" stopOpacity={0.3} />
                                                    </linearGradient>
                                                )}
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} vertical={false} />
                                            <XAxis
                                                dataKey="date"
                                                stroke="#94a3b8"
                                                style={{ fontSize: '11px', fontWeight: 500, fill: '#64748b' }}
                                                tickFormatter={(value) => {
                                                    const date = new Date(value)
                                                    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
                                                }}
                                                interval="preserveStartEnd"
                                                minTickGap={80}
                                                tickLine={false}
                                                axisLine={{ stroke: '#e2e8f0' }}
                                            />
                                            <YAxis
                                                stroke="#94a3b8"
                                                style={{ fontSize: '11px', fontWeight: 500, fill: '#64748b' }}
                                                tickFormatter={(value) => `${value.toFixed(0)}%`}
                                                tickLine={false}
                                                axisLine={{ stroke: '#e2e8f0' }}
                                                width={50}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    borderRadius: '12px',
                                                    padding: '12px',
                                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                                                }}
                                                labelStyle={{
                                                    color: 'rgba(255,255,255,0.5)',
                                                    fontWeight: 600,
                                                    marginBottom: '4px',
                                                    fontSize: '11px'
                                                }}
                                                itemStyle={{
                                                    color: '#fff',
                                                    fontWeight: 700,
                                                    fontSize: '14px'
                                                }}
                                                formatter={(value: number, name: string) => {
                                                    if (results.length > 1) {
                                                        const strategyIdx = parseInt(name.replace('strategy', ''));
                                                        const strategyName = results[strategyIdx]?.strategyName || `Strategy ${strategyIdx + 1}`;
                                                        return [`${value.toFixed(2)}%`, strategyName];
                                                    }
                                                    return [`${value.toFixed(2)}%`, 'Drawdown'];
                                                }}
                                                labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            />
                                            {results.length > 1 ? (
                                                // Multiple strategies - render overlapping drawdown lines with visibility control
                                                results.map((_r, idx) =>
                                                    visibleStrategies[idx] ? (
                                                        <Area
                                                            key={idx}
                                                            type="monotone"
                                                            dataKey={`strategy${idx}`}
                                                            stroke={strategyColors[idx % strategyColors.length].stroke}
                                                            strokeWidth={2.5}
                                                            fill={`url(#drawdownGradient${idx % strategyColors.length})`}
                                                            fillOpacity={0.3}
                                                        />
                                                    ) : null
                                                )
                                            ) : (
                                                <Area
                                                    type="monotone"
                                                    dataKey="drawdown"
                                                    stroke="#f87171"
                                                    strokeWidth={2.5}
                                                    fill="url(#drawdownGradient)"
                                                />
                                            )}
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                {/* Interactive Strategy Legend for Drawdown */}
                                <StrategyLegend />
                            </div>
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
