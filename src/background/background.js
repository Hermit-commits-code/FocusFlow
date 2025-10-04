// FocusFlow Background Script (Service Worker)
// Handles timers, notifications, keyboard shortcuts, and state management

class FocusFlowBackground {
  constructor() {
    this.timerState = {
      isActive: false,
      startTime: null,
      duration: 25 * 60, // 25 minutes in seconds
      type: "work", // 'work' or 'break'
      timeRemaining: 0,
    };

    this.init();
  }

  init() {
    // Listen for extension installation
    chrome.runtime.onInstalled.addListener(this.handleInstalled.bind(this));

    // Listen for messages from popup and content scripts
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));

    // Listen for keyboard shortcuts
    chrome.commands.onCommand.addListener(this.handleCommand.bind(this));

    // Listen for alarms (timer notifications)
    chrome.alarms.onAlarm.addListener(this.handleAlarm.bind(this));

    // Update timer every second when active
    this.startTimerUpdater();
  }

  handleInstalled(details) {
    if (details.reason === "install") {
      // Set default settings on first install
      const defaultSettings = {
        focusMode: false,
        distractionBlocker: false,
        breakTimer: false,
        currentTheme: "default",
        pomodoroSettings: {
          workDuration: 25,
          shortBreakDuration: 5,
          longBreakDuration: 15,
          longBreakInterval: 4,
        },
        notificationsEnabled: true,
        keyboardShortcutsEnabled: true,
      };

      chrome.storage.sync.set({ focusFlow: defaultSettings });

      // Show welcome notification
      this.showNotification(
        "FocusFlow Installed!",
        "Click the extension icon to start your distraction-free browsing experience."
      );
    }
  }

  handleMessage(message, sender, sendResponse) {
    switch (message.action) {
      case "startBreakTimer":
        this.startTimer("work", 25 * 60);
        sendResponse({ success: true, timerState: this.timerState });
        break;

      case "stopTimer":
        this.stopTimer();
        sendResponse({ success: true, timerState: this.timerState });
        break;

      case "getTimerStatus":
        sendResponse(this.getTimerStatus());
        break;

      case "updateSettings":
        this.handleSettingsUpdate(message.settings);
        sendResponse({ success: true });
        break;

      default:
        sendResponse({ error: "Unknown action" });
    }

    return true; // Keep message channel open for async response
  }

  handleCommand(command) {
    switch (command) {
      case "toggle-focus-mode":
        this.toggleFeature("focusMode");
        break;

      case "toggle-distraction-blocker":
        this.toggleFeature("distractionBlocker");
        break;

      case "start-break-timer":
        if (!this.timerState.isActive) {
          this.startTimer("work", 25 * 60);
        } else {
          this.stopTimer();
        }
        break;
    }
  }

  async toggleFeature(featureName) {
    const result = await chrome.storage.sync.get(["focusFlow"]);
    const settings = result.focusFlow || {};

    settings[featureName] = !settings[featureName];

    await chrome.storage.sync.set({ focusFlow: settings });

    // Notify all tabs about the change
    this.broadcastSettingsUpdate(settings);

    // Show notification
    const status = settings[featureName] ? "enabled" : "disabled";
    const featureDisplayName =
      featureName === "focusMode" ? "Focus Mode" : "Distraction Blocker";
    this.showNotification(
      `${featureDisplayName} ${status}`,
      `Use the popup to customize your settings.`
    );
  }

  async broadcastSettingsUpdate(settings) {
    const tabs = await chrome.tabs.query({});

    tabs.forEach((tab) => {
      chrome.tabs
        .sendMessage(tab.id, {
          action: "updateSettings",
          settings: settings,
        })
        .catch(() => {
          // Ignore errors for tabs that don't have content script
        });
    });
  }

  startTimer(type, duration) {
    this.timerState = {
      isActive: true,
      startTime: Date.now(),
      duration: duration,
      type: type,
      timeRemaining: duration,
    };

    // Set alarm for when timer completes
    chrome.alarms.create("focusflow-timer", {
      delayInMinutes: duration / 60,
    });

    // Update badge with timer
    this.updateBadge();

    // Show start notification
    const typeName = type === "work" ? "Focus Session" : "Break Time";
    this.showNotification(
      `${typeName} Started`,
      `${Math.round(duration / 60)} minutes on the clock. Stay focused!`
    );
  }

  stopTimer() {
    this.timerState.isActive = false;
    chrome.alarms.clear("focusflow-timer");
    this.updateBadge();

    this.showNotification(
      "Timer Stopped",
      "Great job! Remember to take regular breaks."
    );
  }

  getTimerStatus() {
    if (this.timerState.isActive) {
      const elapsed = Math.floor(
        (Date.now() - this.timerState.startTime) / 1000
      );
      this.timerState.timeRemaining = Math.max(
        0,
        this.timerState.duration - elapsed
      );
    }

    return this.timerState;
  }

  handleAlarm(alarm) {
    if (alarm.name === "focusflow-timer") {
      this.completeTimer();
    }
  }

  completeTimer() {
    const wasWork = this.timerState.type === "work";
    this.timerState.isActive = false;

    if (wasWork) {
      // Work session completed, suggest break
      this.showNotification(
        "Focus Session Complete! 🎉",
        "Time for a well-deserved break. Click to start 5-minute break.",
        [
          { title: "Start Break", iconUrl: "icons/icon-48.png" },
          { title: "Skip Break", iconUrl: "icons/icon-48.png" },
        ]
      );
    } else {
      // Break completed, suggest work
      this.showNotification(
        "Break Time Over! ⏰",
        "Ready to get back to focused work?",
        [
          { title: "Start Focus", iconUrl: "icons/icon-48.png" },
          { title: "Extend Break", iconUrl: "icons/icon-48.png" },
        ]
      );
    }

    this.updateBadge();
  }

  handleSettingsUpdate(settings) {
    // Update timer settings if needed
    if (settings.pomodoroSettings) {
      // Apply new pomodoro settings
    }

    // Broadcast to all tabs
    this.broadcastSettingsUpdate(settings);
  }

  startTimerUpdater() {
    setInterval(() => {
      if (this.timerState.isActive) {
        const elapsed = Math.floor(
          (Date.now() - this.timerState.startTime) / 1000
        );
        this.timerState.timeRemaining = Math.max(
          0,
          this.timerState.duration - elapsed
        );

        // Update badge every minute
        if (elapsed % 60 === 0) {
          this.updateBadge();
        }

        // Timer finished
        if (this.timerState.timeRemaining <= 0) {
          this.completeTimer();
        }
      }
    }, 1000);
  }

  updateBadge() {
    if (this.timerState.isActive) {
      const minutes = Math.ceil(this.timerState.timeRemaining / 60);
      chrome.browserAction.setBadgeText({ text: minutes.toString() });
      chrome.browserAction.setBadgeBackgroundColor({
        color: this.timerState.type === "work" ? "#4299e1" : "#48bb78",
      });
    } else {
      chrome.browserAction.setBadgeText({ text: "" });
    }
  }

  async showNotification(title, message, buttons = []) {
    const settings = await chrome.storage.sync.get(["focusFlow"]);
    if (settings.focusFlow?.notificationsEnabled === false) {
      return;
    }

    const notificationOptions = {
      type: "basic",
      iconUrl: "icons/icon-48.png",
      title: title,
      message: message,
    };

    if (buttons.length > 0) {
      notificationOptions.buttons = buttons;
    }

    chrome.notifications.create(`focusflow-${Date.now()}`, notificationOptions);
  }

  // Handle notification button clicks
  handleNotificationButtonClicked(notificationId, buttonIndex) {
    if (notificationId.startsWith("focusflow-")) {
      switch (buttonIndex) {
        case 0: // First button
          if (this.timerState.type === "work") {
            this.startTimer("break", 5 * 60); // 5-minute break
          } else {
            this.startTimer("work", 25 * 60); // 25-minute work
          }
          break;

        case 1: // Second button
          // Skip or extend - just close notification
          break;
      }

      chrome.notifications.clear(notificationId);
    }
  }
}

// Initialize the background script
const focusFlowBackground = new FocusFlowBackground();

// Handle notification button clicks
chrome.notifications.onButtonClicked.addListener(
  (notificationId, buttonIndex) => {
    focusFlowBackground.handleNotificationButtonClicked(
      notificationId,
      buttonIndex
    );
  }
);

// Handle notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
  if (notificationId.startsWith("focusflow-")) {
    // Note: chrome.browserAction.openPopup() is not available in Manifest V2
    // The popup will open when user clicks the browser action button
    chrome.notifications.clear(notificationId);
  }
});
