export const cssVariablesResolver = (theme) => ({
  variables: {
    "--eq-gold": "#D4AF37", // The classic title text gold
    "--eq-mana": "#3B82F6", // Standard blue mana bar
    "--eq-health": "#10B981", // Standard green health bar
  },
  light: {
    "--mantine-color-body": "#F5E6C4", // Classic Parchment
    "--mantine-color-text": "#2B1B17", // Aged Ink
    "--eq-panel-bg": "#EBDCB3", // Darker parchment for cards
    "--eq-border": "#D2B48C", // "Stone" UI border
  },
  dark: {
    "--mantine-color-body": "#121417", // Deep obsidian void
    "--mantine-color-text": "#D1D5DB", // Silver-white text
    "--eq-panel-bg": "#1A1D21", // Dark stone panel
    "--eq-border": "#374151", // Cold slate border
    "--eq-glow": "0 0 10px rgba(59, 130, 246, 0.3)", // Subtle mana glow
  },
});
