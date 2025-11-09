# Backfolio Design System
*Inspired by Xtract's Modern AI Aesthetic*

## Design Philosophy
Intelligent, modern financial platform with AI-first approach. Clean, sophisticated, and future-forward design inspired by Xtract's automation focus and premium aesthetics.

## Color Palette

### Primary Gradient System (Xtract-Inspired)
- `primary-50`: #f0f9ff - Ultra light backgrounds
- `primary-100`: #e0f2fe - Light backgrounds
- `primary-200`: #bae6fd - Subtle accents
- `primary-300`: #7dd3fc - Hover states
- `primary-400`: #38bdf8 - Interactive elements
- `primary-500`: #0ea5e9 - Primary buttons
- `primary-600`: #0284c7 - Primary focus
- `primary-700`: #0369a1 - Active states
- `primary-800`: #075985 - Dark accents
- `primary-900`: #0c4a6e - Text emphasis

### Secondary Purple (AI/Intelligence Theme)
- `purple-400`: #c084fc - AI indicators
- `purple-500`: #a855f7 - Smart features
- `purple-600`: #9333ea - Intelligence accents

### Modern Neutrals
- `slate-50`: #f8fafc - Page backgrounds
- `slate-100`: #f1f5f9 - Card backgrounds
- `slate-200`: #e2e8f0 - Borders & dividers
- `slate-300`: #cbd5e1 - Disabled states
- `slate-400`: #94a3b8 - Placeholders
- `slate-500`: #64748b - Secondary text
- `slate-600`: #475569 - Labels & metadata
- `slate-700`: #334155 - Primary text
- `slate-800`: #1e293b - Headings
- `slate-900`: #0f172a - High emphasis text

### Status & Feedback
- `emerald-500`: #10b981 - Success/Positive
- `emerald-600`: #059669 - Success emphasis
- `red-500`: #ef4444 - Error/Negative
- `red-600`: #dc2626 - Error emphasis
- `amber-500`: #f59e0b - Warning
- `orange-500`: #f97316 - Alert

## Typography
*Xtract-Inspired Hierarchy*

### Font Stack
`'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`

### Display & Headlines (Xtract Style)
- **Hero**: 4xl-6xl (36px-60px) - Bold (700) - Gradient text capable
- **Section Headers**: 3xl (30px) - Semibold (600) - High contrast
- **Card Titles**: xl (20px) - Medium (500) - Professional

### Body Text Hierarchy
- **Primary Body**: base (16px) - Regular (400) - Enhanced readability
- **Secondary Text**: sm (14px) - Regular (400) - Metadata & descriptions
- **Captions**: xs (12px) - Medium (500) - Labels & fine print

### Interactive Elements
- **Buttons**: sm (14px) - Medium (500) - Clear actions
- **Navigation**: sm (14px) - Medium (500) - Consistent weight
- **Stats/Data**: lg-2xl (18px-24px) - Semibold (600) - Tabular nums

### Weight Distribution
- **Extra Bold (800)**: Hero headlines only
- **Bold (700)**: Major section headers
- **Semibold (600)**: Card titles, stats, CTAs
- **Medium (500)**: Navigation, labels, buttons
- **Regular (400)**: Body text, descriptions

## Components
*Xtract-Inspired Elements*

### Cards & Containers
```css
/* Modern Glass Cards */
.card-xtract {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

/* Premium Elevated Cards */
.card-elevated {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* AI/Smart Feature Cards */
.card-ai {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(56, 189, 248, 0.1) 100%);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 16px;
}
```

### Buttons & CTAs
```css
/* Primary Action (Xtract Style) */
.btn-primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%);
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
}

/* Secondary Actions */
.btn-secondary {
  background: rgba(15, 23, 42, 0.05);
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 12px;
}

/* AI/Smart Actions */
.btn-ai {
  background: linear-gradient(135deg, #a855f7 0%, #c084fc 100%);
  border-radius: 12px;
}
```

### Navigation & Layout
- **Sidebar**: 280px width, frosted glass effect
- **Links**: Medium weight, 12px border-radius, smooth transitions
- **Active States**: Gradient backgrounds with subtle shadows
- **Spacing**: 20px base grid (instead of 8px for more breathing room)

## Spacing & Layout
*Generous, Breathing Room*

### Base Grid System
- **Micro**: 4px (p-1) - Fine adjustments
- **Small**: 12px (p-3) - Compact elements
- **Medium**: 20px (p-5) - Standard spacing
- **Large**: 32px (p-8) - Section separators
- **XL**: 48px (p-12) - Major sections

### Component Spacing
- **Page Margins**: 32px-48px (responsive)
- **Card Padding**: 24px-32px (based on content)
- **Button Padding**: 12px-24px (vertical), 20px-32px (horizontal)
- **Grid Gaps**: 20px-32px (breathing room)

## Interactions & Motion
*Smooth, Intentional Animations*

### Hover Effects
```css
.hover-xtract {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Transitions
- **Standard**: 300ms cubic-bezier(0.4, 0, 0.2, 1)
- **Quick**: 200ms ease-out
- **Smooth**: 400ms ease-in-out

### Micro-Interactions
- **Button Press**: Scale(0.98) for 100ms
- **Card Hover**: Subtle lift + shadow expansion
- **Focus States**: 2px outline with brand color

## Design Principles
*Xtract-Inspired Philosophy*

1. **Intelligence First** - AI and automation are core to the experience
2. **Modern Sophistication** - Clean, professional, but approachable
3. **Generous Spacing** - Let content breathe, don't cram
4. **Subtle Gradients** - Enhance without overwhelming
5. **Purposeful Motion** - Every animation has meaning
6. **Data Clarity** - Financial information is crystal clear
7. **Accessible Contrast** - WCAG AA compliance minimum

## Visual Hierarchy
1. **Hero Elements** - Bold gradients, large typography
2. **Primary Actions** - High contrast, clear CTAs
3. **Secondary Content** - Subtle backgrounds, medium emphasis
4. **Supporting Info** - Light colors, smaller text
5. **Metadata** - Minimal presence, functional
