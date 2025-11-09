# Backtesting API Contract

**Version:** 2.0  
**Last Updated:** November 8, 2025  
**Service:** BackfolioBackend Backtesting Engine

**Breaking Changes from v1.0:**
- Request format now requires nested `strategy` wrapper
- `rebalancing_frequency` renamed to `rebalance_frequency`
- Expanded response includes advanced analytics
- Risk management disabled by default

## Base URLs

- **Development:** `http://localhost:8000`
- **Production:** `https://backfolio-backend.azurewebsites.net`

## Overview

The Backtesting API provides endpoints for running portfolio backtests with support for various investment strategies, including leveraged positions. The API returns both performance metrics and time-series data suitable for charting.

## Authentication

Currently, no authentication is required for the backtesting endpoints.

**Optional User Identification:**  
You can include an `X-User-Id` header to associate backtest results with a user account:

```http
POST /api/v1/backtest
X-User-Id: user123
Content-Type: application/json
```

This enables:
- Saving backtest results to your account
- Retrieving past backtest runs
- Tracking strategy performance over time

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
  "strategy": {
    "allocations": {
      "allocation_group_name": {         // Custom group name (e.g., "stocks", "growth", "balanced")
        "SYMBOL": 0.5,                   // Regular symbol with allocation percentage (0.0-1.0)
        "SYMBOL?L=3": 0.3,              // Leveraged symbol with multiplier (L=2, L=3, etc.)
        "CASH": 0.2                      // Cash allocation
      }
    },
    "fallback_allocation": "allocation_group_name",  // Which allocation group to use as default
    "switching_logic": []               // Array of switching conditions (can be empty for simple strategies)
  },
  "config": {
    "start_date": "YYYY-MM-DD",         // Backtest start date
    "end_date": "YYYY-MM-DD",           // Backtest end date
    "initial_capital": 10000,           // Starting portfolio value (default: 10000)
    "rebalance_frequency": "monthly",   // "daily", "weekly", "monthly", "quarterly", "yearly"
    "base_commission": 0.0035,          // Commission rate (default: 35 basis points)
    
    // Advanced Risk Management (optional - disabled by default)
    "enable_risk_management": false,    // Enable advanced risk controls
    "stop_loss": null,                  // Stop loss threshold (0.0-1.0, e.g., 0.2 = 20% loss)
    "take_profit": null,                // Take profit threshold (e.g., 0.5 = 50% gain)
    "trailing_stop": null,              // Trailing stop threshold (0.0-1.0)
    "max_drawdown_limit": null,         // Maximum drawdown before exit (0.0-1.0)
    "volatility_exit_threshold": null,  // Exit if volatility exceeds threshold
    
    // Advanced Position Sizing (optional)
    "target_volatility": null,          // Target portfolio volatility for position sizing
    "max_position_size": 0.25,          // Maximum position size (default: 25%)
    "min_position_size": 0.05           // Minimum position size (default: 5%)
  }
}
```

#### Switching Logic Format

For strategies with conditional allocation switching:

```json
{
  "strategy": {
    "allocations": {
      "defensive": {"BND": 0.7, "CASH": 0.3},
      "aggressive": {"SPY": 0.6, "QQQ": 0.4}
    },
    "fallback_allocation": "defensive",
    "switching_logic": [
      {
        "name": "Market Above SMA200",
        "condition": {
          "left": {
            "type": "SMA",
            "symbol": "SPY",
            "window": 200
          },
          "comparison": ">",
          "right": {
            "type": "constant",
            "value": 0.0
          }
        },
        "target_allocation": "aggressive"
      }
    ]
  },
  "config": {
    "start_date": "2020-01-01",
    "end_date": "2023-12-31",
    "initial_capital": 10000,
    "rebalance_frequency": "monthly"
  }
}
```

**Composite Conditions (AND/OR):**

```json
{
  "strategy": {
    "allocations": {
      "GROWTH": {"QQQ?L=3": 1.0},
      "DEFENSIVE": {"SPY": 0.7, "CASH": 0.3}
    },
    "fallback_allocation": "DEFENSIVE",
    "switching_logic": [
      {
        "condition": {
          "op": "and",
          "conditions": [
            {
              "left": {
                "type": "Momentum",
                "symbol": "SPY",
                "window": 120
              },
              "comparison": ">",
              "right": {
                "type": "constant",
                "value": 0.0
              }
            },
            {
              "left": {
                "type": "RollingSharpe",
                "symbol": "SPY",
                "window": 252,
                "trading_days": 252,
                "risk_free_rate": 0.02
              },
              "comparison": ">",
              "right": {
                "type": "constant",
                "value": 0.5
              }
            },
            {
              "left": {
                "type": "SMA",
                "symbol": "SPY",
                "window": 200
              },
              "comparison": ">",
              "right": {
                "type": "constant",
                "value": 0.0
              }
            }
          ]
        },
        "target_allocation": "GROWTH"
      }
    ]
  },
  "config": {
    "start_date": "2020-01-01",
    "end_date": "2023-12-31",
    "initial_capital": 10000,
    "rebalance_frequency": "monthly"
  }
}
```

#### Available Signal Types

The following signal types can be used in condition `left` or `right` sides:

**Technical Indicators:**
- `SMA` - Simple Moving Average (params: `window`)
- `EMA` - Exponential Moving Average (params: `window`)
- `RSI` - Relative Strength Index (params: `window`)
- `MACD` - Moving Average Convergence Divergence (params: `fast`, `slow`, `signal`)
- `Momentum` - Price momentum (params: `window`)
- `ROC` - Rate of Change (params: `window`)
- `Volatility` - Rolling volatility (params: `window`)
- `ATR` - Average True Range (params: `window`)
- `BollingerBands` - Bollinger Bands (params: `window`, `num_std`)
- `StochasticOscillator` - Stochastic oscillator (params: `window`, `smooth_window`)

**Performance Metrics:**
- `RollingSharpe` - Rolling Sharpe ratio (params: `window`, `trading_days`, `risk_free_rate`)
- `RollingSortino` - Rolling Sortino ratio (params: `window`, `trading_days`, `risk_free_rate`)
- `RollingReturn` - Rolling returns (params: `window`)
- `Drawdown` - Current drawdown from peak

**Price Data:**
- `Close` - Closing price
- `Open` - Opening price
- `High` - High price
- `Low` - Low price
- `Volume` - Trading volume

**Constants:**
- `constant` - Fixed value (params: `value`)

**Comparison Operators:**
- `>` - Greater than
- `<` - Less than
- `>=` - Greater than or equal
- `<=` - Less than or equal
- `==` - Equal to

**Logical Operators:**
- `op: "and"` - All conditions must be true
- `op: "or"` - At least one condition must be true

#### Request Example (Simple Buy & Hold)

```json
{
  "strategy": {
    "allocations": {
      "growth": {
        "SPY": 0.6,
        "QQQ": 0.3,
        "CASH": 0.1
      }
    },
    "fallback_allocation": "growth",
    "switching_logic": []
  },
  "config": {
    "start_date": "2020-01-01",
    "end_date": "2023-12-31",
    "initial_capital": 10000,
    "rebalance_frequency": "monthly",
    "base_commission": 0.0035
  }
}
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "backtest_id": "abc123-def456-ghi789",  // Optional: ID for saved backtest result
  "result": {
    "is_valid": true,
    "validation_score": 0.87,          // Overall validation score (0.0-1.0)
    
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
    
    "allocation_summary": [
      {
        "allocation": "growth",
        "days": 1008,
        "avg_daily_return": 0.0008,
        "total_return": 0.4111
      }
    ],
    
    "risk_metrics": {
      "var_95": -0.0234,               // 95% Value at Risk
      "cvar_95": -0.0312,              // 95% Conditional VaR (Expected Shortfall)
      "var_99": -0.0345,               // 99% Value at Risk
      "cvar_99": -0.0421,              // 99% Conditional VaR
      "skewness": -0.15,               // Return distribution skewness
      "kurtosis": 3.2,                 // Return distribution kurtosis
      "max_consecutive_losses": 5,     // Max losing streak
      "volatility_clustering": 0.042   // Measure of volatility persistence
    },
    
    "benchmark_comparison": {
      "SPY": {
        "correlation": 0.85,
        "beta": 1.12,
        "alpha_annualized": 0.015,
        "information_ratio": 0.42,
        "tracking_error": 0.078,
        "up_capture": 1.15,
        "down_capture": 0.95,
        "benchmark_cagr": 0.075,
        "excess_return_cagr": 0.012
      }
    },
    
    "transaction_analysis": {
      "total_transaction_costs": 125.43,
      "total_trades": 48,
      "total_turnover": 35820.50,
      "avg_cost_per_trade": 2.61,
      "cost_as_pct_of_portfolio": 1.05,
      "turnover_ratio": 3.02,
      "trading_frequency": 0.048
    },
    
    "drawdown_analysis": {
      "summary": {
        "max_drawdown": -0.4313,
        "avg_drawdown": -0.0872,
        "drawdown_frequency": 3,
        "avg_drawdown_duration": 42.5,
        "avg_recovery_time": 68.2,
        "max_recovery_time": 125
      },
      "periods": [
        {
          "start_date": "2020-02-19",
          "end_date": "2020-03-23",
          "recovery_date": "2020-08-15",
          "max_drawdown": -0.4313,
          "duration_days": 33,
          "recovery_days": 145
        }
      ]
    },
    
    "allocation_efficiency": {
      "allocation_changes": 12,
      "switching_frequency": 0.012,
      "allocation_percentages": {
        "growth": 95.2,
        "defensive": 4.8
      },
      "allocation_performance": {
        "growth": {
          "avg_return": 0.0009,
          "volatility": 0.0185,
          "sharpe": 0.487
        }
      }
    },
    
    "rolling_metrics": {
      "2020-02-01": {
        "rolling_sharpe": 0.45,
        "rolling_sortino": 0.62,
        "rolling_volatility": 0.28
      }
      // ... rolling metrics for each date
    },
    
    "correlation_matrix": {
      "SPY": {"SPY": 1.0, "QQQ": 0.82},
      "QQQ": {"SPY": 0.82, "QQQ": 1.0}
    },
    
    "risk_contribution": {
      "SPY": 0.55,
      "QQQ": 0.45
    },
    
    "data_quality": {
      "total_symbols": 2,
      "date_range_days": 1008,
      "start_date": "2020-01-01",
      "end_date": "2023-12-31",
      "missing_data_issues": [],
      "data_completeness": {
        "SPY": 1.0,
        "QQQ": 0.998
      }
    },
    
    "rebalancing_frequency": "monthly",
    "execution_time": 0.245,
    "warnings": [],
    "errors": []
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
    "Missing required field: allocations",
    "Allocation 'growth' weights sum to 1.05, not 1.0",
    "Symbol SPY data not available for requested date range"
  ]
}
```

Common validation errors:
- Missing required fields (`allocations`, `fallback_allocation`, `switching_logic`)
- Allocation weights don't sum to 1.0
- Invalid date format (must be YYYY-MM-DD)
- Start date not before end date
- Invalid rebalance frequency
- Missing data for symbols
- Invalid leverage multiplier format

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
interface BacktestRequest {
  strategy: {
    allocations: {
      [groupName: string]: {
        [symbol: string]: number; // 0.0 to 1.0
      };
    };
    fallback_allocation: string;
    switching_logic: SwitchingCondition[];
  };
  config: {
    start_date: string; // YYYY-MM-DD
    end_date: string;   // YYYY-MM-DD
    initial_capital: number;
    rebalance_frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    base_commission?: number;
    enable_risk_management?: boolean;
    stop_loss?: number;
    take_profit?: number;
    trailing_stop?: number;
  };
}

interface SwitchingCondition {
  name?: string;
  condition: {
    type: string;
    symbol: string;
    signal: string;
    params: Record<string, any>;
    operator: string;
    threshold: number;
  };
  target_allocation: string;
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
  "strategy": {
    "allocations": {
      "stocks": { "SPY": 1.0 }
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
}
```

