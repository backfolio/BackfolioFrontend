import { useState } from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { Allocation } from '../../../types/strategy';
import { useTheme } from '../../../context/ThemeContext';

interface AllocationNodeData {
    name: string;
    allocation: Allocation;
    isFallback?: boolean;
    assignedRules?: string[] | string; // Can be array (legacy) or expression string
    rebalancingFrequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    isNewlyCreated?: boolean;
    onUpdate: (allocation: Allocation, rebalancingFrequency?: string) => void;
    onRename: (newName: string) => void;
    onDelete: () => void;
    onDuplicate: () => void;
    onManageRules: () => void;
    onClearRules: () => void;
}

const TEMPLATES = {
    conservative: {
        name: 'Conservative 60/40',
        allocation: { SPY: 0.6, BND: 0.4 },
    },
    balanced: {
        name: 'Balanced 70/30',
        allocation: { SPY: 0.7, BND: 0.3 },
    },
    aggressive: {
        name: 'Aggressive 80/20',
        allocation: { SPY: 0.8, BND: 0.2 },
    },
    allEquity: {
        name: 'All Equity',
        allocation: { SPY: 1.0 },
    },
    goldenButterfly: {
        name: 'Golden Butterfly',
        allocation: { SPY: 0.2, VTI: 0.2, SHY: 0.2, TLT: 0.2, GLD: 0.2 },
    },
};

