// Custom hook for backtest state management
import { useState, useEffect } from 'react'

// Types - Updated for API v2.0
interface Strategy {
    allocations: {
        [groupName: string]: {
            [symbol: string]: number
        }
    }
    fallback_allocation: string
    switching_logic: any[]
}

interface BacktestConfig {
    start_date: string
    end_date: string
    initial_capital: number
    rebalance_frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
    base_commission?: number
    enable_risk_management?: boolean
    stop_loss?: number | null
    take_profit?: number | null
    trailing_stop?: number | null
    max_drawdown_limit?: number | null
    volatility_exit_threshold?: number | null
    target_volatility?: number | null
    max_position_size?: number
    min_position_size?: number
}

interface BacktestRequest {
    strategy: Strategy
    config: BacktestConfig
}



interface BacktestMetrics {
    total_return: number
    annual_return: number
    volatility: number
    sharpe_ratio: number
    max_drawdown: number
    calmar_ratio: number
    win_rate?: number
    profit_factor?: number
}

interface BacktestResult {
    request: BacktestRequest
    metrics: BacktestMetrics
    portfolio_values: Array<{
        date: string
        value: number
    }>
    benchmark_values?: Array<{
        date: string
        value: number
    }>
    warnings?: string[]
}

const DEFAULT_REQUEST: BacktestRequest = {
    strategy: {
        allocations: {
            portfolio: {
                'SPY': 0.6,
                'BND': 0.4
            }
        },
        fallback_allocation: 'portfolio',
        switching_logic: []
    },
    config: {
        start_date: '2020-01-01',
        end_date: '2023-12-31',
        initial_capital: 10000,
        rebalance_frequency: 'monthly'
    }
}

// UI state for strategy metadata
interface StrategyUI {
    name: string
    description?: string
}

const DEFAULT_ALLOCATIONS = [
    { symbol: 'SPY', allocation: 60 },
    { symbol: 'BND', allocation: 40 }
]

