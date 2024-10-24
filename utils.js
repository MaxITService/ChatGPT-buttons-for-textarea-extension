// utils.js
// Version: 1.0
// Instructions for AI: do not remove comments! MUST NOT REMOVE COMMENTS.

'use strict';

window.MaxExtensionUtils = {
    // Utility function to wait for an element to be present in the DOM
    waitForElement: function(selector, callback, maxAttempts = 50, interval = 100) {
        let attempts = 0;
        const observer = new MutationObserver((mutations, obs) => {
            const element = document.querySelector(selector);
            if (element) {
                obs.disconnect();
                callback(element);
            } else if (++attempts >= maxAttempts) {
                obs.disconnect();
                console.error(`[Chatgpt-Buttons] Element ${selector} not found after ${maxAttempts} attempts.`);
            }
        });
        observer.observe(document, { childList: true, subtree: true });
    },

    // Function to simulate a comprehensive click event
    simulateClick: function(element) {
        const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
            buttons: 1
        });
        element.dispatchEvent(event);
    },

    // Function to insert text into the editor by updating innerHTML and dispatching input event
    insertTextIntoEditor: function(editorDiv, text) {
        console.log('[Chatgpt-Buttons] Attempting to insert text into the editor by updating innerHTML.');
        editorDiv.focus();

        // Escape HTML entities in the text
        const escapedText = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');

        // Update the innerHTML directly
        editorDiv.innerHTML = `<p>${escapedText}</p>`;

        // Dispatch an input event to notify React of the change
        const event = new Event('input', { bubbles: true });
        editorDiv.dispatchEvent(event);
        console.log('[Chatgpt-Buttons] Editor content updated and input event dispatched.');
    },

    // Function to create a visual separator
    createSeparator: function() {
        const separator = document.createElement('div');
        separator.style.cssText = `
            width: 1px;
            height: 24px;
            background-color: #ccc;
            margin: 0 8px;
        `;
        return separator;
    }
};
