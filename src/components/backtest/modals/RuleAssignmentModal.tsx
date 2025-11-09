import { useState } from 'react';
import { SwitchingRule } from '../../../types/strategy';

interface RuleAssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAssign: (ruleName: string) => void;
    availableRules: SwitchingRule[];
    targetAllocation: string | null;
}

export const RuleAssignmentModal: React.FC<RuleAssignmentModalProps> = ({
    isOpen,
    onClose,
    onAssign,
    availableRules,
    targetAllocation,
}) => {
    const [selectedRule, setSelectedRule] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleAssign = () => {
        if (selectedRule) {
            onAssign(selectedRule);
            setSelectedRule(null);
        }
    };

    const handleClose = () => {
        setSelectedRule(null);
        onClose();
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
                            {availableRules.map((rule, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedRule(rule.name || `Rule ${index + 1}`)}
                                    className={`w-full p-4 border-2 rounded-xl transition-all text-left ${selectedRule === (rule.name || `Rule ${index + 1}`)
                                        ? 'border-purple-500 bg-purple-50'
                                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-slate-900">
                                                    {rule.name || `Rule ${index + 1}`}
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
                                            </div>
                                            {rule.condition && (
                                                <div className="text-xs text-slate-600 mt-2 font-mono bg-slate-50 p-2 rounded">
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
                                                        {rule.condition.right.type === 'VALUE' ?
                                                            rule.condition.right.value :
                                                            rule.condition.right.type
                                                        }
                                                    </span>
                                                    {rule.condition.right.type !== 'VALUE' && (
                                                        <span className="text-slate-500">
                                                            ({rule.condition.right.symbol}, {rule.condition.right.window}d)
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {selectedRule === (rule.name || `Rule ${index + 1}`) && (
                                            <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
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
                            disabled={!selectedRule}
                            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            Assign Rule
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
