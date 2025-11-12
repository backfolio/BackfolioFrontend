import { useState } from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { Allocation } from '../../../types/strategy';

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
                bg-white rounded-xl shadow-lg border-2 transition-all duration-200 min-w-[280px]
                ${selected ? 'border-purple-500 shadow-purple-200' : 'border-slate-200'}
                ${data.isFallback ? 'ring-2 ring-emerald-400' : ''}
            `}
        >
            {/* Render ONE handle per side - React Flow will handle bidirectional connections */}
            {handlePositions.map(({ position, name }) => (
                <Handle
                    key={name}
                    type="source"
                    position={position}
                    id={`${data.name}-${name}`}
                    className="!bg-purple-500 !w-3 !h-3 !border-2 !border-white"
                    isConnectableStart={true}
                    isConnectableEnd={true}
                />
            ))}

            {/* Header */}
            <div className={`px-4 py-3 border-b border-slate-200 ${data.isFallback ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                        <div className={`w-2 h-2 rounded-full ${data.isFallback ? 'bg-emerald-500' : 'bg-purple-500'}`}></div>
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
                                className="font-bold text-slate-900 text-sm px-1 py-0.5 border border-purple-300 rounded"
                                autoFocus
                            />
                        ) : (
                            <h3
                                className="font-bold text-slate-900 text-sm cursor-pointer hover:text-purple-600"
                                onClick={() => setIsEditingName(true)}
                                title="Click to edit name"
                            >
                                {data.name}
                            </h3>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit allocation"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button
                            onClick={data.onDuplicate}
                            className="p-1 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                            title="Duplicate portfolio"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                        <button
                            onClick={data.onDelete}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete portfolio"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                {data.isFallback ? (
                    <div className="mt-2 space-y-1">
                        <div className="text-xs text-emerald-700 font-medium">Fallback Portfolio</div>
                        <div className="text-xs text-slate-500">First in chain, no rules. Add rules to activate switching.</div>
                        <button
                            onClick={data.onManageRules}
                            className="mt-1 w-full px-2 py-1 text-xs text-slate-600 hover:text-purple-600 hover:bg-purple-50 border border-dashed border-slate-300 hover:border-purple-300 rounded transition-colors"
                        >
                            + Define Switching Rules
                        </button>
                    </div>
                ) : (data.assignedRules && (typeof data.assignedRules === 'string' ? data.assignedRules : data.assignedRules.length > 0)) ? (
                    <div className="mt-2 space-y-1">
                        <div className="text-xs font-medium text-slate-600">When to switch TO this portfolio:</div>
                        {typeof data.assignedRules === 'string' ? (
                            // Parse and display expression as stacked rules with operators
                            <div className="space-y-1">
                                {(() => {
                                    const parts = data.assignedRules.split(/\s+(AND|OR)\s+/);
                                    const elements = [];
                                    for (let i = 0; i < parts.length; i += 2) {
                                        const rule = parts[i].trim();
                                        const operator = parts[i + 1] as 'AND' | 'OR' | undefined;

                                        elements.push(
                                            <div key={i} className="flex items-center gap-1.5">
                                                <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[11px] font-medium">
                                                    {rule}
                                                </span>
                                                {operator && (
                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${operator === 'AND'
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-emerald-500 text-white'
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
                            // Legacy array display
                            <div className="space-y-1">
                                {data.assignedRules.map((ruleName) => (
                                    <div key={ruleName} className="flex items-center gap-1 text-xs">
                                        <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                                            {ruleName}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button
                            onClick={data.onManageRules}
                            className="text-xs text-purple-600 hover:text-purple-700 font-medium mt-1"
                        >
                            Manage Rules
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={data.onManageRules}
                        className="mt-2 w-full px-2 py-1 text-xs text-slate-600 hover:text-purple-600 hover:bg-purple-50 border border-dashed border-slate-300 hover:border-purple-300 rounded transition-colors"
                    >
                        + Define Switching Rules
                    </button>
                )}
            </div>

            {/* Body */}
            <div className="p-4">
                {isEditing ? (
                    <div className="space-y-2">
                        {/* Template Selector */}
                        {showTemplates && (
                            <div className="mb-3 p-2 bg-purple-50 border border-purple-200 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-purple-900">Load Template</span>
                                    <button
                                        onClick={() => setShowTemplates(false)}
                                        className="text-purple-500 hover:text-purple-700 text-xs"
                                    >
                                        Skip
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-1">
                                    {Object.entries(TEMPLATES).map(([key, template]) => (
                                        <button
                                            key={key}
                                            onClick={() => handleLoadTemplate(key as keyof typeof TEMPLATES)}
                                            className="text-left px-2 py-1.5 bg-white hover:bg-purple-100 border border-purple-200 hover:border-purple-400 rounded text-xs transition-all"
                                        >
                                            <div className="font-medium text-purple-900 text-[10px] mb-0.5">{template.name}</div>
                                            <div className="text-[9px] text-purple-600 truncate">
                                                {Object.entries(template.allocation).map(([sym, w]) => `${sym} ${Math.round(w * 100)}%`).join(' · ')}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!showTemplates && (
                            <button
                                onClick={() => setShowTemplates(true)}
                                className="w-full px-2 py-1 text-xs text-purple-600 hover:bg-purple-50 border border-dashed border-purple-300 rounded transition-colors mb-2"
                            >
                                📋 Load from Template
                            </button>
                        )}

                        {Object.entries(editedAllocation).map(([symbol, weight]) => (
                            <div key={symbol} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={symbol.startsWith('_new_asset_') ? '' : symbol}
                                    onChange={(e) => handleUpdateSymbol(symbol, e.target.value)}
                                    placeholder="Ticker Symbol"
                                    className="flex-1 px-2 py-1 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <input
                                    type="number"
                                    value={Math.round(weight * 100)}
                                    onChange={(e) => handleUpdateWeight(symbol, Number(e.target.value))}
                                    min="0"
                                    max="100"
                                    className="w-16 px-2 py-1 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <span className="text-xs text-slate-500">%</span>
                                <button
                                    onClick={() => handleRemoveAsset(symbol)}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={handleAddAsset}
                            disabled={Object.keys(editedAllocation).length >= 6}
                            className="w-full mt-2 px-2 py-1 text-xs text-purple-600 hover:bg-purple-50 border border-dashed border-purple-300 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                        >
                            + Add Asset {Object.keys(editedAllocation).length >= 6 ? '(Max 6)' : ''}
                        </button>

                        {/* Rebalancing Controls */}
                        <div className="pt-2 border-t border-slate-200 space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rebalancingEnabled}
                                    onChange={(e) => setRebalancingEnabled(e.target.checked)}
                                    className="w-3 h-3 text-purple-600 rounded focus:ring-purple-500"
                                />
                                <span className="text-xs font-medium text-slate-700">Enable Rebalancing</span>
                            </label>

                            {rebalancingEnabled && (
                                <select
                                    value={rebalancingFrequency}
                                    onChange={(e) => setRebalancingFrequency(e.target.value as 'monthly' | 'quarterly')}
                                    className="w-full text-xs border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="quarterly">Quarterly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                            <span className={`text-xs font-medium ${isValid ? 'text-emerald-600' : 'text-red-600'}`}>
                                Total: {Math.round(total * 100)}%
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setEditedAllocation(data.allocation);
                                        setRebalancingEnabled(!!data.rebalancingFrequency);
                                        setRebalancingFrequency(data.rebalancingFrequency || 'monthly');
                                        setIsEditing(false);
                                    }}
                                    className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={!isValid}
                                    className="px-3 py-1 text-xs text-white bg-purple-600 hover:bg-purple-700 rounded disabled:bg-slate-300 disabled:cursor-not-allowed"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="space-y-1">
                            {Object.entries(data.allocation).map(([symbol, weight]) => (
                                <div key={symbol} className="flex items-center justify-between text-xs">
                                    <span className="font-medium text-slate-700">{symbol}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                                                style={{ width: `${weight * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-slate-600 font-semibold w-10 text-right">
                                            {Math.round(weight * 100)}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Display rebalancing info */}
                        {data.rebalancingFrequency && (
                            <div className="pt-2 border-t border-slate-200">
                                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span>Rebalances {data.rebalancingFrequency}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

AllocationNode.displayName = 'AllocationNode';
