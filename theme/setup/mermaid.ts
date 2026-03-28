import type { MermaidConfig } from 'mermaid'

export default (): MermaidConfig => ({
  // Inject CSS directly into every rendered SVG so it works inside the Shadow DOM.
  // This scales oversized diagrams down to fit the slide canvas.
  // `userCSSstyles` is embedded verbatim inside the SVG's <style> block by Mermaid.
  userCSSstyles: `
    :root, svg {
      max-width: 100% !important;
    }
    svg {
      width: 100% !important;
      height: auto !important;
      max-height: 62vh !important;
      overflow: visible;
    }
  `,
})
