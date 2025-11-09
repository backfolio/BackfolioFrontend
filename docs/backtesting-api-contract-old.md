# Backtesting API Contract

**Version:** 1.0  
**Last Updated:** November 7, 2025  
**Service:** BackfolioBackend Backtesting Engine

## Base URLs

- **Development:** `http://localhost:8000`
- **Production:** `https://backfolio-backend.azurewebsites.net`

## Overview

The Backtesting API provides endpoints for running portfolio backtests with support for various investment strategies, including leveraged positions. The API returns both performance metrics and time-series data suitable for charting.

## Authentication

Currently, no authentication is required for the backtesting endpoints.

---

## Endpoints

### 1. Get Backtest Examples

Retrieve pre-configured strategy examples that can be used as templates.

**Endpoint:** `GET /api/v1/backtest/examples`

#### Response

```json
{
  "examples": {
    "buy_and_hold_spy": {
      "name": "Buy and Hold SPY",
      "description": "Simple buy and hold S&P 500 strategy",
      "strategy": {
        "allocations": {
          "stocks": {
            "SPY": 1.0
          }
        },
        "fallback_allocation": "stocks",
        "switching_logic": []
      },
      "config": {
        "start_date": "2020-01-01",
        "end_date": "2023-12-31",
        "initial_capital": 10000,
        "rebalance_frequency": "monthly"
      }
    },
    "leveraged_growth": {
      "name": "Leveraged Growth Strategy",
      "description": "Using leveraged ETFs for growth",
      "strategy": {
        "allocations": {
          "growth": {
            "QQQ?L=3": 0.5,
            "SPY?L=2": 0.5
          }
        },
        "fallback_allocation": "growth",
        "switching_logic": []
      },
      "config": {
        "start_date": "2020-01-01",
        "end_date": "2023-12-31",
        "initial_capital": 10000,
        "rebalance_frequency": "monthly"
      }
    },
    "conservative_portfolio": {
      "name": "Conservative 60/40 Portfolio",
      "description": "60% stocks, 40% bonds portfolio",
      "strategy": {
        "allocations": {
          "balanced": {
            "SPY": 0.6,
            "BND": 0.4
          }
        },
        "fallback_allocation": "balanced",
        "switching_logic": []
      },
      "config": {
        "start_date": "2020-01-01",
        "end_date": "2023-12-31",
        "initial_capital": 10000,
        "rebalance_frequency": "quarterly"
      }
    },
    "defensive_strategy": {
      "name": "Defensive Cash Strategy",
      "description": "Conservative strategy with cash allocation",
      "strategy": {
        "allocations": {
          "defensive": {
            "BND": 0.7,
            "CASH": 0.3
          }
        },
        "fallback_allocation": "defensive",
        "switching_logic": []
      },
      "config": {
        "start_date": "2020-01-01",
        "end_date": "2023-12-31",
        "initial_capital": 10000,
        "rebalance_frequency": "quarterly"
      }
    }
  },
  "usage": "Copy any example and POST to /api/v1/backtest to run a backtest"
}
```

---

### 2. Run Backtest

Execute a backtest with the provided strategy configuration.

**Endpoint:** `POST /api/v1/backtest`

#### Request Body

