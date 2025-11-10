import { useMemo } from 'react'
import { BacktestAPIResult, PortfolioDataPoint, ReturnsDataPoint, DrawdownDataPoint, AllocationDataPoint } from '../types/backtestResults'

/**
 * Custom hook to transform backtest API results into chart-ready data
 */
export const useBacktestChartData = (results: BacktestAPIResult[], selectedStrategyIndex: number) => {
    const result = results[selectedStrategyIndex]

    const portfolioData = useMemo((): PortfolioDataPoint[] => {
        if (!result?.result?.portfolio_log) return []
        return Object.entries(result.result.portfolio_log).map(([date, value]) => ({
            date,
            value: value as number
        }))
    }, [result])

    const returnsData = useMemo((): ReturnsDataPoint[] => {
        if (!result?.result?.returns_log) return []
        return Object.entries(result.result.returns_log).map(([date, returnValue]) => ({
            date,
            return: (returnValue as number) * 100 // Convert to percentage
        }))
    }, [result])

    const drawdownData = useMemo((): DrawdownDataPoint[] => {
        return portfolioData.map((item, idx) => {
            const peak = Math.max(...portfolioData.slice(0, idx + 1).map(p => p.value))
            const drawdown = ((item.value - peak) / peak) * 100
            return {
                date: item.date,
                drawdown
            }
        })
    }, [portfolioData])

    const allocationData = useMemo((): AllocationDataPoint[] => {
        if (!result?.result?.allocation_log) return []
        return Object.entries(result.result.allocation_log).map(([date, allocation]) => ({
            date,
            allocation: allocation as string
        }))
    }, [result])

    const multiStrategyPortfolioData = useMemo(() => {
        if (results.length === 1) {
            return portfolioData
        }

        // Collect all unique dates
        const allDates = new Set<string>()
        results.forEach(r => {
            Object.keys(r.result.portfolio_log).forEach(date => allDates.add(date))
        })

        // Build data points with all strategies
        return Array.from(allDates).sort().map(date => {
            const dataPoint: any = { date }
            results.forEach((r, idx) => {
                dataPoint[`strategy${idx}`] = r.result.portfolio_log[date] || null
            })
            return dataPoint
        })
    }, [results, portfolioData])

    const multiStrategyDrawdownData = useMemo(() => {
        if (results.length === 1) {
            return drawdownData
        }

        // Collect all unique dates
        const allDates = new Set<string>()
        results.forEach(r => {
            Object.keys(r.result.portfolio_log).forEach(date => allDates.add(date))
        })

        // Build drawdown for each strategy
        return Array.from(allDates).sort().map(date => {
            const dataPoint: any = { date }

            results.forEach((r, idx) => {
                const portfolioLog = Object.entries(r.result.portfolio_log)
                    .sort(([a], [b]) => a.localeCompare(b))

                const dateIndex = portfolioLog.findIndex(([d]) => d === date)
                if (dateIndex >= 0) {
                    const currentValue = portfolioLog[dateIndex][1]
                    const peak = Math.max(...portfolioLog.slice(0, dateIndex + 1).map(([, v]) => v as number))
                    const drawdown = ((currentValue - peak) / peak) * 100
                    dataPoint[`strategy${idx}`] = drawdown
                } else {
                    dataPoint[`strategy${idx}`] = null
                }
            })

            return dataPoint
        })
    }, [results, drawdownData])

    return {
        portfolioData,
        returnsData,
        drawdownData,
        allocationData,
        multiStrategyPortfolioData,
        multiStrategyDrawdownData
    }
}
