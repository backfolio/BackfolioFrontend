import { useState } from 'react';
import { SwitchingRule } from '../../../types/strategy';
import { useTheme } from '../../../context/ThemeContext';

interface RuleAssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAssign: (ruleExpression: string) => void;
    onClear: () => void;
    availableRules: SwitchingRule[];
    targetAllocation: string | null;
    currentRules?: string | string[];
}

type RuleItem = {
    ruleName: string;
    operator?: 'AND' | 'OR';
};

export const RuleAssignmentModal: React.FC<RuleAssignmentModalProps> = ({
    isOpen,
    onClose,
    onAssign,
    onClear,
    availableRules,
    targetAllocation,
    currentRules,
}) => {
    const [ruleChain, setRuleChain] = useState<RuleItem[]>([]);
    const [selectedRuleToAdd, setSelectedRuleToAdd] = useState<string | null>(null);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    if (!isOpen) return null;

    const hasCurrentRules = currentRules && (typeof currentRules === 'string' ? currentRules.length > 0 : currentRules.length > 0);

    const buildExpression = (): string => {
        if (ruleChain.length === 0) return '';

        let expression = ruleChain[0].ruleName;
        for (let i = 1; i < ruleChain.length; i++) {
            expression += ` ${ruleChain[i - 1].operator} ${ruleChain[i].ruleName}`;
        }
        return expression;
    };

    const handleAssign = () => {
        const expression = buildExpression();
        if (expression) {
            onAssign(expression);
            setRuleChain([]);
            setSelectedRuleToAdd(null);
        }
    };

    const handleClose = () => {
        setRuleChain([]);
        setSelectedRuleToAdd(null);
        onClose();
    };

    const addRuleToChain = (ruleName: string, operator: 'AND' | 'OR' = 'OR') => {
        setRuleChain([...ruleChain, { ruleName, operator }]);
        setSelectedRuleToAdd(null);
    };

    const removeRuleFromChain = (index: number) => {
        setRuleChain(ruleChain.filter((_, i) => i !== index));
    };

    const updateOperator = (index: number, operator: 'AND' | 'OR') => {
        const updated = [...ruleChain];
        updated[index].operator = operator;
        setRuleChain(updated);
    };

    const isRuleInChain = (ruleName: string) => {
        return ruleChain.some(item => item.ruleName === ruleName);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`rounded-2xl shadow-2xl max-w-lg w-full ${isDark ? 'bg-black border border-white/[0.15]' : 'bg-white'
                }`}>
                {/* Header */}
                <div className={`px-6 py-4 flex items-center justify-between ${isDark ? 'border-b border-white/[0.15]' : 'border-b border-slate-200'
                    }`}>
                    <div>
                        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Manage Portfolio Rules</h2>
                        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                            Assign switching rules to <span className="font-semibold text-purple-500">{targetAllocation}</span>
                        </p>
                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>
                            Rules determine when to switch TO this portfolio
                        </p>
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
                <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
                    {/* Rule Chain Builder */}
                    {ruleChain.length > 0 && (
                        <div className={`mb-6 p-4 rounded-xl border-2 ${isDark ? 'bg-purple-500/10 border-purple-500/30' : 'bg-purple-50 border-purple-200'
                            }`}>
                            <div className="flex items-center gap-2 mb-3">
                                <svg className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <h3 className={`font-bold ${isDark ? 'text-purple-300' : 'text-purple-900'}`}>Rule Expression</h3>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                {ruleChain.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        {/* Rule Pill */}
                                        <div className={`flex items-center gap-2 border-2 rounded-lg px-3 py-2 shadow-sm ${isDark
                                                ? 'bg-white/[0.05] border-purple-500/50'
                                                : 'bg-white border-purple-300'
                                            }`}>
                                            <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                {item.ruleName}
                                            </span>
                                            <button
                                                onClick={() => removeRuleFromChain(index)}
                                                className={`p-0.5 rounded transition-colors ${isDark ? 'hover:bg-red-500/20' : 'hover:bg-red-100'
                                                    }`}
                                            >
                                                <svg className={`w-4 h-4 ${isDark ? 'text-red-400' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Operator Toggle (not for last item) */}
                                        {index < ruleChain.length - 1 && (
                                            <div className={`flex gap-1 rounded-lg p-1 ${isDark ? 'bg-white/[0.05]' : 'bg-slate-100'}`}>
                                                <button
                                                    onClick={() => updateOperator(index, 'AND')}
                                                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${item.operator === 'AND'
                                                        ? 'bg-blue-500 text-white shadow'
                                                        : isDark
                                                            ? 'bg-transparent text-gray-400 hover:bg-white/[0.05]'
                                                            : 'bg-transparent text-slate-600 hover:bg-slate-200'
                                                        }`}
                                                >
                                                    AND
                                                </button>
                                                <button
                                                    onClick={() => updateOperator(index, 'OR')}
                                                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${item.operator === 'OR'
                                                        ? 'bg-emerald-500 text-white shadow'
                                                        : isDark
                                                            ? 'bg-transparent text-gray-400 hover:bg-white/[0.05]'
                                                            : 'bg-transparent text-slate-600 hover:bg-slate-200'
                                                        }`}
                                                >
                                                    OR
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className={`mt-3 text-xs font-mono p-2 rounded border ${isDark ? 'text-gray-300 bg-black/30 border-purple-500/30' : 'text-slate-600 bg-white border-purple-200'
                                }`}>
                                {buildExpression()}
                            </div>
                        </div>
                    )}

                    {/* Available Rules */}
                    <div>
                        <h3 className={`text-sm font-bold mb-3 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                            {ruleChain.length === 0 ? 'Select a rule to start' : 'Add another rule'}
                        </h3>
                        {availableRules.length === 0 ? (
                            <div className="text-center py-8">
                                <svg className={`w-16 h-16 mx-auto mb-3 ${isDark ? 'text-gray-700' : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>No rules created yet</p>
                                <button
                                    onClick={handleClose}
                                    className={`px-4 py-2 rounded-lg transition-colors ${isDark
                                            ? 'bg-purple-500 hover:bg-purple-600 text-white'
                                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                                        }`}
                                >
                                    Create a Rule First
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {availableRules.map((rule, index) => {
                                    const ruleName = rule.name || `Rule ${index + 1}`;
                                    const inChain = isRuleInChain(ruleName);

                                    return (
                                        <div
                                            key={index}
                                            className={`w-full p-4 border-2 rounded-xl transition-all ${inChain
                                                ? isDark
                                                    ? 'border-white/[0.1] bg-white/[0.02] opacity-50'
                                                    : 'border-slate-200 bg-slate-50 opacity-50'
                                                : selectedRuleToAdd === ruleName
                                                    ? isDark
                                                        ? 'border-purple-500/50 bg-purple-500/10'
                                                        : 'border-purple-500 bg-purple-50'
                                                    : isDark
                                                        ? 'border-white/[0.15] hover:border-white/[0.25] hover:bg-white/[0.02]'
                                                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                            {ruleName}
                                                        </h3>
                                                        <span
                                                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${rule.rule_type === 'buy'
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : rule.rule_type === 'sell'
                                                                    ? 'bg-red-100 text-red-700'
                                                                    : 'bg-blue-100 text-blue-700'
                                                                }`}
                                                        >
                                                            {rule.rule_type}
                                                        </span>
                                                        {inChain && (
                                                            <span className={`text-xs italic ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>
                                                                (already added)
                                                            </span>
                                                        )}
                                                    </div>
                                                    {rule.condition && (
                                                        <div className={`text-xs mt-2 font-mono p-2 rounded ${isDark ? 'bg-black/30 text-gray-300' : 'bg-white text-slate-600'
                                                            }`}>
                                                            <span className="font-semibold text-purple-500">
                                                                {rule.condition.left.type}
                                                            </span>
                                                            <span className={isDark ? 'text-gray-500' : 'text-slate-500'}>
                                                                ({rule.condition.left.symbol}, {rule.condition.left.window}d)
                                                            </span>
                                                            <span className="mx-1 text-purple-600 font-bold">
                                                                {rule.condition.comparison}
                                                            </span>
                                                            <span className="font-semibold text-blue-500">
                                                                {rule.condition.right.type === 'VALUE'
                                                                    ? rule.condition.right.value
                                                                    : rule.condition.right.type}
                                                            </span>
                                                            {rule.condition.right.type !== 'VALUE' && (
                                                                <span className={isDark ? 'text-gray-500' : 'text-slate-500'}>
                                                                    ({rule.condition.right.symbol}, {rule.condition.right.window}d)
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Add buttons */}
                                                {!inChain && (
                                                    <div className="flex gap-2">
                                                        {ruleChain.length > 0 && (
                                                            <>
                                                                <button
                                                                    onClick={() => addRuleToChain(ruleName, 'AND')}
                                                                    className="px-3 py-1.5 bg-blue-500 text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition-colors"
                                                                >
                                                                    + AND
                                                                </button>
                                                                <button
                                                                    onClick={() => addRuleToChain(ruleName, 'OR')}
                                                                    className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition-colors"
                                                                >
                                                                    + OR
                                                                </button>
                                                            </>
                                                        )}
                                                        {ruleChain.length === 0 && (
                                                            <button
                                                                onClick={() => addRuleToChain(ruleName)}
                                                                className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-colors ${isDark
                                                                        ? 'bg-purple-500 hover:bg-purple-600 text-white'
                                                                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                                                                    }`}
                                                            >
                                                                Add
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                {availableRules.length > 0 && (
                    <div className={`px-6 py-4 ${isDark ? 'border-t border-white/[0.15]' : 'border-t border-slate-200'}`}>
                        {/* Show clear button if there are current rules */}
                        {hasCurrentRules && (
                            <button
                                onClick={() => {
                                    onClear();
                                    handleClose();
                                }}
                                className={`w-full mb-3 px-4 py-2 border-2 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 ${isDark
                                        ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                                        : 'border-red-300 text-red-600 hover:bg-red-50'
                                    }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Clear All Rules
                            </button>
                        )}
                        <div className="flex gap-3">
                            <button
                                onClick={handleClose}
                                className={`flex-1 px-4 py-2 border rounded-lg transition-colors font-medium ${isDark
                                        ? 'border-white/[0.15] text-gray-300 hover:bg-white/[0.05]'
                                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                                    }`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAssign}
                                disabled={ruleChain.length === 0}
                                className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium ${isDark
                                        ? 'bg-purple-500 hover:bg-purple-600 text-white disabled:bg-slate-700 disabled:cursor-not-allowed'
                                        : 'bg-purple-600 hover:bg-purple-700 text-white disabled:bg-slate-300 disabled:cursor-not-allowed'
                                    }`}
                            >
                                Assign Expression
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
