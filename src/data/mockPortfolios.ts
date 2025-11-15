export type UserTier = 'free' | 'pro' | 'premium'

export interface DeployedStrategy {
    id: string
    name: string
    status: 'active' | 'paused' | 'alert'
    lastAlert: string
    ytdPerformance: number
    backtestProjection: number
    alertsTriggered: number
    alertsExecuted: number
    alertsIgnored: number
    nextCheck: string
    currentAllocation: {
        symbol: string
        name: string
        percentage: number
        color: string
    }[]
    deployedDate: string
    runningDays: number
}

export interface SavedBacktest {
    id: string
    name: string
    version: number
    timestamp: string
    totalReturn: number
    sharpeRatio: number
    maxDrawdown: number
    rules: string
    isDeployed: boolean
    riskLevel: 'aggressive' | 'defensive' | 'balanced'
}

export interface ComparisonStrategy {
    id: string
    name: string
    type: 'backtest' | 'benchmark'
    metrics: {
        totalReturn: number
        cagr: number
        sharpeRatio: number
        maxDrawdown: number
        volatility: number
        winRate: number | null
        numberOfTrades: number | null
        avgTrade: number | null
        bestMonth: number
        worstMonth: number
    }
}

export interface PortfolioData {
    userTier: UserTier
    maxDeployedStrategies: number
    deployedStrategies: DeployedStrategy[]
    savedBacktests: SavedBacktest[]
    comparisonStrategies: ComparisonStrategy[]
}

export const mockPortfolioData: PortfolioData = {
    userTier: 'pro',
    maxDeployedStrategies: 1,
    deployedStrategies: [
        {
            id: 'deployed-1',
            name: 'Defensive Momentum Strategy',
            status: 'active',
            lastAlert: '2 days ago',
            ytdPerformance: 12.3,
            backtestProjection: 11.8,
            alertsTriggered: 12,
            alertsExecuted: 10,
            alertsIgnored: 2,
            nextCheck: 'Today 4:00 PM ET',
            currentAllocation: [
                { symbol: 'TLT', name: 'Bonds', percentage: 40, color: 'bg-blue-500' },
                { symbol: 'GLD', name: 'Gold', percentage: 30, color: 'bg-yellow-500' },
                { symbol: 'CASH', name: 'Cash', percentage: 30, color: 'bg-gray-400' },
            ],
            deployedDate: 'Nov 10, 2025',
            runningDays: 5,
        },
    ],
    savedBacktests: [
        {
            id: 'backtest-1',
            name: 'Aggressive Growth',
            version: 3,
            timestamp: 'Nov 14, 2:34 PM',
            totalReturn: 18.2,
            sharpeRatio: 1.42,
            maxDrawdown: -12,
            rules: 'RSI > 70 → switch to defensive',
            isDeployed: false,
            riskLevel: 'aggressive',
        },
        {
            id: 'backtest-2',
            name: 'Defensive Momentum',
            version: 2,
            timestamp: 'Nov 12, 10:15 AM',
            totalReturn: 11.8,
            sharpeRatio: 1.28,
            maxDrawdown: -8,
            rules: 'RSI < 30 → switch to bonds',
            isDeployed: true,
            riskLevel: 'defensive',
        },
        {
            id: 'backtest-3',
            name: 'Balanced Rotation',
            version: 1,
            timestamp: 'Nov 10, 4:22 PM',
            totalReturn: 9.3,
            sharpeRatio: 1.05,
            maxDrawdown: -10,
            rules: 'Monthly rebalance + SMA crossover',
            isDeployed: false,
            riskLevel: 'balanced',
        },
        {
            id: 'backtest-4',
            name: 'High Momentum',
            version: 1,
            timestamp: 'Nov 8, 11:30 AM',
            totalReturn: 22.5,
            sharpeRatio: 0.98,
            maxDrawdown: -18,
            rules: 'Momentum rank > 80th percentile',
            isDeployed: false,
            riskLevel: 'aggressive',
        },
        {
            id: 'backtest-5',
            name: 'Conservative Income',
            version: 2,
            timestamp: 'Nov 6, 3:15 PM',
            totalReturn: 7.8,
            sharpeRatio: 1.15,
            maxDrawdown: -6,
            rules: 'Dividend yield > 3% + low volatility filter',
            isDeployed: false,
            riskLevel: 'defensive',
        },
        {
            id: 'backtest-6',
            name: 'Sector Rotation Pro',
            version: 1,
            timestamp: 'Nov 4, 9:45 AM',
            totalReturn: 14.5,
            sharpeRatio: 1.22,
            maxDrawdown: -11,
            rules: 'Quarterly sector strength rebalance',
            isDeployed: false,
            riskLevel: 'balanced',
        },
        {
            id: 'backtest-7',
            name: 'Volatility Breakout',
            version: 4,
            timestamp: 'Nov 2, 1:20 PM',
            totalReturn: 25.3,
            sharpeRatio: 0.89,
            maxDrawdown: -22,
            rules: 'VIX spike detection with mean reversion',
            isDeployed: false,
            riskLevel: 'aggressive',
        },
        {
            id: 'backtest-8',
            name: 'All Weather Portfolio',
            version: 1,
            timestamp: 'Oct 30, 5:30 PM',
            totalReturn: 8.5,
            sharpeRatio: 1.08,
            maxDrawdown: -7,
            rules: 'Risk parity across asset classes',
            isDeployed: false,
            riskLevel: 'defensive',
        },
    ],
    comparisonStrategies: [
        {
            id: 'comp-1',
            name: 'Defensive Momentum',
            type: 'backtest',
            metrics: {
                totalReturn: 11.8,
                cagr: 9.2,
                sharpeRatio: 1.28,
                maxDrawdown: -8,
                volatility: 8.5,
                winRate: 68,
                numberOfTrades: 24,
                avgTrade: 2.1,
                bestMonth: 8.2,
                worstMonth: -5.1,
            },
        },
        {
            id: 'comp-2',
            name: 'Aggressive Growth',
            type: 'backtest',
            metrics: {
                totalReturn: 18.2,
                cagr: 13.8,
                sharpeRatio: 1.42,
                maxDrawdown: -12,
                volatility: 12.3,
                winRate: 72,
                numberOfTrades: 36,
                avgTrade: 3.4,
                bestMonth: 12.5,
                worstMonth: -8.2,
            },
        },
        {
            id: 'comp-3',
            name: 'SPY Buy & Hold',
            type: 'benchmark',
            metrics: {
                totalReturn: 15.1,
                cagr: 11.5,
                sharpeRatio: 0.98,
                maxDrawdown: -18,
                volatility: 15.2,
                winRate: null,
                numberOfTrades: null,
                avgTrade: null,
                bestMonth: 10.8,
                worstMonth: -12.5,
            },
        },
    ],
}

