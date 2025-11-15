import React from 'react';

interface DocumentationModalProps {
    isOpen: boolean;
    onClose: () => void;
    isDark: boolean;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ isOpen, onClose, isDark }) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-50 backdrop-blur-sm ${isDark ? 'bg-black/60' : 'bg-black/40'}`}
                onClick={onClose}
            />
            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
                <div className={`rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto border ${isDark
                    ? 'bg-black/95 backdrop-blur-xl border-white/[0.15]'
                    : 'bg-white border-slate-200'
                    }`}>
                    <div className="p-8">
                        {/* Header */}
                        <div className={`flex items-center justify-between mb-6 pb-4 border-b ${isDark ? 'border-white/[0.1]' : 'border-slate-200'}`}>
                            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                How Backfolio Works
                            </h2>
                            <button
                                onClick={onClose}
                                className={`p-2 rounded-lg transition-all ${isDark
                                    ? 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className={`space-y-6 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                            {/* Overview */}
                            <section>
                                <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Visual Strategy Builder
                                </h3>
                                <p className="text-sm leading-relaxed">
                                    Backfolio uses a node-based canvas to create tactical portfolio strategies. Build strategies by connecting portfolios with switching rules—when rules are met, the strategy switches to the connected portfolio.
                                </p>
                            </section>

                            {/* Portfolios */}
                            <section>
                                <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    📦 Portfolios (Nodes)
                                </h3>
                                <p className="text-sm leading-relaxed mb-2">
                                    Each node represents a portfolio allocation—a mix of tickers with percentage weights.
                                </p>
                                <ul className="text-sm space-y-1 ml-4 list-disc list-inside">
                                    <li><strong>Create:</strong> Click "+ Portfolio" in the toolbar</li>
                                    <li><strong>Duplicate:</strong> Click the copy icon on any node</li>
                                    <li><strong>Delete:</strong> Click the X icon on any node</li>
                                    <li><strong>Rename:</strong> Double-click the node title</li>
                                </ul>
                            </section>

                            {/* Rules */}
                            <section>
                                <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    ⚡ Switching Rules
                                </h3>
                                <p className="text-sm leading-relaxed mb-2">
                                    Rules define when to switch portfolios based on market indicators.
                                </p>
                                <ul className="text-sm space-y-1 ml-4 list-disc list-inside">
                                    <li><strong>Create:</strong> Click "+ Rule" in the toolbar</li>
                                    <li><strong>Structure:</strong> IF [Indicator] [Comparison] [Value/Indicator] THEN switch</li>
                                    <li><strong>Indicators:</strong> SMA, EMA, RSI, ROC, ATR, BOLLINGER</li>
                                    <li><strong>Comparisons:</strong> &gt;, &lt;, &gt;=, &lt;=, ==</li>
                                </ul>
                            </section>

                            {/* Connections */}
                            <section>
                                <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    🔗 Linked-List System
                                </h3>
                                <p className="text-sm leading-relaxed mb-2">
                                    Connect portfolios by dragging from one node's handle to another. Each connection can have one rule assigned.
                                </p>
                                <ul className="text-sm space-y-1 ml-4 list-disc list-inside">
                                    <li><strong>Connect:</strong> Drag from a node handle to another node</li>
                                    <li><strong>Assign Rule:</strong> Click the edge and select a rule</li>
                                    <li><strong>Constraint:</strong> One inbound and one outbound connection per node</li>
                                    <li><strong>Fallback:</strong> Nodes with no outbound connections stay active when rules fail</li>
                                </ul>
                            </section>

                            {/* Backtest */}
                            <section>
                                <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    📊 Running Backtests
                                </h3>
                                <p className="text-sm leading-relaxed mb-2">
                                    Test your strategy against historical data to see how it would have performed.
                                </p>
                                <ul className="text-sm space-y-1 ml-4 list-disc list-inside">
                                    <li><strong>Settings:</strong> Click the gear icon (top-right) to set dates and initial capital</li>
                                    <li><strong>Run:</strong> Click "Run Backtest" in the toolbar</li>
                                    <li><strong>Results:</strong> View performance metrics, equity curve, and allocation history</li>
                                </ul>
                            </section>

                            {/* Tips */}
                            <section className={`rounded-lg p-4 border ${isDark
                                ? 'bg-white/[0.02] border-white/[0.1]'
                                : 'bg-slate-50 border-slate-200'
                                }`}>
                                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    💡 Pro Tips
                                </h3>
                                <ul className="text-sm space-y-1 ml-4 list-disc list-inside">
                                    <li>Start simple: 2-3 portfolios with one rule</li>
                                    <li>Use the JSON editor (toolbar) for advanced editing</li>
                                    <li>Multiple strategy chains will run separate backtests</li>
                                    <li>Empty canvas? Click anywhere to start building</li>
                                </ul>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
