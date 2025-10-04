// Modularized CSS helper for FocusFlow
function getReadingStylesCSSHelper(maxWidth = 800) {
  return `
    .focusflow-focus-mode {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      line-height: 1.6 !important;
    }
    .focusflow-main-content {
      max-width: ${maxWidth}px !important;
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

export { getReadingStylesCSSHelper };
