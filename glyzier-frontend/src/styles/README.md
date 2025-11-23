# Styles Directory

This directory contains all CSS modules for the Glyzier frontend application, organized for better maintainability and code reusability.

## Directory Structure

### `/components`
CSS modules for reusable UI components (Navigation, NotificationManager, etc.)

### `/pages`
CSS modules for page-level components (HomePage, DashboardPage, etc.)

### `/shared`
Reusable CSS utilities that can be imported across multiple components:

- **animations.module.css** - Common animations (fade, slide, pulse)
- **auth-layout.module.css** - Authentication page layouts
- **buttons.module.css** - Button styles (primary, secondary, submit)
- **cards.module.css** - Card components with glassmorphism
- **forms.module.css** - Form elements (inputs, labels, textareas)
- **headers.module.css** - Gradient page headers

## Quick Usage

### Import Component/Page Styles
```jsx
// From a component
import styles from '../styles/components/ComponentName.module.css';

// From a page
import styles from '../styles/pages/PageName.module.css';
```

### Import Shared Utilities
```jsx
import buttons from '../styles/shared/buttons.module.css';
import forms from '../styles/shared/forms.module.css';
import animations from '../styles/shared/animations.module.css';

// Use multiple utilities
<button className={`${buttons.primaryButton} ${animations.fadeIn}`}>
  Click Me
</button>
```

## Design System Reference

### Colors
- **Primary Purple:** `#8b7fc4`, `#7c6fb8`, `#b8afe8`, `#9b8dd4`
- **Text:** `#2c3e50` (dark), `#7f8c8d` (labels), `#95a5a6` (muted)
- **Borders:** `#e0e0e0`
- **Backgrounds:** Gradient from `#f5f5f5` to `#e8e8f5`

### Typography
- **Large Titles:** 2.5-3em, font-weight: 700-800
- **Subtitles:** 1.1-1.3em, font-weight: 300-500
- **Body:** 1em, line-height: 1.6
- **Hints:** 0.85-0.9em

### Spacing
- **Card Padding:** 32-40px
- **Form Gaps:** 20-24px
- **Button Padding:** 12-16px vertical, 24-32px horizontal

### Border Radius
- **Cards:** 16-24px
- **Buttons:** 8-25px (25px for pill-shaped)
- **Inputs:** 6-8px

### Shadows
- **Cards:** `0 4px 20px rgba(0, 0, 0, 0.06)`
- **Buttons:** `0 4px 15px rgba(139, 127, 196, 0.2)`
- **Hover Cards:** `0 12px 40px rgba(139, 127, 196, 0.15)`

### Transitions
- **Standard:** `all 0.3s ease`
- **Cubic Bezier:** `cubic-bezier(0.4, 0, 0.2, 1)`
- **Quick:** `0.2s`

## Best Practices

1. **Use Shared Styles First** - Check if a shared utility exists before creating custom styles
2. **CSS Modules Scope** - All classes are scoped to the module, preventing conflicts
3. **Composition** - Combine multiple classes for complex styling
4. **Responsive** - Most shared utilities include responsive breakpoints
5. **Accessibility** - Maintain proper contrast ratios and focus states

## Adding New Styles

### For New Components
1. Create `ComponentName.module.css` in `/components`
2. Import in component: `import styles from '../styles/components/ComponentName.module.css'`

### For New Pages
1. Create `PageName.module.css` in `/pages`
2. Import in page: `import styles from '../styles/pages/PageName.module.css'`

### For Shared Utilities
1. Identify patterns used in 3+ places
2. Add to existing shared module or create new one
3. Document usage in `/glyzier-frontend/CSS_MODULARIZATION_GUIDE.md`

## Maintenance

- **Before removing a style:** Use grep to check for all usages
- **When updating shared styles:** Test all consuming components
- **When renaming classes:** Update all import sites

## Related Documentation

- [CSS Modularization Guide](../CSS_MODULARIZATION_GUIDE.md) - Full documentation
- [CSS Modules Guide](../CSS_MODULES_GUIDE.md) - Pattern reference
- [UI Implementation Summary](../UI_IMPLEMENTATION_SUMMARY.md) - Design decisions

---

For questions or issues, refer to the main CSS_MODULARIZATION_GUIDE.md
