import { useState } from 'react';
import { SwitchingRule, Condition } from '../../../types/strategy';

interface RuleCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (rule: Partial<SwitchingRule>) => void;
}

const RULE_TEMPLATES = {
    sma_cross: {
        name: 'SMA Crossover',
        rule_type: 'buy' as const,
        condition: {
            left: { type: 'SMA', symbol: 'SPY', window: 50 },
            comparison: '>' as const,
            right: { type: 'SMA', symbol: 'SPY', window: 200 },
        },
    },
    momentum: {
        name: 'Momentum Signal',
        rule_type: 'buy' as const,
        condition: {
            left: { type: 'MOMENTUM', symbol: 'SPY', trading_days: 60 },
            comparison: '>' as const,
            right: { type: 'constant', value: 0 },
        },
    },
    volatility: {
        name: 'Low Volatility',
        rule_type: 'sell' as const,
        condition: {
            left: { type: 'VOLATILITY', symbol: 'VIX', window: 20 },
            comparison: '>' as const,
            right: { type: 'constant', value: 20 },
        },
    },
    rsi: {
        name: 'RSI Oversold',
        rule_type: 'buy' as const,
        condition: {
            left: { type: 'RSI', symbol: 'SPY', window: 14 },
            comparison: '<' as const,
            right: { type: 'constant', value: 30 },
        },
    },
};

