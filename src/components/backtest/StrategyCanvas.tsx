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
    BackgroundVariant,
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
import { NavigationMenu } from '../NavigationMenu';
import { useTheme } from '../../context/ThemeContext';

/**
 * StrategyCanvas - Visual node-based editor for portfolio strategies
 * 
 * Architecture:
 * - Uses ReactFlow for canvas rendering and node/edge management
 * - Maintains persistent position tracking via nodePositionsRef to prevent layout resets
 * - Syncs with useTacticalStrategy hook for strategy state management
 * - Supports drag-and-drop, duplicate, delete, rename operations
 * - Implements linked-list connection constraints (max 1 in/out per node)
 * - Auto-detects fallback portfolios based on rule assignments
 */

const nodeTypes = {
    allocation: AllocationNode,
};

const edgeTypes = {
    rule: RuleEdge,
};

interface StrategyCanvasProps {
    hook: ReturnType<typeof useTacticalStrategy>;
    onEdgesChange?: (edges: Array<{ source: string; target: string }>) => void;
    onRunBacktest?: () => void;
    isBacktestLoading?: boolean;
}

export const StrategyCanvas: React.FC<StrategyCanvasProps> = ({
    hook,
    onEdgesChange: notifyEdgesChange,
    onRunBacktest,
    isBacktestLoading = false
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Position tracking: persists node positions across re-renders to prevent layout resets
    // - Stores positions when nodes are dragged or duplicated
    // - Prioritizes: stored position > existing position > default grid layout
    const nodePositionsRef = useRef<Map<string, { x: number; y: number }>>(new Map());

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
    const [showPortfolioModal, setShowPortfolioModal] = useState(false);
    const [showRuleModal, setShowRuleModal] = useState(false);
    const [showAssignRuleModal, setShowAssignRuleModal] = useState(false);
    const [showRulesPanel, setShowRulesPanel] = useState(false);
    const [showJsonEditor, setShowJsonEditor] = useState(false);
    const [showPlaceholderPanel, setShowPlaceholderPanel] = useState(false);
    const [showDocumentation, setShowDocumentation] = useState(false);
    const [selectedAllocationForRule, setSelectedAllocationForRule] = useState<string | null>(null);

    // ============================================================================
    // Effects
    // ============================================================================

    // Track node position changes to persist them across renders
    React.useEffect(() => {
        nodes.forEach(node => {
            nodePositionsRef.current.set(node.id, node.position);
        });
    }, [nodes]);

    // Notify parent of edge changes for multi-strategy detection
    React.useEffect(() => {
        if (notifyEdgesChange) {
            const simpleEdges = edges.map(e => ({ source: e.source, target: e.target }));
            notifyEdgesChange(simpleEdges);
        }
    }, [edges, notifyEdgesChange]);

    // ============================================================================
    // Node Management Handlers
    // ============================================================================

    const handleDuplicateNode = useCallback((sourceNodeId: string) => {
        const sourceNode = nodes.find(n => n.id === sourceNodeId);
        if (!sourceNode) return;

        // Create duplicate allocation via hook
        const newName = hook.duplicateAllocation(sourceNodeId);
        if (!newName) return;

        // Pre-store position for the new node (300px to the right of source)
        // The initialization effect will pick this up when the allocation is created
        nodePositionsRef.current.set(newName, {
            x: sourceNode.position.x + 300,
            y: sourceNode.position.y,
        });
    }, [hook, nodes]);

    // ============================================================================
    // Node Initialization & Synchronization Effects
    // ============================================================================

    // Initialize nodes from strategy allocations
    // Use a stable key to prevent unnecessary re-renders
    const allocationsKey = React.useMemo(() =>
        JSON.stringify(Object.keys(hook.strategy.allocations).sort()),
        [hook.strategy.allocations]
    );

    React.useEffect(() => {
        const allocationNames = Object.keys(hook.strategy.allocations);
        if (allocationNames.length === 0) return;

        setNodes((currentNodes) => {
            const existingNodeMap = new Map(currentNodes.map(n => [n.id, n]));

            return allocationNames.map((name, index) => {
                const allocationWithRebalancing = hook.strategy.allocations[name];
                const allocationRule = hook.strategy.allocation_rules?.find(ar => ar.allocation === name);
                const assignedRules = allocationRule?.rules || [];
                const isFallback = false;

                // Priority: stored position > existing position > default grid position
                const existingNode = existingNodeMap.get(name);
                const storedPosition = nodePositionsRef.current.get(name);

                const position = storedPosition || existingNode?.position || {
                    x: 100 + (index % 3) * 350,
                    y: 100 + Math.floor(index / 3) * 250,
                };

                // Store this position for future reference
                if (!storedPosition && existingNode?.position) {
                    nodePositionsRef.current.set(name, existingNode.position);
                } else if (!storedPosition) {
                    nodePositionsRef.current.set(name, position);
                }

                return {
                    id: name,
                    type: 'allocation',
                    position,
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
                            // Update position tracking
                            const pos = nodePositionsRef.current.get(name);
                            if (pos) {
                                nodePositionsRef.current.delete(name);
                                nodePositionsRef.current.set(newName, pos);
                            }
                            setNodes((nds) =>
                                nds.map((n) => (n.id === name ? { ...n, id: newName, data: { ...n.data, name: newName } } : n))
                            );
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
                            nodePositionsRef.current.delete(name); // Clean up position tracking
                            setNodes((nds) => nds.filter((n) => n.id !== name));
                            setEdges((eds) =>
                                eds.filter((e) => e.source !== name && e.target !== name)
                            );
                        },
                        onDuplicate: () => {
                            handleDuplicateNode(name);
                        },
                        onManageRules: () => {
                            setSelectedAllocationForRule(name);
                            setShowAssignRuleModal(true);
                        },
                        onClearRules: () => {
                            hook.unassignRuleFromAllocation('', name);
                        },
                    },
                };
            });
        });
    }, [allocationsKey, hook.strategy.allocations, hook.strategy.allocation_rules]);

    // Sync nodes with strategy changes (for rule assignments and fallback status)
    React.useEffect(() => {
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
                    const rulesData = allocationRule?.rules || [];
                    const hasRules = typeof rulesData === 'string' ? rulesData.length > 0 : rulesData.length > 0;

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

                const isFallback = fallbackNodes.has(node.id);

                return {
                    ...node,
                    data: {
                        ...node.data,
                        assignedRules,
                        isFallback,
                        onDuplicate: () => {
                            handleDuplicateNode(node.id);
                        },
                    },
                };
            });
        });
    }, [hook.strategy.allocation_rules, edges, handleDuplicateNode]);

    // ============================================================================
    // Connection Handlers
    // ============================================================================

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

    // ============================================================================
    // Portfolio Creation Handlers
    // ============================================================================

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
                    onDuplicate: () => {
                        handleDuplicateNode(actualName);
                    },
                    onManageRules: () => {
                        setSelectedAllocationForRule(actualName);
                        setShowAssignRuleModal(true);
                    },
                    onClearRules: () => {
                        hook.unassignRuleFromAllocation('', actualName);
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
                    onDuplicate: () => {
                        handleDuplicateNode(actualName);
                    },
                    onManageRules: () => {
                        setSelectedAllocationForRule(actualName);
                        setShowAssignRuleModal(true);
                    },
                    onClearRules: () => {
                        hook.unassignRuleFromAllocation('', actualName);
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

    // ============================================================================
    // Rule Management Handlers
    // ============================================================================

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

    // Check if canvas is empty (no portfolios)
    const isEmpty = Object.keys(hook.strategy.allocations).length === 0;

    return (
        <div className={`h-screen w-full relative ${isDark ? 'dark bg-[#121212]' : 'bg-slate-50'}`}>
            {/* Navigation Menu */}
            <NavigationMenu />

            {/* Placeholder Panel Button - Top Right */}
            <button
                onClick={() => setShowPlaceholderPanel(!showPlaceholderPanel)}
                className={`fixed top-6 right-6 z-50 p-3 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl border transition-all hover:scale-105 ${isDark
                        ? 'bg-black/80 border-white/[0.15] hover:bg-black/90 hover:shadow-purple-500/20'
                        : 'bg-white/95 border-slate-200/50 hover:bg-white'
                    }`}
                title="Panel"
            >
                <svg className={`w-5 h-5 ${isDark ? 'text-white' : 'text-slate-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Placeholder Panel - Slide in from right */}
            {showPlaceholderPanel && (
                <>
                    {/* Backdrop */}
                    <div
                        className={`fixed inset-0 z-40 backdrop-blur-sm ${isDark ? 'bg-black/40' : 'bg-black/20'
                            }`}
                        onClick={() => setShowPlaceholderPanel(false)}
                    />
                    {/* Panel */}
                    <div className={`fixed right-6 top-6 bottom-6 w-80 rounded-2xl shadow-2xl z-50 overflow-y-auto border ${isDark
                            ? 'bg-black/95 backdrop-blur-xl border-white/[0.15]'
                            : 'bg-white border-slate-200/50'
                        }`}>
                        <div className="p-6">
                            {/* Header */}
                            <div className={`flex items-center justify-between mb-6 pb-4 border-b ${isDark ? 'border-white/[0.1]' : 'border-slate-200'
                                }`}>
                                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Panel</h2>
                                <button
                                    onClick={() => setShowPlaceholderPanel(false)}
                                    className={`p-1.5 rounded-lg transition-all ${isDark
                                            ? 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Placeholder Content */}
                            <div className={`flex items-center justify-center h-64 ${isDark ? 'text-gray-400' : 'text-slate-400'
                                }`}>
                                <div className="text-center">
                                    <svg className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-500' : 'text-slate-300'
                                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <p className="text-sm font-medium">Content Coming Soon</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

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
                translateExtent={[[-500, -500], [2500, 2000]]}
                proOptions={{ hideAttribution: true }}
            >
                <Background
                    color={isDark ? "#2a2a2a" : "#cbd5e1"}
                    gap={20}
                    size={1.5}
                    variant={BackgroundVariant.Dots}
                />
                <Controls showZoom={true} showInteractive={true} />

                {/* Empty State Wallpaper */}
                {isEmpty && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <div className="flex flex-col items-center justify-center text-center px-8 py-12 max-w-2xl">
                            {/* Welcome Text */}
                            <h2 className="text-3xl font-bold text-slate-900 mb-3">
                                Build Your Strategy
                            </h2>
                            <p className="text-lg text-slate-600 mb-8 max-w-md">
                                Create dynamic portfolio strategies with visual rules and conditions
                            </p>

                            {/* Quick Start Steps */}
                            <div className="grid grid-cols-1 gap-4 mb-8 w-full max-w-md">
                                <div className="flex items-start gap-3 bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm border border-slate-200/50">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-purple-700 font-bold text-sm">1</span>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-slate-900 mb-1">Add Portfolios</p>
                                        <p className="text-xs text-slate-600">Click the + Portfolio button above to create your first portfolio</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm border border-slate-200/50">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-blue-700 font-bold text-sm">2</span>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-slate-900 mb-1">Create Rules</p>
                                        <p className="text-xs text-slate-600">Define switching conditions based on technical indicators</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm border border-slate-200/50">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-green-700 font-bold text-sm">3</span>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-slate-900 mb-1">Connect & Test</p>
                                        <p className="text-xs text-slate-600">Link portfolios with arrows and run your backtest</p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <button
                                onClick={handleQuickCreatePortfolio}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-indigo-700 transition-all font-semibold pointer-events-auto"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Create Your First Portfolio
                            </button>
                        </div>
                    </div>
                )}

                {/* Top Center Toolbar - Icon Only (Excalidraw Style) */}
                <Panel position="top-center" className="mt-4">
                    <div className={`flex items-center gap-2 backdrop-blur-lg rounded-xl shadow-2xl px-3 py-2 ${isDark ? 'bg-white/[0.02] border border-white/[0.15]' : 'bg-white/95 border border-slate-200/50'
                        }`}>
                        {/* Add Portfolio */}
                        <div className="relative group">
                            <button
                                onClick={handleQuickCreatePortfolio}
                                disabled={Object.keys(hook.strategy.allocations).length >= 6}
                                className={`p-2.5 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed border-2 ${isDark
                                    ? 'bg-white/[0.05] hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 border-transparent hover:border-purple-500/30 disabled:hover:bg-white/[0.05]'
                                    : 'bg-white hover:bg-purple-50 text-purple-600 hover:text-purple-700 border-transparent hover:border-purple-200 disabled:hover:bg-white'
                                    }`}
                                title="Add Portfolio"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </button>
                            <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg ${isDark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
                                }`}>
                                {Object.keys(hook.strategy.allocations).length >= 6 ? 'Max 6 portfolios' : 'Add Portfolio'}
                            </div>
                        </div>

                        {/* Add Rule */}
                        <button
                            onClick={() => setShowRuleModal(true)}
                            className={`p-2.5 rounded-lg transition-all border-2 group relative ${isDark
                                ? 'bg-white/[0.05] hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 border-transparent hover:border-blue-500/30'
                                : 'bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 border-transparent hover:border-blue-200'
                                }`}
                            title="Create Rule"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg ${isDark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
                                }`}>
                                Create Rule
                            </div>
                        </button>

                        {/* Divider */}
                        <div className={`h-6 w-px ${isDark ? 'bg-white/[0.1]' : 'bg-slate-300'}`} />

                        {/* View Rules */}
                        <button
                            onClick={() => setShowRulesPanel(!showRulesPanel)}
                            className={`p-2.5 rounded-lg transition-all border-2 group relative ${showRulesPanel
                                ? isDark
                                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30'
                                    : 'bg-indigo-50 text-indigo-700 border-indigo-300'
                                : isDark
                                    ? 'bg-white/[0.05] text-slate-300 hover:bg-indigo-500/20 hover:text-indigo-300 border-transparent hover:border-indigo-400/30'
                                    : 'bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 border-transparent hover:border-indigo-200'
                                }`}
                            title="View Rules"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg ${isDark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
                                }`}>
                                {showRulesPanel ? 'Hide Rules' : 'View Rules'}
                            </div>
                        </button>

                        {/* Divider */}
                        <div className={`h-6 w-px ${isDark ? 'bg-white/[0.1]' : 'bg-slate-300'}`} />

                        {/* Strategy Settings Dropdown */}
                        <div className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg border ${isDark ? 'bg-white/[0.03] border-white/[0.1]' : 'bg-slate-50 border-slate-200'
                            }`}>
                            {/* Start Date */}
                            <div className="flex flex-col">
                                <label className={`text-[10px] font-medium mb-0.5 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Start</label>
                                <input
                                    type="date"
                                    value={hook.strategy.start_date}
                                    onChange={(e) => hook.updateStrategy({ ...hook.strategy, start_date: e.target.value })}
                                    className={`text-xs border rounded px-2 py-1 focus:outline-none focus:ring-1 w-32 ${isDark
                                        ? 'bg-white/[0.05] border-white/[0.1] text-white focus:ring-purple-500 focus:border-purple-500'
                                        : 'border-slate-300 focus:ring-purple-500'
                                        }`}
                                />
                            </div>

                            {/* End Date */}
                            <div className="flex flex-col">
                                <label className={`text-[10px] font-medium mb-0.5 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>End</label>
                                <input
                                    type="date"
                                    value={hook.strategy.end_date}
                                    onChange={(e) => hook.updateStrategy({ ...hook.strategy, end_date: e.target.value })}
                                    className={`text-xs border rounded px-2 py-1 focus:outline-none focus:ring-1 w-32 ${isDark
                                        ? 'bg-white/[0.05] border-white/[0.1] text-white focus:ring-purple-500 focus:border-purple-500'
                                        : 'border-slate-300 focus:ring-purple-500'
                                        }`}
                                />
                            </div>

                            {/* Initial Capital */}
                            <div className="flex flex-col">
                                <label className={`text-[10px] font-medium mb-0.5 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Capital</label>
                                <div className="relative">
                                    <span className={`absolute left-2 top-1 text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>$</span>
                                    <input
                                        type="number"
                                        value={hook.strategy.initial_capital}
                                        onChange={(e) => hook.updateStrategy({ ...hook.strategy, initial_capital: parseFloat(e.target.value) || 100000 })}
                                        className={`text-xs border rounded pl-5 pr-2 py-1 focus:outline-none focus:ring-1 w-28 ${isDark
                                            ? 'bg-white/[0.05] border-white/[0.1] text-white focus:ring-purple-500 focus:border-purple-500'
                                            : 'border-slate-300 focus:ring-purple-500'
                                            }`}
                                        min="1000"
                                        step="1000"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className={`h-6 w-px ${isDark ? 'bg-white/[0.1]' : 'bg-slate-300'}`} />

                        {/* JSON Editor */}
                        <button
                            onClick={() => setShowJsonEditor(true)}
                            className={`p-2.5 rounded-lg transition-all border-2 group relative ${isDark
                                ? 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-slate-200 border-transparent hover:border-white/[0.2]'
                                : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-700 border-transparent hover:border-slate-200'
                                }`}
                            title="Edit JSON"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg ${isDark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
                                }`}>
                                Edit JSON
                            </div>
                        </button>

                        {/* Divider */}
                        <div className={`h-6 w-px ${isDark ? 'bg-white/[0.1]' : 'bg-slate-300'}`} />

                        {/* Run Backtest Button - Primary CTA */}
                        {onRunBacktest && (
                            <button
                                onClick={onRunBacktest}
                                disabled={isBacktestLoading}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium group relative ${isDark
                                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                                    }`}
                                title="Run Backtest"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                <span className="text-sm">Run</span>
                                <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg ${isDark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
                                    }`}>
                                    Run Backtest
                                </div>
                            </button>
                        )}
                    </div>
                </Panel>

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
                onClear={() => {
                    if (selectedAllocationForRule) {
                        hook.unassignRuleFromAllocation('', selectedAllocationForRule);
                    }
                }}
                availableRules={hook.strategy.switching_logic}
                targetAllocation={selectedAllocationForRule}
                currentRules={
                    selectedAllocationForRule
                        ? hook.strategy.allocation_rules?.find(ar => ar.allocation === selectedAllocationForRule)?.rules
                        : undefined
                }
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

            {/* Documentation Button - Bottom Right */}
            <button
                onClick={() => setShowDocumentation(true)}
                className={`fixed bottom-6 right-6 z-50 p-3 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl border transition-all hover:scale-105 ${isDark
                        ? 'bg-black/80 border-white/[0.15] hover:bg-black/90 hover:shadow-purple-500/20'
                        : 'bg-white/95 border-slate-200/50 hover:bg-white'
                    }`}
                title="Documentation"
            >
                <svg className={`w-5 h-5 ${isDark ? 'text-white' : 'text-slate-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>

            {/* Documentation Modal */}
            {showDocumentation && (
                <>
                    {/* Backdrop */}
                    <div
                        className={`fixed inset-0 z-50 backdrop-blur-sm ${isDark ? 'bg-black/60' : 'bg-black/40'
                            }`}
                        onClick={() => setShowDocumentation(false)}
                    />
                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
                        <div className={`rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto border ${isDark
                                ? 'bg-black/95 backdrop-blur-xl border-white/[0.15]'
                                : 'bg-white border-slate-200'
                            }`}>
                            <div className="p-8">
                                {/* Header */}
                                <div className={`flex items-center justify-between mb-6 pb-4 border-b ${isDark ? 'border-white/[0.1]' : 'border-slate-200'
                                    }`}>
                                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        How Backfolio Works
                                    </h2>
                                    <button
                                        onClick={() => setShowDocumentation(false)}
                                        className={`p-2 rounded-lg transition-all ${isDark
                                                ? 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                                            }`}
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Content */}
                                <div className={`space-y-6 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                                    {/* Overview */}
                                    <section>
                                        <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            Visual Strategy Builder
                                        </h3>
                                        <p className="text-sm leading-relaxed">
                                            Backfolio uses a node-based canvas to create tactical portfolio strategies. Build strategies by connecting portfolios with switching rules—when rules are met, the strategy switches to the connected portfolio.
                                        </p>
                                    </section>

                                    {/* Portfolios */}
                                    <section>
                                        <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            📦 Portfolios (Nodes)
                                        </h3>
                                        <p className="text-sm leading-relaxed mb-2">
                                            Each node represents a portfolio allocation—a mix of tickers with percentage weights.
                                        </p>
                                        <ul className="text-sm space-y-1 ml-4 list-disc list-inside">
                                            <li><strong>Create:</strong> Click "+ Portfolio" in the toolbar</li>
                                            <li><strong>Duplicate:</strong> Click the copy icon on any node</li>
                                            <li><strong>Delete:</strong> Click the X icon on any node</li>
                                            <li><strong>Rename:</strong> Double-click the node title</li>
                                        </ul>
                                    </section>

                                    {/* Rules */}
                                    <section>
                                        <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            ⚡ Switching Rules
                                        </h3>
                                        <p className="text-sm leading-relaxed mb-2">
                                            Rules define when to switch portfolios based on market indicators.
                                        </p>
                                        <ul className="text-sm space-y-1 ml-4 list-disc list-inside">
                                            <li><strong>Create:</strong> Click "+ Rule" in the toolbar</li>
                                            <li><strong>Structure:</strong> IF [Indicator] [Comparison] [Value/Indicator] THEN switch</li>
                                            <li><strong>Indicators:</strong> SMA, EMA, RSI, ROC, ATR, BOLLINGER</li>
                                            <li><strong>Comparisons:</strong> &gt;, &lt;, &gt;=, &lt;=, ==</li>
                                        </ul>
                                    </section>

                                    {/* Connections */}
                                    <section>
                                        <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            🔗 Linked-List System
                                        </h3>
                                        <p className="text-sm leading-relaxed mb-2">
                                            Connect portfolios by dragging from one node's handle to another. Each connection can have one rule assigned.
                                        </p>
                                        <ul className="text-sm space-y-1 ml-4 list-disc list-inside">
                                            <li><strong>Connect:</strong> Drag from a node handle to another node</li>
                                            <li><strong>Assign Rule:</strong> Click the edge and select a rule</li>
                                            <li><strong>Constraint:</strong> One inbound and one outbound connection per node</li>
                                            <li><strong>Fallback:</strong> Nodes with no outbound connections stay active when rules fail</li>
                                        </ul>
                                    </section>

                                    {/* Backtest */}
                                    <section>
                                        <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            📊 Running Backtests
                                        </h3>
                                        <p className="text-sm leading-relaxed mb-2">
                                            Test your strategy against historical data to see how it would have performed.
                                        </p>
                                        <ul className="text-sm space-y-1 ml-4 list-disc list-inside">
                                            <li><strong>Settings:</strong> Click the gear icon (top-right) to set dates and initial capital</li>
                                            <li><strong>Run:</strong> Click "Run Backtest" in the toolbar</li>
                                            <li><strong>Results:</strong> View performance metrics, equity curve, and allocation history</li>
                                        </ul>
                                    </section>

                                    {/* Tips */}
                                    <section className={`rounded-lg p-4 border ${isDark
                                            ? 'bg-white/[0.02] border-white/[0.1]'
                                            : 'bg-slate-50 border-slate-200'
                                        }`}>
                                        <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            💡 Pro Tips
                                        </h3>
                                        <ul className="text-sm space-y-1 ml-4 list-disc list-inside">
                                            <li>Start simple: 2-3 portfolios with one rule</li>
                                            <li>Use the JSON editor (toolbar) for advanced editing</li>
                                            <li>Multiple strategy chains will run separate backtests</li>
                                            <li>Empty canvas? Click anywhere to start building</li>
                                        </ul>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
