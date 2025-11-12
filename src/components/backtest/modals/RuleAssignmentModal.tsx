import { useState } from 'react';
import { SwitchingRule } from '../../../types/strategy';

interface RuleAssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAssign: (ruleExpression: string) => void;
    availableRules: SwitchingRule[];
    targetAllocation: string | null;
}

type RuleItem = {
    ruleName: string;
    operator?: 'AND' | 'OR';
};

export const RuleAssignmentModal: React.FC<RuleAssignmentModalProps> = ({
    isOpen,
    onClose,
    onAssign,
    availableRules,
    targetAllocation,
}) => {
    const [ruleChain, setRuleChain] = useState<RuleItem[]>([]);
    const [selectedRuleToAdd, setSelectedRuleToAdd] = useState<string | null>(null);

    if (!isOpen) return null;

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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Manage Portfolio Rules</h2>
                        <p className="text-sm text-slate-600 mt-1">
                            Assign switching rules to <span className="font-semibold text-purple-700">{targetAllocation}</span>
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            Rules determine when to switch TO this portfolio
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
                    {/* Rule Chain Builder */}
                    {ruleChain.length > 0 && (
                        <div className="mb-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-xl">
                            <div className="flex items-center gap-2 mb-3">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <h3 className="font-bold text-purple-900">Rule Expression</h3>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                {ruleChain.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        {/* Rule Pill */}
                                        <div className="flex items-center gap-2 bg-white border-2 border-purple-300 rounded-lg px-3 py-2 shadow-sm">
                                            <span className="font-semibold text-slate-900 text-sm">
                                                {item.ruleName}
                                            </span>
                                            <button
                                                onClick={() => removeRuleFromChain(index)}
                                                className="p-0.5 hover:bg-red-100 rounded transition-colors"
                                            >
                                                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Operator Toggle (not for last item) */}
                                        {index < ruleChain.length - 1 && (
                                            <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                                                <button
                                                    onClick={() => updateOperator(index, 'AND')}
                                                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${item.operator === 'AND'
                                                            ? 'bg-blue-500 text-white shadow'
                                                            : 'bg-transparent text-slate-600 hover:bg-slate-200'
                                                        }`}
                                                >
                                                    AND
                                                </button>
                                                <button
                                                    onClick={() => updateOperator(index, 'OR')}
                                                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${item.operator === 'OR'
                                                            ? 'bg-emerald-500 text-white shadow'
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
                            <div className="mt-3 text-xs font-mono text-slate-600 bg-white p-2 rounded border border-purple-200">
                                {buildExpression()}
                            </div>
                        </div>
                    )}

                    {/* Available Rules */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-700 mb-3">
                            {ruleChain.length === 0 ? 'Select a rule to start' : 'Add another rule'}
                        </h3>
                        {availableRules.length === 0 ? (
                            <div className="text-center py-8">
                                <svg className="w-16 h-16 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-slate-600 mb-4">No rules created yet</p>
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
                                                    ? 'border-slate-200 bg-slate-50 opacity-50'
                                                    : selectedRuleToAdd === ruleName
                                                        ? 'border-purple-500 bg-purple-50'
                                                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-slate-900">
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
                                                            <span className="text-xs text-slate-500 italic">
                                                                (already added)
                                                            </span>
                                                        )}
                                                    </div>
                                                    {rule.condition && (
                                                        <div className="text-xs text-slate-600 mt-2 font-mono bg-white p-2 rounded">
                                                            <span className="font-semibold text-purple-600">
                                                                {rule.condition.left.type}
                                                            </span>
                                                            <span className="text-slate-500">
                                                                ({rule.condition.left.symbol}, {rule.condition.left.window}d)
                                                            </span>
                                                            <span className="mx-1 text-purple-700 font-bold">
                                                                {rule.condition.comparison}
                                                            </span>
                                                            <span className="font-semibold text-blue-600">
                                                                {rule.condition.right.type === 'VALUE'
                                                                    ? rule.condition.right.value
                                                                    : rule.condition.right.type}
                                                            </span>
                                                            {rule.condition.right.type !== 'VALUE' && (
                                                                <span className="text-slate-500">
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
                                                                className="px-4 py-1.5 bg-purple-600 text-white text-sm font-bold rounded-lg hover:bg-purple-700 transition-colors"
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
                    <div className="px-6 py-4 border-t border-slate-200 flex gap-3">
                        <button
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAssign}
                            disabled={ruleChain.length === 0}
                            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            Assign Expression
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
