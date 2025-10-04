import React, { useState } from "react";

const defaultOverride = {
  focusMode: false,
  distractionBlocker: false,
  customTheme: "default",
  accessibility: {
    fontSize: 16,
    fontFamily: "system",
    lineHeight: 1.6,
    letterSpacing: 0,
    dyslexiaFriendlyFont: false,
    highContrast: false,
    reducedMotion: false,
  },
  layout: {
    maxContentWidth: 800,
    hideImages: false,
    hideVideos: false,
    simplifyPages: true,
    removeAnimations: false,
  },
  enabled: true,
};

const WebsiteOverridesUI = ({ overrides, updateOverrides }) => {
  const [domainInput, setDomainInput] = useState("");
  const [editDomain, setEditDomain] = useState(null);
  const [editData, setEditData] = useState(null);

  const handleAddDomain = () => {
    const domain = domainInput.trim().toLowerCase();
    if (!domain || overrides[domain]) return;
    updateOverrides({ ...overrides, [domain]: { ...defaultOverride } });
    setDomainInput("");
  };

  const handleEditDomain = (domain) => {
    setEditDomain(domain);
    setEditData({ ...overrides[domain] });
  };

  const handleSaveEdit = () => {
    updateOverrides({ ...overrides, [editDomain]: editData });
    setEditDomain(null);
    setEditData(null);
  };

  const handleDeleteDomain = (domain) => {
    const newOverrides = { ...overrides };
    delete newOverrides[domain];
    updateOverrides(newOverrides);
  };

  return (
    <div className="website-overrides-ui">
      <div className="add-domain-row">
        <input
          type="text"
          placeholder="Enter domain (e.g. example.com)"
          value={domainInput}
          onChange={(e) => setDomainInput(e.target.value)}
          className="domain-input"
        />
        <button
          className="btn btn-primary"
          onClick={handleAddDomain}
          disabled={!domainInput.trim()}
        >
          Add Domain
        </button>
      </div>
      <div className="overrides-list">
        {Object.keys(overrides).length === 0 && (
          <div className="empty-message">No overrides set yet.</div>
        )}
        {Object.entries(overrides).map(([domain, data]) => (
          <div key={domain} className="override-item">
            <div className="override-header">
              <strong>{domain}</strong>
              <span className="status-label">
                {data.enabled ? "Enabled" : "Disabled"}
              </span>
              <button
                className="btn btn-secondary"
                onClick={() => handleEditDomain(domain)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteDomain(domain)}
              >
                Delete
              </button>
            </div>
            {editDomain === domain ? (
              <div className="edit-panel">
                <label>
                  <input
                    type="checkbox"
                    checked={editData.enabled}
                    onChange={(e) =>
                      setEditData({ ...editData, enabled: e.target.checked })
                    }
                  />{" "}
                  Enable Override
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={editData.focusMode}
                    onChange={(e) =>
                      setEditData({ ...editData, focusMode: e.target.checked })
                    }
                  />{" "}
                  Focus Mode
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={editData.distractionBlocker}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        distractionBlocker: e.target.checked,
                      })
                    }
                  />{" "}
                  Distraction Blocker
                </label>
                <label>
                  Theme:
                  <select
                    value={editData.customTheme}
                    onChange={(e) =>
                      setEditData({ ...editData, customTheme: e.target.value })
                    }
                  >
                    <option value="default">Default</option>
                    <option value="dark">Dark</option>
                    <option value="calm-blue">Calm Blue</option>
                    <option value="warm-beige">Warm Beige</option>
                    <option value="high-contrast">High Contrast</option>
                  </select>
                </label>
                <label>
                  Font Size:
                  <input
                    type="number"
                    min={12}
                    max={24}
                    value={editData.accessibility.fontSize}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        accessibility: {
                          ...editData.accessibility,
                          fontSize: Number(e.target.value),
                        },
                      })
                    }
                  />{" "}
                  px
                </label>
                <label>
                  Line Height:
                  <input
                    type="number"
                    min={1.0}
                    max={2.5}
                    step={0.1}
                    value={editData.accessibility.lineHeight}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        accessibility: {
                          ...editData.accessibility,
                          lineHeight: Number(e.target.value),
                        },
                      })
                    }
                  />
                </label>
                <label>
                  Letter Spacing:
                  <input
                    type="number"
                    min={-2}
                    max={5}
                    step={0.5}
                    value={editData.accessibility.letterSpacing}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        accessibility: {
                          ...editData.accessibility,
                          letterSpacing: Number(e.target.value),
                        },
                      })
                    }
                  />{" "}
                  px
                </label>
                <button className="btn btn-success" onClick={handleSaveEdit}>
                  Save
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditDomain(null);
                    setEditData(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebsiteOverridesUI;
