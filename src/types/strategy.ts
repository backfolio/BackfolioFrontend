// Types for the strategy DSL, based on the API contract and example patterns

export interface Allocation {
    [symbol: string]: number; // symbol -> allocation percentage (0.0-1.0)
}

export interface AllocationWithRebalancing {
    allocation: Allocation;
    rebalancing_frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}

export interface Condition {
    left: {
        type: string;
        symbol: string;
        window?: number;
        fast?: number;
        slow?: number;
        signal?: number;
        num_std?: number;
        smooth_window?: number;
        trading_days?: number;
        risk_free_rate?: number;
        value?: number;
    };
    comparison: '>' | '<' | '>=' | '<=' | '==';
    right: {
        type: 'constant' | 'VALUE' | string;
        value?: number;
        symbol?: string;
        window?: number;
    };
}

export interface SwitchingRule {
    name?: string;
    rule_type: 'buy' | 'sell' | 'hold';
    condition: Condition;
}

export interface AllocationRule {
    allocation: string;
    rules: string[] | string; // rule names array OR logical expression string (e.g., "A AND B OR C")
}

// Main strategy DSL structure - matches API contract
export interface StrategyDSL {
    start_date: string;
    end_date: string;
    initial_capital: number;
    allocations: {
        [name: string]: AllocationWithRebalancing;
    };
    fallback_allocation: string;
    switching_logic: SwitchingRule[];
    allocation_rules?: AllocationRule[];
}

// Backtest configuration for the UI
export interface BacktestConfig {
    start_date: string;
    end_date: string;
    initial_capital: number;
    benchmark: string;
    cashflow_annualized?: number;
    cashflow_type?: 'dollars' | 'percentage';
    cashflow_period?: 'monthly' | 'quarterly' | 'semi-annually' | 'annually';
    risk_management?: {
        enable_risk_management: boolean;
        stop_loss?: number | null;
        max_drawdown?: number | null;
        volatility_exit_threshold?: number | null;
    };
}