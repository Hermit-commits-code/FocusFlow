import React from "react";

const ThemePreview = ({ theme, isActive, onClick, settings }) => {
  const themeConfigs = {
    default: {
      name: "Default",
      description: "Clean and neutral for everyday use",
      colors: {
        primary: "#3b82f6",
        background: "#ffffff",
        text: "#1f2937",
        secondary: "#f8fafc",
      },
      icon: "🌟",
    },
    dark: {
      name: "Dark Mode",
      description: "Easy on the eyes in low light",
      colors: {
        primary: "#60a5fa",
        background: "#1f2937",
        text: "#f9fafb",
        secondary: "#374151",
      },
      icon: "🌙",
    },
    "calm-blue": {
      name: "Calm Blue",
      description: "Soothing blues reduce anxiety",
      colors: {
        primary: "#0284c7",
        background: "#f0f9ff",
        text: "#0c4a6e",
        secondary: "#e0f2fe",
      },
      icon: "🌊",
    },
    "warm-beige": {
      name: "Warm Beige",
      description: "Warm tones for comfort",
      colors: {
        primary: "#d97706",
        background: "#fefdf8",
        text: "#451a03",
        secondary: "#fef3c7",
      },
      icon: "☕",
    },
    "high-contrast": {
      name: "High Contrast",
      description: "Maximum visibility for visual impairments",
      colors: {
        primary: "#ffff00",
        background: "#000000",
        text: "#ffffff",
        secondary: "#333333",
      },
      icon: "⚡",
    },
  };

  const config = themeConfigs[theme];
  if (!config) return null;

  const previewStyle = {
    backgroundColor: config.colors.background,
    color: config.colors.text,
    border: `2px solid ${isActive ? config.colors.primary : "transparent"}`,
    borderRadius: "12px",
    padding: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
    minHeight: "120px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  if (isActive) {
    previewStyle.boxShadow = `0 0 0 3px ${config.colors.primary}33`;
    previewStyle.transform = "scale(1.02)";
  }

  return (
    <div
      className={`theme-preview ${isActive ? "active" : ""}`}
      style={previewStyle}
      onClick={() => onClick(theme)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(theme);
        }
      }}
      aria-label={`Select ${config.name} theme`}
    >
      <div className="theme-header">
        <div
          className="theme-icon"
          style={{ fontSize: "24px", marginBottom: "8px" }}
        >
          {config.icon}
        </div>
        <h4
          style={{
            margin: "0 0 4px 0",
            color: config.colors.text,
            fontSize: `${
              (settings.accessibilitySettings?.fontSize || 16) * 0.875
            }px`,
          }}
        >
          {config.name}
        </h4>
        <p
          style={{
            margin: 0,
            fontSize: `${
              (settings.accessibilitySettings?.fontSize || 16) * 0.75
            }px`,
            opacity: 0.8,
            color: config.colors.text,
          }}
        >
          {config.description}
        </p>
      </div>

      <div
        className="theme-sample"
        style={{
          backgroundColor: config.colors.secondary,
          padding: "8px",
          borderRadius: "6px",
          marginTop: "8px",
        }}
      >
        <div
          style={{
            fontSize: `${
              (settings.accessibilitySettings?.fontSize || 16) * 0.75
            }px`,
            color: config.colors.text,
            fontFamily: settings.accessibilitySettings?.fontFamily || "inherit",
          }}
        >
          Sample text with current font
        </div>
      </div>

      {isActive && (
        <div
          className="active-indicator"
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: config.colors.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme === "high-contrast" ? "#000" : "#fff",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          ✓
        </div>
      )}
    </div>
  );
};

const EnhancedThemeSelector = ({ currentTheme, onChange, settings }) => {
  const themes = [
    "default",
    "dark",
    "calm-blue",
    "warm-beige",
    "high-contrast",
  ];

  return (
    <div className="enhanced-theme-selector">
      <label className="setting-label">
        Visual Theme
        <span className="setting-description">
          Choose colors and contrast that work best for your vision and
          preferences
        </span>
      </label>

      <div className="theme-grid">
        {themes.map((theme) => (
          <ThemePreview
            key={theme}
            theme={theme}
            isActive={currentTheme === theme}
            onClick={onChange}
            settings={settings}
          />
        ))}
      </div>

      <div className="theme-info">
        <div className="accessibility-note">
          <strong>💡 Accessibility Tip:</strong> The High Contrast theme meets
          WCAG AAA standards for users with visual impairments. Calm Blue and
          Warm Beige themes are designed to reduce sensory overwhelm for users
          with autism or ADHD.
        </div>
      </div>
    </div>
  );
};

export default EnhancedThemeSelector;
