import React from 'react'
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import { BacktestAPIResult } from '../types/backtestResults'
import { STRATEGY_COLORS } from '../constants/chartColors'
import { StrategyLegend } from './StrategyLegend'
import { useTheme } from '../../../context/ThemeContext'

interface DrawdownChartProps {
    data: any[]
    results: BacktestAPIResult[]
    visibleStrategies: boolean[]
    onToggleStrategy: (index: number) => void
}

export const DrawdownChart: React.FC<DrawdownChartProps> = ({
    data,
    results,
    visibleStrategies,
    onToggleStrategy
}) => {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    return (
        <div className={`backdrop-blur-xl border rounded-2xl p-6 shadow-sm ${isDark ? 'bg-white/[0.02] border-white/[0.15]' : 'bg-white border-gray-200'
            }`}>
            <div className="flex items-center gap-3 mb-6">
                <div className={`flex items-center justify-center w-11 h-11 border rounded-xl ${isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'
                    }`}>
                    <svg className={`w-6 h-6 ${isDark ? 'text-red-400' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                </div>
                <div>
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Drawdown Analysis</h3>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Underwater equity curve</p>
                </div>
            </div>
            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                        <defs>
                            {results.length > 1 ? (
                                // Multiple gradient definitions for multi-strategy view
                                STRATEGY_COLORS.map((color, idx) => (
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
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'} opacity={0.3} vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke={isDark ? 'rgba(255,255,255,0.3)' : '#94a3b8'}
                            style={{ fontSize: '11px', fontWeight: 500, fill: isDark ? 'rgba(255,255,255,0.5)' : '#64748b' }}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
                            }}
                            interval="preserveStartEnd"
                            minTickGap={80}
                            tickLine={false}
                            axisLine={{ stroke: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0' }}
                        />
                        <YAxis
                            stroke={isDark ? 'rgba(255,255,255,0.3)' : '#94a3b8'}
                            style={{ fontSize: '11px', fontWeight: 500, fill: isDark ? 'rgba(255,255,255,0.5)' : '#64748b' }}
                            tickFormatter={(value) => `${value.toFixed(0)}%`}
                            tickLine={false}
                            axisLine={{ stroke: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0' }}
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
                                    const strategyIdx = parseInt(name.replace('strategy', ''))
                                    const strategyName = results[strategyIdx]?.strategyName || `Strategy ${strategyIdx + 1}`
                                    return [`${value.toFixed(2)}%`, strategyName]
                                }
                                return [`${value.toFixed(2)}%`, 'Drawdown']
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
                                        stroke={STRATEGY_COLORS[idx % STRATEGY_COLORS.length].stroke}
                                        strokeWidth={2.5}
                                        fill={`url(#drawdownGradient${idx % STRATEGY_COLORS.length})`}
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
            <StrategyLegend
                results={results}
                visibleStrategies={visibleStrategies}
                onToggleStrategy={onToggleStrategy}
            />
        </div>
    )
}
