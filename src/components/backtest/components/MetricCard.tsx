import React from 'react'
import { useTheme } from '../../../context/ThemeContext'

interface MetricCardProps {
    icon: React.ReactNode
    label: string
    value: string
    badge: string
    badgeColor: 'emerald' | 'blue' | 'purple' | 'red' | 'amber' | 'cyan' | 'indigo'
    valueColor: 'emerald' | 'blue' | 'purple' | 'red' | 'amber' | 'cyan' | 'indigo' | 'gray'
}

const colorClasses = {
    emerald: {
        light: {
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            hoverBg: 'group-hover:bg-emerald-100',
            iconText: 'text-emerald-600',
            badgeBg: 'bg-emerald-100',
            badgeText: 'text-emerald-700',
            badgeBorder: 'border-emerald-200',
            valueText: 'text-emerald-600'
        },
        dark: {
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/30',
            hoverBg: 'group-hover:bg-emerald-500/15',
            iconText: 'text-emerald-400',
            badgeBg: 'bg-emerald-500/20',
            badgeText: 'text-emerald-300',
            badgeBorder: 'border-emerald-500/30',
            valueText: 'text-emerald-400'
        }
    },
    blue: {
        light: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            hoverBg: 'group-hover:bg-blue-100',
            iconText: 'text-blue-600',
            badgeBg: 'bg-blue-100',
            badgeText: 'text-blue-700',
            badgeBorder: 'border-blue-200',
            valueText: 'text-blue-600'
        },
        dark: {
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/30',
            hoverBg: 'group-hover:bg-blue-500/15',
            iconText: 'text-blue-400',
            badgeBg: 'bg-blue-500/20',
            badgeText: 'text-blue-300',
            badgeBorder: 'border-blue-500/30',
            valueText: 'text-blue-400'
        }
    },
    purple: {
        light: {
            bg: 'bg-purple-50',
            border: 'border-purple-200',
            hoverBg: 'group-hover:bg-purple-100',
            iconText: 'text-purple-600',
            badgeBg: 'bg-purple-100',
            badgeText: 'text-purple-700',
            badgeBorder: 'border-purple-200',
            valueText: 'text-purple-600'
        },
        dark: {
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/30',
            hoverBg: 'group-hover:bg-purple-500/15',
            iconText: 'text-purple-400',
            badgeBg: 'bg-purple-500/20',
            badgeText: 'text-purple-300',
            badgeBorder: 'border-purple-500/30',
            valueText: 'text-purple-400'
        }
    },
    red: {
        light: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            hoverBg: 'group-hover:bg-red-100',
            iconText: 'text-red-600',
            badgeBg: 'bg-red-100',
            badgeText: 'text-red-700',
            badgeBorder: 'border-red-200',
            valueText: 'text-red-600'
        },
        dark: {
            bg: 'bg-red-500/10',
            border: 'border-red-500/30',
            hoverBg: 'group-hover:bg-red-500/15',
            iconText: 'text-red-400',
            badgeBg: 'bg-red-500/20',
            badgeText: 'text-red-300',
            badgeBorder: 'border-red-500/30',
            valueText: 'text-red-400'
        }
    },
    amber: {
        light: {
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            hoverBg: 'group-hover:bg-amber-100',
            iconText: 'text-amber-600',
            badgeBg: 'bg-amber-100',
            badgeText: 'text-amber-700',
            badgeBorder: 'border-amber-200',
            valueText: 'text-amber-600'
        },
        dark: {
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/30',
            hoverBg: 'group-hover:bg-amber-500/15',
            iconText: 'text-amber-400',
            badgeBg: 'bg-amber-500/20',
            badgeText: 'text-amber-300',
            badgeBorder: 'border-amber-500/30',
            valueText: 'text-amber-400'
        }
    },
    cyan: {
        light: {
            bg: 'bg-cyan-50',
            border: 'border-cyan-200',
            hoverBg: 'group-hover:bg-cyan-100',
            iconText: 'text-cyan-600',
            badgeBg: 'bg-cyan-100',
            badgeText: 'text-cyan-700',
            badgeBorder: 'border-cyan-200',
            valueText: 'text-cyan-600'
        },
        dark: {
            bg: 'bg-cyan-500/10',
            border: 'border-cyan-500/30',
            hoverBg: 'group-hover:bg-cyan-500/15',
            iconText: 'text-cyan-400',
            badgeBg: 'bg-cyan-500/20',
            badgeText: 'text-cyan-300',
            badgeBorder: 'border-cyan-500/30',
            valueText: 'text-cyan-400'
        }
    },
    indigo: {
        light: {
            bg: 'bg-indigo-50',
            border: 'border-indigo-200',
            hoverBg: 'group-hover:bg-indigo-100',
            iconText: 'text-indigo-600',
            badgeBg: 'bg-indigo-100',
            badgeText: 'text-indigo-700',
            badgeBorder: 'border-indigo-200',
            valueText: 'text-indigo-600'
        },
        dark: {
            bg: 'bg-indigo-500/10',
            border: 'border-indigo-500/30',
            hoverBg: 'group-hover:bg-indigo-500/15',
            iconText: 'text-indigo-400',
            badgeBg: 'bg-indigo-500/20',
            badgeText: 'text-indigo-300',
            badgeBorder: 'border-indigo-500/30',
            valueText: 'text-indigo-400'
        }
    },
    gray: {
        light: {
            bg: 'bg-gray-50',
            border: 'border-gray-200',
            hoverBg: 'group-hover:bg-gray-100',
            iconText: 'text-gray-600',
            badgeBg: 'bg-gray-100',
            badgeText: 'text-gray-700',
            badgeBorder: 'border-gray-200',
            valueText: 'text-gray-900'
        },
        dark: {
            bg: 'bg-white/[0.05]',
            border: 'border-white/[0.1]',
            hoverBg: 'group-hover:bg-white/[0.08]',
            iconText: 'text-gray-400',
            badgeBg: 'bg-white/[0.1]',
            badgeText: 'text-gray-300',
            badgeBorder: 'border-white/[0.15]',
            valueText: 'text-white'
        }
    }
}

export const MetricCard: React.FC<MetricCardProps> = ({
    icon,
    label,
    value,
    badge,
    badgeColor,
    valueColor
}) => {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    const iconColors = colorClasses[badgeColor][isDark ? 'dark' : 'light']
    const badgeColors = colorClasses[badgeColor][isDark ? 'dark' : 'light']
    const valueColors = colorClasses[valueColor][isDark ? 'dark' : 'light']

    return (
        <div className={`group backdrop-blur-xl border transition-all duration-500 rounded-2xl p-6 ${isDark
                ? 'bg-white/[0.02] border-white/[0.15] hover:border-white/[0.25] hover:shadow-lg hover:shadow-purple-500/10'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}>
            <div className="flex items-start justify-between mb-4">
                <div className={`flex items-center justify-center w-11 h-11 ${iconColors.bg} border ${iconColors.border} rounded-xl ${iconColors.hoverBg} transition-all duration-300`}>
                    {icon}
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${badgeColors.badgeBg} ${badgeColors.badgeText} border ${badgeColors.badgeBorder}`}>
                    {badge}
                </span>
            </div>
            <div className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</div>
            <div className={`text-3xl font-bold tracking-tight ${valueColors.valueText}`}>
                {value}
            </div>
        </div>
    )
}
