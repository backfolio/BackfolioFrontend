import { useState } from 'react';
import { Allocation } from '../../../types/strategy';

interface PortfolioCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string, allocation: Allocation) => void;
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

export const PortfolioCreationModal: React.FC<PortfolioCreationModalProps> = ({
    isOpen,
    onClose,
    onCreate,
}) => {
    const [mode, setMode] = useState<'template' | 'custom'>('template');
    const [portfolioName, setPortfolioName] = useState('');
    const [assets, setAssets] = useState<Array<{ symbol: string; weight: number }>>([
        { symbol: '', weight: 0 },
    ]);

    if (!isOpen) return null;

    const handleTemplateSelect = (templateKey: keyof typeof TEMPLATES) => {
        const template = TEMPLATES[templateKey];
        onCreate(template.name, template.allocation);
        handleClose();
    };

    const handleCustomCreate = () => {
        const allocation: Allocation = {};
        assets.forEach((asset) => {
            if (asset.symbol.trim()) {
                allocation[asset.symbol.trim()] = asset.weight / 100;
            }
        });

        const total = Object.values(allocation).reduce((sum, val) => sum + val, 0);
        if (Math.abs(total - 1.0) > 0.001) {
            alert('Allocations must total 100%');
            return;
        }

        if (!portfolioName.trim()) {
            alert('Please enter a portfolio name');
            return;
        }

        onCreate(portfolioName.trim(), allocation);
        handleClose();
    };

    const handleClose = () => {
        setMode('template');
        setPortfolioName('');
        setAssets([{ symbol: '', weight: 0 }]);
        onClose();
    };

    const addAsset = () => {
        setAssets([...assets, { symbol: '', weight: 0 }]);
    };

    const updateAsset = (index: number, field: 'symbol' | 'weight', value: string | number) => {
        const newAssets = [...assets];
        newAssets[index] = { ...newAssets[index], [field]: value };
        setAssets(newAssets);
    };

    const removeAsset = (index: number) => {
        if (assets.length > 1) {
            setAssets(assets.filter((_, i) => i !== index));
        }
    };

    const totalWeight = assets.reduce((sum, asset) => sum + asset.weight, 0);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-slate-900">Create New Portfolio</h2>
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
                                Select a pre-configured portfolio template to get started quickly
                            </p>
                            {Object.entries(TEMPLATES).map(([key, template]) => (
                                <button
                                    key={key}
                                    onClick={() => handleTemplateSelect(key as keyof typeof TEMPLATES)}
                                    className="w-full p-4 border-2 border-slate-200 hover:border-purple-500 hover:bg-purple-50 rounded-xl transition-all text-left group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-slate-900 group-hover:text-purple-700">
                                                {template.name}
                                            </h3>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {Object.entries(template.allocation).map(([symbol, weight]) => (
                                                    <span
                                                        key={symbol}
                                                        className="text-xs px-2 py-1 bg-slate-100 group-hover:bg-purple-100 text-slate-700 group-hover:text-purple-700 rounded-md font-medium"
                                                    >
                                                        {symbol}: {Math.round(weight * 100)}%
                                                    </span>
                                                ))}
                                            </div>
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
                                Build your portfolio from scratch by adding assets and setting allocations
                            </p>

                            {/* Portfolio Name */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Portfolio Name
                                </label>
                                <input
                                    type="text"
                                    value={portfolioName}
                                    onChange={(e) => setPortfolioName(e.target.value)}
                                    placeholder="e.g., My Custom Strategy"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            {/* Assets */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Asset Allocation
                                </label>
                                <div className="space-y-2">
                                    {assets.map((asset, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={asset.symbol}
                                                onChange={(e) => updateAsset(index, 'symbol', e.target.value)}
                                                placeholder="Symbol (e.g., SPY)"
                                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                            />
                                            <input
                                                type="number"
                                                value={asset.weight}
                                                onChange={(e) => updateAsset(index, 'weight', Number(e.target.value))}
                                                min="0"
                                                max="100"
                                                placeholder="%"
                                                className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                            />
                                            <span className="text-sm text-slate-500">%</span>
                                            <button
                                                onClick={() => removeAsset(index)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                disabled={assets.length === 1}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={addAsset}
                                    className="mt-2 w-full px-4 py-2 border-2 border-dashed border-slate-300 hover:border-purple-500 hover:bg-purple-50 rounded-lg text-sm font-medium text-slate-600 hover:text-purple-700 transition-all"
                                >
                                    + Add Asset
                                </button>

                                {/* Total Weight Indicator */}
                                <div className="mt-3 flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="text-sm font-medium text-slate-700">Total Allocation</span>
                                    <span
                                        className={`text-sm font-bold ${Math.abs(totalWeight - 100) < 0.1
                                                ? 'text-emerald-600'
                                                : 'text-red-600'
                                            }`}
                                    >
                                        {totalWeight.toFixed(1)}%
                                    </span>
                                </div>
                            </div>

                            {/* Create Button */}
                            <button
                                onClick={handleCustomCreate}
                                disabled={Math.abs(totalWeight - 100) > 0.1 || !portfolioName.trim()}
                                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all"
                            >
                                Create Portfolio
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
