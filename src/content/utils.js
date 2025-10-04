// Mutation observer setup helper
function setupMutationObserverHelper(settings, applySettingsFn) {
  const observer = new MutationObserver((mutations) => {
    if (settings.distractionBlocker || settings.focusMode) {
      setTimeout(() => applySettingsFn(), 100);
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// ...existing code...
// Utility methods for FocusFlow
function hideElement(element, className) {
  element.classList.add("focusflow-hidden", className);
  element.setAttribute("data-focusflow-hidden", "true");
}

function stopAutoplayMedia() {
  document.querySelectorAll("video[autoplay]").forEach((video) => {
    video.pause();
    video.removeAttribute("autoplay");
  });
  document.querySelectorAll("audio[autoplay]").forEach((audio) => {
    audio.pause();
    audio.removeAttribute("autoplay");
  });
}

function blockAdIframes(hideElementFn) {
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
      hideElementFn(iframe, "ad-iframe-blocked");
    }
  });
}

function showNotification(message) {
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
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

export {
  hideElement,
  stopAutoplayMedia,
  blockAdIframes,
  showNotification,
  setupMutationObserverHelper,
};
// Utility functions for FocusFlow (add more as needed)
// Currently, all utility methods are inside the class, so this is a placeholder.
