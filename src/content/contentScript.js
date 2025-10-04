// FocusFlow Content Script - Distraction Blocker & Focus Mode
// This script runs on all web pages to implement accessibility features

class FocusFlowContentScript {
  constructor() {
    this.settings = {
      focusMode: false,
      distractionBlocker: false,
      currentTheme: "default",
    };

    this.init();
  }

  async init() {
    // Load settings from storage
    await this.loadSettings();

    // Apply initial modifications
    this.applySettings();

    // Listen for messages from popup/background
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "updateSettings") {
        this.settings = { ...this.settings, ...message.settings };
        this.applySettings();
        sendResponse({ success: true });
      }
    });

    // Listen for keyboard shortcuts
    document.addEventListener(
      "keydown",
      this.handleKeyboardShortcuts.bind(this)
    );

    // Observe DOM changes for dynamic content
    this.setupMutationObserver();
  }

  async loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(["focusFlow"], (result) => {
        if (result.focusFlow) {
          this.settings = { ...this.settings, ...result.focusFlow };
        }
        resolve();
      });
    });
  }

  applySettings() {
    // Remove existing FocusFlow modifications
    this.removeFocusFlowElements();

    if (this.settings.distractionBlocker) {
      this.enableDistractionBlocker();
    }

    if (this.settings.focusMode) {
      this.enableFocusMode();
    }

    this.applyTheme();
  }

  // Distraction Blocker Implementation
  enableDistractionBlocker() {
    // Block common ad and popup selectors
    const distractionSelectors = [
      // Ads
      ".ad",
      ".ads",
      '[class*="advertisement"]',
      '[id*="ad"]',
      ".google-ads",
      ".adsense",
      '[class*="sponsored"]',

      // Popups & overlays
      ".modal",
      ".popup",
      ".overlay",
      '[class*="popup"]',
      ".newsletter-signup",
      ".email-signup",
      ".subscribe-popup",

      // Chat widgets
      ".chat-widget",
      ".live-chat",
      '[class*="intercom"]',
      ".drift-widget",
      ".zendesk-widget",

      // Social media widgets
      ".social-share",
      ".fb-like",
      ".twitter-follow",
      ".social-login",
      '[class*="social-media"]',

      // Notification bars
      ".notification-bar",
      ".cookie-notice",
      ".gdpr-notice",
      ".banner",
      '[class*="notification"]',

      // Autoplay elements
      "video[autoplay]",
      "audio[autoplay]",
    ];

    distractionSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        this.hideElement(element, "distraction-blocked");
      });
    });

    // Stop autoplay media
    this.stopAutoplayMedia();

    // Block specific iframe sources (ads, tracking)
    this.blockAdIframes();
  }

  // Focus Mode Implementation
  enableFocusMode() {
    const body = document.body;

    // Add focus mode class
    body.classList.add("focusflow-focus-mode");

    // Identify and highlight main content
    this.highlightMainContent();

    // Hide sidebars and secondary content
    this.hideSecondaryContent();

    // Simplify navigation
    this.simplifyNavigation();

    // Apply reading-friendly styles
    this.applyReadingStyles();
  }

  highlightMainContent() {
    // Common main content selectors
    const mainContentSelectors = [
      "main",
      "article",
      ".main-content",
      "#main",
      "#content",
      ".post-content",
      ".entry-content",
      ".article-content",
      '[role="main"]',
      ".content-wrapper",
    ];

    const mainContent = this.findMainContent(mainContentSelectors);
    if (mainContent) {
      mainContent.classList.add("focusflow-main-content");
    }
  }

  findMainContent(selectors) {
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && this.hasSignificantContent(element)) {
        return element;
      }
    }

    // Fallback: find largest content area
    return this.findLargestContentArea();
  }

  hasSignificantContent(element) {
    const textContent = element.textContent.trim();
    return textContent.length > 200; // Minimum text length
  }

  findLargestContentArea() {
    const candidates = document.querySelectorAll("div, section, article");
    let largest = null;
    let maxSize = 0;

    candidates.forEach((element) => {
      const size = element.textContent.length;
      if (size > maxSize) {
        maxSize = size;
        largest = element;
      }
    });

    return largest;
  }

  hideSecondaryContent() {
    const secondarySelectors = [
      "aside",
      ".sidebar",
      ".widget",
      ".secondary",
      "nav:not(.main-nav)",
      ".related-posts",
      ".comments",
      ".footer",
      "footer",
      ".advertisement",
      ".promo",
    ];

    secondarySelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        this.hideElement(element, "focus-mode-hidden");
      });
    });
  }

  simplifyNavigation() {
    // Make navigation sticky and more accessible
    const nav = document.querySelector(
      "nav, .navigation, .navbar, #navigation"
    );
    if (nav) {
      nav.classList.add("focusflow-simplified-nav");
    }
  }

  applyReadingStyles() {
    // Inject reading-friendly CSS
    const readingStyles = document.createElement("style");
    readingStyles.id = "focusflow-reading-styles";
    readingStyles.textContent = this.getReadingStylesCSS();
    document.head.appendChild(readingStyles);
  }

  getReadingStylesCSS() {
    return `
      .focusflow-focus-mode {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        line-height: 1.6 !important;
      }
      
      .focusflow-main-content {
        max-width: 800px !important;
        margin: 0 auto !important;
        padding: 20px !important;
        background: white !important;
        border-radius: 8px !important;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
        position: relative !important;
        z-index: 1000 !important;
      }
      
      .focusflow-main-content h1,
      .focusflow-main-content h2,
      .focusflow-main-content h3 {
        color: #2d3748 !important;
        margin: 1.5em 0 0.5em 0 !important;
      }
      
      .focusflow-main-content p {
        color: #4a5568 !important;
        margin: 1em 0 !important;
        font-size: 16px !important;
      }
      
      .focusflow-simplified-nav {
        position: sticky !important;
        top: 0 !important;
        z-index: 1001 !important;
        background: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(10px) !important;
        padding: 10px 20px !important;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1) !important;
      }
      
      .focusflow-hidden {
        display: none !important;
      }
      
      /* Dark theme styles */
      @media (prefers-color-scheme: dark) {
        .focusflow-main-content {
          background: #2d3748 !important;
          color: #f7fafc !important;
        }
        
        .focusflow-main-content h1,
        .focusflow-main-content h2,
        .focusflow-main-content h3 {
          color: #f7fafc !important;
        }
        
        .focusflow-main-content p {
          color: #e2e8f0 !important;
        }
      }
    `;
  }

  // Utility Methods
  hideElement(element, className) {
    element.classList.add("focusflow-hidden", className);
    element.setAttribute("data-focusflow-hidden", "true");
  }

  stopAutoplayMedia() {
    // Stop autoplay videos
    document.querySelectorAll("video[autoplay]").forEach((video) => {
      video.pause();
      video.removeAttribute("autoplay");
    });

    // Stop autoplay audio
    document.querySelectorAll("audio[autoplay]").forEach((audio) => {
      audio.pause();
      audio.removeAttribute("autoplay");
    });
  }

  blockAdIframes() {
    document.querySelectorAll("iframe").forEach((iframe) => {
      const src = iframe.src.toLowerCase();
      const adDomains = [
        "googlesyndication.com",
        "doubleclick.net",
        "amazon-adsystem.com",
        "googletagmanager.com",
        "facebook.com/tr",
      ];

      if (adDomains.some((domain) => src.includes(domain))) {
        this.hideElement(iframe, "ad-iframe-blocked");
      }
    });
  }

  applyTheme() {
    document.body.classList.remove(
      "focusflow-theme-default",
      "focusflow-theme-dark"
    );
    document.body.classList.add(
      `focusflow-theme-${this.settings.currentTheme}`
    );
  }

  handleKeyboardShortcuts(event) {
    if (event.ctrlKey && event.shiftKey) {
      switch (event.code) {
        case "KeyF":
          event.preventDefault();
          this.toggleFocusMode();
          break;
        case "KeyD":
          event.preventDefault();
          this.toggleDistractionBlocker();
          break;
      }
    }
  }

  toggleFocusMode() {
    this.settings.focusMode = !this.settings.focusMode;
    this.saveSettings();
    this.applySettings();
    this.showNotification(
      "Focus Mode " + (this.settings.focusMode ? "enabled" : "disabled")
    );
  }

  toggleDistractionBlocker() {
    this.settings.distractionBlocker = !this.settings.distractionBlocker;
    this.saveSettings();
    this.applySettings();
    this.showNotification(
      "Distraction Blocker " +
        (this.settings.distractionBlocker ? "enabled" : "disabled")
    );
  }

  saveSettings() {
    chrome.storage.sync.set({ focusFlow: this.settings });
  }

  showNotification(message) {
    // Create a temporary notification
    const notification = document.createElement("div");
    notification.className = "focusflow-notification";
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4299e1;
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  setupMutationObserver() {
    // Watch for dynamic content changes
    const observer = new MutationObserver((mutations) => {
      if (this.settings.distractionBlocker || this.settings.focusMode) {
        // Re-apply filters for new content
        setTimeout(() => this.applySettings(), 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  removeFocusFlowElements() {
    // Remove all FocusFlow modifications
    document.querySelectorAll("[data-focusflow-hidden]").forEach((element) => {
      element.classList.remove(
        "focusflow-hidden",
        "distraction-blocked",
        "focus-mode-hidden"
      );
      element.removeAttribute("data-focusflow-hidden");
    });

    // Remove FocusFlow classes
    document.body.classList.remove("focusflow-focus-mode");
    document.querySelectorAll(".focusflow-main-content").forEach((element) => {
      element.classList.remove("focusflow-main-content");
    });

    // Remove injected styles
    const styles = document.getElementById("focusflow-reading-styles");
    if (styles) {
      styles.remove();
    }
  }
}

// Initialize the content script
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new FocusFlowContentScript();
  });
} else {
  new FocusFlowContentScript();
}
