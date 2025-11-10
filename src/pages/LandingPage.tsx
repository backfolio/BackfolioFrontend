import { Link, useNavigate } from 'react-router-dom'

const LandingPage = () => {
    const navigate = useNavigate()

    const handleStartBacktest = () => {
        // Redirect to login with a redirect parameter to backtest page
        navigate('/login?redirect=/backtest')
    }

    return (
        <div className="relative overflow-hidden min-h-screen flex flex-col bg-black">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 py-6 px-8 backdrop-blur-2xl bg-black/60 border-b border-white/5">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-12">
                        {/* Logo */}
                        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-400 via-purple-400 to-blue-400 bg-clip-text text-transparent hover:from-primary-300 hover:via-purple-300 hover:to-blue-300 transition-all duration-300 transform hover:scale-105">
                            Back<span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">folio</span>
                        </Link>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a
                                href="#features"
                                className="text-sm font-semibold text-white/70 hover:text-white transition-all duration-200 relative group"
                                onClick={(e) => {
                                    e.preventDefault()
                                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                                }}
                            >
                                Features
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-200 group-hover:w-full"></span>
                            </a>
                            <a
                                href="#pricing"
                                className="text-sm font-semibold text-white/70 hover:text-white transition-all duration-200 relative group"
                                onClick={(e) => {
                                    e.preventDefault()
                                    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
                                }}
                            >
                                Pricing
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-200 group-hover:w-full"></span>
                            </a>
                            <a
                                href="#docs"
                                className="text-sm font-semibold text-white/70 hover:text-white transition-all duration-200 relative group"
                                onClick={(e) => {
                                    e.preventDefault()
                                    document.getElementById('docs')?.scrollIntoView({ behavior: 'smooth' })
                                }}
                            >
                                Docs
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-200 group-hover:w-full"></span>
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link
                            to="/login"
                            className="text-sm font-medium text-white/60 hover:text-white transition-all duration-300 px-5 py-2.5 rounded-xl hover:bg-white/5"
                        >
                            Log In
                        </Link>
                        <Link
                            to="/login?mode=signup"
                            className="bg-white text-black text-sm font-semibold px-7 py-2.5 rounded-xl transition-all duration-300 hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transform hover:scale-[1.02]"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Background gradients */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-black"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent"></div>
                <div className="absolute top-40 left-20 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-40 right-20 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                {/* Subtle grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-32 w-full flex-1 flex items-center">
                {/* Hero Content */}
                <div className="text-center w-full">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-sm font-medium text-white/80 mb-12 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
                        AI-Powered Portfolio Analysis
                        <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>

                    <h1 className="text-7xl lg:text-8xl xl:text-9xl font-bold text-white mb-10 leading-[0.9] tracking-[-0.04em]">
                        Intelligent
                        <span className="block bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent mt-3">
                            Portfolio Analytics
                        </span>
                    </h1>

                    <p className="text-xl lg:text-2xl text-white/50 max-w-3xl mx-auto mb-16 leading-relaxed font-normal tracking-wide">
                        Transform your investment strategies with AI-powered backtesting and real-time analytics.
                        <span className="text-white/70"> Discover what works, optimize performance,</span> and build
                        institutional-grade portfolios with confidence.
                    </p>

                    {/* Stats Bar */}
                    <div className="flex flex-wrap justify-center gap-6 lg:gap-10 mb-16">
                        <div className="flex items-center gap-3 px-5 py-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(16,185,129,0.1)] transition-all duration-300 hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                            <div className="flex items-center justify-center w-11 h-11 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className="font-medium text-white/80">Real-time Data</span>
                        </div>
                        <div className="flex items-center gap-3 px-5 py-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(168,85,247,0.1)] transition-all duration-300 hover:border-primary-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                            <div className="flex items-center justify-center w-11 h-11 bg-primary-500/10 rounded-xl border border-primary-500/20">
                                <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <span className="font-medium text-white/80">Advanced Analytics</span>
                        </div>
                        <div className="flex items-center gap-3 px-5 py-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(147,51,234,0.1)] transition-all duration-300 hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(147,51,234,0.2)]">
                            <div className="flex items-center justify-center w-11 h-11 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <span className="font-medium text-white/80">AI Insights</span>
                        </div>
                        <div className="flex items-center gap-3 px-5 py-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-all duration-300 hover:border-amber-500/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                            <div className="flex items-center justify-center w-11 h-11 bg-amber-500/10 rounded-xl border border-amber-500/20">
                                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <span className="font-medium text-white/80">Risk Management</span>
                        </div>
                    </div>

                    {/* Start Backtest Button */}
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                        <button
                            onClick={handleStartBacktest}
                            className="group relative px-12 py-6 bg-white text-black font-semibold text-lg rounded-2xl hover:bg-white/90 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all duration-300 overflow-hidden min-w-[300px]"
                        >
                            <div className="relative flex items-center justify-center gap-3">
                                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span>Start Your Analysis</span>
                            </div>
                        </button>

                        <div className="flex items-center gap-2 text-white/40 text-sm font-normal">
                            <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Free to start • No credit card required
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section id="features" className="relative py-32 bg-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-24">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-sm font-medium text-white/70 mb-8">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Platform Features
                        </div>
                        <h2 className="text-6xl lg:text-7xl font-bold text-white mb-8 leading-[1.1] tracking-[-0.02em]">
                            Everything you need to build
                            <span className="block text-white/60 mt-2">
                                smarter portfolios
                            </span>
                        </h2>
                        <p className="text-xl text-white/40 max-w-3xl mx-auto leading-relaxed">
                            From simple backtests to advanced portfolio monitoring, we've got the institutional-grade tools
                            to elevate your investment strategy.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="group p-10 bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-500">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/10 transition-all duration-300">
                                <svg className="w-7 h-7 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">AI-Powered Backtesting</h3>
                            <p className="text-base text-white/50 leading-relaxed">Describe your strategy in plain English and watch our AI build comprehensive backtests with institutional-grade historical data analysis.</p>
                        </div>

                        <div className="group p-10 bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-500">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/10 transition-all duration-300">
                                <svg className="w-7 h-7 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">Real-Time Monitoring</h3>
                            <p className="text-base text-white/50 leading-relaxed">Track your deployed strategies with live market updates and receive instant alerts when rebalancing opportunities arise.</p>
                        </div>

                        <div className="group p-10 bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-500">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/10 transition-all duration-300">
                                <svg className="w-7 h-7 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">Advanced Risk Analysis</h3>
                            <p className="text-base text-white/50 leading-relaxed">Sophisticated Monte Carlo simulations and stress testing to thoroughly understand your portfolio's risk profile and potential outcomes.</p>
                        </div>

                        <div className="group p-10 bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-500">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/10 transition-all duration-300">
                                <svg className="w-7 h-7 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">AI Strategy Coach</h3>
                            <p className="text-base text-white/50 leading-relaxed">Receive intelligent suggestions to optimize your strategies and automatically discover alternative investment approaches.</p>
                        </div>

                        <div className="group p-10 bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-500">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/10 transition-all duration-300">
                                <svg className="w-7 h-7 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">Professional Reports</h3>
                            <p className="text-base text-white/50 leading-relaxed">Generate detailed PDF reports with AI-powered commentary and insights to share with advisors or track your progress over time.</p>
                        </div>

                        <div className="group p-10 bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-500">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/10 transition-all duration-300">
                                <svg className="w-7 h-7 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">Community Insights</h3>
                            <p className="text-base text-white/50 leading-relaxed">Connect with fellow investors, share strategies, learn from the community, and discover new investment approaches from experts.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="relative py-32 bg-black">
                <div className="absolute inset-0">
                    <div className="absolute top-40 left-40 w-[500px] h-[500px] bg-white/[0.01] rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-40 right-40 w-[500px] h-[500px] bg-white/[0.01] rounded-full blur-[100px]"></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-24">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-sm font-medium text-white/70 mb-8">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            Pricing Plans
                        </div>
                        <h2 className="text-6xl lg:text-7xl font-bold text-white mb-8 leading-[1.1] tracking-[-0.02em]">
                            Choose your
                            <span className="block text-white/60 mt-2">
                                investment journey
                            </span>
                        </h2>
                        <p className="text-xl text-white/40 max-w-3xl mx-auto leading-relaxed">
                            From curious beginner to serious portfolio manager, we have a plan that fits your needs and grows with your ambitions.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                        {/* Explorer (Free) */}
                        <div className="bg-white/[0.02] backdrop-blur-xl rounded-3xl p-10 border border-white/5 hover:border-white/10 transition-all duration-500">
                            <div className="text-center mb-10">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-sm font-medium text-white/60 mb-6">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Explorer
                                </div>
                                <div className="text-5xl font-bold text-white mb-3">Free</div>
                                <p className="text-base text-white/50">Perfect for getting started</p>
                            </div>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-white/60 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white/60">Backtest simple strategies (SMA, RSI)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white/60">AI chat for basic strategy questions</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white/60">3 backtests per month</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white/60">1 saved strategy</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white/60">Demo Monte Carlo (limited)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white/60">Community sharing (view-only)</span>
                                </li>
                            </ul>

                            <button className="w-full bg-white/[0.08] hover:bg-white/[0.12] text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-white/20 transform hover:scale-105 border border-white/[0.15]">
                                Start Free
                            </button>
                        </div>

                        {/* Pro (Recommended) */}
                        <div className="bg-white/[0.02] backdrop-blur-sm rounded-3xl p-10 border-2 border-primary-500/50 relative hover:border-primary-400 hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-300 transform hover:-translate-y-3 scale-105">
                            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                                <div className="bg-gradient-to-r from-primary-500 via-purple-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-primary-500/30">
                                    ⭐ Most Popular
                                </div>
                            </div>

                            <div className="text-center mb-10">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500/20 to-purple-500/20 backdrop-blur-sm border border-primary-500/30 rounded-full text-sm font-bold text-primary-300 mb-6">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                    Pro
                                </div>
                                <div className="text-5xl font-bold text-white mb-3">
                                    $20
                                    <span className="text-2xl font-semibold text-white/60">/month</span>
                                </div>
                                <p className="text-lg text-white/70 font-medium">Your personal AI quant assistant</p>
                            </div>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white/70">Unlimited backtesting</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white/70">Tactical backtests with conditions</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white/70">Full Monte Carlo & stress tests</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white/70">Save & monitor up to 5 portfolios</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white/70">Weekly email alerts</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white/70">Full AI chat access</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white/70">PDF reports with commentary</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white/70">Basic live dashboard (daily updates)</span>
                                </li>
                            </ul>

                            <button className="w-full bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 hover:from-primary-500 hover:via-purple-500 hover:to-blue-500 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/40 transform hover:scale-105">
                                Start Pro Trial
                            </button>
                        </div>

                        {/* Portfolio+ */}
                        <div className="bg-gradient-to-br from-white/[0.02] to-purple-900/10 backdrop-blur-sm rounded-3xl p-10 border border-purple-500/30 hover:border-purple-400/50 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-2">
                            <div className="text-center mb-10">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full text-sm font-bold text-purple-300 mb-6">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                    Portfolio+
                                </div>
                                <div className="text-5xl font-bold text-white mb-3">
                                    $55
                                    <span className="text-2xl font-semibold text-white/60">/month</span>
                                </div>
                                <p className="text-lg text-white/70 font-medium">Run portfolios like a hedge fund</p>
                            </div>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white/70">Everything in Pro, plus:</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white/70">Unlimited portfolios</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white/70">Live (hourly) dashboard updates</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white/70">Real-time SMS/email alerts</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white/70">Advanced Monte Carlo (custom variables)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white/70">Multi-asset coverage (ETFs, crypto, indices)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white/70">AI Strategy Coach (auto suggestions)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white/70">White-labeled PDF exports</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white/70">Priority support</span>
                                </li>
                            </ul>

                            <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/40 transform hover:scale-105">
                                Start Portfolio+
                            </button>
                        </div>

                        {/* Enterprise */}
                        <div className="bg-gradient-to-br from-black to-white/[0.02] rounded-3xl p-10 border border-white/[0.15] hover:border-white/30 hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 transform hover:-translate-y-2">
                            <div className="text-center mb-10">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] backdrop-blur-sm border border-white/[0.15] rounded-full text-sm font-bold text-white/70 mb-6">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    Enterprise
                                </div>
                                <div className="text-5xl font-bold text-white mb-3">
                                    Custom
                                </div>
                                <p className="text-lg text-white/70 font-medium">Built for institutional scale</p>
                            </div>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white/70">Everything in Portfolio+, plus:</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white/70">Custom integrations & API access</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white/70">Team collaboration tools</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white/70">Custom data sources</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white/70">Service level agreements (SLA)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white/70">Compliance & audit support</span>
                                </li>
                            </ul>

                            <button className="w-full bg-white text-black font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transform hover:scale-105">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Docs Section */}
            <section id="docs" className="relative py-24 bg-black">
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-20 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-20 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-950/50 via-purple-950/50 to-blue-950/50 backdrop-blur-sm border border-primary-500/20 rounded-full text-sm font-semibold text-primary-300 mb-8 shadow-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Get Started Today
                    </div>
                    <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                        Ready to transform
                        <span className="block bg-gradient-to-r from-primary-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                            your portfolio?
                        </span>
                    </h2>
                    <p className="text-xl lg:text-2xl text-white/60 max-w-4xl mx-auto mb-12 leading-relaxed">
                        Join thousands of investors who trust Backfolio for comprehensive documentation,
                        tutorials, and examples to master portfolio backtesting.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <button
                            onClick={handleStartBacktest}
                            className="group bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 hover:from-primary-500 hover:via-purple-500 hover:to-blue-500 text-white font-bold px-10 py-5 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/40 transform hover:scale-105 min-w-[260px]"
                        >
                            <div className="flex items-center justify-center gap-3">
                                <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Start Your First Backtest
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </button>
                        <a
                            href="#"
                            className="group border-2 border-white/[0.15] hover:border-white/30 text-white/70 hover:text-white font-bold px-10 py-5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-white/20 hover:bg-white/5 backdrop-blur-sm transform hover:scale-105 min-w-[260px]"
                        >
                            <div className="flex items-center justify-center gap-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                View Documentation
                            </div>
                        </a>
                    </div>

                    {/* Trust indicators */}
                    <div className="mt-16 pt-12 border-t border-white/[0.08]">
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-white/60">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-medium">Free to start</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span className="font-medium">Bank-grade security</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-medium">24/7 support</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default LandingPage
