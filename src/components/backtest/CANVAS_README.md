# Strategy Canvas - Graph-Based Backtest Builder

## Overview

The Strategy Canvas is an intuitive, visual interface for building and testing investment strategies using a graph-based approach. It provides a drag-and-drop experience similar to tools like Excalidraw and Notion, making strategy creation more accessible and visual.

## Concept

### Graph-Based Strategy Model

Strategies are represented as **directed graphs** where:

- **Nodes** = Portfolio allocations (collections of assets with percentage weights)
- **Edges** = Switching rules (tactical allocation logic that determines when to switch between portfolios)

### Strategy Types

1. **Orphan Nodes** (Simple Strategies)
   - Single portfolio nodes with no connections
   - Represent static buy-and-hold allocations
   - Example: Traditional 60/40 portfolio

2. **Linked Nodes** (Tactical Strategies)
   - Multiple portfolio nodes connected by arrows
   - Arrows represent switching logic/rules
   - The **last node** (no outgoing arrows) is the **fallback portfolio**
   - Example: Momentum rotation strategy with defensive fallback

## Features

### Visual Canvas
- **Infinite canvas** with pan, zoom, and minimap
- **Drag-and-drop** portfolio creation
- **Click-and-drag** connections between nodes to create switching rules
- **Real-time updates** to strategy configuration

### Portfolio Nodes
- Display asset allocations with visual weight bars
- **In-line editing** of assets and percentages
- **Fallback indicator** (green ring) for the fallback portfolio
- **Delete/Edit controls** for each node

### Switching Rules (Edges)
- Arrows connecting portfolios represent switching logic
- Labeled with rule names (e.g., "Switch to Defensive")
- **Click to edit** rule conditions
- **Delete button** to remove rules

### Controls & Panels

**Toolbar (Top-Left)**
- Drag-and-drop portfolio button
- Instructions and tips

**Strategy Summary (Top-Right)**
- Portfolio count
- Rule count
- Current fallback portfolio

**View Toggle (Top)**
- Switch between Canvas and Config views
- Canvas = Visual graph builder
- Config = Traditional form-based editor

## Usage

### Creating a Simple Strategy

1. **Drag a portfolio** from the toolbar onto the canvas
2. **Click the edit icon** on the portfolio node
3. **Add/edit assets** and set percentage weights (must total 100%)
4. **Click "Set as fallback"** to mark it as the default portfolio
5. **Click "Run Backtest"** to test the strategy

### Creating a Tactical Strategy

1. **Drag multiple portfolios** onto the canvas
2. **Position them** by dragging nodes around
3. **Connect portfolios** by clicking and dragging from one node's bottom handle to another's top handle
4. This creates a **switching rule** (shown as an arrow)
5. **Edit the rule** by clicking on the arrow label
6. The **last node** (no outgoing arrows) is automatically the fallback
7. **Run the backtest** to see performance

### Example Tactical Strategy

```
[Aggressive Portfolio] 
        ↓ (Rule: Market > SMA200)
[Balanced Portfolio]
        ↓ (Rule: VIX > 20)
[Defensive Portfolio] ← Fallback (no outgoing rules)
```

## Technical Implementation

### Libraries
- **reactflow** - Graph rendering and interaction
- **React hooks** - State management
- **TailwindCSS** - Styling

### Components

#### `StrategyCanvas.tsx`
Main canvas component managing:
- Node/edge state synchronization with strategy DSL
- Drag-and-drop functionality
- Connection handling
- Graph layout

#### `AllocationNode.tsx`
Portfolio node component with:
- Asset allocation display
- In-line editing
- Fallback toggle
- Delete functionality

#### `RuleEdge.tsx`
Switching rule edge component with:
- Rule label display
- Delete button
- Custom styling

### Data Flow

```
User Interaction (Canvas)
    ↓
React Flow State (Nodes/Edges)
    ↓
Strategy DSL Update (useTacticalStrategy hook)
    ↓
Backend API (Backtest execution)
    ↓
Results Display (Overlay panel)
```

## Graph Rules

1. **Fallback Portfolio**
   - Must have exactly one fallback
   - Cannot have outgoing switching rules
   - Marked with green ring indicator

2. **Switching Rules**
   - Must connect two different portfolios
   - Can have multiple rules per portfolio
   - Rules are evaluated in order

3. **Orphan Nodes**
   - Valid as simple buy-and-hold strategies
   - Must be set as fallback if only node

## Keyboard Shortcuts

- **Drag canvas** - Click and drag on empty space
- **Zoom** - Mouse wheel / trackpad pinch
- **Delete node** - Click delete icon on node
- **Delete edge** - Click X on edge label

## Future Enhancements

- [ ] Rule condition editor in canvas
- [ ] Multi-select nodes
- [ ] Copy/paste nodes
- [ ] Save/load canvas layouts
- [ ] Animated backtest visualization on graph
- [ ] Performance heatmap on nodes
- [ ] Auto-layout algorithms
- [ ] Export as image
- [ ] Collaborative editing

## Comparison: Canvas vs Config View

| Feature | Canvas View | Config View |
|---------|-------------|-------------|
| Visual Representation | ✅ Graph | ❌ List |
| Drag-and-Drop | ✅ Yes | ❌ No |
| Switching Logic Visualization | ✅ Arrows | 📋 Text |
| Beginner Friendly | ✅✅✅ | ⚠️ |
| Advanced Controls | ⚠️ Coming Soon | ✅ Full |
| Mobile Friendly | ⚠️ Limited | ✅ Yes |

## Best Practices

1. **Start Simple** - Begin with 2-3 portfolios, add complexity gradually
2. **Name Meaningfully** - Use descriptive portfolio names (e.g., "Aggressive", "Defensive")
3. **Validate Allocations** - Ensure each portfolio totals 100%
4. **Test Incrementally** - Run backtests after each major change
5. **Use Fallback Wisely** - Choose your most conservative portfolio as fallback

## Troubleshooting

**Issue**: Cannot connect two nodes
- **Solution**: Ensure you're dragging from bottom handle to top handle

**Issue**: Node won't delete
- **Solution**: If it's the only node, you must add another first

**Issue**: Backtest fails
- **Solution**: Check that all portfolios total 100% and a fallback is set

**Issue**: Canvas is laggy
- **Solution**: Reduce number of nodes or zoom out
