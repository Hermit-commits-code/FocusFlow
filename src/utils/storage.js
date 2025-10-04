// FocusFlow Storage Utilities
// Centralized storage management for settings, profiles, and user data

export class StorageManager {
  constructor() {
    this.defaultSettings = {
      focusMode: false,
      distractionBlocker: false,
      breakTimer: false,
      currentTheme: "default",
      currentProfile: "default",
      pomodoroSettings: {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        longBreakInterval: 4,
        autoStartBreaks: false,
        autoStartWork: false,
      },
      accessibilitySettings: {
        fontSize: 16,
        fontFamily: "system",
        lineHeight: 1.6,
        letterSpacing: 0,
        wordSpacing: 0,
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
      syncAcrossDevices: true,
    };
  }

  // Get all settings
  async getSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(["focusFlow"], (result) => {
        const settings = result.focusFlow || this.defaultSettings;
        resolve({ ...this.defaultSettings, ...settings });
      });
    });
  }

  // Save settings
  async saveSettings(settings) {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ focusFlow: settings }, () => {
        if (chrome.runtime.lastError) {
          console.error("Failed to save settings:", chrome.runtime.lastError);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  // Update specific setting
  async updateSetting(key, value) {
    const settings = await this.getSettings();
    settings[key] = value;
    return this.saveSettings(settings);
  }

  // Get user profiles
  async getProfiles() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(["focusFlowProfiles"], (result) => {
        const profiles = result.focusFlowProfiles || this.getDefaultProfiles();
        resolve(profiles);
      });
    });
  }

  // Save user profiles
  async saveProfiles(profiles) {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ focusFlowProfiles: profiles }, () => {
        resolve(!chrome.runtime.lastError);
      });
    });
  }

  // Create new profile
  async createProfile(name, settings) {
    const profiles = await this.getProfiles();
    const profileId = this.generateProfileId();

    profiles[profileId] = {
      id: profileId,
      name: name,
      settings: { ...this.defaultSettings, ...settings },
      createdAt: Date.now(),
      lastUsed: Date.now(),
    };

    await this.saveProfiles(profiles);
    return profileId;
  }

  // Delete profile
  async deleteProfile(profileId) {
    if (profileId === "default") {
      throw new Error("Cannot delete default profile");
    }

    const profiles = await this.getProfiles();
    delete profiles[profileId];
    return this.saveProfiles(profiles);
  }

  // Switch to profile
  async switchToProfile(profileId) {
    const profiles = await this.getProfiles();
    const profile = profiles[profileId];

    if (!profile) {
      throw new Error("Profile not found");
    }

    // Update last used timestamp
    profile.lastUsed = Date.now();
    await this.saveProfiles(profiles);

    // Apply profile settings
    const settings = { ...profile.settings, currentProfile: profileId };
    await this.saveSettings(settings);

    return settings;
  }

  // Get usage statistics
  async getUsageStats() {
    return new Promise((resolve) => {
      chrome.storage.local.get(["focusFlowStats"], (result) => {
        const stats = result.focusFlowStats || this.getDefaultStats();
        resolve(stats);
      });
    });
  }

  // Update usage statistics
  async updateUsageStats(type, duration) {
    const stats = await this.getUsageStats();
    const today = new Date().toDateString();

    if (!stats.daily[today]) {
      stats.daily[today] = { focus: 0, break: 0, sessions: 0 };
    }

    stats.daily[today][type] += duration;
    stats.daily[today].sessions += 1;
    stats.totalTime[type] += duration;
    stats.totalSessions += 1;

    return new Promise((resolve) => {
      chrome.storage.local.set({ focusFlowStats: stats }, () => {
        resolve(!chrome.runtime.lastError);
      });
    });
  }

  // Clear all data
  async clearAllData() {
    return new Promise((resolve) => {
      chrome.storage.sync.clear(() => {
        chrome.storage.local.clear(() => {
          resolve(!chrome.runtime.lastError);
        });
      });
    });
  }

  // Export settings
  async exportSettings() {
    const settings = await this.getSettings();
    const profiles = await this.getProfiles();
    const stats = await this.getUsageStats();

    return {
      version: "1.0.0",
      exportDate: new Date().toISOString(),
      settings,
      profiles,
      stats,
    };
  }

  // Import settings
  async importSettings(data) {
    try {
      if (data.version !== "1.0.0") {
        throw new Error("Incompatible version");
      }

      if (data.settings) {
        await this.saveSettings(data.settings);
      }

      if (data.profiles) {
        await this.saveProfiles(data.profiles);
      }

      return true;
    } catch (error) {
      console.error("Failed to import settings:", error);
      return false;
    }
  }

  // Helper methods
  generateProfileId() {
    return (
      "profile_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    );
  }

  getDefaultProfiles() {
    return {
      default: {
        id: "default",
        name: "Default",
        settings: this.defaultSettings,
        createdAt: Date.now(),
        lastUsed: Date.now(),
      },
      adhd: {
        id: "adhd",
        name: "ADHD Friendly",
        settings: {
          ...this.defaultSettings,
          distractionBlocker: true,
          focusMode: true,
          accessibilitySettings: {
            ...this.defaultSettings.accessibilitySettings,
            reducedMotion: true,
            fontSize: 18,
          },
          layoutSettings: {
            ...this.defaultSettings.layoutSettings,
            removeAnimations: true,
            simplifyPages: true,
          },
        },
        createdAt: Date.now(),
        lastUsed: 0,
      },
      dyslexia: {
        id: "dyslexia",
        name: "Dyslexia Friendly",
        settings: {
          ...this.defaultSettings,
          accessibilitySettings: {
            ...this.defaultSettings.accessibilitySettings,
            dyslexiaFriendlyFont: true,
            fontSize: 18,
            lineHeight: 1.8,
            letterSpacing: 1,
          },
        },
        createdAt: Date.now(),
        lastUsed: 0,
      },
    };
  }

  getDefaultStats() {
    return {
      totalTime: { focus: 0, break: 0 },
      totalSessions: 0,
      daily: {},
      achievements: [],
      streaks: { current: 0, longest: 0 },
    };
  }
}

