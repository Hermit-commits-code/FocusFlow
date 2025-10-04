import {
  hideElement,
  stopAutoplayMedia,
  blockAdIframes,
  showNotification,
  setupMutationObserverHelper,
} from "./utils";
import {
  distractionSelectors,
  secondarySelectors,
  mainContentSelectors,
} from "./selectors";
import { getReadingStylesCSSHelper } from "./cssHelper";
// FocusFlow Content Script - Distraction Blocker & Focus Mode
// This script runs on all web pages to implement accessibility features
class FocusFlowContentScript {
  applySettings() {
    // Apply focus mode
    if (this.settings.focusMode) {
      this.enableFocusMode();
    } else {
      this.removeFocusFlowElements();
    }

    // Apply theme
    this.applyTheme();

    // Apply distraction blocker
    if (this.settings.distractionBlocker) {
      this.hideSecondaryContent();
      this.blockAdIframes();
      this.stopAutoplayMedia();
    }
  }
  applySettings() {
    // Apply focus mode
    if (this.settings.focusMode) {
      this.enableFocusMode();
    } else {
      this.removeFocusFlowElements();
    }

    // Apply theme
    this.applyTheme();

    // Apply distraction blocker
    if (this.settings.distractionBlocker) {
      this.hideSecondaryContent();
      this.blockAdIframes();
      this.stopAutoplayMedia();
    }
  }
  constructor() {
    this.settings = {
      focusMode: false,
      distractionBlocker: false,
      currentTheme: "default",
    };

    // Track TTS retry state
    this.ttsRetry = null;
    this.ttsElement = null;
    this.ttsText = null;
    this._ttsActive = false;

    // Proactively trigger voices loading and set up handler
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        console.log("FocusFlow: voiceschanged event fired (constructor)");
        if (this.ttsRetry) {
          clearTimeout(this.ttsRetry);
          this.ttsRetry = null;
        }
        if (this.ttsElement && this.ttsText) {
          this._speakTTS(this.ttsElement, this.ttsText);
        }
      };
    }

    this._initContentScript();
  }

  _initContentScript() {
    // Load settings from storage
    this.loadSettings().then(() => {
      // Apply initial modifications
      this.applySettings();
      // Listen for messages from popup/background
      if (
        typeof chrome !== "undefined" &&
        chrome.runtime &&
        chrome.runtime.onMessage
      ) {
        chrome.runtime.onMessage.addListener(
          (message, sender, sendResponse) => {
            if (message.action === "updateSettings") {
              this.settings = { ...this.settings, ...message.settings };
              this.applySettings();
              sendResponse({ success: true });
            }
          }
        );
      }
    });
  }

  async loadSettings() {
    return new Promise((resolve) => {
      if (
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.sync
      ) {
        chrome.storage.sync.get(["focusFlow"], (result) => {
          if (result.focusFlow) {
            this.settings = { ...this.settings, ...result.focusFlow };
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  _speakTTS(element, text) {
    // Helper: split text into chunks (max 2000 chars, try to split at sentence)
    function splitText(text, maxLen = 2000) {
      const chunks = [];
      let remaining = text;
      while (remaining.length > maxLen) {
        let splitIdx = remaining.lastIndexOf(". ", maxLen);
        if (splitIdx === -1) splitIdx = maxLen;
        chunks.push(remaining.slice(0, splitIdx + 1));
        remaining = remaining.slice(splitIdx + 1);
      }
      if (remaining.length > 0) chunks.push(remaining);
      return chunks;
    }

    const voices = window.speechSynthesis.getVoices();
    let selectedVoice =
      voices.find((v) => v.lang.startsWith("en")) || voices[0];
    const volume = 1.0;
    const rate = 1.0;
    const pitch = 1.0;

    const chunks = splitText(text);
    let chunkIdx = 0;
    this._ttsActive = true;
    const speakChunk = () => {
      if (!this._ttsActive) return; // If stopped, abort
      if (chunkIdx >= chunks.length) {
        console.log("FocusFlow: TTS finished");
        this.showNotification("Reading finished.");
        this.ttsElement = null;
        this.ttsText = null;
        if (this.ttsRetry) {
          clearTimeout(this.ttsRetry);
          this.ttsRetry = null;
        }
        this._ttsActive = false;
        return;
      }
      const utterance = new window.SpeechSynthesisUtterance(chunks[chunkIdx]);
      utterance.voice = selectedVoice;
      utterance.volume = volume;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.onerror = (e) => {
        console.log("FocusFlow: TTS error", e);
        this.showNotification(
          "Text-to-speech failed: " + (e.error || "Unknown error")
        );
        this._ttsActive = false;
      };
      utterance.onend = () => {
        chunkIdx++;
        speakChunk();
      };
      window.speechSynthesis.speak(utterance);
      if (chunkIdx === 0) {
        console.log("FocusFlow: TTS started");
        this.showNotification("Reading started.");
      }
    };
    window.speechSynthesis.cancel();
    speakChunk();
  }

  stopTTS() {
    window.speechSynthesis.cancel();
    this._ttsActive = false;
    this.showNotification("TTS stopped.");
  }

  // ...existing code...

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
    secondarySelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        hideElement(element, "focus-mode-hidden");
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
    const maxWidth = this.settings.layoutSettings?.maxContentWidth || 800;
    const customCSS = this.settings.layoutSettings?.customCSS || "";
    readingStyles.textContent =
      this.getReadingStylesCSS(maxWidth) + "\n" + customCSS;
    document.head.appendChild(readingStyles);
  }

  getReadingStylesCSS(maxWidth = 800) {
    // Import the CSS helper from the modularized file
    // If using ES6 modules, use:
    // import { getReadingStylesCSSHelper } from './cssHelper';
    // For now, assume require or global import for compatibility
    return getReadingStylesCSSHelper(maxWidth);
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
      // ...existing code for shortcuts...
    }
  }

  setupMutationObserver() {
    // Watch for dynamic content changes using helper
    setupMutationObserverHelper(this.settings, this.applySettings.bind(this));
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

  enableReadingMode() {
    const mainContent = document.querySelector(".focusflow-main-content");
    if (mainContent) {
      mainContent.classList.add("focusflow-reading-mode");
      // Add TTS button if not present
      if (!document.getElementById("focusflow-tts-btn")) {
        const ttsBtn = document.createElement("button");
        ttsBtn.id = "focusflow-tts-btn";
        ttsBtn.textContent = "🔊 Read Aloud";
        ttsBtn.style.cssText =
          "position: absolute; top: 10px; right: 10px; z-index: 1100; background: #4299e1; color: white; border: none; border-radius: 4px; padding: 8px 16px; cursor: pointer; font-size: 16px;";
        ttsBtn.onclick = () => {
          console.log("FocusFlow: TTS button clicked");
          this.readAloud(mainContent);
        };
        mainContent.appendChild(ttsBtn);
      }
      // Apply reading mode styles
      if (!document.getElementById("focusflow-reading-mode-styles")) {
        const style = document.createElement("style");
        style.id = "focusflow-reading-mode-styles";
        style.textContent = `
          .focusflow-reading-mode {
            background: #f7fafc !important;
            color: #222 !important;
            font-size: 20px !important;
            line-height: 1.8 !important;
            max-width: 900px !important;
            margin: 0 auto !important;
            padding: 32px !important;
            box-shadow: 0 4px 24px rgba(0,0,0,0.08) !important;
            border-radius: 12px !important;
          }
          .focusflow-reading-mode h1,
          .focusflow-reading-mode h2,
          .focusflow-reading-mode h3 {
            color: #2b6cb0 !important;
            margin-top: 2em !important;
          }
          .focusflow-reading-mode p {
            color: #222 !important;
            font-size: 20px !important;
            margin: 1.5em 0 !important;
          }
          /* Hide sidebars, nav, ads, comments, footers */
          aside, .sidebar, .widget, .secondary, nav:not(.main-nav), .related-posts, .comments, .footer, footer, .advertisement, .promo, .ad, .ads, [class*="advertisement"], [id*="ad"], .google-ads, .adsense, [class*="sponsored"], .modal, .popup, .overlay, [class*="popup"], .newsletter-signup, .email-signup, .subscribe-popup, .chat-widget, .live-chat, [class*="intercom"], .drift-widget, .zendesk-widget, .social-share, .fb-like, .twitter-follow, .social-login, [class*="social-media"], .notification-bar, .cookie-notice, .gdpr-notice, .banner, [class*="notification"], video[autoplay], audio[autoplay] {
            display: none !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }

  readAloud(element) {
    if (!element) {
      console.log("FocusFlow: readAloud called with null element");
      this.showNotification("No main content found for TTS.");
      return;
    }
    const text = element.textContent.trim();
    console.log("FocusFlow: readAloud called, text length:", text.length);
    if (!text) {
      this.showNotification("No readable text found for TTS.");
      return;
    }
    if ("speechSynthesis" in window) {
      const voices = window.speechSynthesis.getVoices();
      console.log("FocusFlow: speechSynthesis voices count:", voices.length);
      if (!voices || voices.length === 0) {
        this.showNotification(
          "No speech synthesis voices available yet. Retrying..."
        );
        // Save state for retry
        this.ttsElement = element;
        this.ttsText = text;
        // Set a timeout to notify user if voices never load
        if (this.ttsRetry) clearTimeout(this.ttsRetry);
        this.ttsRetry = setTimeout(() => {
          this.showNotification(
            "Speech synthesis voices did not load. Try reloading the page or checking browser settings."
          );
          this.ttsRetry = null;
        }, 5000);
        return;
      }
      this._speakTTS(element, text);
    } else {
      console.log("FocusFlow: speechSynthesis not supported");
      this.showNotification("Text-to-speech is not supported in this browser.");
    }
  }

  _speakTTS(element, text) {
    // Helper: split text into chunks (max 2000 chars, try to split at sentence)
    function splitText(text, maxLen = 2000) {
      const chunks = [];
      let remaining = text;
      while (remaining.length > maxLen) {
        let splitIdx = remaining.lastIndexOf(". ", maxLen);
        if (splitIdx === -1) splitIdx = maxLen;
        chunks.push(remaining.slice(0, splitIdx + 1));
        remaining = remaining.slice(splitIdx + 1);
      }
      if (remaining.length > 0) chunks.push(remaining);
      return chunks;
    }

    const voices = window.speechSynthesis.getVoices();
    // Prefer English voice, fallback to first
    let selectedVoice =
      voices.find((v) => v.lang.startsWith("en")) || voices[0];
    const volume = 1.0; // max volume
    const rate = 1.0; // normal speed
    const pitch = 1.0; // normal pitch

    const chunks = splitText(text);
    let chunkIdx = 0;
    const speakChunk = () => {
      if (chunkIdx >= chunks.length) {
        console.log("FocusFlow: TTS finished");
        this.showNotification("Reading finished.");
        this.ttsElement = null;
        this.ttsText = null;
        if (this.ttsRetry) {
          clearTimeout(this.ttsRetry);
          this.ttsRetry = null;
        }
        return;
      }
      const utterance = new window.SpeechSynthesisUtterance(chunks[chunkIdx]);
      utterance.voice = selectedVoice;
      utterance.volume = volume;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.onerror = (e) => {
        console.log("FocusFlow: TTS error", e);
        this.showNotification(
          "Text-to-speech failed: " + (e.error || "Unknown error")
        );
      };
      utterance.onend = () => {
        chunkIdx++;
        speakChunk();
      };
      window.speechSynthesis.speak(utterance);
      if (chunkIdx === 0) {
        console.log("FocusFlow: TTS started");
        this.showNotification("Reading started.");
      }
    };
    window.speechSynthesis.cancel();
    speakChunk();
  }
}

// Initialize the content script
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    new FocusFlowContentScript();
  });
} else {
  new FocusFlowContentScript();
}
