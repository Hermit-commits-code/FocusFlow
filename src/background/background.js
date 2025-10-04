// FocusFlow Background Script (Service Worker)
// Handles timers, notifications, keyboard shortcuts, and state management

class FocusFlowBackground {
  constructor() {
    this.timerState = {
      isActive: false,
      startTime: null,
      duration: 25 * 60,
      type: "work",
      timeRemaining: 0,
      mode: "pomodoro", // new: track mode
    };
    this.analytics = {
      sessions: [],
      dailyMinutes: 0,
      dailySessions: 0,
    };
    this.init();
  }

  init() {
    chrome.runtime.onInstalled.addListener(this.handleInstalled.bind(this));
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
    chrome.commands.onCommand.addListener(this.handleCommand.bind(this));
    chrome.alarms.onAlarm.addListener(this.handleAlarm.bind(this));
    // Periodic badge update (Manifest V3: must be inside a method)
    chrome.alarms.create("focusflow-badge-update", { periodInMinutes: 1 });
    chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === "focusflow-badge-update") {
        this.updateBadge();
      }
    });
  }

  handleInstalled(details) {
    if (details.reason === "install") {
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
        sendResponse({ success: true, timerState: this.getTimerStatus() });
        break;
      case "stopTimer":
        this.stopTimer();
        sendResponse({ success: true, timerState: this.getTimerStatus() });
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
    return true;
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
    this.broadcastSettingsUpdate(settings);
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
        .catch(() => {});
    });
  }

  async startTimer(type, duration) {
    // Load timer mode and goals from settings
    const settings = await chrome.storage.sync.get(["focusFlow"]);
    const mode = settings.focusFlow?.timerMode || "pomodoro";
    this.timerState = {
      isActive: true,
      startTime: Date.now(),
      duration,
      type,
      timeRemaining: duration,
      mode,
    };
    chrome.storage.local.set({ focusFlowTimer: this.timerState });
    chrome.alarms.create("focusflow-timer", {
      when: Date.now() + duration * 1000,
    });
    this.updateBadge();
    this.showNotification(
      `${type === "work" ? "Focus Session" : "Break Time"} Started`,
      `${Math.round(duration / 60)} minutes on the clock. Mode: ${mode}`
    );
  }

  stopTimer() {
    this.timerState.isActive = false;
    chrome.alarms.clear("focusflow-timer");
    chrome.storage.local.set({ focusFlowTimer: this.timerState });
    this.updateBadge();
    this.showNotification(
      "Timer Stopped",
      "Great job! Remember to take regular breaks."
    );
  }

  handleAlarm(alarm) {
    if (alarm.name === "focusflow-timer") {
      this.completeTimer();
    }
  }

  async completeTimer() {
    this.timerState.isActive = false;
    chrome.storage.local.set({ focusFlowTimer: this.timerState });
    this.updateBadge();
    // Update analytics
    const sessionDuration = Math.round(
      (Date.now() - this.timerState.startTime) / 1000
    );
    this.analytics.sessions.push({
      start: this.timerState.startTime,
      end: Date.now(),
      duration: sessionDuration,
      mode: this.timerState.mode,
      type: this.timerState.type,
    });
    if (this.timerState.type === "work") {
      this.analytics.dailyMinutes += sessionDuration / 60;
      this.analytics.dailySessions += 1;
    }
    chrome.storage.sync.set({ focusFlowAnalytics: this.analytics });
    // Achievement check (simple example)
    if (this.analytics.dailySessions >= (await this.getDailyGoal("sessions"))) {
      this.showNotification(
        "Achievement unlocked!",
        "Daily session goal reached."
      );
    }
    if (this.analytics.dailyMinutes >= (await this.getDailyGoal("minutes"))) {
      this.showNotification(
        "Achievement unlocked!",
        "Daily focus minutes goal reached."
      );
    }
    this.showNotification(
      "Focus Session Complete! 🎉",
      "Time for a well-deserved break. Click to start break.",
      [
        { title: "Start Break", iconUrl: "icons/icon-48.png" },
        { title: "Skip Break", iconUrl: "icons/icon-48.png" },
      ]
    );
  }

  async getDailyGoal(type) {
    const settings = await chrome.storage.sync.get(["focusFlow"]);
    if (type === "sessions")
      return settings.focusFlow?.timerGoals?.dailySessions || 4;
    if (type === "minutes")
      return settings.focusFlow?.timerGoals?.dailyMinutes || 100;
    return 0;
  }

  getTimerStatus() {
    let timer = this.timerState;
    if (timer.isActive) {
      const elapsed = Math.floor((Date.now() - timer.startTime) / 1000);
      timer = {
        ...timer,
        timeRemaining: Math.max(0, timer.duration - elapsed),
      };
    }
    return timer;
  }

  updateBadge() {
    if (this.timerState.isActive) {
      const elapsed = Math.floor(
        (Date.now() - this.timerState.startTime) / 1000
      );
      const timeRemaining = Math.max(0, this.timerState.duration - elapsed);
      const minutes = Math.ceil(timeRemaining / 60);
      chrome.action.setBadgeText({ text: minutes.toString() });
      chrome.action.setBadgeBackgroundColor({
        color: this.timerState.type === "work" ? "#4299e1" : "#48bb78",
      });
    } else {
      chrome.action.setBadgeText({ text: "" });
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

  handleNotificationButtonClicked(notificationId, buttonIndex) {
    if (notificationId.startsWith("focusflow-")) {
      switch (buttonIndex) {
        case 0:
          if (this.timerState.type === "work") {
            this.startTimer("break", 5 * 60);
          } else {
            this.startTimer("work", 25 * 60);
          }
          break;
        case 1:
          break;
      }
      chrome.notifications.clear(notificationId);
    }
  }
}

const focusFlowBackground = new FocusFlowBackground();

chrome.notifications.onButtonClicked.addListener(
  (notificationId, buttonIndex) => {
    focusFlowBackground.handleNotificationButtonClicked(
      notificationId,
      buttonIndex
    );
  }
);

chrome.notifications.onClicked.addListener((notificationId) => {
  if (notificationId.startsWith("focusflow-")) {
    chrome.notifications.clear(notificationId);
  }
});
