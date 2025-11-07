# Backfolio Design System

## Design Philosophy
Professional, data-focused financial platform inspired by Portfolio Visualizer. Clean, refined, and sophisticated.

## Color Palette

### Primary (Purple Accent)
- `primary-600`: #9333ea - Links, active states
- `primary-50`: #faf5ff - Hover backgrounds

### Neutrals
- `premium-50`: #fafafa - Page background
- `premium-100`: #f5f5f5 - Hover states
- `premium-200`: #e5e5e5 - Borders
- `premium-500`: #737373 - Secondary text
- `premium-600`: #525252 - Labels
- `premium-700`: #404040 - Nav items
- `premium-900`: #171717 - Primary text

### Status Colors
- `success-600`: #16a34a - Positive returns
- `danger-600`: #dc2626 - Negative returns

## Typography

### Font Stack
`-apple-system, BlinkMacSystemFont, Inter, Segoe UI, Roboto, Helvetica Neue, sans-serif`

### Sizes
- **Headers**: 3xl (30px), lg (18px)
- **Body**: sm (14px), xs (12px)
- **Stats**: 2xl (24px) with `stat-number` class for tabular nums

### Weights
- Semibold (600) for headers and stats
- Medium (500) for navigation
- Regular (400) for body text

## Components

### Cards
```css
card-professional: white background, 1px #e5e5e5 border, subtle shadow
```

### Tables
```css
table-professional: uppercase headers, #fafafa header bg, alternating row borders
```

### Navigation
- Sidebar: 256px width, glass-sidebar style
- Links: sm text, rounded-md, subtle hover states
- Active: primary-50 background

## Spacing
- Page padding: 32px (p-8)
- Card padding: 24px (p-6)
- Sidebar padding: 12px (p-3)
- Grid gaps: 24px (gap-6)

## Interactions
- Hover: `hover-professional` - subtle 1px lift with soft shadow
- Transitions: 200ms cubic-bezier(0.4, 0, 0.2, 1)
- No dramatic animations or gradients

## Key Principles
1. **Data First** - Design serves the data, not the other way around
2. **Subtle Refinement** - Professional, not flashy
3. **Consistent Spacing** - Regular 8px grid
4. **Readable Typography** - Clear hierarchy, proper contrast
5. **Clean Borders** - Light separators, no heavy outlines
