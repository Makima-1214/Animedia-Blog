# 🎨 Animedia Design System

Quick reference guide for maintaining design consistency.

---

## 🎨 Color Palette

### Primary Colors
```css
Violet 600: #7c3aed (Primary brand color)
Violet 500: #8b5cf6
Violet 400: #a78bfa
Violet 50:  #f5f3ff

Blue 600: #2563eb (Secondary brand color)
Blue 500: #3b82f6
Blue 400: #60a5fa
Blue 50:  #eff6ff
```

### Accent Colors
```css
Red 600:    #dc2626 (Trending, Breaking)
Red 500:    #ef4444
Amber 500:  #f59e0b (Affiliate, Shop)
Green 500:  #10b981 (Success)
```

### Neutral Colors
```css
Gray 900: #111827 (Dark text)
Gray 800: #1f2937
Gray 700: #374151
Gray 600: #4b5563
Gray 500: #6b7280
Gray 400: #9ca3af
Gray 300: #d1d5db
Gray 200: #e5e7eb
Gray 100: #f3f4f6
Gray 50:  #f9fafb
```

### Gradients
```css
Primary:    from-violet-600 to-blue-600
Trending:   from-red-50 to-orange-50
Newsletter: from-violet-600 via-violet-500 to-blue-600
Dark:       from-gray-900 to-gray-800
```

---

## 📏 Spacing Scale

```css
--space-1:  0.25rem  (4px)
--space-2:  0.5rem   (8px)
--space-3:  0.75rem  (12px)
--space-4:  1rem     (16px)
--space-6:  1.5rem   (24px)
--space-8:  2rem     (32px)
--space-12: 3rem     (48px)
--space-16: 4rem     (64px)
```

### Usage
- **Tight**: 4-8px (icons, badges)
- **Normal**: 12-16px (cards, buttons)
- **Comfortable**: 24-32px (sections)
- **Spacious**: 48-64px (major sections)

---

## 🔲 Border Radius

```css
--radius-sm:  0.5rem   (8px)  - Small elements
--radius-md:  0.75rem  (12px) - Buttons, inputs
--radius-lg:  1rem     (16px) - Cards
--radius-xl:  1.5rem   (24px) - Large cards
--radius-2xl: 2rem     (32px) - Hero sections
```

---

## 🌑 Shadows

```css
--shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.1)
--shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.1)
--shadow-xl:  0 20px 25px -5px rgb(0 0 0 / 0.1)
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25)
```

### Usage
- **sm**: Subtle elevation (badges)
- **md**: Default cards
- **lg**: Hover states
- **xl**: Featured content
- **2xl**: Modals, overlays

---

## 📝 Typography

### Font Family
```css
Primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
Icons: 'Material Symbols Outlined'
```

### Font Sizes
```css
xs:   0.75rem   (12px)
sm:   0.875rem  (14px)
base: 1rem      (16px)
lg:   1.125rem  (18px)
xl:   1.25rem   (20px)
2xl:  1.5rem    (24px)
3xl:  1.875rem  (30px)
4xl:  2.25rem   (36px)
5xl:  3rem      (48px)
```

### Font Weights
```css
light:     300
normal:    400
medium:    500
semibold:  600
bold:      700
extrabold: 800
black:     900
```

### Line Heights
```css
tight:   1.25
snug:    1.375
normal:  1.5
relaxed: 1.75
loose:   1.85
```

---

## ⏱️ Animations

### Durations
```css
--animation-duration: 300ms (default)
fast:   150ms
normal: 300ms
slow:   500ms
slower: 1000ms
```

### Easing Functions
```css
--ease-out-expo:    cubic-bezier(0.16, 1, 0.3, 1)
--ease-in-out-circ: cubic-bezier(0.85, 0, 0.15, 1)
ease-out:           cubic-bezier(0.4, 0, 0.2, 1)
ease-in-out:        cubic-bezier(0.4, 0, 0.6, 1)
```

### Common Animations
```css
Fade in:     opacity 0 → 1, translateY 20px → 0
Hover lift:  translateY 0 → -4px
Scale:       scale 1 → 1.1
Ripple:      scale 0 → 4, opacity 1 → 0
```

---

## 🎯 Component Patterns

### Card
```html
<div class="bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 card-hover">
  <!-- Content -->
</div>
```

### Button Primary
```html
<button class="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95" data-ripple="true">
  Button Text
</button>
```

### Button Secondary
```html
<button class="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold px-6 py-3 rounded-xl transition-all duration-300">
  Button Text
</button>
```

### Badge
```html
<span class="bg-violet-100 dark:bg-violet-900/30 text-violet-900 dark:text-violet-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
  Badge
</span>
```

### Input
```html
<input class="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-violet-600 dark:focus:ring-violet-400 outline-none transition-all" />
```

---

## 🎭 Dark Mode

### Background Colors
```css
Light: bg-white, bg-gray-50
Dark:  bg-gray-900, bg-gray-950
```

### Text Colors
```css
Light: text-gray-900, text-gray-700
Dark:  text-white, text-gray-300
```

### Border Colors
```css
Light: border-gray-200, border-gray-100
Dark:  border-gray-800, border-gray-700
```

---

## 📱 Responsive Breakpoints

```css
sm:  640px  (Mobile landscape)
md:  768px  (Tablet)
lg:  1024px (Desktop)
xl:  1280px (Large desktop)
2xl: 1536px (Extra large)
```

### Mobile-First Approach
```html
<!-- Mobile: 12px, Desktop: 24px -->
<div class="p-3 md:p-6">

<!-- Mobile: 1 col, Desktop: 2 cols -->
<div class="grid grid-cols-1 md:grid-cols-2">
```

---

## ♿ Accessibility

### Focus States
```css
*:focus-visible {
  outline: 2px solid #7c3aed;
  outline-offset: 2px;
  border-radius: 4px;
}
```

### Touch Targets
```css
Minimum: 44x44px
Recommended: 48x48px
```

### Contrast Ratios
```css
Normal text: 4.5:1 (WCAG AA)
Large text:  3:1 (WCAG AA)
Target:      7:1 (WCAG AAA)
```

---

## 🎨 Data Attributes

### Animations
```html
data-animate="fade-in"     - Fade in on scroll
data-stagger               - Stagger children
data-parallax="0.5"        - Parallax effect
data-count="100"           - Counter animation
```

### Interactions
```html
data-hover="lift"          - Hover lift effect
data-ripple="true"         - Ripple on click
```

---

## 📦 Icon Usage

### Material Symbols
```html
<span class="material-symbols-outlined">icon_name</span>
```

### Common Icons
```
home, search, menu, close, arrow_forward, arrow_back
visibility, schedule, calendar_today, favorite, share
mail, person, settings, notifications, bookmark
```

---

## 🎯 Best Practices

### DO ✅
- Use design system variables
- Follow spacing scale
- Maintain color consistency
- Add hover states
- Include focus indicators
- Test on mobile
- Support dark mode
- Add loading states

### DON'T ❌
- Use arbitrary values
- Mix different gradients
- Forget hover states
- Skip accessibility
- Ignore mobile
- Use inline styles
- Hardcode colors
- Skip animations

---

## 🔄 Version History

**v2.0** (Current) - 10/10 Design
- Enhanced animations
- Better spacing
- Unified colors
- Improved accessibility

**v1.0** - Initial Design
- Basic layout
- Simple animations
- Standard spacing

---

## 📚 Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Material Symbols](https://fonts.google.com/icons)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

**Last Updated**: 2026-04-30
**Design Rating**: 10/10 ✨
