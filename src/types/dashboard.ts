export type StrategyStatus = 'healthy' | 'alert' | 'paused'
export type AlertType = 'warning' | 'success' | 'info' | 'upgrade'
export type UserTier = 'free' | 'pro' | 'premium'

export interface Allocation {
    symbol: string
    percentage: number
    name: string
}

export interface DeployedStrategy {
    id: string
    name: string
    status: StrategyStatus
    ytdReturn: number
    backtestProjection: number
    lastAlertDate: string
    alertsTriggered: number
    alertsExecuted: number
    alertsIgnored: number
    currentAllocation: Allocation[]
    deployedDate: string
    nextCheckTime: string
}

export interface Alert {
    id: string
    strategyId: string
    strategyName: string
    type: AlertType
    title: string
    message: string
    timestamp: string
    triggerReason?: string
    newAllocation?: Allocation[]
    performanceSinceLastRebalance?: number
    actions?: Array<{
        label: string
        variant: 'primary' | 'secondary' | 'ghost'
    }>
}

export interface PerformanceMetrics {
    last30Days: number
    vsBacktest: number
    ytd: number
    alertsTriggered: number
    alertsExecuted: number
    executionRate: number
    avgResponseTimeHours: number
}

export interface DashboardData {
    userTier: UserTier
    deployedStrategies: DeployedStrategy[]
    recentAlerts: Alert[]
    performanceMetrics?: PerformanceMetrics
    maxStrategies: number
}
