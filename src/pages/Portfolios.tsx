import Layout from '../components/Layout'
import { NavigationMenu } from '../components/NavigationMenu'
import { useTheme } from '../context/ThemeContext'

const Portfolios = () => {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    return (
        <Layout>
            <NavigationMenu />
            <div className="max-w-6xl mx-auto p-8">
                <div className={`backdrop-blur-2xl rounded-3xl p-12 text-center shadow-[0_0_50px_rgba(255,255,255,0.06)] ${isDark ? 'bg-white/[0.02] border border-white/[0.15]' : 'bg-white border border-gray-200'}`}>
                    <div className="text-6xl mb-6">💼</div>
                    <h1 className={`text-4xl md:text-5xl font-bold mb-4 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Hello - Portfolios Page
                    </h1>
                    <p className={`text-xl font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Coming soon: Manage and track your investment portfolios
                    </p>
                </div>
            </div>
        </Layout>
    )
}

export default Portfolios
