// Selector arrays for FocusFlow
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

export { distractionSelectors, secondarySelectors, mainContentSelectors };
