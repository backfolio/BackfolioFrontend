import React from 'react'
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import { ReturnsDataPoint } from '../types/backtestResults'
import { useTheme } from '../../../context/ThemeContext'

interface ReturnsChartProps {
    data: ReturnsDataPoint[]
}

export const ReturnsChart: React.FC<ReturnsChartProps> = ({ data }) => {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    return (
        <div className={`backdrop-blur-xl border rounded-2xl p-6 shadow-sm ${isDark ? 'bg-white/[0.02] border-white/[0.15]' : 'bg-white border-gray-200'
            }`}>
            <div className="flex items-center gap-3 mb-6">
                <div className={`flex items-center justify-center w-11 h-11 border rounded-xl ${isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'
                    }`}>
                    <svg className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <div>
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Daily Returns</h3>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Daily percentage changes</p>
                </div>
            </div>
            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.slice(-100)} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'} opacity={0.3} vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke={isDark ? 'rgba(255,255,255,0.3)' : '#94a3b8'}
                            style={{ fontSize: '10px', fontWeight: 500, fill: isDark ? 'rgba(255,255,255,0.5)' : '#64748b' }}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            }}
                            interval="preserveStartEnd"
                            minTickGap={50}
                            tickLine={false}
                            axisLine={{ stroke: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0' }}
                        />
                        <YAxis
                            stroke={isDark ? 'rgba(255,255,255,0.3)' : '#94a3b8'}
                            style={{ fontSize: '11px', fontWeight: 500, fill: isDark ? 'rgba(255,255,255,0.5)' : '#64748b' }}
                            tickFormatter={(value) => `${value.toFixed(1)}%`}
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
    )
}
