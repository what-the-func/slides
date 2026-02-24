# What The Func? Slides

> Presentation slides for the [What The Func?](https://www.youtube.com/@what-the-func) YouTube channel — powered by [Slidev](https://sli.dev).

## Overview

This is a monorepo containing all presentation decks for the channel. Each deck lives in `decks/<deck-name>/slides.md` and shares the custom **Synthwave '84** theme.

## Quick Start

### Run a deck in dev mode

```bash
npx slidev decks/dnd-agent/slides.md
```

Or use the npm scripts for the default deck:

```bash
npm run dev
```

### Build for production

```bash
npm run build
# or for a specific deck:
npx slidev build decks/dnd-agent/slides.md
```

### Export to PDF / PNG

```bash
npm run export
# or for a specific deck:
npx slidev export decks/dnd-agent/slides.md
```

## Synthwave '84 Theme

The `theme/` directory contains a custom local theme inspired by the VS Code [SynthWave '84](https://marketplace.visualstudio.com/items?itemName=RobbOwen.synthwave-vscode) extension.

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#ff7edb` | Headings, neon pink |
| Secondary | `#36f9f6` | Emphasis, links, electric cyan |
| Accent | `#fede5d` | Code, list markers, neon yellow |
| Background | `#262335` | Slide background, deep purple-navy |
| Surface | `#34294f` | Cards, panels |
| Code BG | `#1e1a2e` | Code block backgrounds |
| Muted | `#848bbd` | Subtext, lavender gray |

### Layouts

| Layout | Description |
|--------|-------------|
| `cover` | Title slide with retro grid perspective floor and horizon glow |
| `default` | Standard slide with padding |
| `center` | Centered content |
| `section` | Section divider with big neon heading |
| `two-cols` | Two-column layout |
| `statement` | Full-screen impactful statement |
| `image-right` | Content left, image right |
| `fact` | Large stat/metric with muted description |

### Components

| Component | Props | Description |
|-----------|-------|-------------|
| `<NeonBox>` | `color: pink\|cyan\|yellow` | Neon-bordered card with glow |
| `<GlowText>` | `color: pink\|cyan\|yellow` | Inline text with neon glow |

### Code Syntax Highlighting

Uses the `synthwave-84` Shiki theme for code blocks. Both light and dark modes render in Synthwave '84.

### Fonts

- **Sans:** [Inter](https://fonts.google.com/specimen/Inter)
- **Mono:** [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)

## Adding a New Deck

1. Create a new directory: `decks/<your-deck-name>/`
2. Create `decks/<your-deck-name>/slides.md`
3. Add this frontmatter to use the theme:

```yaml
---
theme: ../../theme
title: "Your Presentation Title"
transition: slide-left
mdc: true
---
```

4. Run it:

```bash
npx slidev decks/<your-deck-name>/slides.md
```

## Repository Structure

```
slides/
├── theme/                    # Local Synthwave '84 theme
│   ├── layouts/              # Vue layout components
│   ├── components/           # Reusable Vue components
│   ├── styles/               # CSS (base.css + index.ts)
│   ├── setup/                # Shiki syntax highlighting setup
│   └── package.json          # Theme metadata
├── components/               # Shared components across all decks
├── decks/
│   └── dnd-agent/            # "Build a Local AI Dungeon Master in Go"
│       └── slides.md
├── public/                   # Shared static assets
├── package.json
└── README.md
```

## Decks

### [Build a Local AI Dungeon Master in Go](decks/dnd-agent/slides.md)

A deep dive into building a local LLM-powered D&D dungeon master using Go, with zero CGo — powered by Fantasy, Kronk, and yzma.

---

Built with ❤️ and neon by [What The Func?](https://www.youtube.com/@what-the-func)
