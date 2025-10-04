# FocusFlow: Neurodiverse-Friendly Browsing Extension

<div align="center">

🧠 **Transform the internet into a calm, distraction-free, neurodiverse-friendly environment**

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-4285f4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://chrome.google.com/webstore)
[![Firefox Add-ons](https://img.shields.io/badge/Firefox-Add--ons-ff6611?style=for-the-badge&logo=firefox&logoColor=white)](https://addons.mozilla.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

# FocusFlow Browser Extension

> 🧠 A neurodiverse-friendly browser extension that helps you focus and reduce overwhelm while browsing the web.

**Version 1.0.0** - Sprint 1 Complete ✅

FocusFlow is designed specifically for people with ADHD, autism, dyslexia, and other neurological differences, but beneficial for anyone seeking a calmer online experience.

---

## ✨ What's New in v1.0.0

This is the **first stable release** of FocusFlow! Sprint 1 goals achieved:

- ✅ **Complete Core Features**: Distraction blocking, focus mode, and Pomodoro timer
- ✅ **Cross-Browser Support**: Works seamlessly in Chrome and Firefox
- ✅ **Accessibility Foundation**: WCAG 2.1 AA compliant with neurodiverse-friendly design
- ✅ **Professional Build System**: Optimized for performance and maintainability
- ✅ **Comprehensive Documentation**: Ready for community contributions

🎯 **Ready for Production Use** - All primary features tested and stable!

### 🎯 **Core Functionality**

- **Distraction Blocker**: Instantly remove popups, ads, chat widgets, and autoplay videos
- **Focus Mode**: Highlight main content, hide sidebars and menus, enable simplified reading views
- **Custom Themes**: Choose from soothing palettes, dark mode, or high-contrast settings
- **Break Timer**: Built-in Pomodoro timers with gentle reminders for healthy browsing habits

### ♿ **Accessibility Features**

- **Layout Simplifier**: Adjust fonts, spacing, and colors for optimal comfort and readability
- **Dyslexia-Friendly Fonts**: OpenDyslexic font support with customizable letter spacing
- **ADHD Support**: Reduced motion, simplified layouts, and distraction elimination
- **High Contrast Mode**: Enhanced visibility for users with visual impairments
- **Keyboard Navigation**: Full keyboard accessibility with customizable shortcuts

### 👥 **Personalization**

- **Personal Profiles**: Save your accessibility preferences and apply them across the web
- **Quick Toggle**: Instant on/off controls via popup or keyboard shortcuts
- **Adaptive Settings**: Automatically adjust based on your browsing patterns

---

## 🚀 Quick Start

### Installation

#### From Browser Store (Coming Soon)

- **Chrome**: [Install from Chrome Web Store](https://chrome.google.com/webstore) - _Submitting for review_
- **Firefox**: [Install from Firefox Add-ons](https://addons.mozilla.org) - _Submitting for review_

#### Stable Release Installation (v1.0.0)

For immediate use, install the stable v1.0.0 release:

1. **Download the latest release**

   ```bash
   wget https://github.com/yourusername/focusflow-extension/releases/download/v1.0.0/focusflow-v1.0.0.zip
   unzip focusflow-v1.0.0.zip
   ```

2. **Load in browser**
   - **Chrome**: Extensions → Developer mode → Load unpacked → Select `dist` folder
   - **Firefox**: Add-ons → Debug Add-ons → Load Temporary Add-on → Select `manifest.json`

#### Manual Installation (Development)

1. **Clone the repository**

   ```bash
   git clone https://github.com/focusflow/focusflow-extension.git
   cd focusflow-extension
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the extension**

   ```bash
   npm run build
   ```

4. **Load in browser**
   - **Chrome**: Go to `chrome://extensions/` → Enable "Developer mode" → Click "Load unpacked" → Select the `dist` folder
   - **Firefox**: Go to `about:debugging` → "This Firefox" → "Load Temporary Add-on" → Select `manifest.json` from `dist` folder

### First Use

1. **Click the FocusFlow icon** in your browser toolbar
2. **Toggle Focus Mode** to highlight main content and hide distractions
3. **Enable Distraction Blocker** to remove ads and popups
4. **Access Settings** to customize your experience
5. **Start a timer** for focused work sessions

---

## 🛠️ Development

### Prerequisites

- Node.js 16+ and npm
- Chrome or Firefox browser for testing

### Development Setup

```bash
# Clone and install
git clone https://github.com/focusflow/focusflow-extension.git
cd focusflow-extension
npm install

# Start development build with watch mode
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

### Project Structure

```
focusflow-extension/
├── public/
│   └── icons/              # Extension icons (16, 32, 48, 128px)
├── src/
│   ├── popup/              # React popup interface
│   │   ├── Popup.jsx       # Main popup component
│   │   ├── popup.html      # Popup HTML template
│   │   └── popup.css       # Popup styles
│   ├── content/            # Content script for DOM modification
│   │   └── contentScript.js
│   ├── background/         # Service worker for timers and coordination
│   │   └── background.js
│   ├── options/            # Settings page
│   │   ├── Options.jsx     # Settings interface
│   │   ├── options.html    # Settings HTML template
│   │   └── options.css     # Settings styles
│   ├── styles/             # Shared styles and themes
│   │   ├── themes.js       # Color palettes and theme system
│   │   └── content.css     # Injected page styles
│   ├── utils/              # Utilities and helpers
│   │   └── storage.js      # Storage management and profiles
│   └── manifest.json       # Extension manifest
├── package.json
├── webpack.config.js       # Build configuration
└── README.md
```

### Available Scripts

- `npm run dev` - Development build with file watching
- `npm run build` - Production build
- `npm run build:dev` - Development build (one-time)
- `npm run lint` - Code linting with ESLint
- `npm test` - Run test suite
- `npm run clean` - Clean build directory
- `npm run package` - Create distributable package

---

## 🎨 Customization

### Themes

FocusFlow includes several built-in themes optimized for different needs:

- **Default**: Clean, professional appearance
- **Dark**: Low-light friendly with dark colors
- **Calm**: Soothing blue palette for anxiety reduction
- **Warm**: Comfortable beige tones for extended reading
- **High Contrast**: Maximum visibility for visual accessibility

### Accessibility Profiles

Pre-configured profiles for specific needs:

- **ADHD Friendly**: Reduced motion, simplified layouts, distraction blocking
- **Dyslexia Friendly**: OpenDyslexic font, increased spacing, reading guides
- **Autism Friendly**: Consistent layouts, predictable interactions, sensory consideration
- **Low Vision**: High contrast, large fonts, clear focus indicators

### Keyboard Shortcuts

- `Ctrl+Shift+F` (Mac: `Cmd+Shift+F`) - Toggle Focus Mode
- `Ctrl+Shift+D` (Mac: `Cmd+Shift+D`) - Toggle Distraction Blocker
- `Ctrl+Shift+B` (Mac: `Cmd+Shift+B`) - Start/Stop Break Timer

---

## 🔧 Configuration

### Settings Overview

#### General Settings

- Enable/disable core features (Focus Mode, Distraction Blocker)
- Notification preferences
- Keyboard shortcut configuration

#### Accessibility Settings

- Font family selection (including dyslexia-friendly options)
- Font size and spacing adjustments
- Line height and letter spacing
- Motion reduction preferences
- High contrast mode

#### Focus & Timer Settings

- Pomodoro work duration (15-60 minutes)
- Short break duration (3-15 minutes)
- Long break duration (15-30 minutes)
- Break interval configuration

#### Layout Settings

- Maximum content width
- Image and video hiding options
- Page simplification level
- Animation control

### Profile Management

Create and save multiple profiles for different contexts:

- Work profile with strict distraction blocking
- Reading profile with dyslexia-friendly settings
- Casual browsing with minimal modifications

---

## 🤝 Contributing

We welcome contributions from the community! FocusFlow is built by and for the neurodiverse community.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test thoroughly
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Contribution Guidelines

- **Code Style**: Follow the existing code style and use ESLint
- **Testing**: Add tests for new features and ensure existing tests pass
- **Documentation**: Update documentation for any new features
- **Accessibility**: Ensure all changes maintain or improve accessibility
- **Performance**: Consider performance impact, especially for content scripts

### Areas for Contribution

- **Accessibility improvements** for specific neurodivergent needs
- **New theme development** for different visual preferences
- **Performance optimizations** for content script efficiency
- **Browser compatibility** testing and fixes
- **Internationalization** for non-English speakers
- **User experience research** and testing

---

## 📋 Roadmap

### Version 1.0 (Current)

- ✅ Core distraction blocking functionality
- ✅ Focus mode with content highlighting
- ✅ Basic theming system
- ✅ Pomodoro timer integration
- ✅ Accessibility profiles
- ✅ Settings and profile management

### Version 1.1 (Next)

- 📅 Advanced content analysis for better main content detection
- 📅 Reading progress tracking and statistics
- 📅 Website-specific settings and overrides
- 📅 Enhanced keyboard navigation
- 📅 Screen reader compatibility improvements

### Version 1.2 (Future)

- 📅 Team and organization management features
- 📅 Cloud sync for settings across devices
- 📅 Advanced timer modes (custom intervals, project tracking)
- 📅 Integration with productivity tools
- 📅 AI-powered content analysis

### Version 2.0 (Long-term)

- 📅 Mobile browser support
- 📅 Advanced analytics and insights
- 📅 Community features and shared profiles
- 📅 Professional edition for workplaces and schools

---

## 🐛 Support & Issues

### Getting Help

- **Documentation**: Check this README and the in-extension help
- **GitHub Issues**: [Report bugs or request features](https://github.com/focusflow/focusflow-extension/issues)
- **Discussions**: [Join community discussions](https://github.com/focusflow/focusflow-extension/discussions)

### Reporting Issues

When reporting issues, please include:

- Browser version and operating system
- Extension version
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots if applicable

### Privacy & Security

FocusFlow is designed with privacy in mind:

- **No data collection**: We don't collect personal browsing data
- **Local storage**: Settings are stored locally on your device
- **Open source**: Full transparency with publicly available code
- **Minimal permissions**: Only requests necessary browser permissions

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenDyslexic Font** - Special thanks to the OpenDyslexic project for their accessibility-focused font
- **Neurodiversity Community** - Inspiration and feedback from ADHD, autism, and dyslexia communities
- **Accessibility Experts** - Guidance from web accessibility professionals
- **Open Source Contributors** - All the developers who have contributed to making the web more accessible

---

## 📞 Contact

- **Project Website**: [focusflow.app](https://focusflow.app)
- **GitHub**: [github.com/focusflow/focusflow-extension](https://github.com/focusflow/focusflow-extension)
- **Email**: hello@focusflow.app

---

<div align="center">

**Made with ❤️ for the neurodiverse community**

_FocusFlow: Take control of your browsing experience_

</div>
