# Architecture Overview

## Project Structure

```
fillr/
├── src/                    # Extension source files (production code)
│   ├── manifest.json       # Extension configuration (Manifest v3)
│   ├── content.js          # Core logic for placeholder detection
│   ├── styles.css          # Visual styling for placeholders
│   ├── icon16.png          # Extension icon (16x16)
│   ├── icon48.png          # Extension icon (48x48)
│   └── icon128.png         # Extension icon (128x128)
├── docs/                   # Landing page (GitHub Pages)
│   └── index.html          # Project website with animated demo
├── .github/
│   └── workflows/
│       └── release.yml     # Automated release workflow
├── test.html               # Local testing page
├── generate-icons.html     # Icon generator utility
├── INSTALLATION.md         # Detailed installation guide
├── ARCHITECTURE.md         # This file
└── README.md               # Project documentation
```

## Extension Architecture

### Manifest v3 Configuration

The extension uses Chrome's Manifest v3 format with minimal permissions:

- **Permissions**: Only `clipboardWrite` for copying edited commands
- **Content Scripts**: Injected into all URLs (`<all_urls>`)
- **Run At**: `document_idle` for optimal performance
- **No Background Script**: Reduces complexity and attack surface

### Core Components

#### 1. Content Script (`content.js`)

**Purpose**: Main logic for detecting and transforming placeholders

**Key Functions**:
- `processCodeBlock(codeBlock)` - Processes a single code block
- `replacePlaceholdersWithSpans(text)` - Converts placeholders to editable spans
- `addCopyButton(preElement, codeBlock)` - Adds copy functionality
- `reconstructFinalText(codeBlock)` - Rebuilds command with edited values
- `scanAndProcessCodeBlocks()` - Scans entire document
- `initMutationObserver()` - Handles dynamic content

**Placeholder Detection**:
```javascript
const PLACEHOLDER_REGEX = /(<)([^<>]+)(>)|(\{)([^{}]+)(\})/g;
```
Matches:
- `<value>` - Angle bracket placeholders
- `{value}` - Curly brace placeholders

**Idempotency**:
- Uses `data-placeholder-processed` attribute
- Prevents reprocessing of same code blocks
- Essential for dynamic content sites (React, Next.js)

**MutationObserver**:
- Watches for DOM changes
- Processes new code blocks as they appear
- Efficient: only scans when relevant nodes are added

#### 2. Styles (`styles.css`)

**Purpose**: Visual styling for editable placeholders and UI elements

**Key Styles**:
- `.cpe-placeholder` - Editable placeholder styling
- `.cpe-copy-button` - Copy button appearance
- `.cpe-copied` - Success state styling

**Design Principles**:
- Non-intrusive: preserves existing page styles
- Accessible: keyboard navigation support
- Responsive: works on all screen sizes

#### 3. Manifest (`manifest.json`)

**Purpose**: Extension configuration and metadata

**Key Settings**:
```json
{
  "manifest_version": 3,
  "permissions": ["clipboardWrite"],
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"],
    "css": ["styles.css"],
    "run_at": "document_idle"
  }]
}
```

## Data Flow

```
1. Page Load
   ↓
2. Content Script Injection (document_idle)
   ↓
3. Scan for <pre><code> blocks
   ↓
4. Detect placeholders via regex
   ↓
5. Replace with contenteditable spans
   ↓
6. Add copy button
   ↓
7. MutationObserver watches for new content
   ↓
8. User edits placeholder
   ↓
9. User clicks copy button
   ↓
10. Reconstruct final text
    ↓
11. Copy to clipboard via Clipboard API
```

## Technical Decisions

### Why Content Script Only?

- **Simplicity**: No background script needed
- **Security**: Reduced attack surface
- **Performance**: Lower memory footprint
- **Permissions**: Minimal permission requirements

### Why MutationObserver?

- **Dynamic Content**: Handles React, Next.js, Vue, etc.
- **Efficiency**: Only processes when DOM changes
- **Reliability**: Catches all new code blocks

### Why Contenteditable Spans?

- **Native**: No custom input fields needed
- **Styling**: Preserves syntax highlighting
- **Accessibility**: Built-in keyboard support
- **Simple**: Minimal JavaScript required

### Why Regex for Detection?

- **Fast**: Native browser implementation
- **Flexible**: Matches multiple patterns
- **Reliable**: Well-tested pattern
- **Simple**: No parsing library needed

## Browser Compatibility

- ✅ Chrome (Manifest v3)
- ✅ Edge (Chromium-based)
- ✅ Brave
- ✅ Other Chromium browsers

**Not Compatible**:
- ❌ Firefox (uses different manifest format)
- ❌ Safari (different extension system)

## Performance Considerations

### Optimization Strategies

1. **Idempotency**: Never process same block twice
2. **Lazy Processing**: Only scan when needed
3. **Efficient Selectors**: Use specific CSS selectors
4. **Minimal DOM Manipulation**: Batch updates when possible
5. **Event Delegation**: Single listener for all placeholders

### Memory Management

- No global state stored
- Event listeners cleaned up automatically
- MutationObserver uses weak references
- No memory leaks in long-running sessions

## Security

### Privacy

- **No Analytics**: Zero tracking or data collection
- **No Remote Calls**: Everything runs locally
- **No Data Storage**: No localStorage or cookies
- **No Network Access**: No host permissions needed

### Content Security Policy

- Works with strict CSP policies
- No inline scripts in injected content
- No eval() or Function() usage
- Safe DOM manipulation only

## Testing Strategy

### Manual Testing

1. **Static Sites**: Test on documentation sites
2. **Dynamic Sites**: Test on React/Next.js apps
3. **Edge Cases**: Empty blocks, nested code, special chars
4. **Performance**: Large pages with many code blocks

### Test Page (`test.html`)

- Includes various placeholder patterns
- Tests different code block structures
- Validates copy functionality
- Checks visual styling

## Release Process

### Automated via GitHub Actions

1. **Trigger**: Push tag (e.g., `v1.0.0`)
2. **Build**: Create ZIP from `src/` directory
3. **Release**: Create GitHub Release with notes
4. **Artifact**: Upload ZIP for download

### Manual Release Steps

```bash
# 1. Update version in manifest.json
# 2. Commit changes
git add src/manifest.json
git commit -m "Bump version to 1.0.0"

# 3. Create and push tag
git tag v1.0.0
git push origin v1.0.0

# 4. GitHub Actions handles the rest
```

## Future Considerations

### Potential Enhancements

- Custom placeholder patterns (user-configurable)
- Placeholder history/suggestions
- Export/import placeholder values
- Chrome Web Store publication
- Firefox port (Manifest v2/v3)

### Limitations

- Only processes `<pre><code>` blocks
- Requires specific placeholder patterns
- No persistent storage of values
- Manual installation required (not on Web Store)

## Contributing

When contributing, maintain:

1. **Minimal Philosophy**: Keep it simple and focused
2. **No Dependencies**: Pure JavaScript only
3. **Performance**: Optimize for speed
4. **Privacy**: No tracking or data collection
5. **Accessibility**: Support keyboard navigation
6. **Documentation**: Comment complex logic

## Resources

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Manifest v3 Migration](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Content Scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)
- [MutationObserver API](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)