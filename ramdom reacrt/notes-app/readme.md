# 📝 Notes Taking App

A beautiful, modern notes taking application with rich text formatting and tag organization.

## ✨ Features

- **Create & Edit Notes**: Easy note creation and editing interface
- **Rich Text Formatting**: Support for bold, italic, and bullet lists
- **Tag Organization**: Organize notes with multiple tags
- **Quick Search**: Search through titles and content
- **Tag Filtering**: Filter notes by tags
- **Clean UI**: Modern, responsive design
- **No Dependencies**: Uses CDN for React, no npm install needed

## 📁 Project Structure

```
notes-app/
├── index.html       # Main HTML file
├── index.css        # All styles
├── project.js       # React application code
├── assets/          # Empty (no assets needed)
├── .gitignore       # Git ignore rules
└── README.md        # This file
```

## 🚀 Getting Started

### Option 1: Direct Open
Simply open `index.html` in your web browser. No server needed!

### Option 2: Local Server (Recommended)
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000`

## 💡 Usage

### Creating Notes
1. Click the "New Note" button in the sidebar
2. Enter a title and content
3. Add tags (comma-separated) for organization
4. Click "Save" to save your note

### Formatting Text
- **Bold**: Wrap text with `**text**`
- *Italic*: Wrap text with `*text*`
- Lists: Start line with `•`

Use the formatting toolbar while editing to apply these styles.

### Organizing with Tags
- Add tags when creating/editing notes
- Click tag filters in the sidebar to view notes by tag
- Click "All" to see all notes

### Searching Notes
Use the search box to find notes by title or content.

## 📊 File Sizes

- `index.html`: ~1 KB
- `index.css`: ~5 KB
- `project.js`: ~8 KB
- **Total**: ~14 KB (well under 15 MB limit)

## 🔧 Technical Details

- **Framework**: React 18.2.0 (via CDN)
- **No Build Process**: Pure HTML/CSS/JS
- **No npm Dependencies**: All libraries loaded from CDN
- **Storage**: In-memory (session-based)
- **Browser Support**: All modern browsers

## 🎨 Customization

### Colors
Main colors are defined in CSS variables. Edit `index.css` to customize:
- Primary: `#3b82f6` (blue)
- Success: `#10b981` (green)
- Danger: `#ef4444` (red)

### Layout
Adjust sidebar width in `.sidebar` class (default: 320px)

## 📝 Notes Storage

Currently, notes are stored in React state (memory). Data persists during the session but will be lost on page refresh. 

To add persistence, you can:
- Implement backend API
- Use browser storage alternatives
- Export/import functionality

## 🤝 Contributing

1. Follow the file structure
2. Keep total size under 15 MB
3. Test in multiple browsers
4. Maintain clean, readable code

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🐛 Known Issues

- No data persistence (session-only)
- Rich text rendering is basic (markdown-style)

## 🔮 Future Enhancements

- [ ] Export notes as JSON/PDF
- [ ] Dark mode toggle
- [ ] Note categories/folders
- [ ] Keyboard shortcuts
- [ ] Note sharing
- [ ] Markdown preview mode

---

**Made with ❤️ using React**
```

---

## 📊 **Size Compliance Report**

### File Breakdown:
```
index.html:     ~1 KB
index.css:      ~5 KB
project.js:     ~8 KB
.gitignore:     ~0.3 KB
README.md:      ~3 KB
--------------------------
TOTAL:          ~17.3 KB
```

✅ **Well under the 15 MB limit per project!**

### Optimization Features:
- ✅ No external dependencies (all via CDN)
- ✅ No `node_modules` folder
- ✅ No binary assets
- ✅ No images (SVG icons inline)
- ✅ Minified production React from CDN
- ✅ Single-file architecture
- ✅ No build process needed

### CDN Usage:
All libraries are loaded from CDN, keeping the repo lightweight:
- React 18.2.0
- ReactDOM 18.2.0
- Babel Standalone 7.23.5

This ensures the project stays minimal and fast!