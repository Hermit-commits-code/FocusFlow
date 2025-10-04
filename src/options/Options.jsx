import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./options.css";

const Options = () => {
  const [settings, setSettings] = useState({
    focusMode: false,
    distractionBlocker: false,
    currentTheme: "default",
    pomodoroSettings: {
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      longBreakInterval: 4,
    },
    accessibilitySettings: {
      fontSize: 16,
      fontFamily: "system",
      lineHeight: 1.6,
      letterSpacing: 0,
      dyslexiaFriendlyFont: false,
      highContrast: false,
      reducedMotion: false,
    },
    layoutSettings: {
      maxContentWidth: 800,
      hideImages: false,
      hideVideos: false,
      simplifyPages: true,
      removeAnimations: false,
    },
    notificationsEnabled: true,
    keyboardShortcutsEnabled: true,
  });

  const [profiles, setProfiles] = useState({});
  const [activeTab, setActiveTab] = useState("general");
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    loadSettings();
    loadProfiles();
  }, []);

  const loadSettings = async () => {
    chrome.storage.sync.get(["focusFlow"], (result) => {
      if (result.focusFlow) {
        setSettings((prev) => ({ ...prev, ...result.focusFlow }));
      }
    });
  };

  const loadProfiles = async () => {
    chrome.storage.sync.get(["focusFlowProfiles"], (result) => {
      if (result.focusFlowProfiles) {
        setProfiles(result.focusFlowProfiles);
      }
    });
  };

  const saveSettings = async () => {
    try {
      await chrome.storage.sync.set({ focusFlow: settings });
      setSaveStatus("Settings saved successfully!");
      setTimeout(() => setSaveStatus(""), 3000);

      // Notify all tabs about the change
      const tabs = await chrome.tabs.query({});
      tabs.forEach((tab) => {
        chrome.tabs
          .sendMessage(tab.id, {
            action: "updateSettings",
            settings: settings,
          })
          .catch(() => {});
      });
    } catch (error) {
      setSaveStatus("Error saving settings");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const updateSetting = (path, value) => {
    const newSettings = { ...settings };
    const keys = path.split(".");
    let current = newSettings;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setSettings(newSettings);
  };

  const createProfile = async () => {
    const name = prompt("Enter profile name:");
    if (!name) return;

    const profileId = "profile_" + Date.now();
    const newProfile = {
      id: profileId,
      name: name,
      settings: { ...settings },
      createdAt: Date.now(),
      lastUsed: Date.now(),
    };

    const newProfiles = { ...profiles, [profileId]: newProfile };
    setProfiles(newProfiles);

    await chrome.storage.sync.set({ focusFlowProfiles: newProfiles });
  };

  const loadProfile = async (profileId) => {
    const profile = profiles[profileId];
    if (profile) {
      setSettings(profile.settings);
      // Update last used
      const updatedProfiles = {
        ...profiles,
        [profileId]: { ...profile, lastUsed: Date.now() },
      };
      setProfiles(updatedProfiles);
      await chrome.storage.sync.set({ focusFlowProfiles: updatedProfiles });
    }
  };

  const deleteProfile = async (profileId) => {
    if (profileId === "default") return;

    const newProfiles = { ...profiles };
    delete newProfiles[profileId];
    setProfiles(newProfiles);

    await chrome.storage.sync.set({ focusFlowProfiles: newProfiles });
  };

  const exportSettings = () => {
    const data = {
      version: "1.0.0",
      exportDate: new Date().toISOString(),
      settings,
      profiles,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `focusflow-settings-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.settings) {
          setSettings(data.settings);
          await chrome.storage.sync.set({ focusFlow: data.settings });
        }
        if (data.profiles) {
          setProfiles(data.profiles);
          await chrome.storage.sync.set({ focusFlowProfiles: data.profiles });
        }
        setSaveStatus("Settings imported successfully!");
      } catch (error) {
        setSaveStatus("Error importing settings");
      }
      setTimeout(() => setSaveStatus(""), 3000);
    };
    reader.readAsText(file);
  };

  const TabButton = ({ id, label, active, onClick }) => (
    <button
      className={`tab-button ${active ? "active" : ""}`}
      onClick={() => onClick(id)}
    >
      {label}
    </button>
  );

  const SettingGroup = ({ title, children }) => (
    <div className="setting-group">
      <h3>{title}</h3>
      {children}
    </div>
  );

  const ToggleSetting = ({ label, description, value, onChange }) => (
    <div className="setting-item">
      <div className="setting-info">
        <label>{label}</label>
        {description && <p>{description}</p>}
      </div>
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="slider"></span>
      </label>
    </div>
  );

  const NumberSetting = ({
    label,
    description,
    value,
    onChange,
    min,
    max,
    step = 1,
  }) => (
    <div className="setting-item">
      <div className="setting-info">
        <label>{label}</label>
        {description && <p>{description}</p>}
      </div>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="number-input"
      />
    </div>
  );

  const SelectSetting = ({ label, description, value, onChange, options }) => (
    <div className="setting-item">
      <div className="setting-info">
        <label>{label}</label>
        {description && <p>{description}</p>}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="select-input"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="options-container">
      <header className="options-header">
        <div className="header-content">
          <h1>🧠 FocusFlow Settings</h1>
          <p>Customize your neurodiverse-friendly browsing experience</p>
        </div>
        {saveStatus && (
          <div
            className={`save-status ${
              saveStatus.includes("Error") ? "error" : "success"
            }`}
          >
            {saveStatus}
          </div>
        )}
      </header>

      <nav className="options-nav">
        <TabButton
          id="general"
          label="General"
          active={activeTab === "general"}
          onClick={setActiveTab}
        />
        <TabButton
          id="accessibility"
          label="Accessibility"
          active={activeTab === "accessibility"}
          onClick={setActiveTab}
        />
        <TabButton
          id="focus"
          label="Focus & Timer"
          active={activeTab === "focus"}
          onClick={setActiveTab}
        />
        <TabButton
          id="layout"
          label="Layout"
          active={activeTab === "layout"}
          onClick={setActiveTab}
        />
        <TabButton
          id="profiles"
          label="Profiles"
          active={activeTab === "profiles"}
          onClick={setActiveTab}
        />
        <TabButton
          id="advanced"
          label="Advanced"
          active={activeTab === "advanced"}
          onClick={setActiveTab}
        />
      </nav>

      <main className="options-content">
        {activeTab === "general" && (
          <div className="tab-content">
            <SettingGroup title="Core Features">
              <ToggleSetting
                label="Focus Mode"
                description="Highlight main content and hide distractions"
                value={settings.focusMode}
                onChange={(value) => updateSetting("focusMode", value)}
              />
              <ToggleSetting
                label="Distraction Blocker"
                description="Remove ads, popups, and autoplay content"
                value={settings.distractionBlocker}
                onChange={(value) => updateSetting("distractionBlocker", value)}
              />
              <ToggleSetting
                label="Notifications"
                description="Show break reminders and timer notifications"
                value={settings.notificationsEnabled}
                onChange={(value) =>
                  updateSetting("notificationsEnabled", value)
                }
              />
              <ToggleSetting
                label="Keyboard Shortcuts"
                description="Enable Ctrl+Shift+F (Focus), Ctrl+Shift+D (Distraction Blocker)"
                value={settings.keyboardShortcutsEnabled}
                onChange={(value) =>
                  updateSetting("keyboardShortcutsEnabled", value)
                }
              />
            </SettingGroup>

            <SettingGroup title="Theme">
              <SelectSetting
                label="Color Theme"
                description="Choose a color scheme that works best for you"
                value={settings.currentTheme}
                onChange={(value) => updateSetting("currentTheme", value)}
                options={[
                  { value: "default", label: "Default" },
                  { value: "dark", label: "Dark" },
                  { value: "calm", label: "Calm Blue" },
                  { value: "warm", label: "Warm Beige" },
                  { value: "highContrast", label: "High Contrast" },
                ]}
              />
            </SettingGroup>
          </div>
        )}

        {activeTab === "accessibility" && (
          <div className="tab-content">
            <SettingGroup title="Typography">
              <SelectSetting
                label="Font Family"
                description="Choose a font that's comfortable for reading"
                value={settings.accessibilitySettings.fontFamily}
                onChange={(value) =>
                  updateSetting("accessibilitySettings.fontFamily", value)
                }
                options={[
                  { value: "system", label: "System Default" },
                  {
                    value: "dyslexic",
                    label: "OpenDyslexic (Dyslexia-friendly)",
                  },
                  { value: "serif", label: "Serif (Georgia)" },
                  { value: "mono", label: "Monospace (Code font)" },
                ]}
              />
              <NumberSetting
                label="Font Size"
                description="Base font size in pixels"
                value={settings.accessibilitySettings.fontSize}
                onChange={(value) =>
                  updateSetting("accessibilitySettings.fontSize", value)
                }
                min={12}
                max={24}
              />
              <NumberSetting
                label="Line Height"
                description="Space between lines (1.0 = tight, 2.0 = loose)"
                value={settings.accessibilitySettings.lineHeight}
                onChange={(value) =>
                  updateSetting("accessibilitySettings.lineHeight", value)
                }
                min={1.0}
                max={2.5}
                step={0.1}
              />
              <NumberSetting
                label="Letter Spacing"
                description="Space between letters in pixels"
                value={settings.accessibilitySettings.letterSpacing}
                onChange={(value) =>
                  updateSetting("accessibilitySettings.letterSpacing", value)
                }
                min={-2}
                max={5}
                step={0.5}
              />
            </SettingGroup>

            <SettingGroup title="Visual Accessibility">
              <ToggleSetting
                label="High Contrast"
                description="Increase contrast for better visibility"
                value={settings.accessibilitySettings.highContrast}
                onChange={(value) =>
                  updateSetting("accessibilitySettings.highContrast", value)
                }
              />
              <ToggleSetting
                label="Reduced Motion"
                description="Minimize animations and transitions"
                value={settings.accessibilitySettings.reducedMotion}
                onChange={(value) =>
                  updateSetting("accessibilitySettings.reducedMotion", value)
                }
              />
            </SettingGroup>
          </div>
        )}

        {activeTab === "focus" && (
          <div className="tab-content">
            <SettingGroup title="Pomodoro Timer">
              <NumberSetting
                label="Work Duration (minutes)"
                description="Length of focused work sessions"
                value={settings.pomodoroSettings.workDuration}
                onChange={(value) =>
                  updateSetting("pomodoroSettings.workDuration", value)
                }
                min={15}
                max={60}
                step={5}
              />
              <NumberSetting
                label="Short Break (minutes)"
                description="Length of short breaks between work sessions"
                value={settings.pomodoroSettings.shortBreakDuration}
                onChange={(value) =>
                  updateSetting("pomodoroSettings.shortBreakDuration", value)
                }
                min={3}
                max={15}
              />
              <NumberSetting
                label="Long Break (minutes)"
                description="Length of longer breaks after multiple sessions"
                value={settings.pomodoroSettings.longBreakDuration}
                onChange={(value) =>
                  updateSetting("pomodoroSettings.longBreakDuration", value)
                }
                min={15}
                max={30}
              />
              <NumberSetting
                label="Long Break Interval"
                description="Number of work sessions before a long break"
                value={settings.pomodoroSettings.longBreakInterval}
                onChange={(value) =>
                  updateSetting("pomodoroSettings.longBreakInterval", value)
                }
                min={2}
                max={8}
              />
            </SettingGroup>
          </div>
        )}

        {activeTab === "layout" && (
          <div className="tab-content">
            <SettingGroup title="Content Layout">
              <NumberSetting
                label="Max Content Width (pixels)"
                description="Maximum width of main content area"
                value={settings.layoutSettings.maxContentWidth}
                onChange={(value) =>
                  updateSetting("layoutSettings.maxContentWidth", value)
                }
                min={600}
                max={1200}
                step={50}
              />
              <ToggleSetting
                label="Simplify Pages"
                description="Hide sidebars and secondary content"
                value={settings.layoutSettings.simplifyPages}
                onChange={(value) =>
                  updateSetting("layoutSettings.simplifyPages", value)
                }
              />
              <ToggleSetting
                label="Remove Animations"
                description="Disable CSS animations and transitions"
                value={settings.layoutSettings.removeAnimations}
                onChange={(value) =>
                  updateSetting("layoutSettings.removeAnimations", value)
                }
              />
            </SettingGroup>

            <SettingGroup title="Media Content">
              <ToggleSetting
                label="Hide Images"
                description="Hide all images on web pages"
                value={settings.layoutSettings.hideImages}
                onChange={(value) =>
                  updateSetting("layoutSettings.hideImages", value)
                }
              />
              <ToggleSetting
                label="Hide Videos"
                description="Hide all videos on web pages"
                value={settings.layoutSettings.hideVideos}
                onChange={(value) =>
                  updateSetting("layoutSettings.hideVideos", value)
                }
              />
            </SettingGroup>
          </div>
        )}

        {activeTab === "profiles" && (
          <div className="tab-content">
            <SettingGroup title="Saved Profiles">
              <div className="profiles-list">
                {Object.values(profiles).map((profile) => (
                  <div key={profile.id} className="profile-item">
                    <div className="profile-info">
                      <h4>{profile.name}</h4>
                      <p>
                        Created:{" "}
                        {new Date(profile.createdAt).toLocaleDateString()}
                      </p>
                      {profile.lastUsed > 0 && (
                        <p>
                          Last used:{" "}
                          {new Date(profile.lastUsed).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="profile-actions">
                      <button
                        className="btn btn-primary"
                        onClick={() => loadProfile(profile.id)}
                      >
                        Load
                      </button>
                      {profile.id !== "default" && (
                        <button
                          className="btn btn-danger"
                          onClick={() => deleteProfile(profile.id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary" onClick={createProfile}>
                Create New Profile
              </button>
            </SettingGroup>
          </div>
        )}

        {activeTab === "advanced" && (
          <div className="tab-content">
            <SettingGroup title="Data Management">
              <div className="data-actions">
                <button className="btn btn-secondary" onClick={exportSettings}>
                  Export Settings
                </button>
                <label className="btn btn-secondary">
                  Import Settings
                  <input
                    type="file"
                    accept=".json"
                    onChange={importSettings}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </SettingGroup>

            <SettingGroup title="Keyboard Shortcuts">
              <div className="shortcuts-list">
                <div className="shortcut-item">
                  <span className="shortcut-label">Toggle Focus Mode</span>
                  <kbd>Ctrl+Shift+F</kbd>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-label">
                    Toggle Distraction Blocker
                  </span>
                  <kbd>Ctrl+Shift+D</kbd>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-label">Start/Stop Timer</span>
                  <kbd>Ctrl+Shift+B</kbd>
                </div>
              </div>
            </SettingGroup>
          </div>
        )}
      </main>

      <footer className="options-footer">
        <button className="btn btn-primary btn-large" onClick={saveSettings}>
          Save All Settings
        </button>
      </footer>
    </div>
  );
};

// Initialize the options page
const container = document.getElementById("options-root");
const root = createRoot(container);
root.render(<Options />);
