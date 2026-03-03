# Installation Guide

## Quick Start

### Step 1: Generate Icons

1. Open `generate-icons.html` in your browser
2. Right-click each canvas and select "Save image as..."
3. Save the images as:
   - `icon16.png` (16x16 canvas)
   - `icon48.png` (48x48 canvas)
   - `icon128.png` (128x128 canvas)
4. Place all three icon files in the extension root directory

### Step 2: Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `chrome-ext` directory
5. The extension should now appear in your extensions list

### Step 3: Test the Extension

1. Open `test.html` in your browser (File → Open File)
2. You should see:
   - Yellow-highlighted editable placeholders in code blocks
   - "Copy Final Command" buttons on code blocks with placeholders
3. Try editing a placeholder and clicking the copy button

## Verification Checklist

✅ Extension appears in `chrome://extensions/`  
✅ No errors in the extension details  
✅ Placeholders are highlighted on test.html  
✅ Placeholders are editable when clicked  
✅ Copy button appears on code blocks with placeholders  
✅ Copy button successfully copies edited command  
✅ "Copied!" feedback appears after clicking copy  

## Testing on Real Sites

Try the extension on documentation sites:

- **Docker Docs**: https://docs.docker.com/
- **Kubernetes Docs**: https://kubernetes.io/docs/
- **AWS CLI Docs**: https://docs.aws.amazon.com/cli/
- **Git Documentation**: https://git-scm.com/docs

## Troubleshooting

### Icons Not Showing

**Problem**: Extension loads but shows default icon  
**Solution**: Make sure icon files are named exactly `icon16.png`, `icon48.png`, `icon128.png`

### Extension Won't Load

**Problem**: "Manifest file is missing or unreadable"  
**Solution**: Ensure `manifest.json` is in the root directory and properly formatted

### Placeholders Not Detected

**Problem**: Code blocks don't show editable placeholders  
**Solution**: 
- Verify placeholders match the pattern: `<value>` or `{value}`
- Check that code is inside `<pre><code>` tags
- Open browser console (F12) and check for errors

### Copy Button Not Working

**Problem**: Button appears but doesn't copy  
**Solution**:
- Ensure the site allows clipboard access
- Check browser console for permission errors
- Try on a different site (some sites have strict CSP)

### Dynamic Content Not Working

**Problem**: Placeholders don't appear on dynamically loaded content  
**Solution**:
- Refresh the page after loading the extension
- Check if the site uses shadow DOM (not currently supported)

## Permissions Explained

The extension requests minimal permissions:

- **`clipboardWrite`**: Required to copy the final command to clipboard
- **`<all_urls>`**: Required to run on any webpage (content script only)

## Uninstalling

1. Go to `chrome://extensions/`
2. Find "Code Placeholder Editor"
3. Click **Remove**
4. Confirm removal

## Development Mode

To modify the extension:

1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the **Reload** button (circular arrow) on the extension card
4. Refresh any open tabs to see changes

## Building for Distribution

To package the extension for sharing:

```bash
# Create a zip file (exclude development files)
zip -r code-placeholder-editor.zip . \
  -x "*.git*" \
  -x "test.html" \
  -x "generate-icons.html" \
  -x "INSTALLATION.md" \
  -x ".DS_Store"
```

## Browser Compatibility

- ✅ **Chrome**: Fully supported (Manifest v3)
- ✅ **Edge**: Fully supported (Chromium-based)
- ✅ **Brave**: Fully supported
- ✅ **Opera**: Should work (Chromium-based)
- ❌ **Firefox**: Not compatible (requires Manifest v2 port)
- ❌ **Safari**: Not compatible (different extension format)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the browser console for errors
3. Test on the included `test.html` file first
4. Verify the extension is enabled in `chrome://extensions/`

## Next Steps

After successful installation:
1. Visit your favorite documentation sites
2. Look for code examples with placeholders
3. Edit the placeholders inline
4. Copy the final commands with one click
5. Enjoy faster workflow! 🚀