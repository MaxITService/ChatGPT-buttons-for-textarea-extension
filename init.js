// init.js
// Version: 1.0
// Instructions for AI: do not remove comments! MUST NOT REMOVE COMMENTS.

(function(window, MaxExtensionConfig, MaxExtensionUtils, MaxExtensionButtons, MaxExtensionInterface) {
    'use strict';

    // Log the extension version
    logConCgp('Extension version: 1.0');

    // Function to check if modifications already exist
    function modsExist() {
        return document.querySelector('[data-testid^="custom-send-button-"]') !== null;
    }

    // Function to handle custom send button click
    function handleCustomSend(event, customText, autoSend) {
        event.preventDefault();
        logConCgp('Custom send button clicked.');

        // Re-find the original send button
        const originalButton = document.querySelector('button[data-testid="send-button"][aria-label="Send prompt"]');
        logConCgp('Original send button re-found:', originalButton);

        // Get the editor div where the user types the message
        const editorDiv = document.querySelector('#prompt-textarea');
        logConCgp('Editor div found:', editorDiv);

        if (editorDiv && originalButton) {
            // Get the current text from the editor
            const currentText = editorDiv.innerText.trim();
            logConCgp('Current text in editor:', currentText);

            // Combine the current text with the custom text
            const combinedText = currentText + ' ' + customText;
            logConCgp('Combined text to insert:', combinedText);

            // Insert the combined text into the editor
            MaxExtensionUtils.insertTextIntoEditor(editorDiv, combinedText);

            if (MaxExtensionConfig.globalAutoSendEnabled && autoSend) {
                // Delay clicking the send button to ensure the text is inserted
                setTimeout(() => {
                    // Simulate a comprehensive click on the original send button
                    MaxExtensionUtils.simulateClick(originalButton);
                    logConCgp('Original send button clicked.');
                }, 50); // Delay of 50 ms before sending
            } else {
                logConCgp('Auto-send disabled. Message not sent automatically.');
            }
        } else {
            logConCgp('Editor div or original send button not found. Cannot send message.');
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
        logConCgp('Auto-send toggle created and added');

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
        logConCgp('Hotkeys toggle created and added');
    }

    // Function to create and add custom buttons
    function createAndAddCustomButtons(container) {
        MaxExtensionConfig.customButtons.forEach((buttonConfig, index) => {
            if (buttonConfig.separator) {
                const separator = MaxExtensionUtils.createSeparator();
                container.appendChild(separator);
                logConCgp('Separator created and added');
            } else {
                const customSendButton = MaxExtensionButtons.createCustomSendButton(buttonConfig, index, handleCustomSend);
                container.appendChild(customSendButton);
                logConCgp(`Custom send button ${index + 1} created:`, customSendButton);
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
            logConCgp(`Resiliency check iteration ${iterations}/${maxIterations}`);

            if (!modsExist()) {
                logConCgp('Custom elements are missing. Initiating resiliency enforcement.');
                clearInterval(resiliencyInterval);
                enforceResiliency();
            } else {
                logConCgp('Custom elements are present.');
            }

            if (iterations >= maxIterations) {
                logConCgp('Resiliency checks completed without detecting missing elements.');
                clearInterval(resiliencyInterval);
            }
        }, intervalDuration);
    }

    // Function to enforce resiliency by re-initializing without resiliency checks
    function enforceResiliency() {
        logConCgp('EnforceResiliency called. Re-initializing without resiliency checks.');
        init(false); // Initialize without resiliency checks
    }

    // Function to initialize the script
    function init(enableResiliency = true) {
        logConCgp('Initializing script...');
        if (modsExist() && !enableResiliency) {
            logConCgp('Modifications already exist. Skipping initialization.');
            return;
        }

        // Load saved toggle states
        MaxExtensionInterface.loadToggleStates();
        logConCgp('Toggle states loaded.');

        MaxExtensionUtils.waitForElement('div.flex.w-full.flex-col.gap-1\\.5.rounded-\\[26px\\].p-1\\.5.transition-colors.bg-\\[\\#f4f4f4\\].dark\\:bg-token-main-surface-secondary', (targetDiv) => {
            logConCgp('Target div found:', targetDiv);

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
            logConCgp('Custom send buttons, separators, auto-send toggle, and hotkeys toggle inserted into the DOM.');

            if (enableResiliency) {
                // Start resiliency checks
                startResiliencyChecks();
            }
        });
    }

    // Function to initialize the script with a delay and check for existing modifications
    function initScript() {
        logConCgp('InitScript called. Waiting 500ms before initialization...');
        setTimeout(() => {
            logConCgp('500ms delay completed. Checking for existing modifications...');
            if (!modsExist()) {
                logConCgp('No existing modifications found. Starting initialization...');
                init();

                // Add event listener for keyboard shortcuts
                if (MaxExtensionConfig.enableShortcuts) {
                    window.addEventListener('keydown', handleKeyboardShortcuts);
                    logConCgp('Keyboard shortcuts enabled and event listener added.');
                }
            } else {
                logConCgp('Modifications already exist. Skipping initialization.');
            }
        }, 500);
    }

    // Expose the initScript function to the global scope for use in events.js
    window.initChatgptButtons = initScript;

    // Initialize the script
    initScript();

})(window, window.MaxExtensionConfig, window.MaxExtensionUtils, window.MaxExtensionButtons, window.MaxExtensionInterface);
