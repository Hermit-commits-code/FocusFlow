# Contributing to FocusFlow

Thank you for your interest in contributing to FocusFlow! This project is built by and for the neurodiverse community, and we welcome contributions from developers, designers, accessibility experts, and users of all backgrounds.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Guidelines](#development-guidelines)
- [Accessibility Requirements](#accessibility-requirements)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community](#community)

## Code of Conduct

FocusFlow is committed to providing a welcoming and inclusive environment for all contributors. We expect all participants to adhere to our values:

### Our Values

- **Respect and Inclusion**: We welcome contributors of all backgrounds, abilities, and perspectives
- **Neurodiversity Acceptance**: We celebrate neurological differences and design with diverse minds in mind
- **Accessibility First**: Every contribution should maintain or improve accessibility
- **Empathy and Understanding**: We assume good intentions and communicate with kindness
- **Collaborative Spirit**: We work together to build something greater than the sum of its parts

### Expected Behavior

- Use welcoming and inclusive language
- Respect differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy toward other community members

### Unacceptable Behavior

- Harassment, discrimination, or exclusionary behavior
- Ableist language or assumptions about capabilities
- Personal attacks or inflammatory comments
- Publishing private information without consent
- Other conduct inappropriate for a professional setting

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Git for version control
- Chrome or Firefox for testing
- Basic understanding of web development (HTML, CSS, JavaScript)
- Familiarity with React is helpful but not required

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/focusflow-extension.git
   cd focusflow-extension
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/focusflow/focusflow-extension.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Start development**:
   ```bash
   npm run dev
   ```

### First-Time Contributors

If this is your first time contributing to open source:

- Look for issues labeled `good first issue` or `help wanted`
- Start with documentation improvements or small bug fixes
- Don't hesitate to ask questions in discussions or issue comments
- Review our [development guidelines](#development-guidelines) before starting

## How to Contribute

### Reporting Issues

Before creating an issue, please check if a similar issue already exists. When reporting:

1. **Use a clear, descriptive title**
2. **Provide detailed steps to reproduce** the issue
3. **Include relevant information**:
   - Browser version and operating system
   - Extension version
   - Screenshot if applicable
   - Console errors if available
4. **Label appropriately** (bug, enhancement, accessibility, etc.)

### Suggesting Features

We welcome feature suggestions! Please:

1. **Search existing feature requests** to avoid duplicates
2. **Use the feature request template**
3. **Explain the use case** and how it helps neurodiverse users
4. **Consider accessibility implications**
5. **Be open to feedback** and alternative solutions

### Code Contributions

#### 1. Choose an Issue

- Browse [open issues](https://github.com/focusflow/focusflow-extension/issues)
- Comment on issues you'd like to work on
- Wait for maintainer assignment before starting work
- For new features, create an issue first for discussion

#### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b bugfix/issue-number-description
```

#### 3. Make Your Changes

- Follow our [development guidelines](#development-guidelines)
- Write clean, readable, well-commented code
- Test your changes thoroughly
- Update documentation as needed

#### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new accessibility feature

- Implements high contrast mode for better visibility
- Includes keyboard navigation improvements
- Adds ARIA labels for screen readers

Fixes #123"
```

Use conventional commit format:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

#### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Create a pull request with:

- Clear title and description
- Reference related issues
- Explain what changed and why
- Include screenshots for UI changes
- Request review from maintainers

## Development Guidelines

### Code Style

- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Code formatting is handled automatically
- **Naming**: Use descriptive names for variables, functions, and components
- **Comments**: Write clear comments for complex logic
- **File Organization**: Keep files focused and well-organized

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types when applicable
- Follow React best practices for accessibility

### Browser Extension Development

- **Manifest V3**: Use modern extension APIs
- **Permissions**: Request only necessary permissions
- **Performance**: Minimize content script impact
- **Security**: Follow security best practices
- **Cross-browser**: Ensure compatibility with Chrome, Firefox, and Edge

### CSS and Styling

- **Accessibility**: Ensure sufficient color contrast
- **Responsive**: Design works on different screen sizes
- **Motion**: Respect `prefers-reduced-motion`
- **Theming**: Use CSS custom properties for consistency
- **Performance**: Optimize for fast rendering

## Accessibility Requirements

Every contribution must maintain or improve accessibility:

### WCAG Compliance

- **Level AA**: All features must meet WCAG 2.1 AA standards
- **Keyboard Navigation**: All functionality accessible via keyboard
- **Screen Readers**: Proper ARIA labels and semantic markup
- **Focus Management**: Clear, visible focus indicators
- **Color Contrast**: Minimum 4.5:1 ratio for normal text

### Neurodiverse Considerations

- **Cognitive Load**: Minimize mental effort required
- **Consistency**: Maintain predictable interactions
- **Flexibility**: Provide multiple ways to accomplish tasks
- **Customization**: Allow users to adapt the interface
- **Error Prevention**: Design to prevent user errors

### Testing Accessibility

- **Manual Testing**: Test with keyboard only
- **Screen Reader**: Test with NVDA, JAWS, or VoiceOver
- **Color Blindness**: Verify design works for color-blind users
- **Motor Impairments**: Ensure large click targets
- **Cognitive Testing**: Test with neurodiverse community members

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Requirements

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions
- **Accessibility Tests**: Automated accessibility testing
- **Cross-browser**: Test on Chrome, Firefox, and Edge
- **Manual Testing**: Real-world usage scenarios

### Writing Tests

- Use descriptive test names
- Test both happy path and error cases
- Include accessibility tests for UI components
- Mock external dependencies appropriately
- Aim for high test coverage on critical paths

## Documentation

### Code Documentation

- **JSDoc**: Document complex functions and classes
- **README**: Keep README up-to-date with changes
- **Inline Comments**: Explain complex logic and accessibility features
- **API Documentation**: Document public interfaces

### User Documentation

- **Help Text**: Clear, concise help within the extension
- **Accessibility Notes**: Document accessibility features
- **Screenshots**: Include alt text for images
- **Video Guides**: Provide captions and transcripts

## Community

### Communication Channels

- **GitHub Discussions**: General questions and community chat
- **Issues**: Bug reports and feature requests
- **Pull Requests**: Code review and collaboration
- **Email**: hello@focusflow.app for private matters

### Getting Help

- **Documentation**: Check README and inline documentation first
- **Discussions**: Ask questions in GitHub Discussions
- **Issues**: Create an issue for bugs or unclear documentation
- **Mentorship**: We're happy to help new contributors learn

### Community Events

- **Monthly Calls**: Community planning and feedback sessions
- **Accessibility Reviews**: Collaborative accessibility testing
- **Hackathons**: Participate in accessibility-focused hackathons
- **Conferences**: Present FocusFlow at accessibility and neurodiversity conferences

### Recognition

We appreciate all contributions and will:

- Add contributors to our README
- Highlight significant contributions in release notes
- Provide letters of recommendation for significant contributors
- Invite regular contributors to join the core team

## Questions?

Don't hesitate to reach out if you have questions:

- **General Questions**: GitHub Discussions
- **Technical Issues**: GitHub Issues
- **Private Matters**: hello@focusflow.app
- **Accessibility Concerns**: accessibility@focusflow.app

Thank you for helping make the web more accessible and neurodiverse-friendly! 🧠✨