// Theme management
export const themes = {
  default: {
    name: "Default",
    colors: {
      primary: "#4299e1",
      secondary: "#718096",
      background: "#f8fafc",
      surface: "#ffffff",
      text: "#1a202c",
      textSecondary: "#4a5568",
    },
  },
  dark: {
    name: "Dark",
    colors: {
      primary: "#63b3ed",
      secondary: "#a0aec0",
      background: "#1a202c",
      surface: "#2d3748",
      text: "#f7fafc",
      textSecondary: "#e2e8f0",
    },
  },
  calm: {
    name: "Calm Blue",
    colors: {
      primary: "#3182ce",
      secondary: "#4a5568",
      background: "#e6f3ff",
      surface: "#ffffff",
      text: "#2d3748",
      textSecondary: "#4a5568",
    },
  },
  warm: {
    name: "Warm Beige",
    colors: {
      primary: "#d69e2e",
      secondary: "#975a16",
      background: "#fef5e7",
      surface: "#ffffff",
      text: "#2d3748",
      textSecondary: "#4a5568",
    },
  },
  highContrast: {
    name: "High Contrast",
    colors: {
      primary: "#000000",
      secondary: "#666666",
      background: "#ffffff",
      surface: "#f0f0f0",
      text: "#000000",
      textSecondary: "#333333",
    },
  },
};

// Accessibility helpers
export class AccessibilityHelper {
  static applyDyslexiaFriendlyFont() {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=OpenDyslexic&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }

  static increaseFontSize(element, size) {
    element.style.fontSize = `${size}px`;
  }

  static adjustLineHeight(element, height) {
    element.style.lineHeight = height;
  }

  static adjustLetterSpacing(element, spacing) {
    element.style.letterSpacing = `${spacing}px`;
  }

  static enableHighContrast() {
    document.body.classList.add("focusflow-high-contrast");
  }

  static reduceMotion() {
    const style = document.createElement("style");
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
    document.head.appendChild(style);
  }
}

// Create singleton instance
export const storageManager = new StorageManager();
