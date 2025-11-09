import React, { useCallback, useRef, useState } from 'react';
import {
    ReactFlow,
    Node,
    Edge,
    Connection,
    useNodesState,
    useEdgesState,
    Controls,
    Background,
    MiniMap,
    Panel,
    MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { AllocationNode } from './nodes/AllocationNode';
import { RuleEdge } from './edges/RuleEdge';
import { PortfolioCreationModal } from './modals/PortfolioCreationModal';
import { RuleCreationModal } from './modals/RuleCreationModal';
import { RuleAssignmentModal } from './modals/RuleAssignmentModal';
import { JsonEditorModal } from './modals/JsonEditorModal';
import { useTacticalStrategy } from '../../hooks/useTacticalStrategy';
import { Allocation } from '../../types/strategy';

const nodeTypes = {
    allocation: AllocationNode,
};

const edgeTypes = {
    rule: RuleEdge,
};

interface StrategyCanvasProps {
    hook: ReturnType<typeof useTacticalStrategy>;
}

export const StrategyCanvas: React.FC<StrategyCanvasProps> = ({ hook }) => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [showPortfolioModal, setShowPortfolioModal] = useState(false);
    const [showRuleModal, setShowRuleModal] = useState(false);
    const [showAssignRuleModal, setShowAssignRuleModal] = useState(false);
    const [showRulesPanel, setShowRulesPanel] = useState(false);
    const [showJsonEditor, setShowJsonEditor] = useState(false);
    const [selectedAllocationForRule, setSelectedAllocationForRule] = useState<string | null>(null);

    // Initialize nodes from strategy allocations
    React.useEffect(() => {
        const allocationNames = Object.keys(hook.strategy.allocations);
        if (allocationNames.length === 0) return;

        // Build edge map to determine fallback (last node in chain = no outgoing edges)
        const incomingEdges = new Set<string>(); // nodes with incoming edges

        // Scan for edges in allocation_rules
        if (hook.strategy.allocation_rules) {
            hook.strategy.allocation_rules.forEach((allocationRule) => {
                if (allocationRule.rules.length > 0) {
                    incomingEdges.add(allocationRule.allocation);
                }
            });
        }

        const initialNodes: Node[] = allocationNames.map((name, index) => {
            const allocationWithRebalancing = hook.strategy.allocations[name];

            // Find rules assigned to this allocation
            const allocationRule = hook.strategy.allocation_rules?.find(ar => ar.allocation === name);
            const assignedRules = allocationRule?.rules || [];

            // A node is a fallback if it has incoming edges but no outgoing edges
            // (i.e., it's the last node in a linked chain)
            const hasIncoming = incomingEdges.has(name);
            const hasOutgoing = assignedRules.length > 0; // If it has rules, it can switch OUT
            const isFallback = hasIncoming && !hasOutgoing;

            return {
                id: name,
                type: 'allocation',
                position: {
                    x: 100 + (index % 3) * 350,
                    y: 100 + Math.floor(index / 3) * 250,
                },
                data: {
                    name,
                    allocation: allocationWithRebalancing.allocation,
                    isFallback,
                    assignedRules,
                    rebalancingFrequency: allocationWithRebalancing.rebalancing_frequency,
                    onUpdate: (newAllocation: Allocation, rebalancingFrequency?: string) => {
                        hook.updateAllocation(name, {
                            allocation: newAllocation,
                            rebalancing_frequency: rebalancingFrequency as any,
                        });
                    },
                    onRename: (newName: string) => {
                        hook.renameAllocation(name, newName);
                        // Update node id
                        setNodes((nds) =>
                            nds.map((n) => (n.id === name ? { ...n, id: newName, data: { ...n.data, name: newName } } : n))
                        );
                        // Update edges
                        setEdges((eds) =>
                            eds.map((e) => ({
                                ...e,
                                source: e.source === name ? newName : e.source,
                                target: e.target === name ? newName : e.target,
                            }))
                        );
                    },
                    onDelete: () => {
                        hook.deleteAllocation(name);
                        setNodes((nds) => nds.filter((n) => n.id !== name));
                        setEdges((eds) =>
                            eds.filter((e) => e.source !== name && e.target !== name)
                        );
                    },
                    onManageRules: () => {
                        // Prevent rule management on fallback nodes
                        if (isFallback) {
                            return;
                        }
                        setSelectedAllocationForRule(name);
                        setShowAssignRuleModal(true);
                    },
                },
            };
        });

        setNodes(initialNodes);

        // Initialize edges from allocation_rules
        // Each portfolio with rules can switch to other portfolios
        const initialEdges: Edge[] = [];
        if (hook.strategy.allocation_rules) {
            hook.strategy.allocation_rules.forEach((allocationRule) => {
                if (allocationRule.rules.length > 0) {
                    // Find which portfolio(s) have rules that switch TO this allocation
                    // We need to trace back: which portfolio's rules trigger switch to this?
                    // For now, we'll create edges based on the existence of rules
                    allocationNames.forEach((sourceName) => {
                        const sourceRules = hook.strategy.allocation_rules?.find(ar => ar.allocation === sourceName);
                        if (sourceRules && sourceRules.rules.length > 0 && sourceName !== allocationRule.allocation) {
                            // This is a potential edge
                            // TODO: This logic needs refinement based on actual rule targets
                        }
                    });
                }
            });
        }

        setEdges(initialEdges);
    }, [hook.strategy.allocations, hook.strategy.allocation_rules, hook.strategy.fallback_allocation]);

    const onConnect = useCallback(
        (params: Connection) => {
            if (!params.source || !params.target) return;
            if (params.source === params.target) return;

            const sourceNode = nodes.find((n) => n.id === params.source);
            const targetNode = nodes.find((n) => n.id === params.target);
            if (!sourceNode || !targetNode) return;

            // Check if edge already exists
            const edgeExists = edges.some(
                (e) => e.source === params.source && e.target === params.target
            );
            if (edgeExists) return;

            // Create edge and update fallback status
            const newEdge: Edge = {
                id: `${params.source}-${params.target}`,
                source: params.source,
                target: params.target,
                type: 'rule',
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: '#8b5cf6',
                },
                data: {
                    onDelete: () => {
                        setEdges((eds) => eds.filter((e) => e.id !== `${params.source}-${params.target}`));
                        // Update fallback status after edge deletion
                        updateFallbackStatus();
                    },
                },
            };

            setEdges((eds) => {
                const updatedEdges = [...eds, newEdge];
                // After adding edge, update fallback status
                setTimeout(() => updateFallbackStatus(), 0);
                return updatedEdges;
            });
        },
        [nodes, edges]
    );

    // Helper to determine fallback nodes (last nodes in chains)
    const updateFallbackStatus = useCallback(() => {
        setNodes((nds) => {
            const outgoingMap = new Map<string, number>();
            const incomingMap = new Map<string, number>();

            // Count outgoing and incoming edges for each node
            edges.forEach((edge) => {
                outgoingMap.set(edge.source, (outgoingMap.get(edge.source) || 0) + 1);
                incomingMap.set(edge.target, (incomingMap.get(edge.target) || 0) + 1);
            });

            return nds.map((node) => {
                const hasIncoming = (incomingMap.get(node.id) || 0) > 0;
                const hasOutgoing = (outgoingMap.get(node.id) || 0) > 0;

                // Fallback = has incoming edges but no outgoing (last in chain)
                const isFallback = hasIncoming && !hasOutgoing;

                // If node becomes fallback, remove all its rules
                if (isFallback && node.data.assignedRules?.length > 0) {
                    node.data.assignedRules.forEach((ruleName: string) => {
                        hook.unassignRuleFromAllocation(ruleName, node.id);
                    });

                    return {
                        ...node,
                        data: {
                            ...node.data,
                            isFallback,
                            assignedRules: [],
                        },
                    };
                }

                return {
                    ...node,
                    data: {
                        ...node.data,
                        isFallback,
                    },
                };
            });
        });
    }, [edges, hook]);

    const handleCreatePortfolio = (name: string, allocation: Allocation) => {
        const actualName = hook.addAllocationWithAssets(name, allocation);

        if (actualName) {
            const position = {
                x: 100 + (Object.keys(hook.strategy.allocations).length % 3) * 350,
                y: 100 + Math.floor(Object.keys(hook.strategy.allocations).length / 3) * 250,
            };

            const newNode: Node = {
                id: actualName,
                type: 'allocation',
                position,
                data: {
                    name: actualName,
                    allocation,
                    isFallback: false,
                    assignedRules: [],
                    rebalancingFrequency: undefined,
                    onUpdate: (newAllocation: Allocation, rebalancingFrequency?: string) => {
                        hook.updateAllocation(actualName, {
                            allocation: newAllocation,
                            rebalancing_frequency: rebalancingFrequency as any,
                        });
                    },
                    onRename: (newName: string) => {
                        hook.renameAllocation(actualName, newName);
                        setNodes((nds) =>
                            nds.map((n) => (n.id === actualName ? { ...n, id: newName, data: { ...n.data, name: newName } } : n))
                        );
                        setEdges((eds) =>
                            eds.map((e) => ({
                                ...e,
                                source: e.source === actualName ? newName : e.source,
                                target: e.target === actualName ? newName : e.target,
                            }))
                        );
                    },
                    onDelete: () => {
                        hook.deleteAllocation(actualName);
                        setNodes((nds) => nds.filter((n) => n.id !== actualName));
                        setEdges((eds) =>
                            eds.filter((e) => e.source !== actualName && e.target !== actualName)
                        );
                    },
                    onManageRules: () => {
                        // New nodes start as non-fallback, so this is safe
                        setSelectedAllocationForRule(actualName);
                        setShowAssignRuleModal(true);
                    },
                },
            };

            setNodes((nds) => nds.concat(newNode));
        }
        setShowPortfolioModal(false);
    };

    const handleCreateRule = (ruleData: any) => {
        hook.addSwitchingRuleWithData(ruleData);
        setShowRuleModal(false);
    };

    const handleAssignRuleToConnection = (ruleName: string) => {
        if (!selectedAllocationForRule) return;

        // Check if the selected allocation is a fallback node
        const targetNode = nodes.find((n) => n.id === selectedAllocationForRule);
        if (targetNode?.data.isFallback) {
            alert('Cannot assign rules to fallback portfolio (last node in chain)');
            setShowAssignRuleModal(false);
            setSelectedAllocationForRule(null);
            return;
        }

        hook.assignRuleToAllocation(ruleName, selectedAllocationForRule);

        // Update the node to show the new rule
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === selectedAllocationForRule) {
                    const allocationRule = hook.strategy.allocation_rules?.find(
                        (ar) => ar.allocation === selectedAllocationForRule
                    );
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            assignedRules: allocationRule?.rules || [],
                        },
                    };
                }
                return node;
            })
        );

        setShowAssignRuleModal(false);
        setSelectedAllocationForRule(null);
    };

    return (
        <div className="h-screen w-full" ref={reactFlowWrapper}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                zoomOnScroll={true}
                zoomOnPinch={true}
                zoomOnDoubleClick={true}
                panOnScroll={true}
                attributionPosition="bottom-left"
            >
                <Background color="#e2e8f0" gap={16} />
                <Controls showZoom={true} showInteractive={true} />
                <MiniMap
                    nodeColor={(node) => {
                        if (node.data.isFallback) return '#10b981';
                        return '#8b5cf6';
                    }}
                    nodeStrokeWidth={3}
                    zoomable={true}
                    pannable
                />

                {/* Toolbar Panel */}
                <Panel position="top-left" className="bg-white rounded-xl shadow-lg p-4 space-y-3 border border-slate-200 max-w-xs">
                    <div className="text-sm font-bold text-slate-900 mb-2">Strategy Builder</div>

                    {/* Add Portfolio Button */}
                    <button
                        onClick={() => setShowPortfolioModal(true)}
                        className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-lg hover:border-purple-500 hover:shadow-md transition-all"
                    >
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="text-sm font-medium text-purple-700">
                            Add Portfolio
                        </span>
                    </button>

                    {/* Add Rule Button */}
                    <button
                        onClick={() => setShowRuleModal(true)}
                        className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
                    >
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-sm font-medium text-blue-700">
                            Create Rule
                        </span>
                    </button>

                    {/* View Rules Button */}
                    <button
                        onClick={() => setShowRulesPanel(!showRulesPanel)}
                        className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all"
                    >
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className="text-sm font-medium text-indigo-700">
                            {showRulesPanel ? 'Hide' : 'View'} All Rules
                        </span>
                    </button>

                    {/* JSON Editor Button */}
                    <button
                        onClick={() => setShowJsonEditor(true)}
                        className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg hover:border-amber-500 hover:shadow-md transition-all"
                    >
                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        <span className="text-sm font-medium text-amber-700">
                            Edit JSON
                        </span>
                    </button>

                    {/* Strategy Parameters */}
                    <div className="pt-3 border-t border-slate-200 space-y-2">
                        <div className="text-xs font-semibold text-slate-700 mb-2">Strategy Parameters</div>

                        <div>
                            <label className="text-xs text-slate-600">Start Date</label>
                            <input
                                type="date"
                                value={hook.strategy.start_date}
                                onChange={(e) => hook.updateStrategy({ ...hook.strategy, start_date: e.target.value })}
                                className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 mt-1"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-slate-600">End Date</label>
                            <input
                                type="date"
                                value={hook.strategy.end_date}
                                onChange={(e) => hook.updateStrategy({ ...hook.strategy, end_date: e.target.value })}
                                className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 mt-1"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-slate-600">Initial Capital</label>
                            <div className="relative mt-1">
                                <span className="absolute left-2 top-1.5 text-xs text-slate-500">$</span>
                                <input
                                    type="number"
                                    value={hook.strategy.initial_capital}
                                    onChange={(e) => hook.updateStrategy({ ...hook.strategy, initial_capital: parseFloat(e.target.value) || 100000 })}
                                    className="w-full text-xs border border-slate-200 rounded pl-5 pr-2 py-1.5"
                                    min="1000"
                                    step="1000"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-200">
                        <div className="flex items-start gap-2">
                            <span className="font-semibold">•</span>
                            <span>Orphan nodes = simple tests</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="font-semibold">•</span>
                            <span>Linked nodes = tactical strategy</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="font-semibold">•</span>
                            <span>Last node in chain = fallback</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="font-semibold">•</span>
                            <span>Rules define <strong>when to switch TO</strong> a portfolio</span>
                        </div>
                    </div>
                </Panel>

                {/* Strategy Info Panel */}
                <Panel position="top-right" className="bg-white rounded-xl shadow-lg p-4 space-y-2 border border-slate-200">
                    <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">Strategy Summary</div>
                    <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                            <span className="text-slate-600">Portfolios:</span>
                            <span className="font-semibold text-slate-900">{Object.keys(hook.strategy.allocations).length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Rules:</span>
                            <span className="font-semibold text-slate-900">{hook.strategy.switching_logic.length}</span>
                        </div>
                        <div className="flex justify-between text-xs pt-1 border-t border-slate-200 mt-2">
                            <span className="text-slate-600">Capital:</span>
                            <span className="font-semibold text-slate-900">${hook.strategy.initial_capital.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-600">Period:</span>
                            <span className="font-medium text-slate-700">{hook.strategy.start_date} to {hook.strategy.end_date}</span>
                        </div>
                    </div>
                </Panel>

                {/* Rules Panel - Right Side */}
                {showRulesPanel && (
                    <Panel position="bottom-right" className="bg-white rounded-xl shadow-lg border border-slate-200 max-w-md max-h-[60vh] overflow-y-auto">
                        <div className="p-4 border-b border-slate-200 sticky top-0 bg-white">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-slate-900">All Switching Rules</h3>
                                <button
                                    onClick={() => setShowRulesPanel(false)}
                                    className="p-1 text-slate-400 hover:text-slate-600 rounded"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-xs text-slate-600 mt-1">Rules define when to switch between portfolios</p>
                        </div>

                        <div className="p-4 space-y-3">
                            {hook.strategy.switching_logic.length === 0 ? (
                                <div className="text-center py-8 text-slate-500">
                                    <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <p className="text-sm font-medium">No rules created yet</p>
                                    <p className="text-xs mt-1">Create rules to define switching logic</p>
                                </div>
                            ) : (
                                hook.strategy.switching_logic.map((rule, index) => (
                                    <div key={index} className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-slate-900 text-sm">{rule.name || `Rule ${index + 1}`}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded ${rule.rule_type === 'buy' ? 'bg-green-100 text-green-700' :
                                                        rule.rule_type === 'sell' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {rule.rule_type}
                                                </span>
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => {
                                                        // TODO: Add rule editing functionality
                                                        alert('Rule editing coming soon! Use the Config view to edit rules.');
                                                    }}
                                                    className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                    title="Edit rule"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => hook.deleteSwitchingRule(index)}
                                                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                    title="Delete rule"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Condition Display */}
                                        {rule.condition && (
                                            <div className="bg-white border border-slate-200 rounded p-2 text-xs">
                                                <div className="text-center font-mono text-slate-700">
                                                    <span className="font-semibold text-purple-600">
                                                        {rule.condition.left.type}
                                                    </span>
                                                    <span className="text-slate-500">
                                                        ({rule.condition.left.symbol}, {rule.condition.left.window}d)
                                                    </span>
                                                    <span className="mx-2 text-purple-700 font-bold">
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
                                            </div>
                                        )}

                                        {/* Show which portfolios use this rule */}
                                        <div className="text-xs text-slate-600">
                                            <span className="font-medium">Assigned to:</span>
                                            {(hook.strategy.allocation_rules || []).filter(ar => ar.rules.includes(rule.name || '')).length > 0 ? (
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {(hook.strategy.allocation_rules || [])
                                                        .filter(ar => ar.rules.includes(rule.name || ''))
                                                        .map(ar => (
                                                            <span key={ar.allocation} className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                                                                {ar.allocation}
                                                            </span>
                                                        ))
                                                    }
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 ml-1">Not assigned</span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Panel>
                )}
            </ReactFlow>

            {/* Modals */}
            <PortfolioCreationModal
                isOpen={showPortfolioModal}
                onClose={() => setShowPortfolioModal(false)}
                onCreate={handleCreatePortfolio}
            />

            <RuleCreationModal
                isOpen={showRuleModal}
                onClose={() => setShowRuleModal(false)}
                onCreate={handleCreateRule}
            />

            <RuleAssignmentModal
                isOpen={showAssignRuleModal}
                onClose={() => {
                    setShowAssignRuleModal(false);
                    setSelectedAllocationForRule(null);
                }}
                onAssign={handleAssignRuleToConnection}
                availableRules={hook.strategy.switching_logic}
                targetAllocation={selectedAllocationForRule}
            />

            <JsonEditorModal
                isOpen={showJsonEditor}
                onClose={() => setShowJsonEditor(false)}
                strategy={hook.strategy}
                onSave={(updatedStrategy) => {
                    hook.updateStrategy(updatedStrategy);
                }}
            />
        </div>
    );
};