```json
{
  "allocations": {
    "allocation_group_name": {         // Custom group name (e.g., "stocks", "growth", "balanced")
      "SYMBOL": 0.5,                   // Regular symbol with allocation percentage (0.0-1.0)
      "SYMBOL?L=3": 0.3,              // Leveraged symbol with multiplier (L=2, L=3, etc.)
      "CASH": 0.2                      // Cash allocation
    }
  },
  "fallback_allocation": "allocation_group_name",  // Which allocation group to use as default
  "switching_logic": [                // Array of switching conditions (can be empty for simple strategies)
    {
      "condition": {
        "type": "simple",              // Condition type
        "symbol": "SPY",               // Symbol to analyze
        "signal": "SMA",               // Technical indicator (SMA, EMA, RSI, etc.)
        "params": {"window": 200},     // Signal parameters
        "operator": ">",               // Comparison operator (>, <, >=, <=, ==)
        "threshold": 0                 // Threshold value
      },
      "target_allocation": "allocation_group_name"  // Allocation to switch to when condition is met
    }
  ],
  "start_date": "YYYY-MM-DD",         // Backtest start date (optional, can be in config)
  "end_date": "YYYY-MM-DD",           // Backtest end date (optional, can be in config)  
  "initial_capital": 10000,           // Starting portfolio value (optional, can be in config)
  "config": {                         // Optional config overrides
    "rebalancing_frequency": "string", // "daily", "weekly", "monthly", "quarterly", "yearly"
    "base_commission": 0.0035,        // Commission rate (35 basis points default)
    "enable_risk_management": false,   // Enable risk management features
    "target_volatility": null,        // Target volatility for position sizing
    "stop_loss": null,                // Stop loss threshold (0.0-1.0)
    "take_profit": null,              // Take profit threshold
    "trailing_stop": null             // Trailing stop threshold (0.0-1.0)
  }
}
```

#### Request Example

```json
{
  "allocations": {
    "growth": {
      "SPY": 0.6,
      "QQQ?L=3": 0.3,
      "CASH": 0.1
    }
  },
  "fallback_allocation": "growth",
  "switching_logic": [],
  "start_date": "2020-01-01",
  "end_date": "2023-12-31",
  "initial_capital": 10000,
  "config": {
    "rebalancing_frequency": "monthly",
    "base_commission": 0.0035
  }
}
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "result": {
    "is_valid": true,
    "metrics": {
      "final_value": 14111.12,         // Final portfolio value
      "cagr": 0.0868,                  // Compound Annual Growth Rate
      "cumulative_return": 0.4111,     // Total return (41.11%)
      "annualized_return": 0.0868,     // Annualized return
      "volatility": 0.3231,            // Annualized volatility
      "sharpe_ratio": 0.2685,          // Risk-adjusted return metric
      "max_drawdown": -0.4313,         // Maximum drawdown (-43.13%)
      "sortino_ratio": 0.35,           // Downside risk-adjusted return
      "calmar_ratio": 0.20,            // CAGR / Max Drawdown
      "win_rate": 0.52                 // Percentage of winning days
    },
    "portfolio_log": {
      "2020-01-01": 10000.0,
      "2020-01-02": 10050.25,
      // ... daily portfolio values
    },
    "allocation_log": {
      "2020-01-01": "growth",
      "2020-01-02": "growth",
      // ... daily allocation names
    },
    "returns_log": {
      "2020-01-01": 0.0,
      "2020-01-02": 0.005025,
      // ... daily returns
    },
    "risk_metrics": {
      "value_at_risk_95": -0.0234,     // 95% VaR
      "expected_shortfall_95": -0.0312, // 95% Expected Shortfall
      "maximum_consecutive_losses": 5,  // Max losing streak
      "average_drawdown_duration": 12.5 // Average days in drawdown
    },
    "benchmark_comparison": {
      "SPY": {
        "correlation": 0.85,
        "beta": 1.12,
        "alpha": 0.015,
        "tracking_error": 0.078
      }
    },
    "execution_time": 0.245,           // Execution time in seconds
    "warnings": [],                    // Any warnings during execution
    "errors": []                       // Any errors (empty if successful)
  }
}
```

#### Error Response (400 Bad Request)

```json
{
  "success": false,
  "error": "Backtest failed",
  "warnings": [
    "Invalid strategy format",
    "Missing required field: allocations"
  ]
}
```

#### Error Response (500 Internal Server Error)

```json
{
  "success": false,
  "error": "Internal server error during backtest execution",
  "warnings": []
}
```

---

## Data Types & Constraints

### Symbol Format

- **Regular Symbols:** `SPY`, `QQQ`, `AAPL`, etc.
- **Leveraged Symbols:** `SYMBOL?L=X` where X is the leverage multiplier
  - Examples: `QQQ?L=3` (3x leveraged QQQ), `SPY?L=2` (2x leveraged SPY)
