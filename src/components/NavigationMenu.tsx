import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

interface NavigationMenuProps {
    isCollapsed?: boolean
    setIsCollapsed?: (collapsed: boolean) => void
}

export const NavigationMenu = ({ isCollapsed: externalIsCollapsed, setIsCollapsed: externalSetIsCollapsed }: NavigationMenuProps = {}) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, logout } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const isDark = theme === 'dark'
    const [internalIsCollapsed, setInternalIsCollapsed] = useState(false)
    const [showMobileMenu, setShowMobileMenu] = useState(false)

    // Use external state if provided, otherwise use internal state
    const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed
    const setIsCollapsed = externalSetIsCollapsed || setInternalIsCollapsed

    return (
        <>
            {/* Mobile Hamburger Button (< 1024px) - Fixed but with proper z-index */}
            <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className={`lg:hidden fixed top-4 left-4 z-50 p-3 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl border transition-all hover:scale-105 ${isDark
                    ? 'bg-black/80 border-white/[0.15] hover:bg-black/90 hover:shadow-purple-500/20'
                    : 'bg-white/95 border-slate-200/50 hover:bg-white'
                    }`}
                title="Menu"
            >
                <svg className={`w-5 h-5 ${isDark ? 'text-white' : 'text-slate-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Mobile Menu Panel */}
            {showMobileMenu && (
                <>
                    <div
                        className={`lg:hidden fixed inset-0 z-40 backdrop-blur-sm ${isDark ? 'bg-black/40' : 'bg-black/20'}`}
                        onClick={() => setShowMobileMenu(false)}
                    />
                    <div className={`lg:hidden fixed left-4 top-4 w-80 rounded-2xl shadow-2xl z-50 border ${isDark
                        ? 'bg-black/95 backdrop-blur-xl border-white/[0.15]'
                        : 'bg-white border-slate-200/50'
                        }`}>
                        <div className="p-6">
                            <div className={`flex items-center justify-between mb-6 pb-4 border-b ${isDark ? 'border-white/[0.1]' : 'border-slate-200'
                                }`}>
                                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Back<span className="bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">folio</span>
                                </div>
                                <button
                                    onClick={() => setShowMobileMenu(false)}
                                    className={`p-1.5 rounded-lg transition-all ${isDark
                                        ? 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Navigation Links */}
                            <div className="space-y-1 mb-6">
                                <button
                                    onClick={() => {
                                        if (!user) {
                                            navigate(`/login?redirect=/dashboard`)
                                        } else {
                                            navigate('/dashboard')
                                        }
                                        setShowMobileMenu(false)
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${location.pathname === '/dashboard'
                                        ? isDark
                                            ? 'bg-purple-500/20 text-white border border-purple-500/30'
                                            : 'bg-slate-100 text-slate-900'
                                        : isDark
                                            ? 'text-gray-300 hover:bg-white/[0.05] hover:text-white'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <span className="text-sm">Dashboard</span>
                                </button>

                                <button
                                    onClick={() => {
                                        if (!user) {
                                            navigate(`/login?redirect=/portfolios`)
                                        } else {
                                            navigate('/portfolios')
                                        }
                                        setShowMobileMenu(false)
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${location.pathname === '/portfolios'
                                        ? isDark
                                            ? 'bg-purple-500/20 text-white border border-purple-500/30'
                                            : 'bg-slate-100 text-slate-900'
                                        : isDark
                                            ? 'text-gray-300 hover:bg-white/[0.05] hover:text-white'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-sm">Portfolios</span>
                                </button>

                                <button
                                    onClick={() => {
                                        navigate('/backtest')
                                        setShowMobileMenu(false)
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${location.pathname === '/backtest'
                                        ? isDark
                                            ? 'bg-purple-500/20 text-white border border-purple-500/30'
                                            : 'bg-slate-100 text-slate-900'
                                        : isDark
                                            ? 'text-gray-300 hover:bg-white/[0.05] hover:text-white'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                    <span className="text-sm">Backtest</span>
                                </button>

                                <button
                                    onClick={() => {
                                        navigate('/ai-chat')
                                        setShowMobileMenu(false)
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${location.pathname === '/ai-chat'
                                        ? isDark
                                            ? 'bg-purple-500/20 text-white border border-purple-500/30'
                                            : 'bg-slate-100 text-slate-900'
                                        : isDark
                                            ? 'text-gray-300 hover:bg-white/[0.05] hover:text-white'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                    <span className="text-sm">AI Chat</span>
                                </button>
                            </div>

                            {/* Divider */}
                            <div className={`border-t my-4 ${isDark ? 'border-white/[0.1]' : 'border-slate-200'}`} />

                            {/* Theme Toggle */}
                            <div className={`flex items-center justify-between px-4 py-3 rounded-lg mb-3 ${isDark ? 'bg-white/[0.02]' : 'bg-slate-50'
                                }`}>
                                <div className="flex items-center gap-3">
                                    <svg className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                    <div>
                                        <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            Theme
                                        </div>
                                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                                            {isDark ? 'Dark mode' : 'Light mode'}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleTheme}
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${isDark ? 'bg-purple-500' : 'bg-slate-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${isDark ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Divider */}
                            <div className={`border-t my-4 ${isDark ? 'border-white/[0.1]' : 'border-slate-200'}`} />

                            {/* User Section */}
                            <div className="space-y-2">
                                {user ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                navigate('/settings')
                                                setShowMobileMenu(false)
                                            }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${location.pathname === '/settings'
                                                ? isDark
                                                    ? 'bg-purple-500/20 border border-purple-500/30'
                                                    : 'bg-slate-100'
                                                : isDark
                                                    ? 'bg-white/[0.05] hover:bg-white/[0.1]'
                                                    : 'bg-slate-50 hover:bg-slate-100'
                                                }`}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                {user.email?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <div className="flex-1 min-w-0 text-left">
                                                <div className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'
                                                    }`}>
                                                    {user.email}
                                                </div>
                                                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                                                    View settings
                                                </div>
                                            </div>
                                            <svg className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>

                                        <button
                                            onClick={() => {
                                                logout()
                                                navigate('/')
                                            }}
                                            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all text-sm font-semibold ${isDark
                                                ? 'bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 hover:text-white border border-white/[0.1]'
                                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                                }`}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => {
                                            navigate('/login')
                                            setShowMobileMenu(false)
                                        }}
                                        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all text-sm font-semibold ${isDark
                                            ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/25'
                                            : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg'
                                            }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        Sign In
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Desktop Sidebar (>= 1024px) */}
            <aside
                className={`hidden lg:flex fixed left-0 top-0 h-full z-30 flex-col border-r transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'
                    } ${isDark
                        ? 'bg-black/95 backdrop-blur-xl border-white/[0.15]'
                        : 'bg-white border-slate-200/50'
                    }`}
            >
                {/* Header with Logo & Collapse Button */}
                <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-white/[0.1]' : 'border-slate-200'
                    }`}>
                    {isCollapsed ? (
                        <div className="flex flex-col items-center w-full gap-3">
                            {/* Compact Logo */}
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg ${isDark ? 'shadow-purple-500/20' : 'shadow-purple-500/30'}`}>
                                <span className="text-white font-bold text-lg">BF</span>
                            </div>
                            {/* Collapse Button */}
                            <button
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className={`p-2 rounded-lg transition-all ${isDark
                                    ? 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                                    }`}
                                title="Expand sidebar"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Back<span className="bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">folio</span>
                            </div>
                            <button
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className={`p-2 rounded-lg transition-all ${isDark
                                    ? 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                                    }`}
                                title="Collapse sidebar"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    <button
                        onClick={() => {
                            if (!user) {
                                navigate(`/login?redirect=/dashboard`)
                            } else {
                                navigate('/dashboard')
                            }
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${location.pathname === '/dashboard'
                            ? isDark
                                ? 'bg-purple-500/20 text-white border border-purple-500/30'
                                : 'bg-slate-100 text-slate-900'
                            : isDark
                                ? 'text-gray-300 hover:bg-white/[0.05] hover:text-white'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        title={isCollapsed ? 'Dashboard' : ''}
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        {!isCollapsed && <span className="text-sm">Dashboard</span>}
                    </button>

                    <button
                        onClick={() => {
                            if (!user) {
                                navigate(`/login?redirect=/portfolios`)
                            } else {
                                navigate('/portfolios')
                            }
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${location.pathname === '/portfolios'
                            ? isDark
                                ? 'bg-purple-500/20 text-white border border-purple-500/30'
                                : 'bg-slate-100 text-slate-900'
                            : isDark
                                ? 'text-gray-300 hover:bg-white/[0.05] hover:text-white'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        title={isCollapsed ? 'Portfolios' : ''}
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {!isCollapsed && <span className="text-sm">Portfolios</span>}
                    </button>

                    <button
                        onClick={() => navigate('/backtest')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${location.pathname === '/backtest'
                            ? isDark
                                ? 'bg-purple-500/20 text-white border border-purple-500/30'
                                : 'bg-slate-100 text-slate-900'
                            : isDark
                                ? 'text-gray-300 hover:bg-white/[0.05] hover:text-white'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        title={isCollapsed ? 'Backtest' : ''}
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        {!isCollapsed && <span className="text-sm">Backtest</span>}
                    </button>

                    <button
                        onClick={() => navigate('/ai-chat')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${location.pathname === '/ai-chat'
                            ? isDark
                                ? 'bg-purple-500/20 text-white border border-purple-500/30'
                                : 'bg-slate-100 text-slate-900'
                            : isDark
                                ? 'text-gray-300 hover:bg-white/[0.05] hover:text-white'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        title={isCollapsed ? 'AI Chat' : ''}
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        {!isCollapsed && <span className="text-sm">AI Chat</span>}
                    </button>
                </nav>

                {/* Bottom Section: Theme Toggle & User */}
                <div className={`p-4 border-t space-y-3 ${isDark ? 'border-white/[0.1]' : 'border-slate-200'}`}>
                    {/* Theme Toggle */}
                    {!isCollapsed ? (
                        <div className={`flex items-center justify-between px-4 py-3 rounded-lg ${isDark ? 'bg-white/[0.02]' : 'bg-slate-50'
                            }`}>
                            <div className="flex items-center gap-3">
                                <svg className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                                <div>
                                    <div className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {isDark ? 'Dark' : 'Light'}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isDark ? 'bg-purple-500' : 'bg-slate-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${isDark ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={toggleTheme}
                            className={`w-full p-3 rounded-lg transition-all ${isDark
                                ? 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                                }`}
                            title="Toggle theme"
                        >
                            <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        </button>
                    )}

                    {/* User Section */}
                    {user ? (
                        !isCollapsed ? (
                            <>
                                <button
                                    onClick={() => navigate('/settings')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${location.pathname === '/settings'
                                        ? isDark
                                            ? 'bg-purple-500/20 border border-purple-500/30'
                                            : 'bg-slate-100'
                                        : isDark
                                            ? 'bg-white/[0.05] hover:bg-white/[0.1]'
                                            : 'bg-slate-50 hover:bg-slate-100'
                                        }`}
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                        {user.email?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <div className={`text-xs font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'
                                            }`}>
                                            {user.email}
                                        </div>
                                        <div className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                                            Settings
                                        </div>
                                    </div>
                                    <svg className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>

                                <button
                                    onClick={() => {
                                        logout()
                                        navigate('/')
                                    }}
                                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all text-xs font-semibold ${isDark
                                        ? 'bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 hover:text-white border border-white/[0.1]'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                        }`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/settings')}
                                    className={`w-full p-3 rounded-lg transition-all ${location.pathname === '/settings'
                                        ? isDark
                                            ? 'bg-purple-500/20 border border-purple-500/30 text-white'
                                            : 'bg-slate-100 text-slate-900'
                                        : isDark
                                            ? 'hover:bg-white/[0.05]'
                                            : 'hover:bg-slate-100'
                                        }`}
                                    title="Settings"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs mx-auto">
                                        {user.email?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                </button>

                                <button
                                    onClick={() => {
                                        logout()
                                        navigate('/')
                                    }}
                                    className={`w-full p-3 rounded-lg transition-all ${isDark
                                        ? 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                                        }`}
                                    title="Sign Out"
                                >
                                    <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </>
                        )
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all font-semibold ${isCollapsed ? 'text-xs p-3' : 'text-xs'
                                } ${isDark
                                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/25'
                                    : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg'
                                }`}
                            title={isCollapsed ? 'Sign In' : ''}
                        >
                            <svg className={`w-4 h-4 ${isCollapsed ? 'mx-auto' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            {!isCollapsed && <span>Sign In</span>}
                        </button>
                    )}
                </div>
            </aside>
        </>
    )
}