### 3. Leveraged Growth Strategy
```json
{
  "strategy": {
    "allocations": {
      "aggressive": {
        "QQQ?L=3": 0.7,
        "SPY?L=2": 0.3
      }
    },
    "fallback_allocation": "aggressive",
    "switching_logic": []
  },
  "config": {
    "start_date": "2020-01-01",
    "end_date": "2023-12-31",
    "initial_capital": 10000,
    "rebalance_frequency": "monthly"
  }
}
```

### 4. Balanced Portfolio with Cash
```json
{
  "strategy": {
    "allocations": {
      "balanced": {
        "SPY": 0.5,
        "BND": 0.3,
        "CASH": 0.2
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
}
```

---

## Notes for Frontend Developers

1. **Performance:** Backtests typically complete in 50-500ms depending on date range and complexity
2. **Data Points:** Daily data provides ~1,000 points for 4-year backtests
3. **Leverage Warning:** Consider adding UI warnings for high leverage (>2x) strategies
4. **Date Validation:** Validate date ranges on frontend before API calls
5. **Progress Indication:** Show loading state during backtest execution
6. **Error Recovery:** Provide clear error messages and suggested fixes
7. **Mobile Friendly:** Chart data works well with responsive chart libraries
8. **Response Size:** Full responses can be large (100KB+) with all metrics - consider data compression
9. **Risk Management:** Risk management features are disabled by default to preserve strategy integrity
10. **Nested Structure:** Note the nested `strategy` wrapper in requests (changed from flat structure)

