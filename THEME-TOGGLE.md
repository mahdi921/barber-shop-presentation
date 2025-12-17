# Women Theme Toggle Feature

## Overview

The site now supports an in-place theme toggle for women-specific content. Users can switch between the default theme and a women's theme without navigating away from the page.

## How It Works

### Theme Switching

1. **Entering Women Theme**: Click "ورود به سایت بانوان" button in the Women Section
   - Site theme immediately switches to women's palette
   - Gallery images change to women-specific assets
   - Theme preference saved in localStorage
   - Accessibility announcement made for screen readers

2. **Returning to Default**: Click "بازگشت به نسخه عمومی" button in navbar (visible only in women theme)
   - Switches back to default theme
   - Restores default gallery images
   - Saves preference to localStorage

### Persistent Theme

The selected theme persists across page reloads using `localStorage`:
- Default theme: `localStorage.getItem('site-theme') === 'default'`
- Women theme: `localStorage.getItem('site-theme') === 'women'`

## Theme Features

### Visual Differences

**Default Theme:**
- Blue accent color (#1e40af)
- Neutral backgrounds
- Male-focused imagery

**Women Theme:**
- Purple/plum accent color (#9b5de5)
- Warmer, softer backgrounds with subtle gradients
- Pink/purple tinted section backgrounds
- Women-specific imagery
- Decorative radial gradient pattern

### Gallery Images

**Default Gallery:**
- `/src/assets/panorama-1.jpg` - مدل مردانه ۱
- `/src/assets/panorama-2.jpg` - مدل مردانه ۲
- `/src/assets/panorama-3.jpg` - مدل مردانه ۳

**Women Gallery:**
- `/src/assets/women-1.jpg` - مدل بانوان ۱
- `/src/assets/women-2.jpg` - مدل بانوان ۲
- `/src/assets/women-3.jpg` - مدل بانوان ۳

## Implementation Details

### Files Created/Modified

**New Files:**
- `src/context/ThemeContext.jsx` - Theme context provider with localStorage
- `src/styles/theme.css` - CSS variables for both themes

**Modified Files:**
- `src/App.jsx` - Wrapped with ThemeProvider
- `src/components/Navbar.jsx` - Added theme toggle button
- `src/components/PanoramaGallery.jsx` - Theme-aware image switching
- `src/components/WomenSection.jsx` - Triggers theme change
- `src/components/Navbar.css` - Theme toggle button styles

**Assets Added:**
- `src/assets/women-1.jpg` (placeholder - replace with actual image)
- `src/assets/women-2.jpg` (placeholder - replace with actual image)
- `src/assets/women-3.jpg` (placeholder - replace with actual image)

### CSS Variables

Both themes define these variables in `src/styles/theme.css`:

```css
--bg                  /* Background color */
--bg-gradient         /* Background gradient */
--surface             /* Surface color (cards, etc) */
--text                /* Primary text color */
--text-secondary      /* Secondary text color */
--accent              /* Primary accent color */
--accent-dark         /* Darker accent for hovers */
--accent-light        /* Lighter accent */
--accent-contrast     /* Text color on accent background */
--border-color        /* Border color */
--card-shadow         /* Card shadow */
--section-bg-*        /* Section-specific backgrounds */
```

### Accessibility

- `aria-live="polite"` region announces theme changes
- Theme toggle button is keyboard focusable
- Clear focus styles on interactive elements
- Respects `prefers-reduced-motion`
- All images have descriptive Persian alt text

## Usage

### Adding More Women-Specific Content

To add more women-specific variations:

1. **Images**: Add to `IMAGES_BY_THEME.women` in `PanoramaGallery.jsx`
2. **Colors**: Update CSS variables in `:root[data-theme="women"]` in `theme.css`
3. **Content**: Check theme with `const { theme } = useTheme()` in any component

### Example: Conditional Content

```jsx
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { theme } = useTheme();
  
  return (
    <div>
      {theme === 'women' ? (
        <p>محتوای ویژه بانوان</p>
      ) : (
        <p>محتوای عمومی</p>
      )}
    </div>
  );
}
```

## Testing Checklist

- [x] Click "ورود به سایت بانوان" switches theme
- [x] Gallery images change to women assets
- [x] Theme persists after page reload
- [x] "بازگشت به نسخه عمومی" button visible in women theme
- [x] Return button switches back to default theme
- [x] Theme announcer updates for screen readers
- [x] All images have Persian alt text
- [x] `data-theme` attribute on `<html>`
- [x] CSS variables change with theme
- [x] Keyboard navigation works
- [x] Respects `prefers-reduced-motion`
- [ ] Actual women images uploaded (placeholders currently)

## Next Steps

1. **Upload Actual Women Images**: Replace placeholder files in `src/assets/`:
   - `women-1.jpg`
   - `women-2.jpg`
   - `women-3.jpg`

2. **Optional Enhancements**:
   - Add theme-specific typography
   - Create decorative SVG patterns
   - Add smooth theme transition animations
   - Extend theme to more components

## Technical Notes

- Theme state managed via React Context
- No external dependencies (pure React + CSS)
- ~50 lines of JavaScript for theme logic
- CSS variables enable instant theme switching
- localStorage provides persistence
- Accessible and keyboard-friendly
