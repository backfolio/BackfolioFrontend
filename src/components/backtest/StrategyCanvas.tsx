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
    ConnectionMode,
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
    onEdgesChange?: (edges: Array<{ source: string; target: string }>) => void;
}

export const StrategyCanvas: React.FC<StrategyCanvasProps> = ({ hook, onEdgesChange: notifyEdgesChange }) => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
    const [showPortfolioModal, setShowPortfolioModal] = useState(false);
    const [showRuleModal, setShowRuleModal] = useState(false);
    const [showAssignRuleModal, setShowAssignRuleModal] = useState(false);
    const [showRulesPanel, setShowRulesPanel] = useState(false);
    const [showJsonEditor, setShowJsonEditor] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [selectedAllocationForRule, setSelectedAllocationForRule] = useState<string | null>(null);

    // Notify parent of edge changes for multi-strategy detection
    React.useEffect(() => {
        if (notifyEdgesChange) {
            const simpleEdges = edges.map(e => ({ source: e.source, target: e.target }));
            notifyEdgesChange(simpleEdges);
        }
    }, [edges, notifyEdgesChange]);

    // Initialize nodes from strategy allocations
    React.useEffect(() => {
        const allocationNames = Object.keys(hook.strategy.allocations);
        if (allocationNames.length === 0) return;

        const initialNodes: Node[] = allocationNames.map((name, index) => {
            const allocationWithRebalancing = hook.strategy.allocations[name];

            // Find rules assigned to this allocation
            const allocationRule = hook.strategy.allocation_rules?.find(ar => ar.allocation === name);
            const assignedRules = allocationRule?.rules || [];

            // Fallback status will be computed by useEffect watching edges
            // Initial state: no nodes are fallback until edges are established
            const isFallback = false;

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
                        // Allow rule management on all nodes including fallback
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

    // Sync nodes with strategy changes (for rule assignments and fallback status)
    React.useEffect(() => {
        console.log('[Sync Effect] Running with edges:', edges.length, 'allocation_rules:', hook.strategy.allocation_rules?.length);

        setNodes((nds) => {
            const incomingMap = new Map<string, number>();
            const outgoingMap = new Map<string, number>();

            // Count incoming and outgoing edges for each node
            edges.forEach((edge) => {
                outgoingMap.set(edge.source, (outgoingMap.get(edge.source) || 0) + 1);
                incomingMap.set(edge.target, (incomingMap.get(edge.target) || 0) + 1);
            });

            // Build chains to find the FIRST node without rules in each chain
            const chains: string[][] = [];
            const visited = new Set<string>();

            // Find chain starts (nodes with no incoming edges but have outgoing)
            nds.forEach((node) => {
                const hasIncoming = (incomingMap.get(node.id) || 0) > 0;
                const hasOutgoing = (outgoingMap.get(node.id) || 0) > 0;

                if (!hasIncoming && hasOutgoing && !visited.has(node.id)) {
                    // This is a chain start - traverse the chain
                    const chain: string[] = [];
                    let current = node.id;

                    while (current && !visited.has(current)) {
                        chain.push(current);
                        visited.add(current);

                        // Find next node in chain
                        const edge = edges.find(e => e.source === current);
                        current = edge?.target || '';
                    }

                    if (chain.length > 0) {
                        chains.push(chain);
                    }
                }
            });

            // For each chain, find the FIRST node without rules = fallback
            const fallbackNodes = new Set<string>();
            chains.forEach((chain) => {
                for (const nodeId of chain) {
                    const allocationRule = hook.strategy.allocation_rules?.find(
                        (ar) => ar.allocation === nodeId
                    );
                    const hasRules = (allocationRule?.rules || []).length > 0;

                    if (!hasRules) {
                        // First node in chain without rules = fallback
                        fallbackNodes.add(nodeId);
                        break; // Only one fallback per chain
                    }
                }
            });

            return nds.map((node) => {
                const allocationRule = hook.strategy.allocation_rules?.find(
                    (ar) => ar.allocation === node.id
                );
                const assignedRules = allocationRule?.rules || [];

                const hasIncoming = (incomingMap.get(node.id) || 0) > 0;
                const hasOutgoing = (outgoingMap.get(node.id) || 0) > 0;
                const hasRules = assignedRules.length > 0;
                const isFallback = fallbackNodes.has(node.id);

                // Debug: show all nodes with edges
                if (hasIncoming || hasOutgoing) {
                    console.log(`[Node] ${node.id}:`, {
                        hasIncoming,
                        hasOutgoing,
                        hasRules,
                        assignedRules,
                        isFallback
                    });
                }

                if (isFallback) {
                    console.log(`🟢 FALLBACK DETECTED: ${node.id}`);
                }

                return {
                    ...node,
                    data: {
                        ...node.data,
                        assignedRules,
                        isFallback,
                    },
                };
            });
        });
    }, [hook.strategy.allocation_rules, edges, hook.strategy]);

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

            // Linked-list constraint: max 1 outgoing edge per node
            const sourceHasOutgoing = edges.some((e) => e.source === params.source);
            if (sourceHasOutgoing) {
                alert('This portfolio already has an outgoing connection. Each portfolio can only have one outgoing arrow (linked-list structure).');
                return;
            }

            // Linked-list constraint: max 1 incoming edge per node
            const targetHasIncoming = edges.some((e) => e.target === params.target);
            if (targetHasIncoming) {
                alert('Target portfolio already has an incoming connection. Each portfolio can only have one incoming arrow (linked-list structure).');
                return;
            }

            // Create edge with SPECIFIC handle IDs to preserve which sides are connected
            const newEdge: Edge = {
                id: `${params.source}-${params.target}`,
                source: params.source,
                target: params.target,
                sourceHandle: params.sourceHandle,  // CRITICAL: preserve which handle on source
                targetHandle: params.targetHandle,  // CRITICAL: preserve which handle on target
                type: 'rule',
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: '#8b5cf6',
                },
                data: {
                    onDelete: () => {
                        setEdges((eds) => eds.filter((e) => e.id !== `${params.source}-${params.target}`));
                    },
                },
            };

            setEdges((eds) => {
                const updatedEdges = [...eds, newEdge];
                return updatedEdges;
            });
        },
        [nodes, edges]
    );

    // Quick create - adds empty portfolio to canvas for inline configuration
    const handleQuickCreatePortfolio = () => {
        const count = Object.keys(hook.strategy.allocations).length;

        // Limit to 6 portfolios per strategy
        if (count >= 6) {
            alert('Maximum of 6 portfolios per strategy reached.');
            return;
        }

        const name = `Portfolio ${count + 1}`;
        const allocation: Allocation = { SPY: 1.0 }; // Default single asset

        const actualName = hook.addAllocationWithAssets(name, allocation);

        if (actualName) {
            const position = reactFlowInstance
                ? reactFlowInstance.project({ x: window.innerWidth / 2 - 140, y: window.innerHeight / 2 - 100 })
                : {
                    x: 100 + (count % 3) * 350,
                    y: 100 + Math.floor(count / 3) * 250,
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
                    isNewlyCreated: true, // Flag to auto-open edit mode
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
                        setSelectedAllocationForRule(actualName);
                        setShowAssignRuleModal(true);
                    },
                },
            };

            setNodes((nds) => nds.concat(newNode));

            // Auto-fit view after adding node
            setTimeout(() => {
                if (reactFlowInstance) {
                    reactFlowInstance.fitView({ padding: 0.2, duration: 300 });
                }
            }, 50);
        }
    };

    const handleCreatePortfolio = (name: string, allocation: Allocation) => {
        // Limit to 6 portfolios per strategy
        if (Object.keys(hook.strategy.allocations).length >= 6) {
            alert('Maximum of 6 portfolios per strategy reached.');
            setShowPortfolioModal(false);
            return;
        }

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
                    isNewlyCreated: false,
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
                        setSelectedAllocationForRule(actualName);
                        setShowAssignRuleModal(true);
                    },
                },
            };

            setNodes((nds) => nds.concat(newNode));

            // Auto-fit view after adding node
            setTimeout(() => {
                if (reactFlowInstance) {
                    reactFlowInstance.fitView({ padding: 0.2, duration: 300 });
                }
            }, 50);
        }
        setShowPortfolioModal(false);
    };

    const handleCreateRule = (ruleData: any) => {
        hook.addSwitchingRuleWithData(ruleData);
        setShowRuleModal(false);
    };

    const handleAssignRuleToConnection = (ruleName: string) => {
        if (!selectedAllocationForRule) return;

        // Allow rules on any portfolio - this will trigger useEffect to recalculate fallback
        hook.assignRuleToAllocation(ruleName, selectedAllocationForRule);

        setShowAssignRuleModal(false);
        setSelectedAllocationForRule(null);
    };

    return (
        <div className="h-screen w-full bg-slate-100" ref={reactFlowWrapper}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                connectionMode={ConnectionMode.Loose}
                fitView
                defaultViewport={{ x: 0, y: 0, zoom: 0.75 }}
                minZoom={0.75}
                maxZoom={1.5}
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

                {/* Compact Floating Toolbar - Excalidraw Style */}
                <Panel position="top-left" className="flex gap-2">
                    <div className="relative group">
                        <button
                            onClick={handleQuickCreatePortfolio}
                            disabled={Object.keys(hook.strategy.allocations).length >= 6}
                            className="p-2.5 bg-white rounded-lg shadow-md hover:shadow-lg border border-slate-200 hover:border-purple-400 transition-all group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-200"
                            title={Object.keys(hook.strategy.allocations).length >= 6 ? "Maximum 6 portfolios per strategy" : "Add Portfolio (Click to add to canvas)"}
                        >
                            <svg className="w-5 h-5 text-slate-600 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                        {/* Small helper text on hover */}
                        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                            {Object.keys(hook.strategy.allocations).length >= 6 ? 'Max 6 portfolios' : 'Create portfolio on canvas'}
                        </div>
                    </div>

                    <button
                        onClick={() => setShowRuleModal(true)}
                        className="p-2.5 bg-white rounded-lg shadow-md hover:shadow-lg border border-slate-200 hover:border-blue-400 transition-all group"
                        title="Create Rule"
                    >
                        <svg className="w-5 h-5 text-slate-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </button>

                    <button
                        onClick={() => setShowRulesPanel(!showRulesPanel)}
                        className={`p-2.5 bg-white rounded-lg shadow-md hover:shadow-lg border transition-all group ${showRulesPanel ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-indigo-400'
                            }`}
                        title={showRulesPanel ? 'Hide Rules' : 'View All Rules'}
                    >
                        <svg className="w-5 h-5 text-slate-600 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </button>

                    <button
                        onClick={() => setShowJsonEditor(true)}
                        className="p-2.5 bg-white rounded-lg shadow-md hover:shadow-lg border border-slate-200 hover:border-amber-400 transition-all group"
                        title="Edit JSON"
                    >
                        <svg className="w-5 h-5 text-slate-600 group-hover:text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                    </button>

                    <div className="w-px bg-slate-200" />

                    <button
                        onClick={() => setShowSummary(!showSummary)}
                        className={`p-2.5 bg-white rounded-lg shadow-md hover:shadow-lg border transition-all group ${showSummary ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-emerald-400'
                            }`}
                        title={showSummary ? 'Hide Summary' : 'Show Summary'}
                    >
                        <svg className="w-5 h-5 text-slate-600 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </button>
                </Panel>

                {/* Compact Strategy Summary - Only show when toggled */}
                {showSummary && (
                    <Panel position="top-right" className="bg-white/95 backdrop-blur rounded-lg shadow-lg p-3 border border-slate-200 text-xs">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-slate-700">Strategy</span>
                            <button
                                onClick={() => setShowSummary(false)}
                                className="p-0.5 text-slate-400 hover:text-slate-600 rounded"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Portfolios</span>
                                <span className="font-medium text-slate-900">{Object.keys(hook.strategy.allocations).length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Rules</span>
                                <span className="font-medium text-slate-900">{hook.strategy.switching_logic.length}</span>
                            </div>
                            <div className="flex justify-between pt-1 border-t border-slate-200">
                                <span className="text-slate-500">Capital</span>
                                <span className="font-medium text-slate-900">${hook.strategy.initial_capital.toLocaleString()}</span>
                            </div>
                            <div className="pt-1">
                                <div className="text-slate-500 mb-0.5">Period</div>
                                <div className="font-mono text-[10px] text-slate-700">
                                    {hook.strategy.start_date}
                                </div>
                                <div className="font-mono text-[10px] text-slate-700">
                                    {hook.strategy.end_date}
                                </div>
                            </div>
                            <div className="pt-1 border-t border-slate-200">
                                <input
                                    type="date"
                                    value={hook.strategy.start_date}
                                    onChange={(e) => hook.updateStrategy({ ...hook.strategy, start_date: e.target.value })}
                                    className="w-full text-[10px] border border-slate-200 rounded px-1.5 py-1 mb-1"
                                />
                                <input
                                    type="date"
                                    value={hook.strategy.end_date}
                                    onChange={(e) => hook.updateStrategy({ ...hook.strategy, end_date: e.target.value })}
                                    className="w-full text-[10px] border border-slate-200 rounded px-1.5 py-1 mb-1"
                                />
                                <div className="relative">
                                    <span className="absolute left-1.5 top-1.5 text-[10px] text-slate-500">$</span>
                                    <input
                                        type="number"
                                        value={hook.strategy.initial_capital}
                                        onChange={(e) => hook.updateStrategy({ ...hook.strategy, initial_capital: parseFloat(e.target.value) || 100000 })}
                                        className="w-full text-[10px] border border-slate-200 rounded pl-4 pr-1.5 py-1"
                                        min="1000"
                                        step="1000"
                                    />
                                </div>
                            </div>
                        </div>
                    </Panel>
                )}

                {/* Rules Panel - Compact Right Sidebar */}
                {showRulesPanel && (
                    <Panel position="bottom-right" className="bg-white/95 backdrop-blur rounded-lg shadow-lg border border-slate-200 max-w-sm max-h-[70vh] overflow-y-auto">
                        <div className="p-3 border-b border-slate-200 sticky top-0 bg-white/95 backdrop-blur">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-slate-900">Rules</h3>
                                <button
                                    onClick={() => setShowRulesPanel(false)}
                                    className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-3 space-y-2">
                            {hook.strategy.switching_logic.length === 0 ? (
                                <div className="text-center py-6 text-slate-400">
                                    <svg className="w-10 h-10 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <p className="text-xs font-medium">No rules yet</p>
                                </div>
                            ) : (
                                hook.strategy.switching_logic.map((rule, index) => (
                                    <div key={index} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 hover:border-slate-300 transition-colors">
                                        <div className="flex items-start justify-between mb-1.5">
                                            <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                                <span className="font-medium text-slate-900 text-xs truncate">{rule.name || `Rule ${index + 1}`}</span>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 ${rule.rule_type === 'buy' ? 'bg-green-100 text-green-700' :
                                                    rule.rule_type === 'sell' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {rule.rule_type}
                                                </span>
                                            </div>
                                            <div className="flex gap-0.5 flex-shrink-0 ml-1">
                                                <button
                                                    onClick={() => alert('Rule editing coming soon! Use JSON editor for now.')}
                                                    className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                    title="Edit"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => hook.deleteSwitchingRule(index)}
                                                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                    title="Delete"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Compact Condition Display */}
                                        {rule.condition && (
                                            <div className="bg-white border border-slate-200 rounded p-1.5 mb-1.5">
                                                <div className="text-center font-mono text-[10px] text-slate-700 leading-tight">
                                                    <span className="font-semibold text-purple-600">
                                                        {rule.condition.left.type}
                                                    </span>
                                                    <span className="text-slate-400 text-[9px]">
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
                                                        <span className="text-slate-400 text-[9px]">
                                                            ({rule.condition.right.symbol}, {rule.condition.right.window}d)
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Assigned To - Compact */}
                                        <div className="text-[10px] text-slate-500">
                                            {(hook.strategy.allocation_rules || []).filter(ar => ar.rules.includes(rule.name || '')).length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {(hook.strategy.allocation_rules || [])
                                                        .filter(ar => ar.rules.includes(rule.name || ''))
                                                        .map(ar => (
                                                            <span key={ar.allocation} className="inline-block px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded">
                                                                {ar.allocation}
                                                            </span>
                                                        ))
                                                    }
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 italic">Not assigned</span>
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
                strategyChains={hook.detectStrategyChains(edges.map(e => ({ source: e.source, target: e.target })))}
            />
        </div>
    );
};
