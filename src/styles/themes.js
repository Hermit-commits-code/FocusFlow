// FocusFlow Theme System
// Comprehensive theming for accessibility and visual comfort

export const colorPalettes = {
  // Default palette - calm and professional
  default: {
    primary: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
    },
    gray: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
    semantic: {
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
  },

  // Dark theme for low-light environments
  dark: {
    primary: {
      50: "#1e3a8a",
      100: "#1e40af",
      200: "#1d4ed8",
      300: "#2563eb",
      400: "#3b82f6",
      500: "#60a5fa",
      600: "#93c5fd",
      700: "#bfdbfe",
      800: "#dbeafe",
      900: "#eff6ff",
    },
    gray: {
      50: "#0f172a",
      100: "#1e293b",
      200: "#334155",
      300: "#475569",
      400: "#64748b",
      500: "#94a3b8",
      600: "#cbd5e1",
      700: "#e2e8f0",
      800: "#f1f5f9",
      900: "#f8fafc",
    },
    semantic: {
      success: "#34d399",
      warning: "#fbbf24",
      error: "#f87171",
      info: "#60a5fa",
    },
  },

  // Calm theme for anxiety reduction
  calm: {
    primary: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      200: "#bae6fd",
      300: "#7dd3fc",
      400: "#38bdf8",
      500: "#0ea5e9",
      600: "#0284c7",
      700: "#0369a1",
      800: "#075985",
      900: "#0c4a6e",
    },
    gray: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
    semantic: {
      success: "#22c55e",
      warning: "#eab308",
      error: "#ef4444",
      info: "#0ea5e9",
    },
  },

  // Warm theme for comfortable reading
  warm: {
    primary: {
      50: "#fefce8",
      100: "#fef9c3",
      200: "#fef08a",
      300: "#fde047",
      400: "#facc15",
      500: "#eab308",
      600: "#ca8a04",
      700: "#a16207",
      800: "#854d0e",
      900: "#713f12",
    },
    gray: {
      50: "#fafaf9",
      100: "#f5f5f4",
      200: "#e7e5e4",
      300: "#d6d3d1",
      400: "#a8a29e",
      500: "#78716c",
      600: "#57534e",
      700: "#44403c",
      800: "#292524",
      900: "#1c1917",
    },
    semantic: {
      success: "#22c55e",
      warning: "#f97316",
      error: "#dc2626",
      info: "#0ea5e9",
    },
  },

  // High contrast for visual accessibility
  highContrast: {
    primary: {
      50: "#ffffff",
      100: "#f0f0f0",
      200: "#d0d0d0",
      300: "#b0b0b0",
      400: "#808080",
      500: "#606060",
      600: "#404040",
      700: "#303030",
      800: "#202020",
      900: "#000000",
    },
    gray: {
      50: "#ffffff",
      100: "#f0f0f0",
      200: "#e0e0e0",
      300: "#c0c0c0",
      400: "#a0a0a0",
      500: "#808080",
      600: "#606060",
      700: "#404040",
      800: "#202020",
      900: "#000000",
    },
    semantic: {
      success: "#008000",
      warning: "#ff8000",
      error: "#ff0000",
      info: "#0000ff",
    },
  },
};

// Typography scales for different accessibility needs
export const typography = {
  fonts: {
    system:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    dyslexic: '"OpenDyslexic", "Comic Sans MS", cursive',
    serif: 'Georgia, "Times New Roman", Times, serif',
    mono: '"Fira Code", "JetBrains Mono", Consolas, "Liberation Mono", Menlo, Courier, monospace',
  },

  sizes: {
    xs: "12px",
    sm: "14px",
    base: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "30px",
    "4xl": "36px",
  },

  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
};

// Spacing system for consistent layouts
export const spacing = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
};

// Theme application utilities
export class ThemeManager {
  constructor() {
    this.currentTheme = "default";
    this.customizations = {};
  }

  // Apply theme to document
  applyTheme(themeName, customizations = {}) {
    this.currentTheme = themeName;
    this.customizations = customizations;

    const palette = colorPalettes[themeName] || colorPalettes.default;
    const root = document.documentElement;

    // Apply color variables
    this.setCSSVariables(root, palette);

    // Apply typography customizations
    this.applyTypography(root, customizations);

    // Apply spacing customizations
    this.applySpacing(root, customizations);

    // Add theme class
    document.body.className = document.body.className.replace(
      /focusflow-theme-\w+/g,
      ""
    );
    document.body.classList.add(`focusflow-theme-${themeName}`);
  }

