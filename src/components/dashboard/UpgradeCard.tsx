import { UserTier } from '../../types/dashboard'
import { useTheme } from '../../context/ThemeContext'

interface UpgradeCardProps {
    userTier: UserTier
    deployedCount: number
    maxStrategies: number
}

export const UpgradeCard = ({ userTier, deployedCount, maxStrategies }: UpgradeCardProps) => {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    if (userTier === 'premium' || deployedCount < maxStrategies) {
        return null
    }

    const upgradeContent = {
        free: {
            title: 'Upgrade to Pro',
            subtitle: 'Start deploying strategies',
            features: [
                'Deploy 1 strategy',
                'Email alerts',
                'Performance tracking',
                '30-day alert history'
            ],
            price: '$29/mo',
            cta: 'Start Pro Trial'
        },
        pro: {
            title: 'Upgrade to Premium',
            subtitle: `You've reached your limit (${deployedCount}/${maxStrategies})`,
            features: [
                'Deploy up to 3 strategies',
                'SMS + Email alerts',
                'AI-powered commentary',
                'Unlimited alert history'
            ],
            price: '$49/mo',
            cta: 'Upgrade to Premium'
        }
    }

    const content = upgradeContent[userTier as 'free' | 'pro']

    return (
        <div className={`backdrop-blur-2xl rounded-lg p-6 transition-all duration-300 border-2 ${isDark
            ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30'
            : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
            }`}>
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-200 text-purple-700'
                        }`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    </div>
                    <h3 className={`text-lg font-semibold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                        {content.title}
                    </h3>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {content.subtitle}
                </p>
            </div>

            <div className="mb-6">
                <ul className="space-y-2.5">
                    {content.features.map((feature, idx) => (
                        <li key={idx} className={`text-sm flex items-center gap-2.5 ${isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            <svg className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10">
                <div className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'
                    }`}>
                    {content.price}
                </div>
                <button className={`py-2.5 px-5 rounded-lg text-sm font-medium transition-all duration-200 ${isDark
                    ? 'bg-purple-500 text-white hover:bg-purple-600'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}>
                    {content.cta}
                </button>
            </div>
        </div>
    )
}
