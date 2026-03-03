/**
 * Code Placeholder Editor - Content Script
 * 
 * Architecture:
 * - Scans for <pre><code> blocks on page load and dynamically
 * - Detects placeholders matching <value> or {value} patterns
 * - Replaces placeholders with contenteditable spans
 * - Adds copy button to reconstruct and copy final command
 * - Uses MutationObserver for dynamic content (React/Next.js sites)
 * - Ensures idempotency with data attributes to prevent reprocessing
 */

(function() {
  'use strict';

  // Regex to match placeholders: <value> or {value}
  // Captures the delimiter and the content inside
  const PLACEHOLDER_REGEX = /(<)([^<>]+)(>)|(\{)([^{}]+)(\})/g;

  // Data attribute to mark processed code blocks
  const PROCESSED_ATTR = 'data-placeholder-processed';

  /**
   * Main function to process a code block
   * @param {HTMLElement} codeBlock - The <code> element to process
   */
  function processCodeBlock(codeBlock) {
    // Skip if already processed
    if (codeBlock.hasAttribute(PROCESSED_ATTR)) {
      return;
    }

    // Get both innerHTML and textContent to handle HTML entities and tags
    const originalHTML = codeBlock.innerHTML;
    const originalText = codeBlock.textContent;

    // Check if there are any placeholders in the text content
    const hasPlaceholders = PLACEHOLDER_REGEX.test(originalText);
    PLACEHOLDER_REGEX.lastIndex = 0; // Reset regex state

    if (!hasPlaceholders) {
      return;
    }

    // Mark as processed to ensure idempotency
    codeBlock.setAttribute(PROCESSED_ATTR, 'true');

    // Store original text for reconstruction
    codeBlock.dataset.originalText = originalText;

    // Replace text content with HTML containing editable spans
    // Use innerHTML to preserve any existing HTML structure
    const newHTML = replacePlaceholdersWithSpans(originalText);
    codeBlock.innerHTML = newHTML;

    // Add copy button to the parent <pre> element
    const preElement = codeBlock.closest('pre');
    if (preElement && !preElement.querySelector('.cpe-copy-button')) {
      addCopyButton(preElement, codeBlock);
    }
  }

  /**
   * Replace placeholder patterns with contenteditable spans
   * @param {string} text - Original text content
   * @returns {string} HTML string with spans
   */
  function replacePlaceholdersWithSpans(text) {
    let lastIndex = 0;
    let result = '';
    let match;

    PLACEHOLDER_REGEX.lastIndex = 0;

    while ((match = PLACEHOLDER_REGEX.exec(text)) !== null) {
      // Add text before the match
      result += escapeHtml(text.slice(lastIndex, match.index));

      // Determine which group matched (angle brackets or curly braces)
      let openDelim, content, closeDelim;
      
      if (match[1]) {
        // Angle bracket match: <value>
        openDelim = match[1];
        content = match[2];
        closeDelim = match[3];
      } else {
        // Curly brace match: {value}
        openDelim = match[4];
        content = match[5];
        closeDelim = match[6];
      }

      // Create editable span without any delimiters
      result += `<span class="cpe-placeholder" contenteditable="true" spellcheck="false">${escapeHtml(content)}</span>`;

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    result += escapeHtml(text.slice(lastIndex));

    return result;
  }

  /**
   * Escape HTML special characters
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Add copy button to the code block
   * @param {HTMLElement} preElement - The <pre> container
   * @param {HTMLElement} codeBlock - The <code> element
   */
  function addCopyButton(preElement, codeBlock) {
    const button = document.createElement('button');
    button.className = 'cpe-copy-button';
    button.textContent = 'Copy Final Command';
    button.setAttribute('aria-label', 'Copy final command to clipboard');

    button.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const finalText = reconstructFinalText(codeBlock);

      try {
        await navigator.clipboard.writeText(finalText);
        
        // Visual feedback
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('cpe-copied');
        
        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove('cpe-copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text:', err);
        button.textContent = 'Copy Failed';
        setTimeout(() => {
          button.textContent = 'Copy Final Command';
        }, 2000);
      }
    });

    // Position button relative to pre element
    preElement.style.position = 'relative';
    preElement.appendChild(button);
  }

  /**
   * Reconstruct the final text with user-edited values
   * @param {HTMLElement} codeBlock - The <code> element
   * @returns {string} Final text with edited values
   */
  function reconstructFinalText(codeBlock) {
    const originalText = codeBlock.dataset.originalText;
    let result = '';
    let lastIndex = 0;

    // Get all placeholder spans (editable parts only)
    const placeholderSpans = codeBlock.querySelectorAll('.cpe-placeholder');
    let spanIndex = 0;

    PLACEHOLDER_REGEX.lastIndex = 0;
    let match;

    while ((match = PLACEHOLDER_REGEX.exec(originalText)) !== null) {
      // Add text before the match
      result += originalText.slice(lastIndex, match.index);

      // Get the edited value from the corresponding span
      if (spanIndex < placeholderSpans.length) {
        const editedValue = placeholderSpans[spanIndex].textContent;
        
        // Use edited value WITHOUT delimiters
        result += editedValue;
        spanIndex++;
      } else {
        // Fallback: use original match without delimiters
        const content = match[2] || match[5];
        result += content;
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    result += originalText.slice(lastIndex);

    return result;
  }

  /**
   * Scan and process all code blocks in the document
   */
  function scanAndProcessCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(processCodeBlock);
  }

  /**
   * Initialize MutationObserver to handle dynamically loaded content
   */
  function initMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      let shouldScan = false;

      for (const mutation of mutations) {
        // Check if new nodes were added
        if (mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            // Check if the added node is or contains a code block
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.matches('pre code') || node.querySelector('pre code')) {
                shouldScan = true;
                break;
              }
            }
          }
        }
        if (shouldScan) break;
      }

      if (shouldScan) {
        scanAndProcessCodeBlocks();
      }
    });

    // Observe the entire document for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Initialize the extension
   */
  function init() {
    // Process existing code blocks
    scanAndProcessCodeBlocks();

    // Set up observer for dynamic content
    initMutationObserver();
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

// Made with Bob