  setCSSVariables(root, palette) {
    // Primary colors
    Object.entries(palette.primary).forEach(([key, value]) => {
      root.style.setProperty(`--ff-primary-${key}`, value);
    });

    // Gray colors
    Object.entries(palette.gray).forEach(([key, value]) => {
      root.style.setProperty(`--ff-gray-${key}`, value);
    });

    // Semantic colors
    Object.entries(palette.semantic).forEach(([key, value]) => {
      root.style.setProperty(`--ff-${key}`, value);
    });

    // Derived colors for common use cases
    root.style.setProperty("--ff-bg-primary", palette.gray[50]);
    root.style.setProperty("--ff-bg-secondary", palette.gray[100]);
    root.style.setProperty("--ff-text-primary", palette.gray[900]);
    root.style.setProperty("--ff-text-secondary", palette.gray[600]);
    root.style.setProperty("--ff-border", palette.gray[200]);
  }

  applyTypography(root, customizations) {
    const fontFamily = customizations.fontFamily || "system";
    const fontSize = customizations.fontSize || "base";
    const lineHeight = customizations.lineHeight || "normal";
    const letterSpacing = customizations.letterSpacing || "normal";

    root.style.setProperty("--ff-font-family", typography.fonts[fontFamily]);
    root.style.setProperty("--ff-font-size", typography.sizes[fontSize]);
    root.style.setProperty(
      "--ff-line-height",
      typography.lineHeights[lineHeight]
    );
    root.style.setProperty(
      "--ff-letter-spacing",
      typography.letterSpacing[letterSpacing]
    );
  }

  applySpacing(root, customizations) {
    Object.entries(spacing).forEach(([key, value]) => {
      root.style.setProperty(`--ff-space-${key}`, value);
    });
  }

  // Generate CSS for content script injection
  generateContentCSS() {
    const palette = colorPalettes[this.currentTheme];

    return `
      :root {
        ${Object.entries(palette.primary)
          .map(([k, v]) => `--ff-primary-${k}: ${v};`)
          .join("\n        ")}
        ${Object.entries(palette.gray)
          .map(([k, v]) => `--ff-gray-${k}: ${v};`)
          .join("\n        ")}
        ${Object.entries(palette.semantic)
          .map(([k, v]) => `--ff-${k}: ${v};`)
          .join("\n        ")}
        
        --ff-bg-primary: ${palette.gray[50]};
        --ff-bg-secondary: ${palette.gray[100]};
        --ff-text-primary: ${palette.gray[900]};
        --ff-text-secondary: ${palette.gray[600]};
        --ff-border: ${palette.gray[200]};
        
        --ff-font-family: ${
          typography.fonts[this.customizations.fontFamily || "system"]
        };
        --ff-font-size: ${
          typography.sizes[this.customizations.fontSize || "base"]
        };
        --ff-line-height: ${
          typography.lineHeights[this.customizations.lineHeight || "normal"]
        };
        --ff-letter-spacing: ${
          typography.letterSpacing[
            this.customizations.letterSpacing || "normal"
          ]
        };
      }
      
      .focusflow-themed {
        font-family: var(--ff-font-family) !important;
        font-size: var(--ff-font-size) !important;
        line-height: var(--ff-line-height) !important;
        letter-spacing: var(--ff-letter-spacing) !important;
        color: var(--ff-text-primary) !important;
      }
      
      .focusflow-theme-${this.currentTheme} .focusflow-main-content {
        background: var(--ff-bg-primary) !important;
        color: var(--ff-text-primary) !important;
        border: 1px solid var(--ff-border) !important;
      }
    `;
  }

  // Get theme-aware color
  getColor(colorPath) {
    const [group, shade] = colorPath.split(".");
    const palette = colorPalettes[this.currentTheme];
    return palette[group]?.[shade] || palette.gray[500];
  }

  // Create theme preset for specific needs
  static createAccessibilityPreset(type) {
    const presets = {
      adhd: {
        theme: "calm",
        customizations: {
          fontSize: "lg",
          lineHeight: "relaxed",
          letterSpacing: "normal",
        },
      },
      dyslexia: {
        theme: "warm",
        customizations: {
          fontFamily: "dyslexic",
          fontSize: "lg",
          lineHeight: "loose",
          letterSpacing: "wide",
        },
      },
      autism: {
        theme: "default",
        customizations: {
          fontSize: "base",
          lineHeight: "normal",
          letterSpacing: "normal",
        },
      },
      lowVision: {
        theme: "highContrast",
        customizations: {
          fontSize: "2xl",
          lineHeight: "loose",
          letterSpacing: "wider",
        },
      },
    };

    return presets[type] || presets.adhd;
  }
}

// CSS template for content script
export const generateContentStyles = (theme, customizations) => {
  return new ThemeManager().applyTheme(theme, customizations);
};

// Export theme manager singleton
export const themeManager = new ThemeManager();
