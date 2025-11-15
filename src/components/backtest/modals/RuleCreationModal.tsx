import { useState, useMemo } from 'react';
import { SwitchingRule, Condition } from '../../../types/strategy';
import { useTheme } from '../../../context/ThemeContext';

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
    const { theme } = useTheme();
    const isDark = theme === 'dark';

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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className={`rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col ${isDark ? 'bg-gradient-to-br from-slate-900 to-black border border-white/[0.12]' : 'bg-white'
                }`}>
                {/* Header - Cleaner */}
                <div className={`px-6 py-4 flex items-center justify-between flex-shrink-0 ${isDark ? 'bg-black/30 border-b border-white/[0.08]' : 'bg-gradient-to-b from-slate-50 to-white border-b border-slate-200'
                    }`}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Create Switching Rule
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className={`p-1.5 rounded-lg transition-all hover:scale-110 ${isDark ? 'hover:bg-white/[0.05] text-gray-400 hover:text-gray-200' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Mode Toggle - Refined */}
                <div className={`px-6 py-3 flex-shrink-0 ${isDark ? 'border-b border-white/[0.08]' : 'border-b border-slate-200'}`}>
                    <div className={`inline-flex gap-1 rounded-lg p-1 ${isDark ? 'bg-white/[0.03]' : 'bg-slate-100'}`}>
                        <button
                            onClick={() => setMode('template')}
                            className={`px-4 py-1.5 rounded-md font-medium text-sm transition-all ${mode === 'template'
                                ? isDark
                                    ? 'bg-purple-500/20 text-purple-300 shadow-sm border border-purple-500/30'
                                    : 'bg-white text-purple-700 shadow-sm border border-purple-200'
                                : isDark
                                    ? 'text-gray-400 hover:text-gray-200'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            📋 Templates
                        </button>
                        <button
                            onClick={() => setMode('custom')}
                            className={`px-4 py-1.5 rounded-md font-medium text-sm transition-all ${mode === 'custom'
                                ? isDark
                                    ? 'bg-purple-500/20 text-purple-300 shadow-sm border border-purple-500/30'
                                    : 'bg-white text-purple-700 shadow-sm border border-purple-200'
                                : isDark
                                    ? 'text-gray-400 hover:text-gray-200'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            ⚡ Custom
                        </button>
                    </div>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {mode === 'template' ? (
                        <div className="space-y-2.5">
                            <p className={`text-xs mb-3 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                                Quick-start with proven strategies
                            </p>
                            {Object.entries(RULE_TEMPLATES).map(([key, template]) => {
                                // Categorize templates for visual grouping
                                const category =
                                    key.includes('sma') || key.includes('ema') ? 'trend' :
                                        key.includes('rsi') ? 'momentum' :
                                            key.includes('volatility') || key.includes('drawdown') || key.includes('vix') ? 'risk' :
                                                key.includes('yield') ? 'macro' :
                                                    key === 'seasonal_may' ? 'seasonal' : 'other';

                                const categoryColors = {
                                    trend: isDark ? 'from-blue-500/10 to-blue-600/5 border-blue-500/20' : 'from-blue-50 to-blue-100/50 border-blue-200',
                                    momentum: isDark ? 'from-purple-500/10 to-purple-600/5 border-purple-500/20' : 'from-purple-50 to-purple-100/50 border-purple-200',
                                    risk: isDark ? 'from-red-500/10 to-red-600/5 border-red-500/20' : 'from-red-50 to-red-100/50 border-red-200',
                                    macro: isDark ? 'from-amber-500/10 to-amber-600/5 border-amber-500/20' : 'from-amber-50 to-amber-100/50 border-amber-200',
                                    seasonal: isDark ? 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20' : 'from-emerald-50 to-emerald-100/50 border-emerald-200',
                                    other: isDark ? 'from-gray-500/10 to-gray-600/5 border-gray-500/20' : 'from-gray-50 to-gray-100/50 border-gray-200'
                                };

                                return (
                                    <button
                                        key={key}
                                        onClick={() => handleTemplateSelect(key as keyof typeof RULE_TEMPLATES)}
                                        className={`w-full p-3 border rounded-xl transition-all text-left group bg-gradient-to-r ${categoryColors[category]} hover:shadow-md ${isDark ? 'hover:border-purple-500/40' : 'hover:border-purple-300 hover:shadow-purple-100'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <h3 className={`font-semibold text-sm mb-0.5 ${isDark ? 'text-white group-hover:text-purple-300' : 'text-slate-900 group-hover:text-purple-700'
                                                    }`}>
                                                    {template.name}
                                                </h3>
                                                <p className={`text-xs font-mono ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                                                    {template.condition.left.type}
                                                    {template.condition.left.window && `(${template.condition.left.window})`}
                                                    {' '}{template.condition.comparison}{' '}
                                                    {template.condition.right.type === 'constant'
                                                        ? (template.condition.right as any).value
                                                        : `${template.condition.right.type}${(template.condition.right as any).window ? `(${(template.condition.right as any).window})` : ''}`}
                                                </p>
                                            </div>
                                            <svg
                                                className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5 ${isDark ? 'text-gray-500 group-hover:text-purple-400' : 'text-slate-400 group-hover:text-purple-600'
                                                    }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                                Define your own indicator-based condition
                            </p>

                            {/* Rule Name */}
                            <div>
                                <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                                    Rule Name <span className={`text-[10px] font-normal ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={ruleName}
                                    onChange={(e) => setRuleName(e.target.value)}
                                    placeholder="e.g., 'Golden Cross Entry'"
                                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:outline-none transition-all ${isDark
                                        ? 'bg-white/[0.03] border-white/[0.1] text-white placeholder-gray-600 focus:ring-purple-500 focus:border-purple-500/50'
                                        : 'bg-white border-slate-300 placeholder-slate-400 focus:ring-purple-500 focus:border-transparent'
                                        }`}
                                />
                            </div>

                            {/* Condition Builder */}
                            <div className={`pt-3 border-t ${isDark ? 'border-white/[0.08]' : 'border-slate-200'}`}>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className={`w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0`}>
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                        </svg>
                                    </div>
                                    <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        Build Condition
                                    </h4>
                                </div>

                                {/* Left Side - Compact Card */}
                                <div className={`p-3 rounded-lg mb-2.5 border ${isDark ? 'bg-white/[0.02] border-white/[0.08]' : 'bg-slate-50 border-slate-200'
                                    }`}>
                                    <label className={`block text-[10px] font-bold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>
                                        Left Side
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <select
                                            value={leftType}
                                            onChange={(e) => handleLeftTypeChange(e.target.value)}
                                            className={`col-span-3 px-2.5 py-2 border rounded-md text-sm font-medium focus:ring-2 focus:outline-none ${isDark
                                                ? 'bg-white/[0.05] border-white/[0.12] text-white focus:ring-purple-500 focus:border-purple-500/50'
                                                : 'bg-white border-slate-300 text-slate-700 focus:ring-purple-500 focus:border-transparent'
                                                }`}
                                        >
                                            <optgroup label="📈 Technical">
                                                <option value="SMA">SMA - Simple Moving Avg</option>
                                                <option value="EMA">EMA - Exponential Moving Avg</option>
                                                <option value="RSI">RSI - Relative Strength Index</option>
                                                <option value="MACD">MACD - Moving Avg Convergence</option>
                                            </optgroup>
                                            <optgroup label="💰 Price & Returns">
                                                <option value="PRICE">PRICE - Close Price</option>
                                                <option value="RETURN">RETURN - Percent Change</option>
                                            </optgroup>
                                            <optgroup label="⚠️ Risk">
                                                <option value="VOLATILITY">VOLATILITY - Annualized StdDev</option>
                                                <option value="DRAWDOWN">DRAWDOWN - Percent Drawdown</option>
                                            </optgroup>
                                            <optgroup label="🌍 Market">
                                                <option value="VIX">VIX - Volatility Index</option>
                                                <option value="T10Y">T10Y - 10Y Treasury Yield</option>
                                                <option value="T2Y">T2Y - 2Y Treasury Yield</option>
                                                <option value="T3M">T3M - 3M Treasury Yield</option>
                                            </optgroup>
                                            <optgroup label="📅 Calendar">
                                                <option value="MONTH">MONTH - Month Number</option>
                                                <option value="DAY_OF_WEEK">DAY_OF_WEEK - Weekday</option>
                                                <option value="DAY_OF_MONTH">DAY_OF_MONTH - Day in Month</option>
                                                <option value="DAY_OF_YEAR">DAY_OF_YEAR - Day in Year</option>
                                            </optgroup>
                                            <optgroup label="🎯 Other">
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
                                                        placeholder="SYMBOL"
                                                        className={`px-2.5 py-2 border rounded-md text-sm font-medium uppercase focus:ring-2 focus:outline-none ${isDark
                                                            ? 'bg-white/[0.05] border-white/[0.12] text-white placeholder-gray-600 focus:ring-purple-500 focus:border-purple-500/50'
                                                            : 'bg-white border-slate-300 text-slate-700 placeholder-slate-400 focus:ring-purple-500 focus:border-transparent'
                                                            }`}
                                                    />
                                                    <input
                                                        type="number"
                                                        value={leftWindow}
                                                        onChange={(e) => setLeftWindow(parseInt(e.target.value) || 0)}
                                                        placeholder="Days"
                                                        className={`px-2.5 py-2 border rounded-md text-sm font-medium focus:ring-2 focus:outline-none ${isDark
                                                            ? 'bg-white/[0.05] border-white/[0.12] text-white placeholder-gray-600 focus:ring-purple-500 focus:border-purple-500/50'
                                                            : 'bg-white border-slate-300 text-slate-700 placeholder-slate-400 focus:ring-purple-500 focus:border-transparent'
                                                            }`}
                                                    />
                                                </>
                                            )}
                                        {leftType === 'PRICE' && (
                                            <input
                                                type="text"
                                                value={leftSymbol}
                                                onChange={(e) => setLeftSymbol(e.target.value)}
                                                placeholder="SYMBOL"
                                                className={`col-span-3 px-2.5 py-2 border rounded-md text-sm font-medium uppercase focus:ring-2 focus:outline-none ${isDark
                                                    ? 'bg-white/[0.05] border-white/[0.12] text-white placeholder-gray-600 focus:ring-purple-500 focus:border-purple-500/50'
                                                    : 'bg-white border-slate-300 text-slate-700 placeholder-slate-400 focus:ring-purple-500 focus:border-transparent'
                                                    }`}
                                            />
                                        )}
                                        {leftType === 'THRESHOLD' && (
                                            <input
                                                type="number"
                                                value={leftWindow}
                                                onChange={(e) => setLeftWindow(parseFloat(e.target.value) || 0)}
                                                placeholder="Value"
                                                className={`col-span-3 px-2.5 py-2 border rounded-md text-sm font-medium focus:ring-2 focus:outline-none ${isDark
                                                    ? 'bg-white/[0.05] border-white/[0.12] text-white placeholder-gray-600 focus:ring-purple-500 focus:border-purple-500/50'
                                                    : 'bg-white border-slate-300 text-slate-700 placeholder-slate-400 focus:ring-purple-500 focus:border-transparent'
                                                    }`}
                                            />
                                        )}
                                        {(leftType === 'MONTH' || leftType === 'DAY_OF_WEEK' ||
                                            leftType === 'DAY_OF_MONTH' || leftType === 'DAY_OF_YEAR') && (
                                                <div className={`col-span-3 px-2.5 py-2 text-xs italic text-center ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                                                    No parameters needed
                                                </div>
                                            )}
                                    </div>
                                </div>

                                {/* Comparison - Visual Focal Point */}
                                <div className="flex justify-center my-2">
                                    <select
                                        value={comparison}
                                        onChange={(e) => setComparison(e.target.value as '>' | '<' | '>=' | '<=' | '==')}
                                        className={`px-4 py-2 border-2 rounded-lg text-sm font-bold focus:ring-2 focus:outline-none shadow-sm ${isDark
                                            ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30 text-purple-300 focus:ring-purple-500 focus:border-purple-500/50'
                                            : 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-300 text-purple-700 focus:ring-purple-500 focus:border-transparent'
                                            }`}
                                    >
                                        <option value=">">{'>'} Greater Than</option>
                                        <option value="<">{'<'} Less Than</option>
                                        <option value=">=">{'>='} Greater or Equal</option>
                                        <option value="<=">{'<='} Less or Equal</option>
                                        <option value="==">== Equal To</option>
                                    </select>
                                </div>

                                {/* Right Side */}
                                <div className={`p-3 rounded-lg mb-3 border ${isDark ? 'bg-white/[0.02] border-white/[0.08]' : 'bg-slate-50 border-slate-200'
                                    }`}>
                                    <label className={`block text-[10px] font-bold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>
                                        Right Side
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <select
                                            value={rightType}
                                            onChange={(e) => setRightType(e.target.value)}
                                            className={`col-span-3 px-2.5 py-2 border rounded-md text-sm font-medium focus:ring-2 focus:outline-none ${isDark
                                                ? 'bg-white/[0.05] border-white/[0.12] text-white focus:ring-purple-500 focus:border-purple-500/50'
                                                : 'bg-white border-slate-300 text-slate-700 focus:ring-purple-500 focus:border-transparent'
                                                }`}
                                        >
                                            <optgroup label="📈 Technical">
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
                                            <optgroup label="💰 Price & Returns">
                                                <option value="PRICE" disabled={!compatibleRightTypes.includes('PRICE')}>
                                                    PRICE - Close Price
                                                </option>
                                                <option value="RETURN" disabled={!compatibleRightTypes.includes('RETURN')}>
                                                    RETURN - Percent Change
                                                </option>
                                            </optgroup>
                                            <optgroup label="⚠️ Risk">
                                                <option value="VOLATILITY" disabled={!compatibleRightTypes.includes('VOLATILITY')}>
                                                    VOLATILITY - Annualized StdDev
                                                </option>
                                                <option value="DRAWDOWN" disabled={!compatibleRightTypes.includes('DRAWDOWN')}>
                                                    DRAWDOWN - Percent Drawdown
                                                </option>
                                            </optgroup>
                                            <optgroup label="🌍 Market">
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
                                            <optgroup label="📅 Calendar">
                                                <option value="MONTH" disabled={!compatibleRightTypes.includes('MONTH')}>
                                                    MONTH - Month Number
                                                </option>
                                                <option value="DAY_OF_WEEK" disabled={!compatibleRightTypes.includes('DAY_OF_WEEK')}>
                                                    DAY_OF_WEEK - Weekday
                                                </option>
                                                <option value="DAY_OF_MONTH" disabled={!compatibleRightTypes.includes('DAY_OF_MONTH')}>
                                                    DAY_OF_MONTH - Day in Month
                                                </option>
                                                <option value="DAY_OF_YEAR" disabled={!compatibleRightTypes.includes('DAY_OF_YEAR')}>
                                                    DAY_OF_YEAR - Day in Year
                                                </option>
                                            </optgroup>
                                            <optgroup label="🎯 Other">
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
                                                        placeholder="SYMBOL"
                                                        className={`px-2.5 py-2 border rounded-md text-sm font-medium uppercase focus:ring-2 focus:outline-none ${isDark
                                                            ? 'bg-white/[0.05] border-white/[0.12] text-white placeholder-gray-600 focus:ring-purple-500 focus:border-purple-500/50'
                                                            : 'bg-white border-slate-300 text-slate-700 placeholder-slate-400 focus:ring-purple-500 focus:border-transparent'
                                                            }`}
                                                    />
                                                    <input
                                                        type="number"
                                                        value={rightWindow}
                                                        onChange={(e) => setRightWindow(parseInt(e.target.value) || 0)}
                                                        placeholder="Days"
                                                        className={`px-2.5 py-2 border rounded-md text-sm font-medium focus:ring-2 focus:outline-none ${isDark
                                                            ? 'bg-white/[0.05] border-white/[0.12] text-white placeholder-gray-600 focus:ring-purple-500 focus:border-purple-500/50'
                                                            : 'bg-white border-slate-300 text-slate-700 placeholder-slate-400 focus:ring-purple-500 focus:border-transparent'
                                                            }`}
                                                    />
                                                </>
                                            )}
                                        {rightType === 'PRICE' && (
                                            <input
                                                type="text"
                                                value={rightSymbol}
                                                onChange={(e) => setRightSymbol(e.target.value)}
                                                placeholder="SYMBOL"
                                                className={`col-span-3 px-2.5 py-2 border rounded-md text-sm font-medium uppercase focus:ring-2 focus:outline-none ${isDark
                                                    ? 'bg-white/[0.05] border-white/[0.12] text-white placeholder-gray-600 focus:ring-purple-500 focus:border-purple-500/50'
                                                    : 'bg-white border-slate-300 text-slate-700 placeholder-slate-400 focus:ring-purple-500 focus:border-transparent'
                                                    }`}
                                            />
                                        )}
                                        {rightType === 'THRESHOLD' && (
                                            <input
                                                type="number"
                                                value={rightValue}
                                                onChange={(e) => setRightValue(parseFloat(e.target.value) || 0)}
                                                placeholder="Value"
                                                className={`col-span-3 px-2.5 py-2 border rounded-md text-sm font-medium focus:ring-2 focus:outline-none ${isDark
                                                    ? 'bg-white/[0.05] border-white/[0.12] text-white placeholder-gray-600 focus:ring-purple-500 focus:border-purple-500/50'
                                                    : 'bg-white border-slate-300 text-slate-700 placeholder-slate-400 focus:ring-purple-500 focus:border-transparent'
                                                    }`}
                                            />
                                        )}
                                        {(rightType === 'MONTH' || rightType === 'DAY_OF_WEEK' ||
                                            rightType === 'DAY_OF_MONTH' || rightType === 'DAY_OF_YEAR') && (
                                                <div className={`col-span-3 px-2.5 py-2 text-xs italic text-center ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                                                    No parameters needed
                                                </div>
                                            )}
                                    </div>
                                </div>

                                {/* Validation Warning - More Prominent */}
                                {!isValidCombination && (
                                    <div className={`p-3 rounded-lg border ${isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-300'
                                        }`}>
                                        <div className="flex items-start gap-2.5">
                                            <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            <div className="flex-1">
                                                <p className={`text-xs font-semibold ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                                                    ⚠️ Invalid Comparison
                                                </p>
                                                <p className={`text-[11px] mt-1 leading-relaxed ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                                                    {leftType} and {rightType} use different units. Try comparing to THRESHOLD instead.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Condition Preview - Terminal Style */}
                                <div className={`p-3 rounded-lg border ${isDark ? 'bg-black/50 border-white/[0.15]' : 'bg-slate-900 border-slate-700'
                                    }`}>
                                    <label className={`block text-[10px] font-bold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-600' : 'text-slate-500'}`}>
                                        Preview
                                    </label>
                                    <code className={`text-sm font-mono ${isValidCombination ? 'text-emerald-400' : 'text-red-400'}`}>
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

                            {/* Create Button - Sticky at bottom */}
                            <button
                                onClick={handleCustomCreate}
                                disabled={!isValidCombination}
                                className={`w-full px-6 py-3 font-bold text-sm rounded-lg transition-all shadow-lg ${isDark
                                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed hover:shadow-purple-500/30'
                                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed'
                                    }`}
                            >
                                {!isValidCombination ? '⚠️ Fix Invalid Combination' : '✓ Create Rule'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
