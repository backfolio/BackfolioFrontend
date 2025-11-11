import { ReactNode, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { BarChart3, Briefcase, FlaskConical, MessageSquare, Settings, LogOut, Menu, X } from 'lucide-react'

interface LayoutProps {
    children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    // Initialize from localStorage, default to false
    const [isExpanded, setIsExpanded] = useState(() => {
        const saved = localStorage.getItem('navbar-expanded')
        return saved === 'true'
    })

    // Persist to localStorage whenever it changes
    const toggleExpanded = () => {
        setIsExpanded(prev => {
            const newValue = !prev
            localStorage.setItem('navbar-expanded', String(newValue))
            return newValue
        })
    }

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const isActivePage = (path: string) => {
        return location.pathname === path
    }

    const navLinks = [
        { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
        { path: '/portfolios', icon: Briefcase, label: 'Portfolios' },
        { path: '/backtest', icon: FlaskConical, label: 'Backtest' },
        { path: '/ai-chat', icon: MessageSquare, label: 'AI Chat' },
    ]

    return (
        <div className="min-h-screen bg-white flex">
            {/* Vertical Sidebar Navigation */}
            <aside className={`${isExpanded ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 fixed left-0 top-0 h-screen flex flex-col transition-all duration-300 ease-in-out overflow-hidden shadow-sm`}>
                {/* Logo and Toggle */}
                <div className="p-4 border-b border-gray-200 flex items-center">
                    {isExpanded ? (
                        <div className="flex items-center justify-between w-full">
                            <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors tracking-tight">
                                Back<span className="bg-gradient-to-r from-primary-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">folio</span>
                            </Link>
                            <button
                                onClick={toggleExpanded}
                                className="p-1 rounded-md hover:bg-gray-100 transition-all duration-200 text-gray-500 hover:text-gray-900"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center w-full space-y-2">
                            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-primary-400 via-purple-400 to-blue-400 bg-clip-text text-transparent hover:from-primary-300 hover:via-purple-300 hover:to-blue-300 transition-all duration-200 ease-in-out">
                                BF
                            </Link>
                            <button
                                onClick={toggleExpanded}
                                className="p-1 rounded-md hover:bg-gray-100 transition-all duration-200 text-gray-500 hover:text-gray-900"
                            >
                                <Menu size={16} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-2 space-y-1">
                    {navLinks.map((link) => {
                        const IconComponent = link.icon
                        const isAIChat = link.path === '/ai-chat'
                        const isActive = isActivePage(link.path)

                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center ${isExpanded ? 'gap-3 px-3' : 'justify-center px-2'} py-3 rounded-lg font-medium transition-all duration-300 ease-in-out relative overflow-hidden group ${isActive && !isAIChat
                                    ? 'text-gray-900 bg-gray-100 border-gray-200 border'
                                    : isAIChat
                                        ? 'text-white bg-gradient-to-br from-violet-500/90 via-purple-600/85 to-fuchsia-500/80 hover:from-violet-600/95 hover:via-purple-700/90 hover:to-fuchsia-600/85 border border-violet-400/60 hover:border-fuchsia-400/70 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 backdrop-blur-sm transform hover:scale-[1.02]'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                title={!isExpanded ? link.label : ''}
                            >
                                {/* Magical glitter effects for AI Chat */}
                                {isAIChat && (
                                    <>
                                        {/* Primary shimmer sweep */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-out" />

                                        {/* Glitter particles */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className="absolute top-2 left-3 w-1 h-1 bg-yellow-300 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                                            <div className="absolute top-4 right-4 w-0.5 h-0.5 bg-cyan-300 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                                            <div className="absolute bottom-3 left-6 w-0.5 h-0.5 bg-pink-300 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
                                            <div className="absolute top-6 left-8 w-0.5 h-0.5 bg-emerald-300 rounded-full animate-pulse" style={{ animationDelay: '600ms' }} />
                                            <div className="absolute bottom-2 right-6 w-1 h-1 bg-amber-300 rounded-full animate-pulse" style={{ animationDelay: '800ms' }} />
                                        </div>

                                        {/* Subtle rainbow edge glow */}
                                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-400/20 via-purple-400/20 to-fuchsia-400/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </>
                                )}

                                <IconComponent
                                    size={20}
                                    className={`transition-all duration-300 ease-in-out relative z-10 ${isAIChat
                                        ? 'text-white drop-shadow-sm group-hover:scale-110 group-hover:rotate-12 group-hover:drop-shadow-md'
                                        : ''
                                        }`}
                                />
                                <span
                                    className={`whitespace-nowrap tracking-tight transition-all duration-300 ease-in-out relative z-10 ${isExpanded
                                        ? 'opacity-100 translate-x-0 max-w-full'
                                        : 'opacity-0 -translate-x-2 max-w-0 overflow-hidden'
                                        } ${isAIChat ? 'font-bold text-white drop-shadow-sm' : ''}`}
                                >
                                    {link.label}
                                    {isAIChat && isExpanded && (
                                        <span className="ml-2 inline-flex items-center">
                                            <span className="text-xs text-yellow-200 font-medium tracking-wide animate-pulse">✨</span>
                                            <span className="ml-1 text-xs text-cyan-200 font-medium animate-pulse" style={{ animationDelay: '500ms' }}>✦</span>
                                        </span>
                                    )}
                                </span>
                            </Link>
                        )
                    })}
                </nav>

                {/* User Section at Bottom */}
                <div className="p-2 border-t border-gray-200">
                    {/* Settings Link */}
                    <Link
                        to="/settings"
                        className={`flex items-center ${isExpanded ? 'gap-3 px-3' : 'justify-center px-2'} py-3 rounded-lg transition-all duration-300 ease-in-out font-medium mb-2 ${isActivePage('/settings')
                            ? 'text-gray-900 bg-gray-100 border-gray-200 border'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        title={!isExpanded ? 'Settings' : ''}
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm transition-all duration-300 ease-in-out flex-shrink-0">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>

                        <div className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${isExpanded
                            ? 'opacity-100 translate-x-0 max-w-full'
                            : 'opacity-0 -translate-x-2 max-w-0 overflow-hidden'
                            }`}>
                            <p className={`text-sm font-bold tracking-tight truncate transition-all duration-300 ease-in-out ${isActivePage('/settings') ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                {user?.email}
                            </p>
                            <p className={`text-xs font-semibold tracking-tight transition-all duration-300 ease-in-out ${isActivePage('/settings') ? 'text-gray-500' : 'text-gray-500'
                                }`}>
                                Professional
                            </p>
                        </div>

                        <Settings
                            size={16}
                            className={`transition-all duration-300 ease-in-out ${isExpanded
                                ? `opacity-100 translate-x-0 ${isActivePage('/settings') ? 'text-gray-500' : 'text-gray-400'}`
                                : 'opacity-0 -translate-x-2 max-w-0 overflow-hidden'
                                }`}
                        />
                    </Link>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className={`bg-gray-50 border border-gray-200 hover:border-gray-300 hover:bg-gray-100 rounded-lg w-full py-2 text-sm font-semibold tracking-tight text-gray-600 hover:text-gray-900 flex items-center justify-center transition-all duration-300 ease-in-out ${isExpanded ? 'gap-2' : ''}`}
                        title={!isExpanded ? 'Sign Out' : ''}
                    >
                        <LogOut size={16} className="transition-transform duration-200 ease-in-out" />
                        <span
                            className={`transition-all duration-300 ease-in-out ${isExpanded
                                ? 'opacity-100 translate-x-0 max-w-full'
                                : 'opacity-0 -translate-x-2 max-w-0 overflow-hidden'
                                }`}
                        >
                            Sign Out
                        </span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={`flex-1 ${isExpanded ? 'ml-64' : 'ml-16'} p-8 bg-white transition-all duration-300 ease-in-out relative`}>
                {children}
            </main>
        </div>
    )
}

export default Layout