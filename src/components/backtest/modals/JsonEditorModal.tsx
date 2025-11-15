import { useState, useEffect } from 'react';
import { StrategyDSL } from '../../../types/strategy';
import { useTheme } from '../../../context/ThemeContext';

interface JsonEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    strategy: StrategyDSL;
    onSave: (strategy: StrategyDSL) => void;
    strategyChains?: string[][];
}

// Display format for rules with explicit AND/OR connections
interface DisplayAllocationRule {
    allocation: string;
    rules: Array<{ rule: string; operator?: 'AND' | 'OR' }>;
}

interface DisplayStrategy extends Omit<StrategyDSL, 'allocation_rules'> {
    name: string;
    allocation_rules?: DisplayAllocationRule[];
}

export const JsonEditorModal: React.FC<JsonEditorModalProps> = ({
    isOpen,
    onClose,
    strategy,
    onSave,
    strategyChains = [],
}) => {
    const [jsonText, setJsonText] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [selectedChainIndex, setSelectedChainIndex] = useState(0);
    const [viewMode, setViewMode] = useState<'individual' | 'all'>('individual');
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Build individual strategy objects for each chain
    const buildIndividualStrategies = (): DisplayStrategy[] => {
        if (strategyChains.length === 0) {
            // Detect orphan nodes (allocations with rules but not in any chain)
            const allAllocations = Object.keys(strategy.allocations);
            const orphanNodes: string[] = [];

            // Check each allocation to see if it has rules but no chain
            allAllocations.forEach(allocName => {
                const hasRules = strategy.allocation_rules?.some(ar => {
                    if (ar.allocation !== allocName) return false;
                    return typeof ar.rules === 'string'
                        ? ar.rules.length > 0
                        : ar.rules.length > 0;
                });

                // If has rules but is the fallback, it's orphaned
                if (hasRules && strategy.fallback_allocation === allocName) {
                    orphanNodes.push(allocName);
                }
            });

            // Build allocations object with implicit CASH fallback for orphans
            let displayAllocations = { ...strategy.allocations };
            if (orphanNodes.length > 0) {
                // Add implicit CASH allocation if it doesn't exist
                if (!displayAllocations['CASH']) {
                    displayAllocations = {
                        ...displayAllocations,
                        CASH: {
                            allocation: { CASH: 1.0 },
                            rebalancing_frequency: undefined
                        }
                    };
                }
            }

            // Convert full strategy to display format
            const displayAllocationRules = (strategy.allocation_rules || []).map(ar => {
                if (typeof ar.rules === 'string') {
                    // Parse expression into structured format
                    const parts = ar.rules.split(/\s+(AND|OR)\s+/);
                    const structured: Array<{ rule: string; operator?: 'AND' | 'OR' }> = [];

                    for (let i = 0; i < parts.length; i += 2) {
                        const rule = parts[i].trim();
                        const operator = parts[i + 1] as 'AND' | 'OR' | undefined;
                        structured.push({ rule, ...(operator && { operator }) });
                    }

                    return {
                        allocation: ar.allocation,
                        rules: structured
                    };
                }
                // Legacy array format - convert to structured
                return {
                    allocation: ar.allocation,
                    rules: ar.rules.map((r, idx) => ({
                        rule: r,
                        ...(idx < ar.rules.length - 1 && { operator: 'OR' as const })
                    }))
                };
            });

            // Determine fallback - if there are orphans, fallback is CASH
            let displayFallback = strategy.fallback_allocation;
            if (orphanNodes.length > 0) {
                displayFallback = 'CASH';
            }

            const result: DisplayStrategy = {
                name: 'Full Strategy',
                start_date: strategy.start_date,
                end_date: strategy.end_date,
                initial_capital: strategy.initial_capital,
                allocations: displayAllocations,
                fallback_allocation: displayFallback,
                switching_logic: strategy.switching_logic,
            };

            // Only include allocation_rules if not empty
            if (displayAllocationRules.length > 0) {
                result.allocation_rules = displayAllocationRules;
            }

            return [result];
        }

        return strategyChains.map((chain, index) => {
            const chainAllocations: any = {};
            chain.forEach(name => {
                if (strategy.allocations[name]) {
                    chainAllocations[name] = strategy.allocations[name];
                }
            });

            // Check if this is an orphan single node with rules
            const isOrphanWithRules = chain.length === 1 && (() => {
                const allocationRule = strategy.allocation_rules?.find(ar => ar.allocation === chain[0]);
                return allocationRule && (typeof allocationRule.rules === 'string'
                    ? allocationRule.rules.length > 0
                    : allocationRule.rules.length > 0);
            })();

            // If orphan with rules, add implicit CASH fallback
            if (isOrphanWithRules && !chainAllocations['CASH']) {
                chainAllocations['CASH'] = {
                    allocation: { CASH: 1.0 },
                    rebalancing_frequency: undefined
                };
            }

            // Determine fallback for this chain
            let chainFallback = chain[chain.length - 1];

            if (isOrphanWithRules) {
                // Orphan nodes with rules fall back to CASH
                chainFallback = 'CASH';
            } else {
                // Normal chain logic
                for (const name of chain) {
                    const allocationRule = strategy.allocation_rules?.find(ar => ar.allocation === name);
                    const hasRules = allocationRule
                        ? (typeof allocationRule.rules === 'string'
                            ? allocationRule.rules.length > 0
                            : allocationRule.rules.length > 0)
                        : false;
                    if (!hasRules) {
                        chainFallback = name;
                        break;
                    }
                }
            }

            // Filter rules for this chain and convert string expressions to structured format
            const chainAllocationRules = (strategy.allocation_rules || [])
                .filter(ar => chain.includes(ar.allocation))
                .map(ar => {
                    if (typeof ar.rules === 'string') {
                        // Parse expression into structured format
                        const parts = ar.rules.split(/\s+(AND|OR)\s+/);
                        const structured: Array<{ rule: string; operator?: 'AND' | 'OR' }> = [];

                        for (let i = 0; i < parts.length; i += 2) {
                            const rule = parts[i].trim();
                            const operator = parts[i + 1] as 'AND' | 'OR' | undefined;
                            structured.push({ rule, ...(operator && { operator }) });
                        }

                        return {
                            allocation: ar.allocation,
                            rules: structured
                        };
                    }
                    // Legacy array format - convert to structured
                    return {
                        allocation: ar.allocation,
                        rules: ar.rules.map((r, idx) => ({
                            rule: r,
                            ...(idx < ar.rules.length - 1 && { operator: 'OR' as const })
                        }))
                    };
                });

            const chainRuleNames = new Set<string>();
            chainAllocationRules.forEach(ar => {
                (ar.rules as any).forEach((ruleItem: any) => {
                    chainRuleNames.add(ruleItem.rule);
                });
            });

            const chainSwitchingLogic = strategy.switching_logic.filter(rule =>
                chainRuleNames.has(rule.name || '')
            );

            const result: DisplayStrategy = {
                name: chain.length > 1 ? `Strategy ${index + 1}: ${chain.join(' → ')}` : `Strategy ${index + 1}: ${chain[0]}`,
                start_date: strategy.start_date,
                end_date: strategy.end_date,
                initial_capital: strategy.initial_capital,
                allocations: chainAllocations,
                fallback_allocation: chainFallback,
                switching_logic: chainSwitchingLogic,
            };

            // Only include allocation_rules if not empty
            if (chainAllocationRules.length > 0) {
                result.allocation_rules = chainAllocationRules;
            }

            return result;
        });
    };

    useEffect(() => {
        if (isOpen) {
            if (strategyChains.length > 0 && viewMode === 'individual') {
                // Show individual strategy
                const strategies = buildIndividualStrategies();
                setJsonText(JSON.stringify(strategies[selectedChainIndex], null, 2));
            } else if (strategyChains.length > 0 && viewMode === 'all') {
                // Show all strategies as an array
                const strategies = buildIndividualStrategies();
                setJsonText(JSON.stringify(strategies, null, 2));
            } else {
                // Fallback to full strategy object
                setJsonText(JSON.stringify(strategy, null, 2));
            }
            setError(null);
        }
    }, [isOpen, strategy, strategyChains, selectedChainIndex, viewMode]);

    const handleSave = () => {
        try {
            const parsed = JSON.parse(jsonText);

            if (viewMode === 'individual' && strategyChains.length > 0) {
                // For individual strategy editing, merge back into full strategy
                alert('Individual strategy editing will update only that strategy chain. For now, use All Strategies view to edit all at once.');
                return;
            }

            if (viewMode === 'all' && strategyChains.length > 0) {
                // When editing all strategies as array, user is editing the parsed array format
                // This would need backend support to handle array of strategies
                alert('Saving multiple strategies from array format. Ensure your backend accepts an array of strategy objects.');
            }

            onSave(parsed);
            onClose();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Invalid JSON');
        }
    };

    const handleFormat = () => {
        try {
            const parsed = JSON.parse(jsonText);
            setJsonText(JSON.stringify(parsed, null, 2));
            setError(null);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Invalid JSON');
        }
    };

    const handleClose = () => {
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col ${isDark ? 'bg-black border border-white/[0.15]' : 'bg-white'
                }`}>
                {/* Header */}
                <div className={`px-6 py-4 flex items-center justify-between ${isDark ? 'border-b border-white/[0.15]' : 'border-b border-slate-200'
                    }`}>
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-xl shadow-sm ${isDark ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20' : 'bg-gradient-to-br from-amber-100 to-orange-100'
                            }`}>
                            <svg className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        </div>
                        <div>
                            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>JSON Strategy Editor</h2>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Edit strategy directly in JSON format</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/[0.05]' : 'hover:bg-slate-100'
                            }`}
                    >
                        <svg className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* View Mode Selector - only show if multiple strategies */}
                    {strategyChains.length > 0 && (
                        <div className="mb-4 flex items-center gap-4">
                            <div className={`flex items-center gap-2 rounded-lg p-1 ${isDark ? 'bg-white/[0.05]' : 'bg-slate-100'
                                }`}>
                                <button
                                    onClick={() => setViewMode('individual')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'individual'
                                        ? isDark
                                            ? 'bg-purple-500/20 text-purple-300 shadow-sm border border-purple-500/30'
                                            : 'bg-white text-slate-900 shadow-sm'
                                        : isDark
                                            ? 'text-gray-400 hover:text-gray-200'
                                            : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                >
                                    Individual Strategy
                                </button>
                                <button
                                    onClick={() => setViewMode('all')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'all'
                                        ? isDark
                                            ? 'bg-purple-500/20 text-purple-300 shadow-sm border border-purple-500/30'
                                            : 'bg-white text-slate-900 shadow-sm'
                                        : isDark
                                            ? 'text-gray-400 hover:text-gray-200'
                                            : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                >
                                    All Strategies ({strategyChains.length})
                                </button>
                            </div>

                            {/* Strategy selector for individual view */}
                            {viewMode === 'individual' && (
                                <select
                                    value={selectedChainIndex}
                                    onChange={(e) => setSelectedChainIndex(parseInt(e.target.value))}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium focus:ring-2 focus:outline-none ${isDark
                                            ? 'bg-white/[0.05] border border-white/[0.15] text-white focus:ring-purple-500 focus:border-purple-500'
                                            : 'bg-white border border-slate-300 text-slate-700 focus:ring-amber-500 focus:border-amber-500'
                                        }`}
                                >
                                    {buildIndividualStrategies().map((s, idx) => (
                                        <option key={idx} value={idx}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    )}

                    {error && (
                        <div className={`mb-4 p-3 rounded-lg ${isDark ? 'bg-red-500/10 border border-red-500/30' : 'bg-red-50 border border-red-200'
                            }`}>
                            <div className="flex items-start gap-2">
                                <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-red-400' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p className={`text-sm font-medium ${isDark ? 'text-red-300' : 'text-red-800'}`}>JSON Error</p>
                                    <p className={`text-xs mt-1 ${isDark ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={`rounded-xl p-1 ${isDark ? 'bg-white/[0.02] border border-white/[0.1]' : 'bg-slate-50 border border-slate-200'
                        }`}>
                        <textarea
                            value={jsonText}
                            onChange={(e) => {
                                setJsonText(e.target.value);
                                setError(null);
                            }}
                            className={`w-full h-[500px] font-mono text-sm border-0 rounded-lg p-4 focus:ring-2 focus:outline-none resize-none ${isDark
                                    ? 'bg-black/50 text-gray-100 placeholder-gray-500 focus:ring-purple-500'
                                    : 'bg-white text-slate-900 focus:ring-amber-500'
                                }`}
                            placeholder="Enter your strategy JSON here..."
                            spellCheck={false}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className={`px-6 py-4 flex items-center justify-between gap-3 ${isDark ? 'border-t border-white/[0.15]' : 'border-t border-slate-200'
                    }`}>
                    <button
                        onClick={handleFormat}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${isDark
                                ? 'bg-white/[0.05] hover:bg-white/[0.1] text-gray-300'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        Format JSON
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={handleClose}
                            className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${isDark
                                    ? 'bg-white/[0.05] hover:bg-white/[0.1] text-gray-300'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-semibold shadow-sm hover:shadow-md ${isDark
                                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