export const mockPortfolioDataPremium: PortfolioData = {
    userTier: 'premium',
    maxDeployedStrategies: 3,
    deployedStrategies: [
        {
            id: 'deployed-1',
            name: 'Defensive Momentum Strategy',
            status: 'active',
            lastAlert: '2 days ago',
            ytdPerformance: 12.3,
            backtestProjection: 11.8,
            alertsTriggered: 12,
            alertsExecuted: 10,
            alertsIgnored: 2,
            nextCheck: 'Today 4:00 PM ET',
            currentAllocation: [
                { symbol: 'TLT', name: 'Bonds', percentage: 40, color: 'bg-blue-500' },
                { symbol: 'GLD', name: 'Gold', percentage: 30, color: 'bg-yellow-500' },
                { symbol: 'CASH', name: 'Cash', percentage: 30, color: 'bg-gray-400' },
            ],
            deployedDate: 'Nov 10, 2025',
            runningDays: 5,
        },
        {
            id: 'deployed-2',
            name: 'Growth Rotation',
            status: 'alert',
            lastAlert: 'Just now',
            ytdPerformance: 15.7,
            backtestProjection: 14.2,
            alertsTriggered: 8,
            alertsExecuted: 8,
            alertsIgnored: 0,
            nextCheck: 'Alert Pending',
            currentAllocation: [
                { symbol: 'QQQ', name: 'Tech', percentage: 60, color: 'bg-purple-500' },
                { symbol: 'SPY', name: 'S&P 500', percentage: 40, color: 'bg-green-500' },
            ],
            deployedDate: 'Nov 8, 2025',
            runningDays: 7,
        },
    ],
    savedBacktests: mockPortfolioData.savedBacktests,
    comparisonStrategies: mockPortfolioData.comparisonStrategies,
}
