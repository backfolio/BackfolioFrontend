import React from 'react'

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
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        hoverBg: 'group-hover:bg-emerald-100',
        iconText: 'text-emerald-600',
        badgeBg: 'bg-emerald-100',
        badgeText: 'text-emerald-700',
        badgeBorder: 'border-emerald-200',
        valueText: 'text-emerald-600'
    },
    blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        hoverBg: 'group-hover:bg-blue-100',
        iconText: 'text-blue-600',
        badgeBg: 'bg-blue-100',
        badgeText: 'text-blue-700',
        badgeBorder: 'border-blue-200',
        valueText: 'text-blue-600'
    },
    purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        hoverBg: 'group-hover:bg-purple-100',
        iconText: 'text-purple-600',
        badgeBg: 'bg-purple-100',
        badgeText: 'text-purple-700',
        badgeBorder: 'border-purple-200',
        valueText: 'text-purple-600'
    },
    red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        hoverBg: 'group-hover:bg-red-100',
        iconText: 'text-red-600',
        badgeBg: 'bg-red-100',
        badgeText: 'text-red-700',
        badgeBorder: 'border-red-200',
        valueText: 'text-red-600'
    },
    amber: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        hoverBg: 'group-hover:bg-amber-100',
        iconText: 'text-amber-600',
        badgeBg: 'bg-amber-100',
        badgeText: 'text-amber-700',
        badgeBorder: 'border-amber-200',
        valueText: 'text-amber-600'
    },
    cyan: {
        bg: 'bg-cyan-50',
        border: 'border-cyan-200',
        hoverBg: 'group-hover:bg-cyan-100',
        iconText: 'text-cyan-600',
        badgeBg: 'bg-cyan-100',
        badgeText: 'text-cyan-700',
        badgeBorder: 'border-cyan-200',
        valueText: 'text-cyan-600'
    },
    indigo: {
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        hoverBg: 'group-hover:bg-indigo-100',
        iconText: 'text-indigo-600',
        badgeBg: 'bg-indigo-100',
        badgeText: 'text-indigo-700',
        badgeBorder: 'border-indigo-200',
        valueText: 'text-indigo-600'
    },
    gray: {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        hoverBg: 'group-hover:bg-gray-100',
        iconText: 'text-gray-600',
        badgeBg: 'bg-gray-100',
        badgeText: 'text-gray-700',
        badgeBorder: 'border-gray-200',
        valueText: 'text-gray-900'
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
    const iconColors = colorClasses[badgeColor]
    const badgeColors = colorClasses[badgeColor]
    const valueColors = colorClasses[valueColor]

    return (
        <div className="group bg-white backdrop-blur-xl border border-gray-200 hover:border-gray-300 rounded-2xl p-6 transition-all duration-500 hover:shadow-md">
            <div className="flex items-start justify-between mb-4">
                <div className={`flex items-center justify-center w-11 h-11 ${iconColors.bg} border ${iconColors.border} rounded-xl ${iconColors.hoverBg} transition-all duration-300`}>
                    {icon}
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${badgeColors.badgeBg} ${badgeColors.badgeText} border ${badgeColors.badgeBorder}`}>
                    {badge}
                </span>
            </div>
            <div className="text-sm text-gray-600 font-medium mb-2">{label}</div>
            <div className={`text-3xl font-bold tracking-tight ${valueColors.valueText}`}>
                {value}
            </div>
        </div>
    )
}
