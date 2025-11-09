# Strategy Canvas - Graph-Based Backtest Builder

## Overview

The Strategy Canvas is an intuitive, visual interface for building and testing investment strategies using a graph-based approach. It provides a drag-and-drop experience similar to tools like Excalidraw and Notion, making strategy creation more accessible and visual.

## Concept

### Graph-Based Strategy Model

Strategies are represented as **directed graphs** where:

- **Nodes** = Portfolio allocations (collections of assets with percentage weights)
- **Edges** = Switching rules (tactical allocation logic that determines when to switch between portfolios)

### Linked-List Structure

Portfolios in a chain follow a **linked-list** structure:
- **Max 1 incoming connection** per portfolio
- **Max 1 outgoing connection** per portfolio
- **4-directional handles** on each node (top, right, bottom, left) for flexible visual layout
- Connections can be made from any side to any side

### Strategy Types

1. **Orphan Nodes** (Simple Strategies)
   - Single portfolio nodes with no connections
   - Represent static buy-and-hold allocations
   - Example: Traditional 60/40 portfolio

2. **Linked Nodes** (Tactical Strategies)
   - Multiple portfolio nodes connected by arrows in a **linked-list chain**
   - Each portfolio can have **max 1 incoming** and **max 1 outgoing** connection
   - Arrows represent switching logic/rules assigned to portfolios
   - The **first node in the chain without rules** is the **fallback portfolio**
   - Any nodes after the fallback are **unreachable** (shown with visual indicators)
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
- **4-directional connection handles** (top, right, bottom, left) for flexible layouts
- **Linked-list constraints**: Each node can only have 1 incoming and 1 outgoing connection
- **Delete/Edit controls** for each node

### Switching Rules (Edges)
- Arrows connecting portfolios represent switching logic
- **Assigned to portfolios**, not edges directly
- Labeled with rule names (e.g., "Switch to Defensive")
- **Click portfolio node** to assign/manage rules
- **Delete button** to remove connections
- Rules are evaluated at the portfolio level to determine when to move to the next portfolio in the chain

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
3. **Connect portfolios** by clicking and dragging from one node's handle to another node's handle
   - You can connect from **any side** (top, right, bottom, left)
   - Each portfolio can have **max 1 incoming** and **max 1 outgoing** connection (linked-list)
4. **Create switching rules** using the "Create Rule" button
5. **Assign rules to portfolios** by clicking the "Manage Rules" button on each node
6. The **first portfolio in the chain without rules** is automatically the **fallback**
7. **Run the backtest** to see performance

### Fallback Logic

The fallback portfolio is determined automatically:
- In a linked chain, the system finds the **first portfolio without any rules**
- When you **assign a rule to the current fallback**, the next portfolio without rules becomes the new fallback
- There can only be **one fallback per chain**
- Portfolios after the fallback are **unreachable** (no rules will ever activate them)
- **Green ring indicator** shows which portfolio is the fallback

### Example Tactical Strategy

```
[Aggressive Portfolio] (Has Rule 1: Market trending up)
        ↓ 
[Balanced Portfolio] (Has Rule 2: VIX < 20)
        ↓ 
[Defensive Portfolio] ← Fallback (NO RULES - first without rules)
        ↓
[Cash Portfolio] ← Unreachable (after fallback, never executed)
```

In this example:
- If Rule 1 triggers, switch from Aggressive to Balanced
- If Rule 2 triggers, switch from Balanced to Defensive
- Defensive has no rules, so it's the **fallback** (green ring)
- Cash is unreachable because it comes after the fallback

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
   - Automatically determined: **first node in a chain without rules**
   - Only **one fallback per chain**
   - Marked with **green ring indicator**
   - Assigning a rule to the fallback makes the next node without rules the new fallback
   - Nodes after the fallback are **unreachable**

2. **Switching Rules**
   - Rules are **assigned to portfolios**, not edges
   - Click "Manage Rules" on a portfolio to assign/remove rules
   - Multiple rules can be assigned to one portfolio
   - Rules determine when to move to the **next portfolio in the chain**

3. **Linked-List Constraints**
   - Each portfolio can have **max 1 incoming connection**
   - Each portfolio can have **max 1 outgoing connection**
   - Connections can be made from **any of 4 sides** (top, right, bottom, left)
   - Forms a clear chain: Portfolio A → Portfolio B → Portfolio C

4. **Orphan Nodes**
   - Valid as simple buy-and-hold strategies
   - Not part of any chain (no incoming or outgoing connections)
   - Must be set as fallback if only node

## Keyboard Shortcuts

- **Drag canvas** - Click and drag on empty space
- **Zoom** - Mouse wheel / trackpad pinch
- **Connect nodes** - Drag from any handle (top/right/bottom/left) to any other handle
- **Delete node** - Click delete icon on node
- **Delete edge** - Click X on edge
- **Manage rules** - Click "Manage Rules" button on portfolio node

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
5. **Understand Fallback** - First portfolio without rules in a chain = fallback
6. **Avoid Orphan Rules** - Assigning rules to the fallback shifts the fallback forward
7. **Check Reachability** - Nodes after the fallback are unreachable
8. **Use Visual Layout** - 4-directional connections let you organize chains clearly

## Troubleshooting

**Issue**: Cannot connect two nodes
- **Solution**: Each node can only have 1 incoming and 1 outgoing connection (linked-list). Remove existing connection first.

**Issue**: "Portfolio already has an outgoing connection"
- **Solution**: This is the linked-list constraint. Delete the existing outgoing arrow before creating a new one.

**Issue**: Green ring (fallback indicator) on wrong portfolio
- **Solution**: The fallback is automatically the first portfolio in the chain without rules. Assign rules to move the fallback forward.

**Issue**: Node won't delete
- **Solution**: If it's the only node, you must add another first

**Issue**: Backtest fails
- **Solution**: Check that all portfolios total 100% and each chain has a fallback

**Issue**: Canvas is laggy
- **Solution**: Reduce number of nodes or zoom out
