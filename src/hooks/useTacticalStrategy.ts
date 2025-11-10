import { useState, useCallback } from 'react';
import { StrategyDSL, Condition, Allocation, AllocationWithRebalancing, SwitchingRule, BacktestConfig } from '../types/strategy';
import { DEFAULT_DSL } from '../constants/strategy';

export const useTacticalStrategy = (defaultStrategy: StrategyDSL = DEFAULT_DSL) => {
    // State for the JSON text editor
    const [dslText, setDslText] = useState<string>(JSON.stringify(defaultStrategy, null, 2));

    // State for the visual strategy builder
    const [strategy, setStrategy] = useState<StrategyDSL>(defaultStrategy);
    const [activeTab, setActiveTab] = useState<'json' | 'visual'>('visual');
    const [showNewAllocationForm, setShowNewAllocationForm] = useState(false);
    const [newAllocationName, setNewAllocationName] = useState('');

    // Backtest configuration state
    const [backtestConfig, setBacktestConfig] = useState<BacktestConfig>({
        start_date: defaultStrategy.start_date,
        end_date: defaultStrategy.end_date,
        initial_capital: defaultStrategy.initial_capital,
        benchmark: 'SPY'
    });

    // Helper function to normalize and validate strategy structure
    const normalizeStrategy = (parsed: any): StrategyDSL => {
        // Ensure switching_logic exists and is an array
        if (!parsed.switching_logic || !Array.isArray(parsed.switching_logic)) {
            parsed.switching_logic = [];
        }

        // Normalize each switching rule
        parsed.switching_logic = parsed.switching_logic.map((rule: any) => {
            // Ensure rule has condition with proper structure
            if (!rule.condition) {
                rule.condition = {
                    left: { type: "SMA", symbol: "SPY", window: 50 },
                    comparison: ">",
                    right: { type: "SMA", symbol: "SPY", window: 200 }
                };
            } else {
                // Ensure condition has left, comparison, and right
                if (!rule.condition.left) {
                    rule.condition.left = { type: "SMA", symbol: "SPY", window: 50 };
                }
                if (!rule.condition.comparison) {
                    rule.condition.comparison = ">";
                }
                if (!rule.condition.right) {
                    rule.condition.right = { type: "SMA", symbol: "SPY", window: 200 };
                }
            }

            return rule;
        });

        return parsed as StrategyDSL;
    };

    const handleDslChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = event.target.value;
        setDslText(newText);

        // Try to parse and update strategy immediately
        try {
            const parsed = JSON.parse(newText);
            const normalized = normalizeStrategy(parsed);
            setStrategy(normalized);
        } catch (e) {
            // Don't update the strategy state if the JSON is invalid
        }
    }, []);

    // Update JSON when the strategy changes through the visual editor
    const updateStrategy = useCallback((newStrategy: StrategyDSL) => {
        setStrategy(newStrategy);
        const formatted = JSON.stringify(newStrategy, null, 2);
        setDslText(formatted);
    }, []);

    // Helper functions for modifying the strategy
    const addAllocation = useCallback((name: string) => {
        if (!name.trim()) return;

        // Check for duplicate names (case-insensitive)
        const existingNames = Object.keys(strategy.allocations).map(n => n.toLowerCase());
        if (existingNames.includes(name.toLowerCase())) {
            alert(`An allocation named "${name}" already exists. Please choose a different name.`);
            return;
        }

        // Auto-set as fallback if it's the first allocation
        const isFirstAllocation = Object.keys(strategy.allocations).length === 0;

        const newStrategy = {
            ...strategy,
            allocations: {
                ...strategy.allocations,
                [name]: { allocation: {} }
            },
            fallback_allocation: isFirstAllocation ? name : strategy.fallback_allocation
        };

        updateStrategy(newStrategy);
        setNewAllocationName('');
        setShowNewAllocationForm(false);
    }, [strategy, updateStrategy]);

    // Add allocation with initial assets in one atomic operation
    const addAllocationWithAssets = useCallback((name: string, allocation: Allocation) => {
        if (!name.trim()) return;

        // Check for duplicate names (case-insensitive) and generate unique name if needed
        const existingNames = Object.keys(strategy.allocations).map(n => n.toLowerCase());
        let uniqueName = name;
        let counter = 1;

        while (existingNames.includes(uniqueName.toLowerCase())) {
            uniqueName = `${name}_${counter}`;
            counter++;
        }

        // Auto-set as fallback if it's the first allocation
        const isFirstAllocation = Object.keys(strategy.allocations).length === 0;

        const newStrategy = {
            ...strategy,
            allocations: {
                ...strategy.allocations,
                [uniqueName]: { allocation }
            },
            fallback_allocation: isFirstAllocation ? uniqueName : strategy.fallback_allocation
        };

        updateStrategy(newStrategy);

        // Return the unique name that was used (for UI feedback if needed)
        return uniqueName;
    }, [strategy, updateStrategy]);

    const deleteAllocation = useCallback((name: string) => {
        const newAllocations = { ...strategy.allocations };
        delete newAllocations[name];

        // Auto-update fallback if deleting the current fallback
        const newFallback = strategy.fallback_allocation === name
            ? Object.keys(newAllocations)[0] || ''
            : strategy.fallback_allocation;

        // Remove allocation rules that reference the deleted allocation
        const newAllocationRules = (strategy.allocation_rules || []).filter(ar => ar.allocation !== name);

        updateStrategy({
            ...strategy,
            allocations: newAllocations,
            fallback_allocation: newFallback,
            allocation_rules: newAllocationRules
        });
    }, [strategy, updateStrategy]);

    const renameAllocation = useCallback((oldName: string, newName: string) => {
        if (oldName === newName || !newName.trim()) return;

        // Create new allocations object with renamed key
        const newAllocations = { ...strategy.allocations };
        newAllocations[newName] = newAllocations[oldName];
        delete newAllocations[oldName];

        // Auto-update fallback if renaming the current fallback
        const newFallback = strategy.fallback_allocation === oldName ? newName : strategy.fallback_allocation;

        // Update allocation rules that reference the renamed allocation
        const newAllocationRules = (strategy.allocation_rules || []).map(ar =>
            ar.allocation === oldName ? { ...ar, allocation: newName } : ar
        );

        updateStrategy({
            ...strategy,
            allocations: newAllocations,
            fallback_allocation: newFallback,
            allocation_rules: newAllocationRules
        });
    }, [strategy, updateStrategy]);

    const updateAllocation = useCallback((name: string, allocationWithRebalancing: AllocationWithRebalancing) => {
        // Auto-set as fallback if fallback_allocation is empty
        const needsFallback = !strategy.fallback_allocation || strategy.fallback_allocation.trim() === '';

        const newStrategy = {
            ...strategy,
            allocations: {
                ...strategy.allocations,
                [name]: allocationWithRebalancing
            },
            fallback_allocation: needsFallback ? name : strategy.fallback_allocation
        };

        updateStrategy(newStrategy);
    }, [strategy, updateStrategy]);

    const removeSymbolFromAllocation = useCallback((allocationName: string, symbol: string) => {
        const allocationWithRebalancing = { ...strategy.allocations[allocationName] };
        const updatedAllocation = { ...allocationWithRebalancing.allocation };
        delete updatedAllocation[symbol];

        updateStrategy({
            ...strategy,
            allocations: {
                ...strategy.allocations,
                [allocationName]: { ...allocationWithRebalancing, allocation: updatedAllocation }
            }
        });
    }, [strategy, updateStrategy]);

    const addSwitchingRule = useCallback(() => {
        const newRule: SwitchingRule = {
            condition: {
                left: { type: "SMA", symbol: "SPY", window: 50 },
                comparison: ">",
                right: { type: "SMA", symbol: "SPY", window: 200 }
            },
            name: `Rule ${strategy.switching_logic.length + 1}`,
            rule_type: 'buy'
        };

        updateStrategy({
            ...strategy,
            switching_logic: [...strategy.switching_logic, newRule]
        });
    }, [strategy, updateStrategy]);

    // Add switching rule with custom data in one atomic operation
    const addSwitchingRuleWithData = useCallback((ruleData: Partial<SwitchingRule>) => {
        // Generate unique name if there's a conflict
        const baseName = ruleData.name || `Rule ${strategy.switching_logic.length + 1}`;
        const existingNames = strategy.switching_logic.map(r => (r.name || '').toLowerCase());
        let uniqueName = baseName;
        let counter = 1;

        while (existingNames.includes(uniqueName.toLowerCase())) {
            uniqueName = `${baseName}_${counter}`;
            counter++;
        }

        const newRule: SwitchingRule = {
            condition: ruleData.condition || {
                left: { type: "SMA", symbol: "SPY", window: 50 },
                comparison: ">",
                right: { type: "SMA", symbol: "SPY", window: 200 }
            },
            name: uniqueName,
            rule_type: ruleData.rule_type || 'buy'
        };

        updateStrategy({
            ...strategy,
            switching_logic: [...strategy.switching_logic, newRule]
        });

        return uniqueName;
    }, [strategy, updateStrategy]);

    // Add switching rule and assign it to an allocation in one atomic operation
    const addSwitchingRuleAndAssign = useCallback((allocationName: string) => {
        const newRule: SwitchingRule = {
            condition: {
                left: { type: "SMA", symbol: "SPY", window: 50 },
                comparison: ">",
                right: { type: "SMA", symbol: "SPY", window: 200 }
            },
            name: `Rule ${strategy.switching_logic.length + 1}`,
            rule_type: 'buy'
        };

        const allocationRules = strategy.allocation_rules || [];
        const existingAllocationRule = allocationRules.find(ar => ar.allocation === allocationName);

        let newAllocationRules;
        if (existingAllocationRule) {
            // Add to existing allocation rule
            newAllocationRules = allocationRules.map(ar =>
                ar.allocation === allocationName
                    ? { ...ar, rules: [...ar.rules, newRule.name!] }
                    : ar
            );
        } else {
            // Create new allocation rule mapping
            newAllocationRules = [
                ...allocationRules,
                { allocation: allocationName, rules: [newRule.name!] }
            ];
        }

        updateStrategy({
            ...strategy,
            switching_logic: [...strategy.switching_logic, newRule],
            allocation_rules: newAllocationRules
        });
    }, [strategy, updateStrategy]);

    const deleteSwitchingRule = useCallback((index: number) => {
        const newRules = [...strategy.switching_logic];
        newRules.splice(index, 1);

        updateStrategy({
            ...strategy,
            switching_logic: newRules
        });
    }, [strategy, updateStrategy]);

    const updateSwitchingRule = useCallback((index: number, rule: SwitchingRule) => {
        const newRules = [...strategy.switching_logic];
        newRules[index] = rule;

        updateStrategy({
            ...strategy,
            switching_logic: newRules
        });
    }, [strategy, updateStrategy]);

    const updateCondition = useCallback((ruleIndex: number, _conditionIndex: number, condition: Condition) => {
        // Since we now have single conditions, conditionIndex will always be 0
        const rule = { ...strategy.switching_logic[ruleIndex] };
        rule.condition = condition;

        updateSwitchingRule(ruleIndex, rule);
    }, [strategy, updateSwitchingRule]);

    const updateRuleName = useCallback((ruleIndex: number, name: string) => {
        const oldRule = strategy.switching_logic[ruleIndex];
        const oldName = oldRule.name || `Rule ${ruleIndex + 1}`;
        const rule = { ...oldRule, name };

        // Update the rule itself
        const newRules = [...strategy.switching_logic];
        newRules[ruleIndex] = rule;

        // Update allocation_rules that reference the old rule name
        const newAllocationRules = (strategy.allocation_rules || []).map(ar => ({
            ...ar,
            rules: ar.rules.map(r => r === oldName ? name : r)
        }));

        updateStrategy({
            ...strategy,
            switching_logic: newRules,
            allocation_rules: newAllocationRules
        });
    }, [strategy, updateStrategy]);

    const updateRuleType = useCallback((ruleIndex: number, rule_type: 'buy' | 'sell' | 'hold') => {
        const rule = { ...strategy.switching_logic[ruleIndex], rule_type };
        updateSwitchingRule(ruleIndex, rule);
    }, [strategy, updateSwitchingRule]);

    const assignRuleToAllocation = useCallback((ruleName: string, allocationName: string) => {
        const allocationRules = strategy.allocation_rules || [];
        const existingAllocationRule = allocationRules.find(ar => ar.allocation === allocationName);

        if (existingAllocationRule) {
            // Check if rule is already assigned
            if (!existingAllocationRule.rules.includes(ruleName)) {
                existingAllocationRule.rules.push(ruleName);
            }
        } else {
            // Create new allocation rule mapping
            allocationRules.push({
                allocation: allocationName,
                rules: [ruleName]
            });
        }

        updateStrategy({
            ...strategy,
            allocation_rules: allocationRules
        });
    }, [strategy, updateStrategy]);

    const unassignRuleFromAllocation = useCallback((ruleName: string, allocationName: string) => {
        const allocationRules = strategy.allocation_rules || [];
        const existingAllocationRule = allocationRules.find(ar => ar.allocation === allocationName);

        if (existingAllocationRule) {
            existingAllocationRule.rules = existingAllocationRule.rules.filter(r => r !== ruleName);
            // Remove allocation rule if no rules left
            if (existingAllocationRule.rules.length === 0) {
                const updatedRules = allocationRules.filter(ar => ar.allocation !== allocationName);
                updateStrategy({
                    ...strategy,
                    allocation_rules: updatedRules
                });
            } else {
                updateStrategy({
                    ...strategy,
                    allocation_rules: allocationRules
                });
            }
        }
    }, [strategy, updateStrategy]);

    const resetStrategy = useCallback(() => {
        setDslText(JSON.stringify(defaultStrategy, null, 2));
        setStrategy(defaultStrategy);
    }, [defaultStrategy]);

    const loadStrategyFromTemplate = useCallback((newStrategy: StrategyDSL) => {
        setDslText(JSON.stringify(newStrategy, null, 2));
        setStrategy(newStrategy);
    }, []);

    const formatJSON = useCallback(() => {
        try {
            const parsed = JSON.parse(dslText);
            const formatted = JSON.stringify(parsed, null, 2);
            setDslText(formatted);
            setStrategy(parsed);
            return true;
        } catch (e) {
            return false;
        }
    }, [dslText]);

    // Helper to detect separate strategy chains (linked-lists + orphan nodes)
    // Accepts optional edges from canvas to build accurate chains
    const detectStrategyChains = useCallback((edges?: Array<{ source: string; target: string }>) => {
        const allocationNames = Object.keys(strategy.allocations);
        const visited = new Set<string>();
        const chains: string[][] = [];

        if (!edges || edges.length === 0) {
            // No edges provided - treat each allocation as separate strategy
            allocationNames.forEach(name => {
                chains.push([name]);
            });
            return chains;
        }

        // Build adjacency map from edges
        const outgoingMap = new Map<string, string>(); // source -> target (1:1 for linked-list)
        const incomingMap = new Map<string, string>(); // target -> source

        edges.forEach(edge => {
            outgoingMap.set(edge.source, edge.target);
            incomingMap.set(edge.target, edge.source);
        });

        // Find chain starts (nodes with no incoming edges)
        const chainStarts = allocationNames.filter(name => !incomingMap.has(name));

        // Build chains from each start
        chainStarts.forEach(startNode => {
            if (visited.has(startNode)) return;

            const chain: string[] = [];
            let current: string | undefined = startNode;

            while (current && !visited.has(current)) {
                chain.push(current);
                visited.add(current);
                current = outgoingMap.get(current);
            }

            if (chain.length > 0) {
                chains.push(chain);
            }
        });

        // Handle any orphan nodes that weren't visited (isolated nodes)
        allocationNames.forEach(name => {
            if (!visited.has(name)) {
                chains.push([name]);
                visited.add(name);
            }
        });

        return chains;
    }, [strategy]);

    // Build backtest requests for API - one per strategy chain
    const buildBacktestRequests = useCallback((edges?: Array<{ source: string; target: string }>) => {
        const chains = detectStrategyChains(edges);

        return chains.map((chain, index) => {
            const config: any = {
                start_date: strategy.start_date,
                end_date: strategy.end_date,
                initial_capital: strategy.initial_capital
            };

            // Convert AllocationWithRebalancing back to simple Allocation for API
            // Only include allocations in this chain
            const simpleAllocations: { [name: string]: Allocation } = {};
            chain.forEach(name => {
                if (strategy.allocations[name]) {
                    simpleAllocations[name] = strategy.allocations[name].allocation;
                }
            });

            // Determine fallback for this chain (first allocation without rules, or last in chain)
            let chainFallback = chain[chain.length - 1]; // Default to last in chain
            for (const name of chain) {
                const allocationRule = strategy.allocation_rules?.find(ar => ar.allocation === name);
                if (!allocationRule || allocationRule.rules.length === 0) {
                    chainFallback = name;
                    break;
                }
            }

            // Filter switching_logic to only include rules assigned to this chain
            const chainAllocationRules = (strategy.allocation_rules || []).filter(ar =>
                chain.includes(ar.allocation)
            );
            const chainRuleNames = new Set<string>();
            chainAllocationRules.forEach(ar => ar.rules.forEach(r => chainRuleNames.add(r)));

            const chainSwitchingLogic = strategy.switching_logic.filter(rule =>
                chainRuleNames.has(rule.name || '')
            );

            return {
                strategy: {
                    allocations: simpleAllocations,
                    fallback_allocation: chainFallback,
                    switching_logic: chainSwitchingLogic,
                    allocation_rules: chainAllocationRules
                },
                config,
                name: chain.length > 1 ? `Strategy ${index + 1}: ${chain.join(' → ')}` : `Strategy ${index + 1}: ${chain[0]}`
            };
        });
    }, [strategy, detectStrategyChains]);

    // Simple validation for UI (no debug logs)
    const isValidForUI = useCallback(() => {
        const allocationGroups = Object.keys(strategy.allocations);

        if (allocationGroups.length === 0) {
            return false;
        }

        const allGroupsValid = allocationGroups.every(groupName => {
            const allocationWithRebalancing = strategy.allocations[groupName];
            const allocation = allocationWithRebalancing.allocation;
            const symbols = Object.keys(allocation);

            if (symbols.length === 0) {
                return false;
            }

            const total = symbols.reduce((sum, symbol) => sum + allocation[symbol], 0);
            const isValidTotal = Math.abs(total - 1.0) < 0.001;
            const hasValidSymbols = symbols.every(symbol => symbol.trim().length > 0);

            return isValidTotal && hasValidSymbols;
        });

        const hasFallbackAllocation = allocationGroups.includes(strategy.fallback_allocation);

        return allGroupsValid && hasFallbackAllocation;
    }, [strategy]);

    // Detailed validation with debug logs (only for debugging)
    const isValidStrategy = useCallback(() => {
        const allocationGroups = Object.keys(strategy.allocations);

        if (allocationGroups.length === 0) {
            return false;
        }

        const allGroupsValid = allocationGroups.every(groupName => {
            const allocationWithRebalancing = strategy.allocations[groupName];
            const allocation = allocationWithRebalancing.allocation;
            const symbols = Object.keys(allocation);

            if (symbols.length === 0) {
                return false;
            }

            const total = symbols.reduce((sum, symbol) => sum + allocation[symbol], 0);
            const isValidTotal = Math.abs(total - 1.0) < 0.001;
            const hasValidSymbols = symbols.every(symbol => symbol.trim().length > 0);

            return isValidTotal && hasValidSymbols;
        });

        const hasFallbackAllocation = allocationGroups.includes(strategy.fallback_allocation);

        return allGroupsValid && hasFallbackAllocation;
    }, [strategy]);

    return {
        // State
        dslText,
        strategy,
        activeTab,
        showNewAllocationForm,
        newAllocationName,
        backtestConfig,

        // Setters
        setActiveTab,
        setShowNewAllocationForm,
        setNewAllocationName,
        setBacktestConfig,

        // Handlers
        handleDslChange,
        updateStrategy,
        resetStrategy,
        loadStrategyFromTemplate,
        formatJSON,

        // Allocation operations
        addAllocation,
        addAllocationWithAssets,
        deleteAllocation,
        renameAllocation,
        updateAllocation,
        removeSymbolFromAllocation,

        // Switching rule operations
        addSwitchingRule,
        addSwitchingRuleWithData,
        addSwitchingRuleAndAssign,
        deleteSwitchingRule,
        updateSwitchingRule,
        updateCondition,
        updateRuleName,
        updateRuleType,
        assignRuleToAllocation,
        unassignRuleFromAllocation,

        // API integration & multi-strategy support
        buildBacktestRequests,
        detectStrategyChains,
        isValidStrategy,
        isValidForUI
    };
};