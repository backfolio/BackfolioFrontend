import React from 'react';

interface StrategyEmptyStateProps {
    onCreatePortfolio: () => void;
    isDark: boolean;
}

export const StrategyEmptyState: React.FC<StrategyEmptyStateProps> = ({
    onCreatePortfolio,
    isDark
}) => {
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="flex flex-col items-center justify-center text-center px-8 py-12 max-w-2xl">
                {/* Logo & Brand */}
                <div className="mb-10 flex items-center gap-3">
                    <svg className={`w-12 h-12 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h1 className={`text-5xl font-black tracking-tight bg-gradient-to-r ${isDark
                        ? 'from-purple-400 to-indigo-400 text-transparent bg-clip-text'
                        : 'from-purple-600 to-indigo-600 text-transparent bg-clip-text'
                        }`}>
                        Backfolio
                    </h1>
                </div>

                {/* Heading */}
                <h2 className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Build Your Winning Strategy
                </h2>

                {/* Description */}
                <p className={`text-lg mb-8 max-w-md ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Create dynamic portfolio strategies with visual rules and conditions
                </p>

                {/* Quick Steps */}
                <div className={`flex items-center gap-8 mb-8 text-sm ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                    <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-semibold ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'
                            }`}>1</div>
                        <span>Add Portfolios</span>
                    </div>
                    <div className={`w-4 h-px ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
                    <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-semibold ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                            }`}>2</div>
                        <span>Define Rules</span>
                    </div>
                    <div className={`w-4 h-px ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
                    <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-semibold ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                            }`}>3</div>
                        <span>Connect & Test</span>
                    </div>
                </div>

                {/* CTA Button */}
                <button
                    onClick={onCreatePortfolio}
                    className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-base pointer-events-auto transition-all transform hover:scale-105 shadow-lg hover:shadow-xl ${isDark
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
                        }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Your First Portfolio
                </button>

                {/* Hint */}
                <p className={`mt-6 text-sm ${isDark ? 'text-slate-600' : 'text-slate-500'}`}>
                    Use the toolbar above to get started
                </p>
            </div>
        </div>
    );
};
