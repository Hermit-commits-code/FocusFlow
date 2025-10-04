import React from "react";

const GoogleFontsSelector = ({ value, onChange, label, description }) => {
  const googleFonts = [
    {
      value: "system",
      label: "System Default",
      family: "system-ui, -apple-system, sans-serif",
    },
    {
      value: "open-sans",
      label: "Open Sans",
      family: '"Open Sans", sans-serif',
      url: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap",
    },
    {
      value: "roboto",
      label: "Roboto",
      family: '"Roboto", sans-serif',
      url: "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap",
    },
    {
      value: "lato",
      label: "Lato",
      family: '"Lato", sans-serif',
      url: "https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap",
    },
    {
      value: "source-sans-pro",
      label: "Source Sans Pro",
      family: '"Source Sans Pro", sans-serif',
      url: "https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap",
    },
    {
      value: "nunito",
      label: "Nunito",
      family: '"Nunito", sans-serif',
      url: "https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap",
    },
    {
      value: "inter",
      label: "Inter",
      family: '"Inter", sans-serif',
      url: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
    },
    {
      value: "poppins",
      label: "Poppins",
      family: '"Poppins", sans-serif',
      url: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
    },
    {
      value: "atkinson-hyperlegible",
      label: "Atkinson Hyperlegible (Accessible)",
      family: '"Atkinson Hyperlegible", sans-serif',
      url: "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap",
    },
    {
      value: "lexend",
      label: "Lexend (Reading Performance)",
      family: '"Lexend", sans-serif',
      url: "https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600&display=swap",
    },
  ];

  // Load font if it's a Google Font
  React.useEffect(() => {
    const selectedFont = googleFonts.find((font) => font.value === value);
    if (selectedFont && selectedFont.url) {
      // Check if font is already loaded
      const existingLink = document.querySelector(
        `link[href="${selectedFont.url}"]`
      );
      if (!existingLink) {
        const link = document.createElement("link");
        link.href = selectedFont.url;
        link.rel = "stylesheet";
        link.crossOrigin = "anonymous";
        document.head.appendChild(link);
      }
    }
  }, [value]);

  const handleFontChange = (fontValue) => {
    const selectedFont = googleFonts.find((font) => font.value === fontValue);
    onChange(selectedFont ? selectedFont.family : fontValue);
  };

  return (
    <div className="setting-group">
      <label className="setting-label">
        {label}
        {description && (
          <span className="setting-description">{description}</span>
        )}
      </label>
      <div className="font-selector">
        <select
          value={value}
          onChange={(e) => handleFontChange(e.target.value)}
          className="select-input font-preview"
          style={{
            fontFamily:
              googleFonts.find((f) => f.value === value)?.family || "inherit",
          }}
        >
          {googleFonts.map((font) => (
            <option
              key={font.value}
              value={font.value}
              style={{ fontFamily: font.family }}
            >
              {font.label}
            </option>
          ))}
        </select>
        <div
          className="font-sample"
          style={{
            fontFamily:
              googleFonts.find((f) => f.value === value)?.family || "inherit",
            marginTop: "8px",
            padding: "12px",
            background: "rgba(0,0,0,0.05)",
            borderRadius: "6px",
            fontSize: "14px",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
            Sample Text
          </div>
          <div>The quick brown fox jumps over the lazy dog. 0123456789</div>
        </div>
      </div>
    </div>
  );
};

const AdvancedTypographyControls = ({ settings, updateSetting }) => {
  const handleFontFamilyChange = (fontFamily) => {
    updateSetting("accessibilitySettings.fontFamily", fontFamily);
  };

  return (
    <div className="advanced-typography">
      <div className="setting-row">
        <GoogleFontsSelector
          label="Font Family"
          description="Choose a font optimized for readability and accessibility"
          value={settings.accessibilitySettings?.fontFamily || "system"}
          onChange={handleFontFamilyChange}
        />
      </div>

      <div className="setting-row">
        <div className="range-setting">
          <label className="setting-label">
            Font Size
            <span className="setting-description">
              Larger text reduces eye strain
            </span>
          </label>
          <div className="range-input-group">
            <input
              type="range"
              min="12"
              max="24"
              step="1"
              value={settings.accessibilitySettings?.fontSize || 16}
              onChange={(e) =>
                updateSetting(
                  "accessibilitySettings.fontSize",
                  parseInt(e.target.value)
                )
              }
              className="range-input"
            />
            <span className="range-value">
              {settings.accessibilitySettings?.fontSize || 16}px
            </span>
          </div>
        </div>
      </div>

      <div className="setting-row">
        <div className="range-setting">
          <label className="setting-label">
            Line Height
            <span className="setting-description">
              Spacing between lines improves readability
            </span>
          </label>
          <div className="range-input-group">
            <input
              type="range"
              min="1.2"
              max="2.5"
              step="0.1"
              value={settings.accessibilitySettings?.lineHeight || 1.6}
              onChange={(e) =>
                updateSetting(
                  "accessibilitySettings.lineHeight",
                  parseFloat(e.target.value)
                )
              }
              className="range-input"
            />
            <span className="range-value">
              {settings.accessibilitySettings?.lineHeight || 1.6}
            </span>
          </div>
        </div>
      </div>

      <div className="setting-row">
        <div className="range-setting">
          <label className="setting-label">
            Letter Spacing
            <span className="setting-description">
              Extra spacing helps with dyslexia and reading difficulties
            </span>
          </label>
          <div className="range-input-group">
            <input
              type="range"
              min="-1"
              max="3"
              step="0.1"
              value={settings.accessibilitySettings?.letterSpacing || 0}
              onChange={(e) =>
                updateSetting(
                  "accessibilitySettings.letterSpacing",
                  parseFloat(e.target.value)
                )
              }
              className="range-input"
            />
            <span className="range-value">
              {settings.accessibilitySettings?.letterSpacing || 0}px
            </span>
          </div>
        </div>
      </div>

      <div className="setting-row">
        <div className="range-setting">
          <label className="setting-label">
            Content Width
            <span className="setting-description">
              Narrower content reduces visual overwhelm
            </span>
          </label>
          <div className="range-input-group">
            <input
              type="range"
              min="600"
              max="1200"
              step="50"
              value={settings.layoutSettings?.maxContentWidth || 800}
              onChange={(e) =>
                updateSetting(
                  "layoutSettings.maxContentWidth",
                  parseInt(e.target.value)
                )
              }
              className="range-input"
            />
            <span className="range-value">
              {settings.layoutSettings?.maxContentWidth || 800}px
            </span>
          </div>
        </div>
      </div>

      <div className="typography-presets">
        <label className="setting-label">Quick Presets</label>
        <div className="preset-buttons">
          <button
            className="preset-button"
            onClick={() => {
              updateSetting("accessibilitySettings.fontSize", 14);
              updateSetting("accessibilitySettings.lineHeight", 1.4);
              updateSetting("accessibilitySettings.letterSpacing", 0);
            }}
          >
            Compact
          </button>
          <button
            className="preset-button"
            onClick={() => {
              updateSetting("accessibilitySettings.fontSize", 16);
              updateSetting("accessibilitySettings.lineHeight", 1.6);
              updateSetting("accessibilitySettings.letterSpacing", 0.5);
            }}
          >
            Comfortable
          </button>
          <button
            className="preset-button"
            onClick={() => {
              updateSetting("accessibilitySettings.fontSize", 18);
              updateSetting("accessibilitySettings.lineHeight", 1.8);
              updateSetting("accessibilitySettings.letterSpacing", 1);
            }}
          >
            Large
          </button>
          <button
            className="preset-button"
            onClick={() => {
              updateSetting("accessibilitySettings.fontSize", 20);
              updateSetting("accessibilitySettings.lineHeight", 2.0);
              updateSetting("accessibilitySettings.letterSpacing", 1.5);
            }}
          >
            Extra Large
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedTypographyControls;