- **Cash:** `CASH` (represents cash holdings)

### Allocation Rules

- All allocation percentages must sum to 1.0 (100%)
- Individual allocations must be between 0.0 and 1.0
- At least one allocation must be specified

### Date Format

- **Format:** `YYYY-MM-DD` (ISO 8601)
- **Range:** Data availability depends on symbol (typically 2010-present)
- **Validation:** End date must be after start date

### Rebalance Frequencies

- `"daily"` - Rebalance every trading day
- `"weekly"` - Rebalance weekly (typically Mondays)
- `"monthly"` - Rebalance monthly (first trading day of month)
- `"quarterly"` - Rebalance quarterly (first trading day of quarter)
- `"yearly"` - Rebalance annually (first trading day of year)

---

## Frontend Implementation Guide

### 1. Strategy Builder UI

```typescript
interface Strategy {
  allocations: {
    [groupName: string]: {
      [symbol: string]: number; // 0.0 to 1.0
    };
  };
  fallback_allocation: string;
  switching_logic: SwitchingCondition[];
}

interface BacktestConfig {
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
  initial_capital: number;
  rebalance_frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}
```

### 2. Chart Data Usage

The `chart_data` object is optimized for frontend charting libraries:

```typescript
// For Chart.js, D3, or similar
const chartData = {
  labels: result.chart_data.dates,
  datasets: [{
    label: 'Portfolio Value',
    data: result.chart_data.values,
    borderColor: '#2563eb',
    backgroundColor: 'rgba(37, 99, 235, 0.1)'
  }]
};
```

### 3. Performance Metrics Display

```typescript
interface PerformanceMetrics {
  total_return: number;      // Display as percentage: (value * 100).toFixed(2) + '%'
  annualized_return: number; // Display as percentage
  final_value: number;       // Format as currency: $14,111.12
  max_drawdown: number;      // Display as negative percentage: -43.13%
  sharpe_ratio: number;      // Display with 2 decimal places: 0.27
  volatility: number;        // Display as percentage: 32.31%
}
```

### 4. Error Handling

```typescript
try {
  const response = await fetch('/api/v1/backtest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(backtestRequest)
  });
  
  const data = await response.json();
  
  if (!data.success) {
    // Handle API errors
    console.error('Backtest failed:', data.error);
    data.warnings?.forEach(warning => console.warn(warning));
  }
} catch (error) {
  // Handle network errors
  console.error('Network error:', error);
}
```

---

## Common Use Cases

### 1. Load Example Strategy
```http
GET /api/v1/backtest/examples
```
Use response to populate strategy builder with pre-configured examples.

### 2. Simple Buy & Hold
```json
{
  "allocations": {
    "stocks": { "SPY": 1.0 }
  },
  "fallback_allocation": "stocks",
  "switching_logic": []
}
```

### 3. Leveraged Growth Strategy
```json
{
  "allocations": {
    "aggressive": {
      "QQQ?L=3": 0.7,
      "SPY?L=2": 0.3
    }
  },
  "fallback_allocation": "aggressive",
  "switching_logic": []
}
```

### 4. Balanced Portfolio with Cash
```json
{
  "allocations": {
    "balanced": {
      "SPY": 0.5,
      "BND": 0.3,
      "CASH": 0.2
    }
  },
  "fallback_allocation": "balanced",
  "switching_logic": []
}
```

---

## Notes for Frontend Developers

1. **Performance:** Backtests typically complete in 50-200ms for 3-year periods
2. **Data Points:** Daily data provides ~1,000 points for 4-year backtests
3. **Leverage Warning:** Consider adding UI warnings for high leverage (>2x) strategies
4. **Date Validation:** Validate date ranges on frontend before API calls
5. **Progress Indication:** Show loading state during backtest execution
6. **Error Recovery:** Provide clear error messages and suggested fixes
7. **Mobile Friendly:** Chart data works well with responsive chart libraries

## Rate Limits

Currently no rate limits are enforced, but consider implementing client-side throttling for better UX.

## Support

For questions about this API contract or implementation assistance, contact the backend team.