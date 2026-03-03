# Code Placeholder Editor

A minimal, production-ready Chrome Extension (Manifest v3) that detects placeholders in code blocks and makes them editable inline.

## Features

- 🎯 **Automatic Detection**: Finds placeholders like `<value>` or `{value}` in `<pre><code>` blocks
- ✏️ **Inline Editing**: Replace placeholders with editable fields directly on the page
- 📋 **Smart Copy**: Reconstructs the final command with your edited values
- ⚡ **Dynamic Content**: Works with React, Next.js, and other dynamically rendered sites
- 🎨 **Non-Intrusive**: Preserves existing syntax highlighting and page styling
- 🔒 **Privacy First**: No analytics, no remote calls, runs entirely locally
- 🚀 **Performant**: Uses MutationObserver for efficient dynamic content handling

## Installation

### From Source

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked"
5. Select the extension directory

### File Structure

```
chrome-ext/
├── manifest.json       # Extension configuration (Manifest v3)
├── content.js          # Core logic for placeholder detection and replacement
├── styles.css          # Visual styling for editable placeholders and copy button
└── README.md           # This file
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

## Contributing

This is a minimal, focused tool. If you find bugs or have suggestions:
1. Check existing issues
2. Create a detailed bug report or feature request
3. Keep changes aligned with the "minimal and elegant" philosophy

## License

MIT License - Feel free to use, modify, and distribute.

## Credits

Built for developers who read documentation and want a better way to work with example commands.