export const AllocationNode = ({ data, selected }: NodeProps<AllocationNodeData>) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [isEditing, setIsEditing] = useState(data.isNewlyCreated || false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState(data.name);
    const [editedAllocation, setEditedAllocation] = useState<Allocation>(data.allocation);
    const [rebalancingEnabled, setRebalancingEnabled] = useState(!!data.rebalancingFrequency);
    const [rebalancingFrequency, setRebalancingFrequency] = useState(data.rebalancingFrequency || 'monthly');
    const [showTemplates, setShowTemplates] = useState(data.isNewlyCreated || false);

    const total = Object.values(editedAllocation).reduce((sum, val) => sum + val, 0);
    const isValid = Math.abs(total - 1.0) < 0.001;

    // Define handles for all 4 sides
    const handlePositions = [
        { position: Position.Top, name: 'top' },
        { position: Position.Right, name: 'right' },
        { position: Position.Bottom, name: 'bottom' },
        { position: Position.Left, name: 'left' },
    ];

    const handleSave = () => {
        if (isValid && data.onUpdate) {
            data.onUpdate(
                editedAllocation,
                rebalancingEnabled ? rebalancingFrequency : undefined
            );
            setIsEditing(false);
            setShowTemplates(false);
        }
    };

    const handleLoadTemplate = (templateKey: keyof typeof TEMPLATES) => {
        const template = TEMPLATES[templateKey];
        setEditedAllocation(template.allocation);
        setShowTemplates(false);
    };

    const handleSaveName = () => {
        if (editedName.trim() && editedName !== data.name && data.onRename) {
            data.onRename(editedName.trim());
        }
        setIsEditingName(false);
    };

    const handleAddAsset = () => {
        // Limit to 6 assets per portfolio
        if (Object.keys(editedAllocation).length >= 6) {
            return;
        }
        // Generate a unique temporary key to avoid collisions when adding multiple assets
        let tempKey = '';
        let counter = 0;
        while (tempKey in editedAllocation) {
            tempKey = `_new_asset_${counter}`;
            counter++;
        }
        setEditedAllocation({
            ...editedAllocation,
            [tempKey]: 0,
        });
    };

    const handleRemoveAsset = (symbol: string) => {
        const newAllocation = { ...editedAllocation };
        delete newAllocation[symbol];
        setEditedAllocation(newAllocation);
    };

    const handleUpdateSymbol = (oldSymbol: string, newSymbol: string) => {
        const newAllocation: Allocation = {};
        Object.keys(editedAllocation).forEach((key) => {
            if (key === oldSymbol) {
                newAllocation[newSymbol] = editedAllocation[key];
            } else {
                newAllocation[key] = editedAllocation[key];
            }
        });
        setEditedAllocation(newAllocation);
    };

    const handleUpdateWeight = (symbol: string, weight: number) => {
        setEditedAllocation({
            ...editedAllocation,
            [symbol]: weight / 100,
        });
    };

    return (
        <div
            className={`
                rounded-xl shadow-lg border transition-all duration-200 min-w-[300px] max-w-[340px]
                ${isDark ? 'bg-gradient-to-br from-slate-900 to-black' : 'bg-white'}
                ${selected
                    ? isDark
                        ? 'border-purple-500 shadow-purple-500/30 shadow-xl'
                        : 'border-purple-500 shadow-purple-200 shadow-xl'
                    : isDark
                        ? 'border-white/[0.12]'
                        : 'border-slate-200'
                }
                ${data.isFallback ? 'ring-1 ring-emerald-400/50' : ''}
            `}
        >
            {/* Render ONE handle per side - React Flow will handle bidirectional connections */}
            {handlePositions.map(({ position, name }) => (
                <Handle
                    key={name}
                    type="source"
                    position={position}
                    id={`${data.name}-${name}`}
                    className={`!w-3 !h-3 !border-2 transition-all ${data.isFallback
                            ? '!bg-emerald-500 !border-emerald-300'
                            : '!bg-purple-500 !border-purple-300'
                        } hover:!scale-125`}
                    isConnectableStart={true}
                    isConnectableEnd={true}
                />
            ))}

            {/* Header - Simplified and Cleaner */}
            <div className="px-4 py-2.5">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${data.isFallback ? 'bg-emerald-500 shadow-emerald-500/50 shadow-md' : 'bg-purple-500 shadow-purple-500/50 shadow-md'
                            }`}></div>
                        {isEditingName ? (
                            <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                onBlur={handleSaveName}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveName();
                                    if (e.key === 'Escape') {
                                        setEditedName(data.name);
                                        setIsEditingName(false);
                                    }
                                }}
                                className={`font-semibold text-sm px-1.5 py-0.5 border rounded flex-1 ${isDark
                                    ? 'bg-white/[0.05] border-purple-500/50 text-white'
                                    : 'bg-white border-purple-300 text-slate-900'
                                    }`}
                                autoFocus
                            />
                        ) : (
                            <h3
                                className={`font-semibold text-sm cursor-pointer transition-colors truncate ${isDark
                                    ? 'text-white hover:text-purple-400'
                                    : 'text-slate-900 hover:text-purple-600'
                                    }`}
                                onClick={() => setIsEditingName(true)}
                                title="Click to edit name"
                            >
                                {data.name}
                            </h3>
                        )}
                    </div>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`p-1.5 rounded-md transition-all hover:scale-110 ${isDark
                                ? 'text-gray-500 hover:text-blue-400 hover:bg-blue-500/10'
                                : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                                }`}
                            title="Edit allocation"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button
                            onClick={data.onDuplicate}
                            className={`p-1.5 rounded-md transition-all hover:scale-110 ${isDark
                                ? 'text-gray-500 hover:text-purple-400 hover:bg-purple-500/10'
                                : 'text-slate-400 hover:text-purple-600 hover:bg-purple-50'
                                }`}
                            title="Duplicate portfolio"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                        <button
                            onClick={data.onDelete}
                            className={`p-1.5 rounded-md transition-all hover:scale-110 ${isDark
                                ? 'text-gray-500 hover:text-red-400 hover:bg-red-500/10'
                                : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                                }`}
                            title="Delete portfolio"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Rules Section - Compact and Scannable */}
                {data.isFallback ? (
                    <div className={`mt-2 px-3 py-2 rounded-lg border border-dashed ${isDark
                            ? 'bg-emerald-500/5 border-emerald-500/30'
                            : 'bg-emerald-50/50 border-emerald-300'
                        }`}>
                        <div className={`text-[11px] font-medium mb-1 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                            🛡️ Default Portfolio
                        </div>
                        <div className={`text-[10px] leading-relaxed mb-2 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                            Active when no rules match
                        </div>
                        <button
                            onClick={data.onManageRules}
                            className={`w-full px-2 py-1.5 text-[11px] font-medium border border-dashed rounded-md transition-all ${isDark
                                ? 'text-emerald-300 hover:text-emerald-200 hover:bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50'
                                : 'text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 border-emerald-300 hover:border-emerald-400'
                                }`}
                        >
                            + Add Switching Rules
                        </button>
                    </div>
                ) : (data.assignedRules && (typeof data.assignedRules === 'string' ? data.assignedRules : data.assignedRules.length > 0)) ? (
                    <div className={`mt-2 px-3 py-2 rounded-lg ${isDark
                            ? 'bg-blue-500/5 border border-blue-500/20'
                            : 'bg-blue-50/50 border border-blue-200'
                        }`}>
                        <div className="flex items-center justify-between mb-1.5">
                            <div className={`text-[11px] font-medium ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                                ⚡ Switch when:
                            </div>
                            <button
                                onClick={data.onClearRules}
                                className={`p-0.5 rounded transition-all hover:scale-110 ${isDark
                                    ? 'text-gray-500 hover:text-red-400 hover:bg-red-500/10'
                                    : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                                    }`}
                                title="Clear all rules"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                        {typeof data.assignedRules === 'string' ? (
                            <div className="space-y-1">
                                {(() => {
                                    const parts = data.assignedRules.split(/\s+(AND|OR)\s+/);
                                    const elements = [];
                                    for (let i = 0; i < parts.length; i += 2) {
                                        const rule = parts[i].trim();
                                        const operator = parts[i + 1] as 'AND' | 'OR' | undefined;

                                        elements.push(
                                            <div key={i} className="flex items-center gap-1.5">
                                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${isDark
                                                        ? 'bg-blue-500/20 text-blue-300'
                                                        : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {rule}
                                                </span>
                                                {operator && (
                                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${operator === 'AND'
                                                        ? isDark ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white'
                                                        : isDark ? 'bg-emerald-500 text-white' : 'bg-emerald-600 text-white'
                                                        }`}>
                                                        {operator}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    }
                                    return elements;
                                })()}
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {data.assignedRules.map((ruleName) => (
                                    <div key={ruleName} className="flex items-center gap-1 text-xs">
                                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${isDark
                                                ? 'bg-blue-500/20 text-blue-300'
                                                : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {ruleName}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button
                            onClick={data.onManageRules}
                            className={`text-[11px] font-medium mt-2 transition-colors ${isDark
                                ? 'text-blue-400 hover:text-blue-300'
                                : 'text-blue-600 hover:text-blue-700'
                                }`}
                        >
                            Edit Rules →
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={data.onManageRules}
                        className={`mt-2 w-full px-3 py-2 text-[11px] font-medium border border-dashed rounded-lg transition-all ${isDark
                            ? 'text-gray-400 hover:text-purple-300 hover:bg-purple-500/5 border-white/[0.08] hover:border-purple-500/30'
                            : 'text-slate-500 hover:text-purple-600 hover:bg-purple-50 border-slate-200 hover:border-purple-300'
                            }`}
                    >
                        + Define Switching Rules
                    </button>
                )}
            </div>

            {/* Body */}
            <div className="p-4">
                {isEditing ? (
                    <div className="space-y-2.5">
                        {/* Compact Template Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowTemplates(!showTemplates)}
                                className={`w-full px-3 py-2 text-[11px] font-medium border rounded-lg transition-all flex items-center justify-between ${showTemplates
                                        ? isDark
                                            ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                                            : 'bg-purple-50 border-purple-300 text-purple-700'
                                        : isDark
                                            ? 'bg-white/[0.02] border-white/[0.08] text-gray-400 hover:text-purple-300 hover:border-purple-500/30'
                                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-purple-600 hover:border-purple-300'
                                    }`}
                            >
                                <span>📋 {showTemplates ? 'Choose Template' : 'Load Template'}</span>
                                <svg className={`w-3 h-3 transition-transform ${showTemplates ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {showTemplates && (
                                <div className={`absolute z-10 w-full mt-1 rounded-lg border shadow-xl ${isDark
                                        ? 'bg-slate-900 border-white/[0.12]'
                                        : 'bg-white border-slate-200'
                                    }`}>
                                    {Object.entries(TEMPLATES).map(([key, template]) => (
                                        <button
                                            key={key}
                                            onClick={() => handleLoadTemplate(key as keyof typeof TEMPLATES)}
                                            className={`w-full text-left px-3 py-2 text-[11px] transition-colors first:rounded-t-lg last:rounded-b-lg ${isDark
                                                    ? 'hover:bg-purple-500/10 border-b border-white/[0.05] last:border-0'
                                                    : 'hover:bg-purple-50 border-b border-slate-100 last:border-0'
                                                }`}
                                        >
                                            <div className={`font-medium mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                {template.name}
                                            </div>
                                            <div className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                                                {Object.entries(template.allocation)
                                                    .map(([sym, w]) => `${sym} ${Math.round(w * 100)}%`)
                                                    .join(' · ')}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Asset List - Cleaner Layout */}
                        <div className="space-y-1.5">
                            {Object.entries(editedAllocation).map(([symbol, weight]) => (
                                <div key={symbol} className={`flex items-center gap-2 p-2 rounded-lg transition-all ${isDark
                                        ? 'bg-white/[0.02] hover:bg-white/[0.04]'
                                        : 'bg-slate-50 hover:bg-slate-100'
                                    }`}>
                                    <input
                                        type="text"
                                        value={symbol.startsWith('_new_asset_') ? '' : symbol}
                                        onChange={(e) => handleUpdateSymbol(symbol, e.target.value)}
                                        placeholder="SYMBOL"
                                        className={`flex-1 px-2.5 py-1.5 text-xs font-medium border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase ${isDark
                                            ? 'bg-white/[0.05] border-white/[0.12] text-white placeholder-gray-600'
                                            : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                                            }`}
                                    />
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="number"
                                            value={Math.round(weight * 100)}
                                            onChange={(e) => handleUpdateWeight(symbol, Number(e.target.value))}
                                            min="0"
                                            max="100"
                                            className={`w-14 px-2 py-1.5 text-xs font-semibold text-right border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent ${isDark
                                                ? 'bg-white/[0.05] border-white/[0.12] text-white'
                                                : 'bg-white border-slate-300 text-slate-900'
                                                }`}
                                        />
                                        <span className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>%</span>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveAsset(symbol)}
                                        className={`p-1 rounded-md transition-all hover:scale-110 ${isDark
                                            ? 'text-gray-500 hover:text-red-400 hover:bg-red-500/10'
                                            : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                                            }`}
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleAddAsset}
                            disabled={Object.keys(editedAllocation).length >= 6}
                            className={`w-full px-3 py-2 text-[11px] font-medium border border-dashed rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed ${isDark
                                ? 'text-purple-400 hover:bg-purple-500/5 border-white/[0.08] hover:border-purple-500/30 disabled:hover:bg-transparent'
                                : 'text-purple-600 hover:bg-purple-50 border-purple-300 disabled:hover:bg-transparent'
                                }`}
                        >
                            + Add Asset {Object.keys(editedAllocation).length >= 6 ? '(Max 6)' : `(${Object.keys(editedAllocation).length}/6)`}
                        </button>

                        {/* Rebalancing Controls - More Compact */}
                        <div className={`pt-2.5 space-y-2 ${isDark ? 'border-t border-white/[0.08]' : 'border-t border-slate-200'
                            }`}>
                            <label className="flex items-center gap-2.5 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={rebalancingEnabled}
                                    onChange={(e) => setRebalancingEnabled(e.target.checked)}
                                    className="w-3.5 h-3.5 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
                                />
                                <span className={`text-xs font-medium transition-colors ${rebalancingEnabled
                                        ? isDark ? 'text-purple-300' : 'text-purple-700'
                                        : isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-slate-600 group-hover:text-slate-700'
                                    }`}>
                                    Enable Rebalancing
                                </span>
                            </label>

                            {rebalancingEnabled && (
                                <select
                                    value={rebalancingFrequency}
                                    onChange={(e) => setRebalancingFrequency(e.target.value as 'monthly' | 'quarterly')}
                                    className={`w-full text-xs font-medium border rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${isDark
                                        ? 'bg-white/[0.05] border-white/[0.12] text-white'
                                        : 'bg-white border-slate-300 text-slate-900'
                                        }`}
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="quarterly">Quarterly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            )}
                        </div>

                        {/* Save Bar */}
                        <div className={`flex items-center justify-between pt-2.5 ${isDark ? 'border-t border-white/[0.08]' : 'border-t border-slate-200'
                            }`}>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-semibold ${isValid
                                    ? isDark ? 'text-emerald-400' : 'text-emerald-600'
                                    : isDark ? 'text-red-400' : 'text-red-600'
                                    }`}>
                                    {isValid ? '✓' : '✗'} {Math.round(total * 100)}%
                                </span>
                                {!isValid && (
                                    <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                                        Must equal 100%
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setEditedAllocation(data.allocation);
                                        setRebalancingEnabled(!!data.rebalancingFrequency);
                                        setRebalancingFrequency(data.rebalancingFrequency || 'monthly');
                                        setIsEditing(false);
                                        setShowTemplates(false);
                                    }}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${isDark
                                        ? 'text-gray-400 hover:text-gray-300 hover:bg-white/[0.05]'
                                        : 'text-slate-600 hover:text-slate-700 hover:bg-slate-100'
                                        }`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={!isValid}
                                    className={`px-4 py-1.5 text-xs font-semibold text-white rounded-md transition-all disabled:cursor-not-allowed ${isDark
                                        ? 'bg-purple-500 hover:bg-purple-600 disabled:bg-slate-700 disabled:text-slate-500'
                                        : 'bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:text-slate-500'
                                        }`}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {/* Allocation Display - Enhanced Visuals */}
                        <div className="space-y-1.5">
                            {Object.entries(data.allocation).map(([symbol, weight]) => (
                                <div key={symbol} className={`group flex items-center justify-between px-2.5 py-2 rounded-lg transition-all ${isDark
                                        ? 'hover:bg-white/[0.03]'
                                        : 'hover:bg-slate-50'
                                    }`}>
                                    <span className={`font-semibold text-xs ${isDark ? 'text-gray-200' : 'text-slate-700'}`}>
                                        {symbol}
                                    </span>
                                    <div className="flex items-center gap-2.5">
                                        <div className={`w-24 h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/[0.08]' : 'bg-slate-200'
                                            }`}>
                                            <div
                                                className={`h-full transition-all ${data.isFallback
                                                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                                                        : 'bg-gradient-to-r from-purple-500 to-blue-500'
                                                    }`}
                                                style={{ width: `${weight * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className={`font-bold text-xs w-11 text-right tabular-nums ${isDark ? 'text-gray-300' : 'text-slate-600'
                                            }`}>
                                            {Math.round(weight * 100)}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Rebalancing Info - More Prominent */}
                        {data.rebalancingFrequency && (
                            <div className={`flex items-center gap-2 px-2.5 py-2 rounded-lg ${isDark
                                    ? 'bg-purple-500/5 border border-purple-500/20'
                                    : 'bg-purple-50/50 border border-purple-200'
                                }`}>
                                <svg className={`w-3.5 h-3.5 flex-shrink-0 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span className={`text-[11px] font-medium ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                                    Rebalances {data.rebalancingFrequency}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

AllocationNode.displayName = 'AllocationNode';
