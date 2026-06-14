# Contributing to React Music Player

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## 🌟 Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Fix issues
- ✨ Add new features
- 🎨 Improve UI/UX
- ♿ Enhance accessibility
- 🧪 Write tests

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/react-music-player.git
   cd react-music-player
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a new branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 💻 Development Workflow

### Running the Project

```bash
npm start          # Start development server on localhost:3000
npm run build      # Create production build
npm run eslint     # Run linting (when configured)
```

### Code Style Guidelines

- Use **2 spaces** for indentation
- Use **single quotes** for strings
- Add **semicolons** at the end of statements
- Write **descriptive variable names**
- Add **comments** for complex logic
- Keep functions **small and focused**

### File Naming Conventions

- Components: `PascalCase.js` (e.g., `PlayerPage.js`)
- Utilities: `camelCase.js` (e.g., `formatTime.js`)
- Styles: Match component name (e.g., `player.less`)

## 🎯 Priority Contribution Areas

### High Priority

1. **Modernize React Code**

   - Convert `React.createClass` to functional components
   - Replace lifecycle methods with hooks
   - Add PropTypes or TypeScript

2. **Remove jQuery Dependency**

   - Replace jPlayer with Web Audio API
   - Use React refs instead of jQuery selectors

3. **Add Testing**

   - Set up Jest + React Testing Library
   - Write unit tests for components
   - Add integration tests

4. **Improve Accessibility**
   - Add ARIA labels
   - Implement keyboard navigation
   - Ensure screen reader compatibility

### Medium Priority

5. **Upgrade Dependencies**

   - Update React to v18
   - Update React Router to v6
   - Update Webpack to v5

6. **Add New Features**
   - Playlist creation/editing
   - Search functionality
   - Volume persistence
   - Keyboard shortcuts
   - Dark mode

## 📋 Pull Request Process

1. **Update your branch** with the latest main:

   ```bash
   git checkout main
   git pull origin main
   git checkout your-branch
   git rebase main
   ```

2. **Test your changes** thoroughly:

   - Run the app and verify functionality
   - Check for console errors
   - Test on different browsers (if UI changes)

3. **Commit your changes** with clear messages:

   ```bash
   git add .
   git commit -m "feat: add playlist search functionality"
   ```

   Use conventional commit prefixes:

   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting)
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

4. **Push to your fork**:

   ```bash
   git push origin your-branch
   ```

5. **Create a Pull Request** on GitHub:
   - Provide a clear title and description
   - Reference any related issues
   - Include screenshots for UI changes
   - List any breaking changes

## 🐛 Reporting Bugs

When reporting bugs, please include:

- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed steps to recreate the bug
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: Browser, OS, Node version
- **Screenshots**: If applicable

## 💡 Suggesting Features

When suggesting features, please include:

- **Use Case**: Why is this feature needed?
- **Proposed Solution**: How should it work?
- **Alternatives**: Other approaches considered
- **Additional Context**: Any relevant information

## 📚 Resources

- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Webpack Documentation](https://webpack.js.org/)
- [Web Audio API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

## ❓ Questions?

If you have questions, feel free to:

- Open an issue with the "question" label
- Check existing issues and discussions
- Review the project documentation

## 🎉 Recognition

Contributors will be recognized in the project README. Thank you for helping improve this project!

---

**Happy Contributing! 🎵**
