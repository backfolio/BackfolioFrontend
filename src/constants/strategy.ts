import { StrategyDSL } from '../types/strategy';

// Preset allocation templates
export const ALLOCATION_PRESETS = {
    '60/40 Portfolio': {
        'SPY': 0.6,
        'BND': 0.4
    },
    '80/20 Aggressive': {
        'SPY': 0.8,
        'BND': 0.2
    },
    'All Weather': {
        'SPY': 0.3,
        'TLT': 0.4,
        'IEF': 0.15,
        'GLD': 0.075,
        'DBC': 0.075
    },
    'Three Fund': {
        'VTI': 0.6,
        'VXUS': 0.3,
        'BND': 0.1
    },
    'Golden Butterfly': {
        'VTI': 0.2,
        'SHY': 0.2,
        'TLT': 0.2,
        'GLD': 0.2,
        'IWM': 0.2
    },
    'Conservative': {
        'SPY': 0.3,
        'BND': 0.5,
        'SHY': 0.2
    },
    'Growth': {
        'QQQ': 0.6,
        'SPY': 0.3,
        'GLD': 0.1
    },
    'Dividend Focus': {
        'VYM': 0.4,
        'SCHD': 0.3,
        'VIG': 0.3
    },
    'International Mix': {
        'VTI': 0.4,
        'VXUS': 0.4,
        'VWO': 0.2
    },
    'Risk Parity': {
        'SPY': 0.25,
        'TLT': 0.25,
        'GLD': 0.25,
        'DBC': 0.25
    }
};

// Preset rule templates
export const RULE_PRESETS = {
    'Golden Cross': {
        name: 'Golden Cross',
        rule_type: 'buy' as 'buy' | 'sell' | 'hold',
        condition: {
            left: { type: 'SMA', symbol: 'SPY', window: 50 },
            comparison: '>',
            right: { type: 'SMA', symbol: 'SPY', window: 200 }
        },
        description: 'Buy when 50-day SMA crosses above 200-day SMA'
    },
    'Death Cross': {
        name: 'Death Cross',
        rule_type: 'sell' as 'buy' | 'sell' | 'hold',
        condition: {
            left: { type: 'SMA', symbol: 'SPY', window: 50 },
            comparison: '<',
            right: { type: 'SMA', symbol: 'SPY', window: 200 }
        },
        description: 'Sell when 50-day SMA crosses below 200-day SMA'
    },
    'RSI Oversold': {
        name: 'RSI Oversold',
        rule_type: 'buy' as 'buy' | 'sell' | 'hold',
        condition: {
            left: { type: 'RSI', symbol: 'SPY', window: 14 },
            comparison: '<',
            right: { type: 'VALUE', value: 30 }
        },
        description: 'Buy when RSI drops below 30 (oversold)'
    },
    'RSI Overbought': {
        name: 'RSI Overbought',
        rule_type: 'sell' as 'buy' | 'sell' | 'hold',
        condition: {
            left: { type: 'RSI', symbol: 'SPY', window: 14 },
            comparison: '>',
            right: { type: 'VALUE', value: 70 }
        },
        description: 'Sell when RSI rises above 70 (overbought)'
    },
    'Price Above SMA200': {
        name: 'Price Above SMA200',
        rule_type: 'buy' as 'buy' | 'sell' | 'hold',
        condition: {
            left: { type: 'CLOSE', symbol: 'SPY' },
            comparison: '>',
            right: { type: 'SMA', symbol: 'SPY', window: 200 }
        },
        description: 'Buy when price is above 200-day moving average'
    },
    'Price Below SMA200': {
        name: 'Price Below SMA200',
        rule_type: 'sell' as 'buy' | 'sell' | 'hold',
        condition: {
            left: { type: 'CLOSE', symbol: 'SPY' },
            comparison: '<',
            right: { type: 'SMA', symbol: 'SPY', window: 200 }
        },
        description: 'Sell when price falls below 200-day moving average'
    },
    'VIX Spike': {
        name: 'VIX Spike',
        rule_type: 'sell' as 'buy' | 'sell' | 'hold',
        condition: {
            left: { type: 'CLOSE', symbol: 'VIX' },
            comparison: '>',
            right: { type: 'VALUE', value: 30 }
        },
        description: 'Sell when VIX (fear index) exceeds 30'
    },
    'MACD Bullish': {
        name: 'MACD Bullish',
        rule_type: 'buy' as 'buy' | 'sell' | 'hold',
        condition: {
            left: { type: 'MACD', symbol: 'SPY' },
            comparison: '>',
            right: { type: 'VALUE', value: 0 }
        },
        description: 'Buy when MACD is positive (bullish momentum)'
    },
    'Momentum Strong': {
        name: 'Momentum Strong',
        rule_type: 'buy' as 'buy' | 'sell' | 'hold',
        condition: {
            left: { type: 'MOMENTUM', symbol: 'SPY', window: 20 },
            comparison: '>',
            right: { type: 'VALUE', value: 0.05 }
        },
        description: 'Buy when 20-day momentum exceeds 5%'
    },
    'Low Volatility': {
        name: 'Low Volatility',
        rule_type: 'hold' as 'buy' | 'sell' | 'hold',
        condition: {
            left: { type: 'VOLATILITY', symbol: 'SPY', window: 20 },
            comparison: '<',
            right: { type: 'VALUE', value: 0.15 }
        },
        description: 'Hold when market volatility is low (<15%)'
    }
};

// Default DSL strategy
export const DEFAULT_DSL: StrategyDSL = {
    start_date: "",
    end_date: "",
    initial_capital: 10000,
    allocations: {},
    fallback_allocation: "",
    switching_logic: [],
    allocation_rules: []
};

// Example tactical strategy with allocation_rules
export const TACTICAL_EXAMPLE_STRATEGY: StrategyDSL = {
    start_date: "2020-01-01",
    end_date: "2024-12-31",
    initial_capital: 10000,
    allocations: {
        "SPY_100": {
            allocation: {
                "SPY": 1.0
            }
            // No rebalancing for tactical allocation
        },
        "DEFENSIVE": {
            allocation: {
                "BND": 0.6,
                "CASH": 0.4
            },
            rebalancing_frequency: "monthly"
        }
    },
    fallback_allocation: "DEFENSIVE",
    switching_logic: [
        {
            name: "Buy Oversold",
            rule_type: "buy",
            condition: {
                left: { type: "RSI", symbol: "SPY", window: 14 },
                comparison: "<",
                right: { type: "VALUE", value: 30 }
            }
        },
        {
            name: "Sell Overbought",
            rule_type: "sell",
            condition: {
                left: { type: "RSI", symbol: "SPY", window: 14 },
                comparison: ">",
                right: { type: "VALUE", value: 70 }
            }
        }
    ],
    allocation_rules: [
        {
            allocation: "SPY_100",
            rules: ["Buy Oversold", "Sell Overbought"]
        }
    ]
};