export const useBacktestState = () => {
    // View state
    const [showPlayground, setShowPlayground] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('backtest-playground-active')
            return saved === 'true'
        }
        return false
    })

    // Data state
    const [examples, setExamples] = useState<any>(null)
    const [selectedExample, setSelectedExample] = useState<string>('')
    const [backtestRequest, setBacktestRequest] = useState<BacktestRequest>(DEFAULT_REQUEST)
    const [strategyUI, setStrategyUI] = useState<StrategyUI>({
        name: 'Conservative 60/40 Portfolio',
        description: '60% stocks, 40% bonds portfolio'
    })
    const [result, setResult] = useState<BacktestResult | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>('')

    // Allocation state
    const [allocations, setAllocations] = useState<Array<{ symbol: string, allocation: number }>>(() => {
        if (typeof window !== 'undefined') {
            const savedAllocations = localStorage.getItem('backtest-allocations')
            if (savedAllocations) {
                try {
                    return JSON.parse(savedAllocations)
                } catch (error) {
                    console.log('Failed to load saved allocations:', error)
                }
            }
        }
        return DEFAULT_ALLOCATIONS
    })

    // Load examples on mount
    useEffect(() => {
        const loadExamples = async () => {
            try {
                // Use correct API endpoint path based on environment
                const apiBase = window.location.hostname === 'localhost'
                    ? 'http://localhost:8000'
                    : 'https://backfolio-backend-dtf4azfmgqh6d4b3.canadacentral-01.azurewebsites.net'
                const response = await fetch(`${apiBase}/api/v1/backtest/examples`)
                if (!response.ok) {
                    throw new Error('Failed to load examples')
                }
                const data = await response.json()
                setExamples(data.examples)
            } catch (error) {
                console.log('Examples not available:', error)
            }
        }
        loadExamples()
    }, [])

    // Persist states to localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('backtest-playground-active', showPlayground.toString())
        }
    }, [showPlayground])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('backtest-configuration', JSON.stringify(backtestRequest))
        }
    }, [backtestRequest])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('backtest-strategy-ui', JSON.stringify(strategyUI))
        }
    }, [strategyUI])

    useEffect(() => {
        if (typeof window !== 'undefined' && allocations.length > 0) {
            localStorage.setItem('backtest-allocations', JSON.stringify(allocations))
        }
    }, [allocations])

    // Load saved configuration on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedConfig = localStorage.getItem('backtest-configuration')
            const savedStrategyUI = localStorage.getItem('backtest-strategy-ui')

            if (savedConfig) {
                try {
                    const parsed = JSON.parse(savedConfig)
                    setBacktestRequest(parsed)

                    // Restore allocations state
                    const allocationsArray = Object.entries(parsed.strategy?.allocations?.portfolio || {}).map(
                        ([symbol, allocation]: [string, any]) => ({
                            symbol,
                            allocation: allocation * 100
                        })
                    )
                    if (allocationsArray.length > 0) {
                        setAllocations(allocationsArray)
                    }
                } catch (error) {
                    console.log('Failed to load saved configuration:', error)
                }
            }

            if (savedStrategyUI) {
                try {
                    const parsed = JSON.parse(savedStrategyUI)
                    setStrategyUI(parsed)
                } catch (error) {
                    console.log('Failed to load saved strategy UI:', error)
                }
            }
        }
    }, [])

    const clearSavedData = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('backtest-playground-active')
            localStorage.removeItem('backtest-configuration')
            localStorage.removeItem('backtest-strategy-ui')
            localStorage.removeItem('backtest-allocations')
        }

        setShowPlayground(false)
        setBacktestRequest(DEFAULT_REQUEST)
        setStrategyUI({
            name: 'Conservative 60/40 Portfolio',
            description: '60% stocks, 40% bonds portfolio'
        })
        setAllocations(DEFAULT_ALLOCATIONS)
        setResult(null)
        setError('')
        setSelectedExample('')
    }

    const loadExample = (exampleKey: string) => {
        if (!examples || !examples[exampleKey]) return

        const example = examples[exampleKey]

        // Update strategy UI metadata
        setStrategyUI({
            name: example.name,
            description: example.description
        })

        // Update backtest request with API v2.0 format
        setBacktestRequest({
            strategy: example.strategy,
            config: {
                ...backtestRequest.config,
                ...example.config
            }
        })

        // Convert strategy allocations to allocations array for UI
        const firstGroup = Object.keys(example.strategy.allocations)[0]
        const strategyAllocations = example.strategy.allocations[firstGroup]
        const newAllocations = Object.entries(strategyAllocations).map(([symbol, allocation]) => ({
            symbol,
            allocation: (allocation as number) * 100
        }))
        setAllocations(newAllocations)
        setSelectedExample(exampleKey)
    }

    const runBacktest = async () => {
        const totalAllocation = allocations.reduce((sum, { allocation }) => sum + allocation, 0)
        const isValidBacktest = totalAllocation === 100 &&
            allocations.every(({ symbol }) => symbol.trim().length > 0) &&
            strategyUI.name.trim().length > 0

        if (!isValidBacktest) return

        setLoading(true)
        setError('')
        setResult(null)

        try {
            // Use correct API endpoint path
            const apiBase = window.location.hostname === 'localhost'
                ? 'http://localhost:8000'
                : 'https://backfolio-backend-dtf4azfmgqh6d4b3.canadacentral-01.azurewebsites.net'

            const response = await fetch(`${apiBase}/api/v1/backtest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(backtestRequest)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || errorData.detail || 'Backtest failed')
            }

            const data = await response.json()

            if (!data.success) {
                throw new Error(data.error || 'Backtest failed')
            }

            // Transform API v2.0 response to match UI expectations
            const apiResult = data.result
            const transformedResult = {
                request: backtestRequest,
                metrics: {
                    total_return: apiResult.metrics.cumulative_return * 100, // Convert to percentage
                    annual_return: apiResult.metrics.cagr * 100,
                    volatility: apiResult.metrics.volatility * 100,
                    sharpe_ratio: apiResult.metrics.sharpe_ratio,
                    max_drawdown: apiResult.metrics.max_drawdown * 100,
                    calmar_ratio: apiResult.metrics.calmar_ratio,
                    win_rate: apiResult.metrics.win_rate * 100,
                    profit_factor: undefined // Not available in API v2.0
                },
                portfolio_values: Object.entries(apiResult.portfolio_log || {}).map(([date, value]) => ({
                    date,
                    value: value as number
                })),
                benchmark_values: undefined, // Not available in simple format
                warnings: apiResult.warnings || []
            }

            setResult(transformedResult)
        } catch (error: any) {
            setError(error.message || 'An error occurred while running the backtest')
        } finally {
            setLoading(false)
        }
    }

    const updateAllocation = (index: number, field: 'symbol' | 'allocation', value: string | number) => {
        const newAllocations = [...allocations]
        newAllocations[index] = { ...newAllocations[index], [field]: value }
        setAllocations(newAllocations)

        // Convert allocations back to strategy format
        const strategyAllocations: { [symbol: string]: number } = {}
        newAllocations.forEach(({ symbol, allocation }) => {
            if (symbol && allocation > 0) {
                strategyAllocations[symbol] = allocation / 100
            }
        })

        setBacktestRequest(prev => ({
            ...prev,
            strategy: {
                ...prev.strategy,
                allocations: {
                    portfolio: strategyAllocations
                },
                fallback_allocation: 'portfolio'
            }
        }))
    }

    const addAllocation = () => {
        setAllocations([...allocations, { symbol: '', allocation: 0 }])
    }

    const removeAllocation = (index: number) => {
        if (allocations.length > 1) {
            const newAllocations = allocations.filter((_, i) => i !== index)
            setAllocations(newAllocations)

            // Update strategy
            const strategyAllocations: { [symbol: string]: number } = {}
            newAllocations.forEach(({ symbol, allocation }) => {
                if (symbol && allocation > 0) {
                    strategyAllocations[symbol] = allocation / 100
                }
            })

            setBacktestRequest(prev => ({
                ...prev,
                strategy: {
                    ...prev.strategy,
                    allocations: {
                        portfolio: strategyAllocations
                    },
                    fallback_allocation: 'portfolio'
                }
            }))
        }
    }

    const totalAllocation = allocations.reduce((sum, { allocation }) => sum + allocation, 0)
    const isValidBacktest = totalAllocation === 100 &&
        allocations.every(({ symbol }) => symbol.trim().length > 0) &&
        strategyUI.name.trim().length > 0

    const hasRestoredData = typeof window !== 'undefined' && !!localStorage.getItem('backtest-configuration')

    return {
        // View state
        showPlayground,
        setShowPlayground,

        // Data state
        examples,
        selectedExample,
        backtestRequest,
        setBacktestRequest,
        strategyUI,
        setStrategyUI,
        result,
        loading,
        error,

        // Allocation state
        allocations,
        totalAllocation,
        isValidBacktest,
        hasRestoredData,

        // Actions
        clearSavedData,
        loadExample,
        runBacktest,
        updateAllocation,
        addAllocation,
        removeAllocation
    }
}