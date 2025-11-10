// Backtest API Result Types

export interface BacktestMetrics {
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

export interface RiskMetrics {
    value_at_risk_95?: number
    conditional_var_95?: number
    downside_deviation?: number
    upside_potential?: number
    omega_ratio?: number
    skewness?: number
    kurtosis?: number
}

export interface AllocationEfficiency {
    allocation_percentages: Record<string, number>
    allocation_changes: number
    switching_frequency: number
}

export interface TransactionAnalysis {
    total_trades: number
    avg_holding_period: number
    turnover_ratio: number
    total_commissions: number
}

export interface DataQuality {
    total_days: number
    missing_days: number
    data_completeness: number
}

export interface BacktestAPIResult {
    strategyName?: string
    result: {
        is_valid: boolean
        metrics: BacktestMetrics
        portfolio_log: Record<string, number>
        returns_log: Record<string, number>
        allocation_log?: Record<string, string>
        risk_metrics?: RiskMetrics
        allocation_efficiency?: AllocationEfficiency
        transaction_analysis?: TransactionAnalysis
        data_quality?: DataQuality
        warnings?: string[]
        errors?: string[]
    }
    success: boolean
}

export interface BacktestResultsModalProps {
    results: BacktestAPIResult[] | null
    onClose: () => void
}

export interface StrategyColor {
    stroke: string
    fill: string
    stopColor: string
}

export interface PortfolioDataPoint {
    date: string
    value: number
}

export interface ReturnsDataPoint {
    date: string
    return: number
}

export interface DrawdownDataPoint {
    date: string
    drawdown: number
}

export interface AllocationDataPoint {
    date: string
    allocation: string
}

export type TabType = 'overview' | 'charts' | 'analytics' | 'allocations'
