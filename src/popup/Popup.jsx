import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./popup.css";

const Popup = () => {
  const [settings, setSettings] = useState({
    focusMode: false,
    distractionBlocker: false,
    breakTimer: false,
    currentTheme: "default",
  });

  const [timerStatus, setTimerStatus] = useState({
    isActive: false,
    timeRemaining: 0,
    type: "work", // 'work' or 'break'
  });

  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    // Load current settings from storage
    chrome.storage.sync.get(["focusFlow"], (result) => {
      if (result.focusFlow) {
        setSettings((prev) => ({ ...prev, ...result.focusFlow }));
      }
    });

    // Get timer status from background script
    const fetchTimerStatus = () => {
      chrome.runtime.sendMessage({ action: "getTimerStatus" }, (response) => {
        if (response) {
          setTimerStatus(response);
        }
      });
    };
    fetchTimerStatus();
    const interval = setInterval(fetchTimerStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateSetting = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await chrome.storage.sync.set({ focusFlow: newSettings });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          action: "updateSettings",
          settings: newSettings,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            setSaveStatus(
              "Content script not available on this page. Some features may not work."
            );
            setTimeout(() => setSaveStatus(""), 4000);
          }
        }
      );
    });
  };

  const startBreakTimer = () => {
    chrome.runtime.sendMessage({ action: "startBreakTimer" }, () => {
      // Refresh timer status after starting
      chrome.runtime.sendMessage({ action: "getTimerStatus" }, (response) => {
        if (response) setTimerStatus(response);
      });
    });
  };

  const stopTimer = () => {
    chrome.runtime.sendMessage({ action: "stopTimer" }, () => {
      // Refresh timer status after stopping
      chrome.runtime.sendMessage({ action: "getTimerStatus" }, (response) => {
        if (response) setTimerStatus(response);
      });
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="popup-container">
      {/* Header */}
      <div className="popup-header">
        <div className="logo">
          <span className="logo-icon">🧠</span>
          <h1>FocusFlow</h1>
        </div>
        <p className="tagline">Neurodiverse-friendly browsing</p>
      </div>

      {/* Main Controls */}
      <div className="controls-section">
        <div className="control-item">
          <div className="control-info">
            <h3>Focus Mode</h3>
            <p>Hide distractions, highlight main content</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.focusMode}
              onChange={(e) => updateSetting("focusMode", e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="control-item">
          <div className="control-info">
            <h3>Distraction Blocker</h3>
            <p>Remove ads, popups, and autoplay videos</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.distractionBlocker}
              onChange={(e) =>
                updateSetting("distractionBlocker", e.target.checked)
              }
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {/* Break Timer Section */}
      <div className="timer-section">
        <h3>Break Timer</h3>
        {timerStatus.isActive ? (
          <div className="timer-active">
            <div className="timer-display">
              <span className="timer-time">
                {formatTime(timerStatus.timeRemaining)}
              </span>
              <span className="timer-type">
                {timerStatus.type === "work"
                  ? "🎯 Focus Time"
                  : "☕ Break Time"}
              </span>
            </div>
            <button className="timer-button stop" onClick={stopTimer}>
              Stop Timer
            </button>
          </div>
        ) : (
          <div className="timer-inactive">
            <p>Take scheduled breaks to maintain focus</p>
            <button className="timer-button start" onClick={startBreakTimer}>
              Start 25-min Focus Session
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button
          className="action-button"
          onClick={() => chrome.runtime.openOptionsPage()}
        >
          ⚙️ Settings
        </button>
        <button
          className="action-button"
          onClick={() =>
            updateSetting(
              "currentTheme",
              settings.currentTheme === "default" ? "dark" : "default"
            )
          }
        >
          🎨 Theme
        </button>
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        <span className="status-text">
          {settings.focusMode || settings.distractionBlocker
            ? "✅ Active"
            : "💤 Inactive"}
        </span>
      </div>

      {/* Save Status Message */}
      {saveStatus && <div className="popup-status">{saveStatus}</div>}
    </div>
  );
};

// Initialize the popup
const container = document.getElementById("popup-root");
const root = createRoot(container);
root.render(<Popup />);
