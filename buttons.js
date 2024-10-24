// buttons.js
// Version: 1.0
// Instructions for AI: do not remove comments! MUST NOT REMOVE COMMENTS.

'use strict';

window.MaxExtensionButtons = {
    // Function to create custom send button
    createCustomSendButton: function(buttonConfig, index, handleCustomSend) {
        const customButton = document.createElement('button');
        customButton.innerHTML = buttonConfig.icon;
        customButton.setAttribute('data-testid', `custom-send-button-${index}`);

        // Assign keyboard shortcuts to the first 10 non-separator buttons if shortcuts are enabled
        let shortcutKey = null;
        if (MaxExtensionConfig.enableShortcuts) {
            shortcutKey = this.getShortcutKeyForIndex(index);
            if (shortcutKey !== null) {
                customButton.dataset.shortcutKey = shortcutKey.toString();
            }
        }

        const shortcutText = shortcutKey !== null ? ` (Shortcut: Alt+${shortcutKey})` : '';
        customButton.setAttribute('title', buttonConfig.text + shortcutText);

        customButton.style.cssText = `
            background-color: transparent;
            border: none;
            cursor: pointer;
            padding: 1px;
            font-size: 20px;
            margin-right: 5px;
            margin-bottom: 5px;
        `;

        customButton.addEventListener('click', (event) => handleCustomSend(event, buttonConfig.text, buttonConfig.autoSend));

        return customButton;
    },

    // Function to get the shortcut key for a given index, skipping separators
    getShortcutKeyForIndex: function(index) {
        let shortcutCount = 0;
        for (let i = 0; i < MaxExtensionConfig.customButtons.length; i++) {
            if (!MaxExtensionConfig.customButtons[i].separator) {
                shortcutCount++;
                if (i === index && shortcutCount <= 10) {
                    return shortcutCount % 10; // 0 represents 10
                }
            }
        }
        return null;
    }
};
