// AI Chat Types - for AI assistant interactions and result visualizations

export type MessageRole = 'user' | 'assistant' | 'system'
export type ResultType = 'none' | 'chart' | 'strategy' | 'backtest' | 'allocation' | 'comparison'
export type ChartType = 'line' | 'bar' | 'pie' | 'allocation'

// Core message structure
export interface ChatMessage {
    id: string
    role: MessageRole
    content: string
    timestamp: Date
    resultType?: ResultType
    resultData?: ResultData
}

// Result data structures for visualization
export interface ResultData {
    type: ResultType
    data: ChartData | StrategyData | BacktestData | ComparisonData
}

export interface ChartData {
    chartType: ChartType
    title: string
    description?: string
    data: Array<{
        label: string
        value: number
        color?: string
    }>
    xAxisLabel?: string
    yAxisLabel?: string
}

export interface AllocationData {
    symbol: string
    name: string
    percentage: number
    amount?: number
}

export interface StrategyNode {
    id: string
    name: string
    allocations: AllocationData[]
    rebalancing?: 'monthly' | 'quarterly' | 'yearly'
}

export interface StrategyRule {
    id: string
    name: string
    condition: string
    fromNode: string
    toNode: string
}

export interface StrategyData {
    name: string
    description?: string
    nodes: StrategyNode[]
    rules: StrategyRule[]
    fallback?: string
}

export interface BacktestData {
    strategyName: string
    startDate: string
    endDate: string
    initialCapital: number
    metrics: {
        totalReturn: number
        annualReturn: number
        sharpe: number
        maxDrawdown: number
        volatility: number
    }
    equityCurve: Array<{
        date: string
        value: number
    }>
    benchmark?: Array<{
        date: string
        value: number
    }>
}

export interface ComparisonData {
    strategies: Array<{
        name: string
        metrics: {
            totalReturn: number
            annualReturn: number
            sharpe: number
            maxDrawdown: number
            volatility: number
        }
    }>
}

// UI State
export interface ChatState {
    messages: ChatMessage[]
    isLoading: boolean
    error: string | null
    activeResult: ResultType
}
