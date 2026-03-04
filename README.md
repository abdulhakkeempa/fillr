# Fillr

A minimal, production-ready Chrome Extension (Manifest v3) that detects placeholders in code blocks and makes them editable inline.

[![GitHub release](https://img.shields.io/github/v/release/abdulhakkeempa/fillr)](https://github.com/abdulhakkeempa/fillr/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎯 **Automatic Detection**: Finds placeholders like `<value>` or `{value}` in `<pre><code>` blocks
- ✏️ **Inline Editing**: Replace placeholders with editable fields directly on the page
- 📋 **Smart Copy**: Reconstructs the final command with your edited values
- ⚡ **Dynamic Content**: Works with React, Next.js, and other dynamically rendered sites
- 🎨 **Non-Intrusive**: Preserves existing syntax highlighting and page styling
- 🔒 **Privacy First**: No analytics, no remote calls, runs entirely locally
- 🚀 **Performant**: Uses MutationObserver for efficient dynamic content handling

## Installation

### From GitHub Releases (Recommended)

1. Go to [Releases](https://github.com/abdulhakkeempa/fillr/releases)
2. Download the latest `fillr-vX.X.X.zip`
3. Extract the ZIP file
4. Open Chrome and navigate to `chrome://extensions/`
5. Enable "Developer mode" (toggle in top-right corner)
6. Click "Load unpacked"
7. Select the extracted `src` folder

### From Source

1. Clone this repository:
   ```bash
   git clone https://github.com/abdulhakkeempa/fillr.git
   cd fillr
   ```
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked"
5. Select the `src` directory

### Repository Structure

```
fillr/
├── src/                    # Extension source files
│   ├── manifest.json       # Extension configuration (Manifest v3)
│   ├── content.js          # Core logic for placeholder detection
│   ├── styles.css          # Visual styling for placeholders
│   ├── icon16.png          # Extension icon (16x16)
│   ├── icon48.png          # Extension icon (48x48)
│   └── icon128.png         # Extension icon (128x128)
├── docs/                   # Landing page (GitHub Pages)
│   └── index.html          # Project website
├── .github/
│   └── workflows/
│       └── release.yml     # Automated release workflow
├── test.html               # Local testing page
├── generate-icons.html     # Icon generator utility
├── INSTALLATION.md         # Detailed installation guide
├── ARCHITECTURE.md         # Technical architecture docs
└── README.md               # This file
```

## Usage

1. **Visit any webpage** with code blocks (documentation, tutorials, etc.)
2. **Placeholders are automatically detected** in patterns like:
   - `<your-value>`
   - `{your-value}`
3. **Click on highlighted placeholders** to edit them inline
4. **Click "Copy Final Command"** button to copy the complete command with your values

### Example

Original code block:
```bash
docker run -p <port>:8080 -e API_KEY={your-api-key} myapp
```

After editing:
- `<port>` → `3000`
- `{your-api-key}` → `abc123xyz`

Copied result:
```bash
docker run -p 3000:8080 -e API_KEY=abc123xyz myapp
```

## Technical Details

### Architecture

- **Manifest v3**: Uses modern Chrome Extension standards
- **Content Script Only**: No background script needed
- **Minimal Permissions**: Only requests `clipboardWrite`
- **Idempotent Processing**: Never processes the same block twice
- **MutationObserver**: Handles dynamically loaded content efficiently

### Placeholder Detection

The extension uses a regex pattern to detect:
- Angle bracket placeholders: `<value>`
- Curly brace placeholders: `{value}`

### How It Works

1. **Scan**: Finds all `<pre><code>` blocks on the page
2. **Detect**: Uses regex to identify placeholder patterns
3. **Replace**: Converts placeholders to `contenteditable` spans
4. **Store**: Keeps original text for reconstruction
5. **Copy**: Merges edited values back into original template

### Browser Compatibility

- ✅ Chrome (Manifest v3)
- ✅ Edge (Chromium-based)
- ✅ Brave
- ✅ Other Chromium-based browsers

## Development

### Key Files

**manifest.json**
- Defines extension metadata and permissions
- Configures content script injection
- Uses Manifest v3 format

**content.js**
- Main logic for placeholder detection
- DOM manipulation for editable spans
- Clipboard API integration
- MutationObserver for dynamic content

**styles.css**
- Visual styling for placeholders
- Copy button positioning and appearance
- Dark mode support
- Accessibility features

### Code Quality

- ✅ Clean, readable code with inline comments
- ✅ No external dependencies
- ✅ Follows Chrome Extension best practices
- ✅ Handles edge cases (dynamic content, existing copy buttons)
- ✅ Accessible (keyboard navigation, ARIA labels)

## Privacy & Security

- 🔒 **No data collection**: Zero analytics or tracking
- 🔒 **No remote calls**: Everything runs locally in your browser
- 🔒 **Minimal permissions**: Only clipboard write access
- 🔒 **No background script**: Reduces attack surface
- 🔒 **Open source**: Full transparency

## Limitations

- Only processes `<pre><code>` blocks
- Placeholder patterns must match `<value>` or `{value}` format
- Does not modify the original page DOM permanently
- Copy button may overlap with existing site copy buttons (rare)

## Troubleshooting

**Placeholders not detected?**
- Ensure they match the pattern: `<value>` or `{value}`
- Check that they're inside `<pre><code>` blocks

**Copy button not appearing?**
- Verify the code block contains valid placeholders
- Check browser console for errors

**Not working on a specific site?**
- Some sites may have Content Security Policies that interfere
- Try refreshing the page after the extension loads

## Releases

This project uses automated releases via GitHub Actions. When a new version tag is pushed:

1. **Create a new tag:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **GitHub Actions automatically:**
   - Creates a ZIP package from the `src` directory
   - Generates release notes
   - Creates a GitHub Release
   - Attaches the ZIP file for download

3. **Users can download** the ZIP from the [Releases page](https://github.com/abdulhakkeempa/fillr/releases)

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality (backwards compatible)
- **PATCH** version for bug fixes (backwards compatible)

## Contributing

This is a minimal, focused tool. If you find bugs or have suggestions:
1. Check existing issues
2. Create a detailed bug report or feature request
3. Keep changes aligned with the "minimal and elegant" philosophy

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make changes in the `src` directory
4. Test locally using `test.html`
5. Commit changes: `git commit -am 'Add new feature'`
6. Push to your fork: `git push origin feature/my-feature`
7. Create a Pull Request

## License

MIT License - Feel free to use, modify, and distribute.

## Credits

Built for developers who read documentation and want a better way to work with example commands.
