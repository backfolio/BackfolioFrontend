import React from 'react';
import { Panel } from 'reactflow';
import { StrategyDSL } from '../../types/strategy';

interface StrategyToolbarProps {
    strategy: StrategyDSL;
    onUpdateStrategy: (strategy: StrategyDSL) => void;
    onCreatePortfolio: () => void;
    onCreateRule: () => void;
    onToggleRulesPanel: () => void;
    onOpenJsonEditor: () => void;
    onRunBacktest?: () => void;
    isBacktestLoading?: boolean;
    showRulesPanel: boolean;
    portfolioCount: number;
    isDark: boolean;
}

export const StrategyToolbar: React.FC<StrategyToolbarProps> = ({
    strategy,
    onUpdateStrategy,
    onCreatePortfolio,
    onCreateRule,
    onToggleRulesPanel,
    onOpenJsonEditor,
    onRunBacktest,
    isBacktestLoading = false,
    showRulesPanel,
    portfolioCount,
    isDark
}) => {
    const [showAdvancedSettings, setShowAdvancedSettings] = React.useState(false);

    return (
        <Panel position="top-center" className="mt-4">
            <div className={`flex items-center gap-1.5 backdrop-blur-lg rounded-xl shadow-2xl px-2 py-1.5 border ${isDark ? 'bg-gradient-to-b from-white/[0.03] to-white/[0.01] border-white/[0.15]' : 'bg-white/95 border-slate-200/50'
                }`}>
                {/* Creation Actions Group */}
                <div className={`flex items-center gap-1 px-1.5 py-1 rounded-lg ${isDark ? 'bg-white/[0.02]' : 'bg-slate-50/50'}`}>
                    {/* Add Portfolio */}
                    <button
                        onClick={onCreatePortfolio}
                        disabled={portfolioCount >= 6}
                        className={`group relative p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed ${isDark
                            ? 'hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 disabled:hover:bg-transparent'
                            : 'hover:bg-purple-100 text-purple-600 hover:text-purple-700 disabled:hover:bg-transparent'
                            }`}
                        title="Add Portfolio"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg font-medium ${isDark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
                            }`}>
                            {portfolioCount >= 6 ? '⚠️ Max 6 portfolios' : '📦 Add Portfolio'}
                        </div>
                    </button>

                    {/* Add Rule */}
                    <button
                        onClick={onCreateRule}
                        className={`group relative p-2 rounded-lg transition-all ${isDark
                            ? 'hover:bg-blue-500/20 text-blue-400 hover:text-blue-300'
                            : 'hover:bg-blue-100 text-blue-600 hover:text-blue-700'
                            }`}
                        title="Create Rule"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg font-medium ${isDark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
                            }`}>
                            ⚡ Create Rule
                        </div>
                    </button>
                </div>

                {/* Divider */}
                <div className={`h-8 w-px ${isDark ? 'bg-white/[0.08]' : 'bg-slate-300/70'}`} />

                {/* View Rules Toggle */}
                <button
                    onClick={onToggleRulesPanel}
                    className={`group relative p-2 rounded-lg transition-all ${showRulesPanel
                        ? isDark
                            ? 'bg-indigo-500/20 text-indigo-300'
                            : 'bg-indigo-100 text-indigo-700'
                        : isDark
                            ? 'text-slate-400 hover:bg-indigo-500/20 hover:text-indigo-300'
                            : 'text-slate-600 hover:bg-indigo-100 hover:text-indigo-700'
                        }`}
                    title="View Rules"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg font-medium ${isDark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
                        }`}>
                        {showRulesPanel ? '👁️ Hide Rules' : '📋 View Rules'}
                    </div>
                </button>

                {/* Divider */}
                <div className={`h-8 w-px ${isDark ? 'bg-white/[0.08]' : 'bg-slate-300/70'}`} />

                {/* Strategy Settings - Compact with Labels */}
                <div className="relative">
                    <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg ${isDark ? 'bg-white/[0.02]' : 'bg-slate-50/50'}`}>
                        {/* Start Date */}
                        <div className="flex flex-col gap-0.5">
                            <label className={`text-[9px] font-semibold uppercase tracking-wide ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Start</label>
                            <input
                                type="date"
                                value={strategy.start_date || ''}
                                onChange={(e) => onUpdateStrategy({ ...strategy, start_date: e.target.value })}
                                placeholder="YYYY-MM-DD"
                                className={`text-[11px] font-medium border-0 bg-transparent px-1 py-0.5 focus:outline-none focus:ring-1 focus:rounded w-[110px] ${isDark
                                    ? 'text-white placeholder-slate-600 focus:ring-purple-500'
                                    : 'text-slate-700 placeholder-slate-400 focus:ring-purple-500'
                                    }`}
                            />
                        </div>

                        {/* End Date */}
                        <div className="flex flex-col gap-0.5">
                            <label className={`text-[9px] font-semibold uppercase tracking-wide ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>End</label>
                            <input
                                type="date"
                                value={strategy.end_date || ''}
                                onChange={(e) => onUpdateStrategy({ ...strategy, end_date: e.target.value })}
                                placeholder="YYYY-MM-DD"
                                className={`text-[11px] font-medium border-0 bg-transparent px-1 py-0.5 focus:outline-none focus:ring-1 focus:rounded w-[110px] ${isDark
                                    ? 'text-white placeholder-slate-600 focus:ring-purple-500'
                                    : 'text-slate-700 placeholder-slate-400 focus:ring-purple-500'
                                    }`}
                            />
                        </div>

                        <div className={`h-8 w-px mx-0.5 ${isDark ? 'bg-white/[0.06]' : 'bg-slate-300/50'}`} />

                        {/* Initial Capital */}
                        <div className="flex flex-col gap-0.5">
                            <label className={`text-[9px] font-semibold uppercase tracking-wide ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Capital</label>
                            <div className="relative">
                                <span className={`absolute left-1 top-0.5 text-[11px] font-medium ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>$</span>
                                <input
                                    type="number"
                                    value={strategy.initial_capital}
                                    onChange={(e) => onUpdateStrategy({ ...strategy, initial_capital: parseFloat(e.target.value) || 100000 })}
                                    className={`text-[11px] font-semibold border-0 bg-transparent pl-4 pr-1 py-0.5 focus:outline-none focus:ring-1 focus:rounded w-[75px] ${isDark
                                        ? 'text-emerald-400 focus:ring-purple-500'
                                        : 'text-emerald-700 focus:ring-purple-500'
                                        }`}
                                    min="1000"
                                    step="1000"
                                />
                            </div>
                        </div>

                        {/* Advanced Settings Button */}
                        <div className={`h-8 w-px mx-0.5 ${isDark ? 'bg-white/[0.06]' : 'bg-slate-300/50'}`} />

                        <button
                            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                            className={`group relative p-1.5 rounded transition-all ${showAdvancedSettings
                                ? isDark
                                    ? 'bg-amber-500/20 text-amber-400'
                                    : 'bg-amber-100 text-amber-700'
                                : isDark
                                    ? 'text-slate-500 hover:bg-amber-500/20 hover:text-amber-400'
                                    : 'text-slate-500 hover:bg-amber-100 hover:text-amber-700'
                                }`}
                            title="Advanced Settings"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg font-medium ${isDark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
                                }`}>
                                ⚙️ Advanced
                            </div>
                        </button>
                    </div>

                    {/* Advanced Settings Panel */}
                    {showAdvancedSettings && (
                        <div className={`absolute top-full mt-2 right-0 w-96 rounded-2xl shadow-2xl border backdrop-blur-xl z-50 ${isDark
                            ? 'bg-gradient-to-br from-slate-900/98 to-slate-800/98 border-white/[0.15]'
                            : 'bg-white/98 border-slate-200 shadow-xl'
                            }`}>
                            {/* Header with gradient accent */}
                            <div className={`relative px-5 py-4 border-b ${isDark ? 'border-white/[0.1]' : 'border-slate-200'}`}>
                                <div className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r ${isDark
                                    ? 'from-purple-500 via-blue-500 to-indigo-500'
                                    : 'from-purple-400 via-blue-400 to-indigo-400'
                                    }`} />
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className={`p-2 rounded-lg ${isDark
                                            ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20'
                                            : 'bg-gradient-to-br from-purple-100 to-blue-100'
                                            }`}>
                                            <svg className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Advanced Settings</h3>
                                            <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Fine-tune your backtest parameters</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowAdvancedSettings(false)}
                                        className={`p-1.5 rounded-lg transition-all ${isDark
                                            ? 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
                                            : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                                            }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="p-5 space-y-5 max-h-[60vh] overflow-y-auto">
                                {/* Transaction Costs Section */}
                                <div className={`p-4 rounded-xl border ${isDark
                                    ? 'bg-white/[0.02] border-white/[0.08]'
                                    : 'bg-slate-50/50 border-slate-200/50'
                                    }`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-lg">💸</span>
                                        <div>
                                            <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Transaction Costs</h4>
                                            <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Per portfolio switch</p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>$</div>
                                        <input
                                            type="number"
                                            value={(strategy as any).switch_allocation_cost || 0}
                                            onChange={(e) => onUpdateStrategy({ ...strategy, switch_allocation_cost: parseFloat(e.target.value) || 0 } as any)}
                                            className={`w-full text-sm font-semibold border rounded-lg pl-7 pr-3 py-2.5 focus:outline-none focus:ring-2 transition-all ${isDark
                                                ? 'bg-black/40 border-white/[0.1] text-white placeholder-slate-600 focus:ring-purple-500/50 focus:border-purple-500/50'
                                                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-purple-500 focus:border-purple-500'
                                                }`}
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <p className={`text-[10px] mt-2 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                        💡 Fee charged each time the strategy switches between portfolios
                                    </p>
                                </div>

                                {/* Cashflow Section */}
                                <div className={`p-4 rounded-xl border ${isDark
                                    ? 'bg-white/[0.02] border-white/[0.08]'
                                    : 'bg-slate-50/50 border-slate-200/50'
                                    }`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-lg">💵</span>
                                        <div>
                                            <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Periodic Cashflow</h4>
                                            <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Contributions or withdrawals</p>
                                        </div>
                                    </div>

                                    {/* Amount and Type Row */}
                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                        {/* Amount Input */}
                                        <div>
                                            <label className={`block text-[10px] font-semibold mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                Amount
                                            </label>
                                            <div className="relative">
                                                <div className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                                                    {(strategy as any).cashflow_type === 'percentage' ? '%' : '$'}
                                                </div>
                                                <input
                                                    type="number"
                                                    value={(strategy as any).cashflow || 0}
                                                    onChange={(e) => onUpdateStrategy({ ...strategy, cashflow: parseFloat(e.target.value) || 0 } as any)}
                                                    className={`w-full text-sm font-semibold border rounded-lg pl-7 pr-3 py-2.5 focus:outline-none focus:ring-2 transition-all ${isDark
                                                        ? 'bg-black/40 border-white/[0.1] text-white placeholder-slate-600 focus:ring-purple-500/50 focus:border-purple-500/50'
                                                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-purple-500 focus:border-purple-500'
                                                        }`}
                                                    step={(strategy as any).cashflow_type === 'percentage' ? '0.1' : '100'}
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>

                                        {/* Type Toggle */}
                                        <div>
                                            <label className={`block text-[10px] font-semibold mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                Type
                                            </label>
                                            <div className={`flex rounded-lg border overflow-hidden ${isDark ? 'border-white/[0.1]' : 'border-slate-300'}`}>
                                                <button
                                                    onClick={() => onUpdateStrategy({ ...strategy, cashflow_type: 'dollars' } as any)}
                                                    className={`flex-1 px-3 py-2.5 text-xs font-semibold transition-all ${(strategy as any).cashflow_type !== 'percentage'
                                                        ? isDark
                                                            ? 'bg-blue-500/20 text-blue-400 border-r border-blue-500/30'
                                                            : 'bg-blue-100 text-blue-700 border-r border-blue-200'
                                                        : isDark
                                                            ? 'bg-black/40 text-slate-500 border-r border-white/[0.1] hover:text-slate-400'
                                                            : 'bg-white text-slate-500 border-r border-slate-300 hover:text-slate-700'
                                                        }`}
                                                >
                                                    $
                                                </button>
                                                <button
                                                    onClick={() => onUpdateStrategy({ ...strategy, cashflow_type: 'percentage' } as any)}
                                                    className={`flex-1 px-3 py-2.5 text-xs font-semibold transition-all ${(strategy as any).cashflow_type === 'percentage'
                                                        ? isDark
                                                            ? 'bg-blue-500/20 text-blue-400'
                                                            : 'bg-blue-100 text-blue-700'
                                                        : isDark
                                                            ? 'bg-black/40 text-slate-500 hover:text-slate-400'
                                                            : 'bg-white text-slate-500 hover:text-slate-700'
                                                        }`}
                                                >
                                                    %
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Frequency Selector */}
                                    <div>
                                        <label className={`block text-[10px] font-semibold mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                            Frequency
                                        </label>
                                        <select
                                            value={(strategy as any).cashflow_period || 'monthly'}
                                            onChange={(e) => onUpdateStrategy({ ...strategy, cashflow_period: e.target.value } as any)}
                                            className={`w-full text-sm font-semibold border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 transition-all ${isDark
                                                ? 'bg-black/40 border-white/[0.1] text-white focus:ring-purple-500/50 focus:border-purple-500/50'
                                                : 'bg-white border-slate-300 text-slate-900 focus:ring-purple-500 focus:border-purple-500'
                                                }`}
                                        >
                                            <option value="weekly">📅 Weekly</option>
                                            <option value="monthly">📅 Monthly</option>
                                            <option value="quarterly">📅 Quarterly</option>
                                            <option value="semi-annually">📅 Semi-Annually</option>
                                            <option value="annually">📅 Annually</option>
                                        </select>
                                    </div>

                                    <div className={`mt-3 p-2.5 rounded-lg ${isDark
                                        ? 'bg-blue-500/10 border border-blue-500/20'
                                        : 'bg-blue-50 border border-blue-200'
                                        }`}>
                                        <p className={`text-[10px] ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                                            💡 <strong>Positive values</strong> = add funds (contributions)<br />
                                            💡 <strong>Negative values</strong> = remove funds (withdrawals)
                                            {(strategy as any).cashflow_type === 'percentage' && (
                                                <>
                                                    <br />💡 <strong>Percentage</strong> is based on current portfolio value
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className={`h-8 w-px ${isDark ? 'bg-white/[0.08]' : 'bg-slate-300/70'}`} />

                {/* JSON Editor */}
                <button
                    onClick={onOpenJsonEditor}
                    className={`group relative p-2 rounded-lg transition-all ${isDark
                        ? 'text-slate-400 hover:bg-slate-700/30 hover:text-slate-300'
                        : 'text-slate-600 hover:bg-slate-200 hover:text-slate-700'
                        }`}
                    title="Edit JSON"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg font-medium ${isDark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
                        }`}>
                        🔧 Edit JSON
                    </div>
                </button>

                {/* Divider */}
                <div className={`h-8 w-px ${isDark ? 'bg-white/[0.08]' : 'bg-slate-300/70'}`} />

                {/* Run Backtest Button */}
                {onRunBacktest && (
                    <button
                        onClick={onRunBacktest}
                        disabled={isBacktestLoading}
                        className={`group relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm ${isDark
                            ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                            : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700'
                            }`}
                        title="Run Backtest"
                    >
                        {isBacktestLoading ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Running...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                <span>Run</span>
                            </>
                        )}
                        <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg font-medium ${isDark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
                            }`}>
                            🚀 Run Backtest
                        </div>
                    </button>
                )}
            </div>
        </Panel>
    );
};
