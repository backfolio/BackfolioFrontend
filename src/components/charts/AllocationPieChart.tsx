import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useTheme } from '../../context/ThemeContext'

interface AllocationData {
    symbol: string
    name: string
    percentage: number
    color?: string
}

interface AllocationPieChartProps {
    data: AllocationData[]
    size?: 'small' | 'medium' | 'large'
    showLegend?: boolean
}

const COLORS = ['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#6366f1', '#ec4899']

const AllocationPieChart = ({ data, size = 'medium', showLegend = true }: AllocationPieChartProps) => {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    const chartData = data.map((item, index) => ({
        name: item.name || item.symbol,
        value: item.percentage,
        color: item.color || COLORS[index % COLORS.length]
    }))

    const sizeMap = {
        small: 120,
        medium: 200,
        large: 280
    }

    const height = sizeMap[size]

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className={`rounded-lg px-3 py-2 shadow-lg ${isDark ? 'bg-gray-800 border border-white/10' : 'bg-white border border-gray-200'
                    }`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {payload[0].name}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {payload[0].value}%
                    </p>
                </div>
            )
        }
        return null
    }

    const renderLegend = (props: any) => {
        const { payload } = props
        return (
            <div className="flex flex-wrap justify-center gap-3 mt-4">
                {payload.map((entry: any, index: number) => (
                    <div key={`legend-${index}`} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-sm"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {entry.value}
                        </span>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <ResponsiveContainer width="100%" height={height}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={size === 'small' ? 30 : size === 'medium' ? 50 : 70}
                    outerRadius={size === 'small' ? 45 : size === 'medium' ? 75 : 105}
                    paddingAngle={2}
                    dataKey="value"
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                {showLegend && <Legend content={renderLegend} />}
            </PieChart>
        </ResponsiveContainer>
    )
}

export default AllocationPieChart
