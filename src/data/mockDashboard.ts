import { DashboardData, DeployedStrategy, Alert, PerformanceMetrics } from '../types/dashboard'

// Mock deployed strategies
const mockDeployedStrategies: DeployedStrategy[] = [
    {
        id: '1',
        name: 'Defensive Momentum',
        status: 'healthy',
        ytdReturn: 12.3,
        backtestProjection: 11.5,
        lastAlertDate: '2025-11-13',
        alertsTriggered: 12,
        alertsExecuted: 10,
        alertsIgnored: 2,
        currentAllocation: [
            { symbol: 'TLT', percentage: 40, name: 'Bonds' },
            { symbol: 'GLD', percentage: 30, name: 'Gold' },
            { symbol: 'CASH', percentage: 30, name: 'Cash' }
        ],
        deployedDate: '2025-11-10',
        nextCheckTime: 'Today 4:00 PM ET'
    },
    {
        id: '2',
        name: 'Growth Rotation',
        status: 'alert',
        ytdReturn: 15.7,
        backtestProjection: 16.2,
        lastAlertDate: '2025-11-14',
        alertsTriggered: 15,
        alertsExecuted: 12,
        alertsIgnored: 3,
        currentAllocation: [
            { symbol: 'SPY', percentage: 60, name: 'S&P 500' },
            { symbol: 'QQQ', percentage: 40, name: 'Nasdaq' }
        ],
        deployedDate: '2025-11-08',
        nextCheckTime: 'Today 4:00 PM ET'
    }
]

// Mock recent alerts
const mockAlerts: Alert[] = [
    {
        id: '1',
        strategyId: '2',
        strategyName: 'Growth Rotation',
        type: 'warning',
        title: 'Defensive Momentum triggered - Switch to bonds',
        message: 'RSI dropped below 30',
        timestamp: '2025-11-14T14:00:00Z',
        triggerReason: 'RSI dropped below 30',
        newAllocation: [
            { symbol: 'TLT', percentage: 40, name: 'Bonds' },
            { symbol: 'GLD', percentage: 30, name: 'Gold' },
            { symbol: 'CASH', percentage: 30, name: 'Cash' }
        ],
        actions: [
            { label: 'View Full Details', variant: 'primary' },
            { label: 'Mark Executed', variant: 'secondary' },
            { label: 'Ignore', variant: 'ghost' }
        ]
    },
    {
        id: '2',
        strategyId: '2',
        strategyName: 'Growth Rotation',
        type: 'success',
        title: 'Growth Rotation rebalanced successfully',
        message: 'Monthly rebalance completed',
        timestamp: '2025-11-12T09:00:00Z',
        performanceSinceLastRebalance: 2.1
    },
    {
        id: '3',
        strategyId: '',
        strategyName: '',
        type: 'upgrade',
        title: 'Upgrade to Premium for AI-powered alert commentary',
        message: 'Get market context, confidence scores, and alternatives with every alert. Know WHY signals trigger.',
        timestamp: '2025-11-14T12:00:00Z',
        actions: [
            { label: 'See Example', variant: 'secondary' },
            { label: 'Upgrade Now', variant: 'primary' }
        ]
    }
]

// Mock performance metrics
const mockPerformanceMetrics: PerformanceMetrics = {
    last30Days: 8.2,
    vsBacktest: 0.8,
    ytd: 15.7,
    alertsTriggered: 15,
    alertsExecuted: 12,
    executionRate: 80,
    avgResponseTimeHours: 4
}

// Mock dashboard data for Pro user with deployed strategies
export const mockDashboardDataPro: DashboardData = {
    userTier: 'pro',
    deployedStrategies: mockDeployedStrategies,
    recentAlerts: mockAlerts,
    performanceMetrics: mockPerformanceMetrics,
    maxStrategies: 1
}

// Mock dashboard data for Free user (empty state)
export const mockDashboardDataFree: DashboardData = {
    userTier: 'free',
    deployedStrategies: [],
    recentAlerts: [],
    maxStrategies: 0
}

// Mock dashboard data for Premium user
export const mockDashboardDataPremium: DashboardData = {
    userTier: 'premium',
    deployedStrategies: mockDeployedStrategies,
    recentAlerts: mockAlerts,
    performanceMetrics: mockPerformanceMetrics,
    maxStrategies: 3
}
