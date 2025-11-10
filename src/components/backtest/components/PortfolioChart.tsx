import React from 'react'
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import { BacktestAPIResult } from '../types/backtestResults'
import { STRATEGY_COLORS } from '../constants/chartColors'
import { formatCurrency } from '../utils/backtestFormatters'
import { StrategyLegend } from './StrategyLegend'

interface PortfolioChartProps {
    data: any[]
    results: BacktestAPIResult[]
    visibleStrategies: boolean[]
    onToggleStrategy: (index: number) => void
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({
    data,
    results,
    visibleStrategies,
    onToggleStrategy
}) => {
    return (
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
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                        <defs>
                            {STRATEGY_COLORS.map((color, idx) => (
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
                                    const strategyIdx = parseInt(name.replace('strategy', ''))
                                    const strategyName = results[strategyIdx]?.strategyName || `Strategy ${strategyIdx + 1}`
                                    return [formatCurrency(value), strategyName]
                                }
                                return [formatCurrency(value), 'Portfolio Value']
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
                                        stroke={STRATEGY_COLORS[idx % STRATEGY_COLORS.length].stroke}
                                        strokeWidth={2.5}
                                        fill={`url(#${STRATEGY_COLORS[idx % STRATEGY_COLORS.length].fill})`}
                                        fillOpacity={0.3}
                                        activeDot={{ r: 6, fill: STRATEGY_COLORS[idx % STRATEGY_COLORS.length].stroke, strokeWidth: 2, stroke: '#fff' }}
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
            <StrategyLegend
                results={results}
                visibleStrategies={visibleStrategies}
                onToggleStrategy={onToggleStrategy}
            />
        </div>
    )
}