export const RuleCreationModal: React.FC<RuleCreationModalProps> = ({
    isOpen,
    onClose,
    onCreate,
}) => {
    const [mode, setMode] = useState<'template' | 'custom'>('template');
    const [ruleName, setRuleName] = useState('');
    const [ruleType, setRuleType] = useState<'buy' | 'sell' | 'hold'>('buy');

    // Condition state
    const [leftType, setLeftType] = useState('SMA');
    const [leftSymbol, setLeftSymbol] = useState('SPY');
    const [leftWindow, setLeftWindow] = useState(20);
    const [comparison, setComparison] = useState<'>' | '<' | '>=' | '<=' | '=='>('>');
    const [rightType, setRightType] = useState('SMA');
    const [rightSymbol, setRightSymbol] = useState('SPY');
    const [rightWindow, setRightWindow] = useState(50);
    const [rightValue, setRightValue] = useState(0);

    if (!isOpen) return null;

    const handleTemplateSelect = (templateKey: keyof typeof RULE_TEMPLATES) => {
        const template = RULE_TEMPLATES[templateKey];
        onCreate(template);
        handleClose();
    };

    const handleCustomCreate = () => {
        if (!ruleName.trim()) return;

        // Build condition object
        const condition: Condition = {
            left: {
                type: leftType,
                symbol: leftSymbol,
                ...(leftType !== 'CLOSE' && leftType !== 'VALUE' && { window: leftWindow }),
            },
            comparison,
            right: {
                type: rightType === 'VALUE' ? 'constant' : rightType,
                ...(rightType === 'VALUE' && { value: rightValue }),
                ...(rightType !== 'VALUE' && { symbol: rightSymbol }),
                ...(rightType !== 'CLOSE' && rightType !== 'VALUE' && { window: rightWindow }),
            },
        };

        onCreate({
            name: ruleName,
            rule_type: ruleType,
            condition,
        });

        // Reset form
        setRuleName('');
        setRuleType('buy');
        setLeftType('SMA');
        setLeftSymbol('SPY');
        setLeftWindow(20);
        setComparison('>');
        setRightType('SMA');
        setRightSymbol('SPY');
        setRightWindow(50);
        setRightValue(0);
        setMode('template');
        onClose();
    }; const handleClose = () => {
        setMode('template');
        setRuleName('');
        setRuleType('buy');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-slate-900">Create Switching Rule</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Mode Toggle */}
                <div className="px-6 py-4 border-b border-slate-200">
                    <div className="flex gap-2 bg-slate-100 rounded-lg p-1">
                        <button
                            onClick={() => setMode('template')}
                            className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-all ${mode === 'template'
                                ? 'bg-white text-purple-700 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            Choose Template
                        </button>
                        <button
                            onClick={() => setMode('custom')}
                            className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-all ${mode === 'custom'
                                ? 'bg-white text-purple-700 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            Create Custom
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                    {mode === 'template' ? (
                        <div className="space-y-3">
                            <p className="text-sm text-slate-600 mb-4">
                                Select a pre-configured rule template
                            </p>
                            {Object.entries(RULE_TEMPLATES).map(([key, template]) => (
                                <button
                                    key={key}
                                    onClick={() => handleTemplateSelect(key as keyof typeof RULE_TEMPLATES)}
                                    className="w-full p-4 border-2 border-slate-200 hover:border-purple-500 hover:bg-purple-50 rounded-xl transition-all text-left group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-slate-900 group-hover:text-purple-700">
                                                    {template.name}
                                                </h3>
                                                <span
                                                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${template.rule_type === 'buy'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-red-100 text-red-700'
                                                        }`}
                                                >
                                                    {template.rule_type}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-600 mt-1">
                                                {template.condition.left.type} {template.condition.comparison}{' '}
                                                {template.condition.right.type === 'constant'
                                                    ? (template.condition.right as any).value
                                                    : template.condition.right.type}
                                            </p>
                                        </div>
                                        <svg
                                            className="w-5 h-5 text-slate-400 group-hover:text-purple-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-slate-600">
                                Build a custom switching condition
                            </p>

                            {/* Rule Name */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Rule Name
                                </label>
                                <input
                                    type="text"
                                    value={ruleName}
                                    onChange={(e) => setRuleName(e.target.value)}
                                    placeholder="e.g., Bull Market Signal"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            {/* Rule Type */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Rule Type
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => setRuleType('buy')}
                                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${ruleType === 'buy'
                                            ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-500'
                                            : 'bg-slate-100 text-slate-600 border-2 border-transparent hover:border-slate-300'
                                            }`}
                                    >
                                        Buy
                                    </button>
                                    <button
                                        onClick={() => setRuleType('sell')}
                                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${ruleType === 'sell'
                                            ? 'bg-red-100 text-red-700 border-2 border-red-500'
                                            : 'bg-slate-100 text-slate-600 border-2 border-transparent hover:border-slate-300'
                                            }`}
                                    >
                                        Sell
                                    </button>
                                    <button
                                        onClick={() => setRuleType('hold')}
                                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${ruleType === 'hold'
                                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                                            : 'bg-slate-100 text-slate-600 border-2 border-transparent hover:border-slate-300'
                                            }`}
                                    >
                                        Hold
                                    </button>
                                </div>
                            </div>

                            {/* Condition Builder */}
                            <div className="border-t border-slate-200 pt-4">
                                <h4 className="text-sm font-semibold text-slate-700 mb-3">Condition Builder</h4>

                                {/* Left Side */}
                                <div className="bg-slate-50 p-3 rounded-lg mb-3 border border-slate-200">
                                    <label className="block text-xs font-medium text-slate-600 mb-2">
                                        LEFT SIDE
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <select
                                            value={leftType}
                                            onChange={(e) => setLeftType(e.target.value)}
                                            className="px-2 py-1.5 border border-slate-300 rounded text-slate-700 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        >
                                            <option value="SMA">SMA</option>
                                            <option value="EMA">EMA</option>
                                            <option value="RSI">RSI</option>
                                            <option value="MACD">MACD</option>
                                            <option value="CLOSE">CLOSE</option>
                                            <option value="VALUE">VALUE</option>
                                        </select>
                                        {leftType !== 'CLOSE' && leftType !== 'VALUE' && (
                                            <>
                                                <input
                                                    type="text"
                                                    value={leftSymbol}
                                                    onChange={(e) => setLeftSymbol(e.target.value)}
                                                    placeholder="Symbol"
                                                    className="px-2 py-1.5 border border-slate-300 rounded text-slate-700 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                />
                                                <input
                                                    type="number"
                                                    value={leftWindow}
                                                    onChange={(e) => setLeftWindow(parseInt(e.target.value) || 0)}
                                                    placeholder="Window"
                                                    className="px-2 py-1.5 border border-slate-300 rounded text-slate-700 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                />
                                            </>
                                        )}
                                        {leftType === 'CLOSE' && (
                                            <input
                                                type="text"
                                                value={leftSymbol}
                                                onChange={(e) => setLeftSymbol(e.target.value)}
                                                placeholder="Symbol"
                                                className="col-span-2 px-2 py-1.5 border border-slate-300 rounded text-slate-700 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        )}
                                        {leftType === 'VALUE' && (
                                            <input
                                                type="text"
                                                value={leftSymbol}
                                                onChange={(e) => setLeftSymbol(e.target.value)}
                                                placeholder="Numeric value"
                                                className="col-span-2 px-2 py-1.5 border border-slate-300 rounded text-slate-700 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Comparison */}
                                <div className="flex justify-center mb-3">
                                    <select
                                        value={comparison}
                                        onChange={(e) => setComparison(e.target.value as '>' | '<' | '>=' | '<=' | '==')}
                                        className="px-4 py-1.5 border border-slate-300 rounded text-slate-700 text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value=">">{'>'} Greater Than</option>
                                        <option value="<">{'<'} Less Than</option>
                                        <option value=">=">{'>='} Greater or Equal</option>
                                        <option value="<=">{'<='} Less or Equal</option>
                                        <option value="==">== Equal To</option>
                                    </select>
                                </div>

                                {/* Right Side */}
                                <div className="bg-slate-50 p-3 rounded-lg mb-3 border border-slate-200">
                                    <label className="block text-xs font-medium text-slate-600 mb-2">
                                        RIGHT SIDE
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <select
                                            value={rightType}
                                            onChange={(e) => setRightType(e.target.value)}
                                            className="px-2 py-1.5 border border-slate-300 rounded text-slate-700 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        >
                                            <option value="SMA">SMA</option>
                                            <option value="EMA">EMA</option>
                                            <option value="RSI">RSI</option>
                                            <option value="MACD">MACD</option>
                                            <option value="CLOSE">CLOSE</option>
                                            <option value="VALUE">VALUE</option>
                                        </select>
                                        {rightType !== 'CLOSE' && rightType !== 'VALUE' && (
                                            <>
                                                <input
                                                    type="text"
                                                    value={rightSymbol}
                                                    onChange={(e) => setRightSymbol(e.target.value)}
                                                    placeholder="Symbol"
                                                    className="px-2 py-1.5 border border-slate-300 rounded text-slate-700 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                />
                                                <input
                                                    type="number"
                                                    value={rightWindow}
                                                    onChange={(e) => setRightWindow(parseInt(e.target.value) || 0)}
                                                    placeholder="Window"
                                                    className="px-2 py-1.5 border border-slate-300 rounded text-slate-700 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                />
                                            </>
                                        )}
                                        {rightType === 'CLOSE' && (
                                            <input
                                                type="text"
                                                value={rightSymbol}
                                                onChange={(e) => setRightSymbol(e.target.value)}
                                                placeholder="Symbol"
                                                className="col-span-2 px-2 py-1.5 border border-slate-300 rounded text-slate-700 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        )}
                                        {rightType === 'VALUE' && (
                                            <input
                                                type="number"
                                                value={rightValue}
                                                onChange={(e) => setRightValue(parseFloat(e.target.value) || 0)}
                                                placeholder="Numeric value"
                                                className="col-span-2 px-2 py-1.5 border border-slate-300 rounded text-slate-700 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Condition Preview */}
                                <div className="bg-slate-900 p-3 rounded-lg border border-slate-300">
                                    <label className="block text-xs font-medium text-slate-400 mb-2">
                                        CONDITION PREVIEW
                                    </label>
                                    <code className="text-sm text-emerald-400 font-mono">
                                        {leftType === 'CLOSE'
                                            ? `CLOSE(${leftSymbol})`
                                            : leftType === 'VALUE'
                                                ? leftSymbol
                                                : `${leftType}(${leftSymbol}, ${leftWindow})`}
                                        {' '}{comparison}{' '}
                                        {rightType === 'CLOSE'
                                            ? `CLOSE(${rightSymbol})`
                                            : rightType === 'VALUE'
                                                ? rightValue
                                                : `${rightType}(${rightSymbol}, ${rightWindow})`}
                                    </code>
                                </div>
                            </div>

                            {/* Create Button */}
                            <button
                                onClick={handleCustomCreate}
                                disabled={!ruleName.trim()}
                                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all"
                            >
                                Create Rule
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
