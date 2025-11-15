import { ReactNode } from 'react'
import { useTheme } from '../context/ThemeContext'

interface LayoutProps {
    children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    return (
        <div className={`min-h-screen relative ${isDark ? 'bg-black' : 'bg-white'}`}>
            {/* Subtle grid overlay for dark mode - clean and minimal */}
            {isDark && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
                </div>
            )}

            {/* Main Content Area - Full Width */}
            <main className="w-full min-h-screen relative z-10">
                {children}
            </main>
        </div>
    )
}

export default Layout