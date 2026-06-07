---
name: AgentNotes
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1b1b1b'
  on-surface-variant: '#414750'
  inverse-surface: '#303030'
  inverse-on-surface: '#f1f1f1'
  outline: '#727781'
  outline-variant: '#c1c7d2'
  surface-tint: '#1461a2'
  primary: '#004173'
  on-primary: '#ffffff'
  primary-container: '#00599a'
  on-primary-container: '#acd0ff'
  inverse-primary: '#a0c9ff'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fdd031'
  on-secondary-container: '#6f5900'
  tertiary: '#683000'
  on-tertiary: '#ffffff'
  tertiary-container: '#8b4301'
  on-tertiary-container: '#ffc097'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e4ff'
  primary-fixed-dim: '#a0c9ff'
  on-primary-fixed: '#001c37'
  on-primary-fixed-variant: '#00497f'
  secondary-fixed: '#ffe085'
  secondary-fixed-dim: '#edc220'
  on-secondary-fixed: '#231b00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#ffdcc7'
  tertiary-fixed-dim: '#ffb787'
  on-tertiary-fixed: '#311300'
  on-tertiary-fixed-variant: '#733600'
  background: '#f9f9f9'
  on-background: '#1b1b1b'
  surface-variant: '#e2e2e2'
typography:
  display:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  container-max: 1200px
  gutter: 24px
  sidebar-width: 280px
---

## Brand & Style

The design system focuses on the intersection of human cognitive speed and machine precision. It adopts a **Minimalist-Editorial** style, prioritizing clarity, white space, and high-quality typography over decorative elements. The emotional response is one of **calm authority**—a digital workspace that feels as permanent and reliable as a physical archive.

The aesthetic avoids "AI tropes" like gradients or cosmic patterns. Instead, it uses structured layouts, precise borders, and a monochromatic base to signal utility. The interface acts as a quiet stage for content, using accent colors only to denote state changes or specific actions.

## Colors

The palette is rooted in high-contrast functionalism. 
- **Core Neutral:** Pure White (#FFFFFF) and Black (#000000) form the bedrock of the UI, ensuring maximum readability and a timeless editorial feel.
- **Deep Blue (#00599A):** Used for primary actions, active states, and navigation links. It provides a professional, stable anchor for the eye.
- **Gold (#F3C727):** Reserved for highlights, starring items, or status indicators requiring attention without the urgency of an error.
- **Red (#C92B2C):** Strictly for destructive actions or critical system errors.
- **Soft Gray (#E5E7EB):** The primary structural color for borders and dividers, maintaining separation without introducing visual noise.

## Typography

This design system utilizes a three-font strategy to balance character with utility:
1. **Hanken Grotesk (Headlines):** A sharp, contemporary grotesque that provides a distinct "modern-classic" editorial feel.
2. **Inter (Body):** The workhorse for long-form reading and data entry, chosen for its exceptional legibility and neutral tone.
3. **JetBrains Mono (Labels/Metadata):** Used for tags, timestamps, and AI-generated metadata. It introduces a subtle technical texture, signaling areas where "agent" data is present.

Use tight line-heights for headlines to maintain impact, and generous 1.6x line-heights for body text to ensure a comfortable reading experience during deep work.

## Layout & Spacing

The layout follows a **structured fluid grid** model. 
- **Desktop:** Employs a 280px fixed sidebar for navigation and workspace management, with the remaining area serving as a fluid canvas for the Markdown editor or note list.
- **Mobile:** Shifts to a persistent bottom navigation bar. Content uses a single-column layout with 16px side margins.
- **Rhythm:** An 8px linear scale (4, 8, 16, 24, 48) ensures vertical consistency. Large blocks of white space (48px+) should be used to separate major logical sections, reinforcing the "calm" brand pillar.
- **Markdown Editor:** In split-view mode, the editor and preview should share exactly 50% width each, separated by a 1px vertical divider.

## Elevation & Depth

This design system avoids heavy shadows and physical metaphors. Depth is communicated through **Tonal Layers** and **Ambient Softness**:
- **Level 0 (Background):** Pure White (#FFFFFF).
- **Level 1 (Cards/Items):** White background with a very subtle, highly diffused shadow (0px 4px 20px rgba(0, 0, 0, 0.04)). This creates a "lifted paper" effect.
- **Level 2 (Modals/Popovers):** White background with a more defined shadow (0px 10px 30px rgba(0, 0, 0, 0.08)) and a 1px border (#E5E7EB).
- **Interactions:** Elements do not "press down" on hover; instead, they transition their border color to the primary blue or apply a slight neutral gray background tint (2% black).

## Shapes

The shape language is sophisticated and approachable.
- **Standard UI Elements:** Buttons, input fields, and small chips use a 0.5rem (8px) radius.
- **Content Containers:** Item cards and large layout containers use a 1rem (16px) radius to create a soft, friendly framing for dense text.
- **Interactive States:** Focus rings should be 2px thick, offset by 2px, using the primary blue color.

## Components

- **Buttons:** Solid Deep Blue for primary; outlined (1px Soft Gray) for secondary. Text should be uppercase JetBrains Mono for a precise, "command" feel.
- **Item Cards:** White base, 16px roundedness. Must include a status badge in the top right. Titles use Headline-MD.
- **Filter Chips:** Pill-shaped (rounded-xl) with a Soft Gray border. Active state: Black background with White text.
- **Status Badges:** Small JetBrains Mono text. Neutral (Gray), High Priority (Gold), or System-Action (Blue).
- **Markdown Editor:** The editor uses JetBrains Mono for input; the preview uses Inter. Use 1px #E5E7EB borders for the split-view divider.
- **Bottom Navigation (Mobile):** 64px height, blur background (90% white), active icon colored in Deep Blue, inactive in Soft Gray.
- **Sidebar (Desktop):** Light gray background (#F9FAFB) to distinguish it from the main white canvas. 24px padding between navigation links.