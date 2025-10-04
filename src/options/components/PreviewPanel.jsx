import React from "react";

const PreviewPanel = ({ settings }) => {
  const getPreviewStyles = () => {
    const { accessibilitySettings, currentTheme } = settings;

    // Theme color mappings
    const themeColors = {
      default: { bg: "#ffffff", text: "#1f2937", accent: "#3b82f6" },
      dark: { bg: "#1f2937", text: "#f9fafb", accent: "#60a5fa" },
      "calm-blue": { bg: "#f0f9ff", text: "#0c4a6e", accent: "#0284c7" },
      "warm-beige": { bg: "#fefdf8", text: "#451a03", accent: "#d97706" },
      "high-contrast": { bg: "#000000", text: "#ffffff", accent: "#ffff00" },
    };

    const theme = themeColors[currentTheme] || themeColors.default;

    return {
      backgroundColor: theme.bg,
      color: theme.text,
      fontSize: `${accessibilitySettings.fontSize}px`,
      fontFamily: accessibilitySettings.dyslexiaFriendlyFont
        ? "OpenDyslexic, monospace"
        : accessibilitySettings.fontFamily === "system"
        ? "system-ui, -apple-system, sans-serif"
        : accessibilitySettings.fontFamily,
      lineHeight: accessibilitySettings.lineHeight,
      letterSpacing: `${accessibilitySettings.letterSpacing}px`,
      wordSpacing: `${accessibilitySettings.wordSpacing || 0}px`,
      filter: accessibilitySettings.highContrast ? "contrast(150%)" : "none",
      transition: accessibilitySettings.reducedMotion
        ? "none"
        : "all 0.3s ease",
      maxWidth: `${settings.layoutSettings?.maxContentWidth || 800}px`,
      margin: "0 auto",
      padding: "20px",
      borderRadius: "8px",
      border: `2px solid ${theme.accent}`,
    };
  };

  return (
    <div className="preview-panel">
      <h3 className="preview-title">🔍 Live Preview</h3>
      <div className="preview-container">
        <div style={getPreviewStyles()}>
          <h2 style={{ color: "inherit", marginTop: 0 }}>
            Sample Article Title
          </h2>
          <p style={{ color: "inherit", opacity: 0.8, fontSize: "0.9em" }}>
            Published on October 4, 2025
          </p>
          <p
            style={{
              color: "inherit",
              marginBottom: `${
                settings.accessibilitySettings?.paragraphSpacing || 0
              }em`,
            }}
          >
            This is a preview of how text will appear with your current
            settings. The font size, family, spacing, and theme colors are all
            applied in real-time as you make changes.
          </p>
          <p
            style={{
              color: "inherit",
              marginBottom: `${
                settings.accessibilitySettings?.paragraphSpacing || 0
              }em`,
            }}
          >
            FocusFlow helps reduce visual overwhelm and cognitive load by
            providing customizable typography and color schemes designed for
            neurodiverse users.
          </p>
          <div
            style={{
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              padding: "15px",
              borderRadius: "6px",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              marginTop: "15px",
            }}
          >
            <strong>💡 Tip:</strong> This preview updates instantly as you
            adjust settings.
          </div>
        </div>
      </div>
      <div className="preview-info">
        <small>
          Current theme: <strong>{settings.currentTheme}</strong> | Font size:{" "}
          <strong>{settings.accessibilitySettings?.fontSize || 16}px</strong> |
          Line height:{" "}
          <strong>{settings.accessibilitySettings?.lineHeight || 1.6}</strong>
        </small>
      </div>
    </div>
  );
};

export default PreviewPanel;
