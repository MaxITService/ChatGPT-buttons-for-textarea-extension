// init.js
// Version: 1.0
// Instructions for AI: do not remove comments! MUST NOT REMOVE COMMENTS.

(function(window, MaxExtensionConfig, MaxExtensionUtils, MaxExtensionButtons, MaxExtensionInterface) {
    'use strict';

    console.log('[Chatgpt-Buttons] Extension version: 1.0');

    // Function to check if modifications already exist
    function modsExist() {
        return document.querySelector('[data-testid^="custom-send-button-"]') !== null;
    }

    // Function to handle custom send button click
    function handleCustomSend(event, customText, autoSend) {
        event.preventDefault();
        console.log('[Chatgpt-Buttons] Custom send button clicked.');

        // Re-find the original send button
        const originalButton = document.querySelector('button[data-testid="send-button"][aria-label="Send prompt"]');
        console.log('[Chatgpt-Buttons] Original send button re-found:', originalButton);

        // Get the editor div where the user types the message
        const editorDiv = document.querySelector('#prompt-textarea');
        console.log('[Chatgpt-Buttons] Editor div found:', editorDiv);

        if (editorDiv && originalButton) {
            // Get the current text from the editor
            const currentText = editorDiv.innerText.trim();
            console.log('[Chatgpt-Buttons] Current text in editor:', currentText);

            // Combine the current text with the custom text
            const combinedText = currentText + ' ' + customText;
            console.log('[Chatgpt-Buttons] Combined text to insert:', combinedText);

            // Insert the combined text into the editor
            MaxExtensionUtils.insertTextIntoEditor(editorDiv, combinedText);

            if (MaxExtensionConfig.globalAutoSendEnabled && autoSend) {
                // Delay clicking the send button to ensure the text is inserted
                setTimeout(() => {
                    // Simulate a comprehensive click on the original send button
                    MaxExtensionUtils.simulateClick(originalButton);
                    console.log('[Chatgpt-Buttons] Original send button clicked.');
                }, 50); // Delay of 50 ms before sending
            } else {
                console.log('[Chatgpt-Buttons] Auto-send disabled. Message not sent automatically.');
            }
        } else {
            console.error('[Chatgpt-Buttons] Editor div or original send button not found. Cannot send message.');
        }
    }

    // Function to create a toggle checkbox (used for both Auto-send and Hotkeys)
    function createAndAddToggles(container) {
        // Add Auto-send toggle
        const autoSendToggle = MaxExtensionInterface.createToggle(
            'auto-send-toggle',
            'Enable Auto-send',
            MaxExtensionConfig.globalAutoSendEnabled,
            (state) => {
                MaxExtensionConfig.globalAutoSendEnabled = state;
            }
        );
        container.appendChild(autoSendToggle);
        console.log('[Chatgpt-Buttons] Auto-send toggle created and added');

        // Add Hotkeys toggle
        const hotkeysToggle = MaxExtensionInterface.createToggle(
            'hotkeys-toggle',
            'Enable Hotkeys',
            MaxExtensionConfig.enableShortcuts,
            (state) => {
                MaxExtensionConfig.enableShortcuts = state;
            }
        );
        container.appendChild(hotkeysToggle);
        console.log('[Chatgpt-Buttons] Hotkeys toggle created and added');
    }

    // Function to create and add custom buttons
    function createAndAddCustomButtons(container) {
        MaxExtensionConfig.customButtons.forEach((buttonConfig, index) => {
            if (buttonConfig.separator) {
                const separator = MaxExtensionUtils.createSeparator();
                container.appendChild(separator);
                console.log('[Chatgpt-Buttons] Separator created and added');
            } else {
                const customSendButton = MaxExtensionButtons.createCustomSendButton(buttonConfig, index, handleCustomSend);
                container.appendChild(customSendButton);
                console.log(`[Chatgpt-Buttons] Custom send button ${index + 1} created:`, customSendButton);
            }
        });
    }

    // Function to handle keyboard shortcuts
    function handleKeyboardShortcuts(event) {
        if (!MaxExtensionConfig.enableShortcuts) return;

        if (event.altKey && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
            const key = event.key === '0' ? '10' : event.key;
            const button = document.querySelector(`button[data-shortcut-key="${key}"]`);
            if (button) {
                event.preventDefault();
                button.click();
            }
        }
    }

    // Function to start resiliency checks
    function startResiliencyChecks() {
        let iterations = 0;
        const maxIterations = 5;
        const intervalDuration = 1000; // 1000 milliseconds

        const resiliencyInterval = setInterval(() => {
            iterations++;
            console.log(`[Chatgpt-Buttons] Resiliency check iteration ${iterations}/${maxIterations}`);

            if (!modsExist()) {
                console.log('[Chatgpt-Buttons] Custom elements are missing. Initiating resiliency enforcement.');
                clearInterval(resiliencyInterval);
                enforceResiliency();
            } else {
                console.log('[Chatgpt-Buttons] Custom elements are present.');
            }

            if (iterations >= maxIterations) {
                console.log('[Chatgpt-Buttons] Resiliency checks completed without detecting missing elements.');
                clearInterval(resiliencyInterval);
            }
        }, intervalDuration);
    }

    // Function to enforce resiliency by re-initializing without resiliency checks
    function enforceResiliency() {
        console.log('[Chatgpt-Buttons] EnforceResiliency called. Re-initializing without resiliency checks.');
        init(false); // Initialize without resiliency checks
    }

    // Function to initialize the script
    function init(enableResiliency = true) {
        console.log('[Chatgpt-Buttons] Initializing script...');
        if (modsExist() && !enableResiliency) {
            console.log('[Chatgpt-Buttons] Modifications already exist. Skipping initialization.');
            return;
        }

        // Load saved toggle states
        MaxExtensionInterface.loadToggleStates();

        MaxExtensionUtils.waitForElement('div.flex.w-full.flex-col.gap-1\\.5.rounded-\\[26px\\].p-1\\.5.transition-colors.bg-\\[\\#f4f4f4\\].dark\\:bg-token-main-surface-secondary', (targetDiv) => {
            console.log('[Chatgpt-Buttons] Target div found:', targetDiv);

            // Create and add custom send buttons
            const customButtonsContainer = document.createElement('div');
            customButtonsContainer.style.cssText = `
                display: flex;
                justify-content: flex-start;
                flex-wrap: wrap;
                gap: 8px;
                padding: 8px;
                width: 100%;
            `;

            createAndAddCustomButtons(customButtonsContainer);

            // Create and add toggles
            createAndAddToggles(customButtonsContainer);

            // Insert the custom buttons container at the end of the target div
            targetDiv.appendChild(customButtonsContainer);
            console.log('[Chatgpt-Buttons] Custom send buttons, separators, auto-send toggle, and hotkeys toggle inserted into the DOM.');

            if (enableResiliency) {
                // Start resiliency checks
                startResiliencyChecks();
            }
        });
    }

    // Function to initialize the script with a delay and check for existing modifications
    function initScript() {
        console.log('[Chatgpt-Buttons] InitScript called. Waiting 500ms before initialization...');
        setTimeout(() => {
            console.log('[Chatgpt-Buttons] 500ms delay completed. Checking for existing modifications...');
            if (!modsExist()) {
                console.log('[Chatgpt-Buttons] No existing modifications found. Starting initialization...');
                init();

                // Add event listener for keyboard shortcuts
                if (MaxExtensionConfig.enableShortcuts) {
                    window.addEventListener('keydown', handleKeyboardShortcuts);
                    console.log('[Chatgpt-Buttons] Keyboard shortcuts enabled and event listener added.');
                }
            } else {
                console.log('[Chatgpt-Buttons] Modifications already exist. Skipping initialization.');
            }
        }, 500);
    }

    // Expose the initScript function to the global scope for use in events.js
    window.initChatgptButtons = initScript;

    // Initialize the script
    initScript();

})(window, window.MaxExtensionConfig, window.MaxExtensionUtils, window.MaxExtensionButtons, window.MaxExtensionInterface);
