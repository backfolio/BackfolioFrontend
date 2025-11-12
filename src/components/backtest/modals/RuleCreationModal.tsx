import { useState, useMemo } from 'react';
import { SwitchingRule, Condition } from '../../../types/strategy';

interface RuleCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (rule: Partial<SwitchingRule>) => void;
}

// Map each indicator to its compatibility group(s)
// Indicators in the same group can be logically compared (same units/scale)
const INDICATOR_TO_GROUP: Record<string, string[]> = {
    SMA: ['PRICE_BASED'],
    EMA: ['PRICE_BASED'],
    PRICE: ['PRICE_BASED'],
    RSI: ['PERCENTAGE'],
    RETURN: ['PERCENTAGE'],
    VOLATILITY: ['PERCENTAGE'],
    DRAWDOWN: ['PERCENTAGE'],
    VIX: ['YIELD'],
    T10Y: ['YIELD'],
    T2Y: ['YIELD'],
    T3M: ['YIELD'],
    MONTH: ['CALENDAR'],
    DAY_OF_WEEK: ['CALENDAR'],
    DAY_OF_MONTH: ['CALENDAR'],
    DAY_OF_YEAR: ['CALENDAR'],
    MACD: ['MOMENTUM', 'PERCENTAGE'], // MACD can compare to zero or other MACD
    THRESHOLD: ['UNIVERSAL'],
};

// Check if two indicators are compatible for comparison
const areIndicatorsCompatible = (left: string, right: string): boolean => {
    // THRESHOLD is compatible with everything
    if (left === 'THRESHOLD' || right === 'THRESHOLD') return true;

    const leftGroups = INDICATOR_TO_GROUP[left] || [];
    const rightGroups = INDICATOR_TO_GROUP[right] || [];

    // Check if they share any group
    return leftGroups.some(group => rightGroups.includes(group));
};

