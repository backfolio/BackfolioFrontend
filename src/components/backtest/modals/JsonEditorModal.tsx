import { useState, useEffect } from 'react';
import { StrategyDSL } from '../../../types/strategy';

interface JsonEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    strategy: StrategyDSL;
    onSave: (strategy: StrategyDSL) => void;
}

export const JsonEditorModal: React.FC<JsonEditorModalProps> = ({
    isOpen,
    onClose,
    strategy,
    onSave,
}) => {
    const [jsonText, setJsonText] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setJsonText(JSON.stringify(strategy, null, 2));
            setError(null);
        }
    }, [isOpen, strategy]);

    const handleSave = () => {
        try {
            const parsed = JSON.parse(jsonText);
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl shadow-sm">
                            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">JSON Strategy Editor</h2>
                            <p className="text-sm text-slate-600">Edit strategy directly in JSON format</p>
                        </div>
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
                <div className="flex-1 overflow-y-auto p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p className="text-sm font-medium text-red-800">JSON Error</p>
                                    <p className="text-xs text-red-600 mt-1">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-1">
                        <textarea
                            value={jsonText}
                            onChange={(e) => {
                                setJsonText(e.target.value);
                                setError(null);
                            }}
                            className="w-full h-[500px] font-mono text-sm bg-white border-0 rounded-lg p-4 focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
                            placeholder="Enter your strategy JSON here..."
                            spellCheck={false}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3">
                    <button
                        onClick={handleFormat}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        Format JSON
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg transition-all text-sm font-semibold shadow-sm hover:shadow-md"
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