## Advanced Features

### Risk Management

Risk management is **disabled by default** to preserve the integrity of user-defined strategies. Enable it explicitly:

```json
{
  "config": {
    "enable_risk_management": true,
    "stop_loss": 0.15,              // Exit if portfolio drops 15%
    "trailing_stop": 0.10,          // Exit if portfolio drops 10% from peak
    "max_drawdown_limit": 0.25      // Exit if drawdown exceeds 25%
  }
}
```

### Position Sizing

Advanced position sizing based on volatility targeting:

```json
{
  "config": {
    "target_volatility": 0.15,      // Target 15% annual volatility
    "max_position_size": 0.30,      // Max 30% in any position
    "min_position_size": 0.05       // Min 5% in any position
  }
}
```

### Supported Technical Indicators

The engine supports 40+ technical indicators for switching logic:
- **Trend:** SMA, EMA, MACD, SAR, TRIX
- **Momentum:** RSI, ROC, Momentum, Stochastic, Williams %R
- **Volatility:** ATR, Bollinger Bands, Standard Deviation
- **Volume:** OBV, MFI, Chaikin Money Flow
- **Custom:** Rolling Sharpe, Market Regime, Correlation

See full list in the engine documentation.

## Rate Limits

Currently no rate limits are enforced, but consider implementing client-side throttling for better UX.

## Support

For questions about this API contract or implementation assistance, contact the backend team.