const RULE_TEMPLATES = {
    sma_cross: {
        name: 'SMA Crossover',
        rule_type: 'buy' as const, // Legacy field, actual logic in condition
        condition: {
            left: { type: 'SMA', symbol: 'SPY', window: 50 },
            comparison: '>' as const,
            right: { type: 'SMA', symbol: 'SPY', window: 200 },
        },
    },
    ema_cross: {
        name: 'EMA Crossover',
        rule_type: 'buy' as const,
        condition: {
            left: { type: 'EMA', symbol: 'SPY', window: 12 },
            comparison: '>' as const,
            right: { type: 'EMA', symbol: 'SPY', window: 26 },
        },
    },
    momentum: {
        name: 'Positive Momentum',
        rule_type: 'buy' as const,
        condition: {
            left: { type: 'RETURN', symbol: 'SPY', window: 60 },
            comparison: '>' as const,
            right: { type: 'constant', value: 0 },
        },
    },
    volatility: {
        name: 'High Volatility Exit',
        rule_type: 'sell' as const,
        condition: {
            left: { type: 'VOLATILITY', symbol: 'SPY', window: 20 },
            comparison: '>' as const,
            right: { type: 'constant', value: 20 },
        },
    },
    rsi_oversold: {
        name: 'RSI Oversold',
        rule_type: 'buy' as const,
        condition: {
            left: { type: 'RSI', symbol: 'SPY', window: 14 },
            comparison: '<' as const,
            right: { type: 'constant', value: 30 },
        },
    },
    rsi_overbought: {
        name: 'RSI Overbought',
        rule_type: 'sell' as const,
        condition: {
            left: { type: 'RSI', symbol: 'SPY', window: 14 },
            comparison: '>' as const,
            right: { type: 'constant', value: 70 },
        },
    },
    drawdown_limit: {
        name: 'Drawdown Protection',
        rule_type: 'sell' as const,
        condition: {
            left: { type: 'DRAWDOWN', symbol: 'SPY', window: 252 },
            comparison: '>' as const,
            right: { type: 'constant', value: 15 },
        },
    },
    vix_spike: {
        name: 'VIX Spike Exit',
        rule_type: 'sell' as const,
        condition: {
            left: { type: 'VIX', symbol: '^VIX', window: 1 },
            comparison: '>' as const,
            right: { type: 'constant', value: 30 },
        },
    },
    yield_curve: {
        name: 'Yield Curve Inversion',
        rule_type: 'sell' as const,
        condition: {
            left: { type: 'T10Y', symbol: '^TNX', window: 1 },
            comparison: '<' as const,
            right: { type: 'T2Y', symbol: '^UST2Y', window: 1 },
        },
    },
    seasonal_may: {
        name: 'Sell in May',
        rule_type: 'sell' as const,
        condition: {
            left: { type: 'MONTH', symbol: 'DATE', window: 1 },
            comparison: '>=' as const,
            right: { type: 'constant', value: 5 },
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

    // Condition state
    const [leftType, setLeftType] = useState('SMA');
    const [leftSymbol, setLeftSymbol] = useState('SPY');
    const [leftWindow, setLeftWindow] = useState(20);
    const [comparison, setComparison] = useState<'>' | '<' | '>=' | '<=' | '=='>('>');
    const [rightType, setRightType] = useState('SMA');
    const [rightSymbol, setRightSymbol] = useState('SPY');
    const [rightWindow, setRightWindow] = useState(50);
    const [rightValue, setRightValue] = useState(0);

    // Get compatible right-side options based on left-side selection
    const compatibleRightTypes = useMemo(() => {
        const leftGroups = INDICATOR_TO_GROUP[leftType] || [];
        const compatible: string[] = ['THRESHOLD']; // Always include threshold

        // Add all indicators that share a group with the left indicator
        Object.entries(INDICATOR_TO_GROUP).forEach(([indicator, groups]) => {
            if (indicator !== leftType && groups.some(g => leftGroups.includes(g))) {
                compatible.push(indicator);
            }
        });

        return compatible;
    }, [leftType]);

    // Check if current combination is valid
    const isValidCombination = areIndicatorsCompatible(leftType, rightType);

    // Auto-reset right side to THRESHOLD if incompatible
    const handleLeftTypeChange = (newLeftType: string) => {
        setLeftType(newLeftType);

        // If current right type becomes incompatible, reset to THRESHOLD
        if (!areIndicatorsCompatible(newLeftType, rightType)) {
            setRightType('THRESHOLD');
        }
    };

    if (!isOpen) return null;

    const handleTemplateSelect = (templateKey: keyof typeof RULE_TEMPLATES) => {
        const template = RULE_TEMPLATES[templateKey];
        onCreate(template);
        handleClose();
    };

    const handleCustomCreate = () => {
        // Helper to check if indicator needs no params (calendar types)
        const isCalendarType = (type: string) =>
            ['MONTH', 'DAY_OF_WEEK', 'DAY_OF_MONTH', 'DAY_OF_YEAR'].includes(type);

        // Build left side
        const leftSide: any = { type: leftType };
        if (leftType === 'THRESHOLD') {
            leftSide.value = leftWindow; // Reuse leftWindow for threshold value
        } else if (!isCalendarType(leftType)) {
            leftSide.symbol = leftSymbol;
            if (leftType !== 'PRICE') {
                leftSide.window = leftWindow;
            }
        }

        // Build right side
        const rightSide: any = {
            type: rightType === 'THRESHOLD' ? 'constant' : rightType
        };
        if (rightType === 'THRESHOLD') {
            rightSide.value = rightValue;
        } else if (!isCalendarType(rightType)) {
            rightSide.symbol = rightSymbol;
            if (rightType !== 'PRICE') {
                rightSide.window = rightWindow;
            }
        }

        const condition: Condition = {
            left: leftSide,
            comparison,
            right: rightSide,
        };

        // Generate condition preview string for auto-naming
        const leftPreview = leftType === 'PRICE'
            ? `PRICE(${leftSymbol})`
            : leftType === 'THRESHOLD'
                ? leftWindow.toString()
                : isCalendarType(leftType)
                    ? leftType
                    : `${leftType}(${leftSymbol}, ${leftWindow})`;

        const rightPreview = rightType === 'PRICE'
            ? `PRICE(${rightSymbol})`
            : rightType === 'THRESHOLD'
                ? rightValue.toString()
                : isCalendarType(rightType)
                    ? rightType
                    : `${rightType}(${rightSymbol}, ${rightWindow})`;

        const generatedName = `${leftPreview} ${comparison} ${rightPreview}`;

        onCreate({
            name: ruleName.trim() || generatedName, // Use provided name or auto-generate
            rule_type: 'buy', // Default to buy, actual logic determined by condition
            condition,
        });

        // Reset form
        setRuleName('');
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
    };

    const handleClose = () => {
        setMode('template');
        setRuleName('');
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
                                            <h3 className="font-bold text-slate-900 group-hover:text-purple-700">
                                                {template.name}
                                            </h3>
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
                                    Rule Name <span className="text-slate-500 text-xs font-normal">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={ruleName}
                                    onChange={(e) => setRuleName(e.target.value)}
                                    placeholder="Auto-generated from condition if left blank"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
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
                                            onChange={(e) => handleLeftTypeChange(e.target.value)}
                                            className="px-2 py-1.5 border border-slate-300 rounded text-slate-700 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        >
                                            <optgroup label="Technical Indicators">
                                                <option value="SMA">SMA - Simple Moving Avg</option>
                                                <option value="EMA">EMA - Exponential Moving Avg</option>
                                                <option value="RSI">RSI - Relative Strength Index</option>
                                                <option value="MACD">MACD - Moving Avg Convergence</option>
                                            </optgroup>
                                            <optgroup label="Price & Returns">
                                                <option value="PRICE">PRICE - Close Price</option>
                                                <option value="RETURN">RETURN - Percent Change</option>
                                            </optgroup>
                                            <optgroup label="Risk Metrics">
                                                <option value="VOLATILITY">VOLATILITY - Annualized StdDev</option>
                                                <option value="DRAWDOWN">DRAWDOWN - Percent Drawdown</option>
                                            </optgroup>
                                            <optgroup label="Market Indicators">
                                                <option value="VIX">VIX - Volatility Index</option>
                                                <option value="T10Y">T10Y - 10Y Treasury Yield</option>
                                                <option value="T2Y">T2Y - 2Y Treasury Yield</option>
                                                <option value="T3M">T3M - 3M Treasury Yield</option>
                                            </optgroup>
                                            <optgroup label="Calendar">
                                                <option value="MONTH">MONTH - Month Number</option>
                                                <option value="DAY_OF_WEEK">DAY_OF_WEEK - Weekday Number</option>
                                                <option value="DAY_OF_MONTH">DAY_OF_MONTH - Day in Month</option>
                                                <option value="DAY_OF_YEAR">DAY_OF_YEAR - Day in Year</option>
                                            </optgroup>
                                            <optgroup label="Other">
                                                <option value="THRESHOLD">THRESHOLD - Constant Value</option>
                                            </optgroup>
                                        </select>
                                        {leftType !== 'PRICE' && leftType !== 'THRESHOLD' && leftType !== 'MONTH' &&
                                            leftType !== 'DAY_OF_WEEK' && leftType !== 'DAY_OF_MONTH' && leftType !== 'DAY_OF_YEAR' && (
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
                                        {leftType === 'PRICE' && (
                                            <input
                                                type="text"
                                                value={leftSymbol}
                                                onChange={(e) => setLeftSymbol(e.target.value)}
                                                placeholder="Symbol"
                                                className="col-span-2 px-2 py-1.5 border border-slate-300 rounded text-slate-700 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        )}
                                        {leftType === 'THRESHOLD' && (
                                            <input
                                                type="number"
                                                value={leftWindow}
                                                onChange={(e) => setLeftWindow(parseFloat(e.target.value) || 0)}
                                                placeholder="Constant value"
                                                className="col-span-2 px-2 py-1.5 border border-slate-300 rounded text-slate-700 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        )}
                                        {(leftType === 'MONTH' || leftType === 'DAY_OF_WEEK' ||
                                            leftType === 'DAY_OF_MONTH' || leftType === 'DAY_OF_YEAR') && (
                                                <div className="col-span-2 px-2 py-1.5 text-slate-500 text-sm italic">
                                                    No parameters needed
                                                </div>
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
                                            <optgroup label="Technical Indicators">
                                                <option value="SMA" disabled={!compatibleRightTypes.includes('SMA')}>
                                                    SMA - Simple Moving Avg
                                                </option>
                                                <option value="EMA" disabled={!compatibleRightTypes.includes('EMA')}>
                                                    EMA - Exponential Moving Avg
                                                </option>
                                                <option value="RSI" disabled={!compatibleRightTypes.includes('RSI')}>
                                                    RSI - Relative Strength Index
                                                </option>
                                                <option value="MACD" disabled={!compatibleRightTypes.includes('MACD')}>
                                                    MACD - Moving Avg Convergence
                                                </option>
                                            </optgroup>
                                            <optgroup label="Price & Returns">
                                                <option value="PRICE" disabled={!compatibleRightTypes.includes('PRICE')}>
                                                    PRICE - Close Price
                                                </option>
                                                <option value="RETURN" disabled={!compatibleRightTypes.includes('RETURN')}>
                                                    RETURN - Percent Change
                                                </option>
                                            </optgroup>
                                            <optgroup label="Risk Metrics">
                                                <option value="VOLATILITY" disabled={!compatibleRightTypes.includes('VOLATILITY')}>
                                                    VOLATILITY - Annualized StdDev
                                                </option>
                                                <option value="DRAWDOWN" disabled={!compatibleRightTypes.includes('DRAWDOWN')}>
                                                    DRAWDOWN - Percent Drawdown
                                                </option>
                                            </optgroup>
                                            <optgroup label="Market Indicators">
                                                <option value="VIX" disabled={!compatibleRightTypes.includes('VIX')}>
                                                    VIX - Volatility Index
                                                </option>
                                                <option value="T10Y" disabled={!compatibleRightTypes.includes('T10Y')}>
                                                    T10Y - 10Y Treasury Yield
                                                </option>
                                                <option value="T2Y" disabled={!compatibleRightTypes.includes('T2Y')}>
                                                    T2Y - 2Y Treasury Yield
                                                </option>
                                                <option value="T3M" disabled={!compatibleRightTypes.includes('T3M')}>
                                                    T3M - 3M Treasury Yield
                                                </option>
                                            </optgroup>
                                            <optgroup label="Calendar">
                                                <option value="MONTH" disabled={!compatibleRightTypes.includes('MONTH')}>
                                                    MONTH - Month Number
                                                </option>
                                                <option value="DAY_OF_WEEK" disabled={!compatibleRightTypes.includes('DAY_OF_WEEK')}>
                                                    DAY_OF_WEEK - Weekday Number
                                                </option>
                                                <option value="DAY_OF_MONTH" disabled={!compatibleRightTypes.includes('DAY_OF_MONTH')}>
                                                    DAY_OF_MONTH - Day in Month
                                                </option>
                                                <option value="DAY_OF_YEAR" disabled={!compatibleRightTypes.includes('DAY_OF_YEAR')}>
                                                    DAY_OF_YEAR - Day in Year
                                                </option>
                                            </optgroup>
                                            <optgroup label="Other">
                                                <option value="THRESHOLD">THRESHOLD - Constant Value</option>
                                            </optgroup>
                                        </select>
                                        {rightType !== 'PRICE' && rightType !== 'THRESHOLD' && rightType !== 'MONTH' &&
                                            rightType !== 'DAY_OF_WEEK' && rightType !== 'DAY_OF_MONTH' && rightType !== 'DAY_OF_YEAR' && (
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
                                        {rightType === 'PRICE' && (
                                            <input
                                                type="text"
                                                value={rightSymbol}
                                                onChange={(e) => setRightSymbol(e.target.value)}
                                                placeholder="Symbol"
                                                className="col-span-2 px-2 py-1.5 border border-slate-300 rounded text-slate-700 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        )}
                                        {rightType === 'THRESHOLD' && (
                                            <input
                                                type="number"
                                                value={rightValue}
                                                onChange={(e) => setRightValue(parseFloat(e.target.value) || 0)}
                                                placeholder="Constant value"
                                                className="col-span-2 px-2 py-1.5 border border-slate-300 rounded text-slate-700 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        )}
                                        {(rightType === 'MONTH' || rightType === 'DAY_OF_WEEK' ||
                                            rightType === 'DAY_OF_MONTH' || rightType === 'DAY_OF_YEAR') && (
                                                <div className="col-span-2 px-2 py-1.5 text-slate-500 text-sm italic">
                                                    No parameters needed
                                                </div>
                                            )}
                                    </div>
                                </div>

                                {/* Validation Warning */}
                                {!isValidCombination && (
                                    <div className="mb-3 p-3 bg-amber-50 border border-amber-300 rounded-lg">
                                        <div className="flex items-start gap-2">
                                            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-amber-800">Invalid Comparison</p>
                                                <p className="text-xs text-amber-700 mt-1">
                                                    {leftType} and {rightType} are not compatible.
                                                    {leftType} values are measured in different units than {rightType}.
                                                    Consider comparing to THRESHOLD instead.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Condition Preview */}
                                <div className="bg-slate-900 p-3 rounded-lg border border-slate-300">
                                    <label className="block text-xs font-medium text-slate-400 mb-2">
                                        CONDITION PREVIEW
                                    </label>
                                    <code className="text-sm text-emerald-400 font-mono">
                                        {leftType === 'PRICE'
                                            ? `PRICE(${leftSymbol})`
                                            : leftType === 'THRESHOLD'
                                                ? leftWindow
                                                : ['MONTH', 'DAY_OF_WEEK', 'DAY_OF_MONTH', 'DAY_OF_YEAR'].includes(leftType)
                                                    ? leftType
                                                    : `${leftType}(${leftSymbol}, ${leftWindow})`}
                                        {' '}{comparison}{' '}
                                        {rightType === 'PRICE'
                                            ? `PRICE(${rightSymbol})`
                                            : rightType === 'THRESHOLD'
                                                ? rightValue
                                                : ['MONTH', 'DAY_OF_WEEK', 'DAY_OF_MONTH', 'DAY_OF_YEAR'].includes(rightType)
                                                    ? rightType
                                                    : `${rightType}(${rightSymbol}, ${rightWindow})`}
                                    </code>
                                </div>
                            </div>

                            {/* Create Button */}
                            <button
                                onClick={handleCustomCreate}
                                disabled={!isValidCombination}
                                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all"
                            >
                                {!isValidCombination ? 'Invalid Indicator Combination' : 'Create Rule'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
