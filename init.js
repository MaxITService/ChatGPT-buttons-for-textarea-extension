// init.js
// Version: 1.2
// Instructions for AI: do not remove comments! MUST NOT REMOVE COMMENTS.

(function(window, MaxExtensionConfig, MaxExtensionUtils, MaxExtensionButtons, MaxExtensionInterface) {
    'use strict';

    // Log the extension version
    logConCgp('Extension version: 1.2');

    // Function to check if modifications already exist
    function modsExist() {
        return document.querySelector('[data-testid^="custom-send-button-"]') !== null;
    }

    // Function to detect the active website
    function getActiveWebsite() {
        const hostname = window.location.hostname;

        if (hostname.includes('chat.openai.com') || hostname.includes('chatgpt.com')) {
            return 'ChatGPT';
        } else if (hostname.includes('claude.ai')) {
            return 'Claude';
        } else {
            return 'Unknown';
        }
    }

    // Initialization function for ChatGPT
    function initScriptCGPT(enableResiliency = true) {
        logConCgp('Initializing ChatGPT script...');
        init(enableResiliency);
    }

    // Initialization function for Claude
    function initScriptClaude(enableResiliency = true) {
        logConCgp('Initializing Claude script...');
        // TODO: Implement Claude-specific initialization logic
    }

    // Function to handle custom send button click
    function handleCustomSend(event, customText, autoSend) {
        event.preventDefault();
        logConCgp('Custom send button clicked.');

        const originalButton = document.querySelector('button[data-testid="send-button"][aria-label="Send prompt"]');
        logConCgp('Original send button re-found:', originalButton);

        const editorDiv = document.querySelector('#prompt-textarea');
        logConCgp('Editor div found:', editorDiv);

        if (editorDiv && originalButton) {
            const currentText = editorDiv.innerText.trim();
            logConCgp('Current text in editor:', currentText);

            const combinedText = currentText + ' ' + customText;
            logConCgp('Combined text to insert:', combinedText);

            MaxExtensionUtils.insertTextIntoEditor(editorDiv, combinedText);

            if (MaxExtensionConfig.globalAutoSendEnabled && autoSend) {
                setTimeout(() => {
                    MaxExtensionUtils.simulateClick(originalButton);
                    logConCgp('Original send button clicked.');
                }, 50);
            } else {
                logConCgp('Auto-send disabled. Message not sent automatically.');
            }
        } else {
            logConCgp('Editor div or original send button not found. Cannot send message.');
        }
    }

    // Function to create and add toggles
    function createAndAddToggles(container) {
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

    // Enhanced function to start resiliency checks
    function startResiliencyChecks() {
        let consecutiveClearChecks = 0;
        const requiredClearChecks = 3;
        const maxTotalIterations = 10;
        let totalIterations = 0;
        const intervalDuration = 1000; // 1000 milliseconds

        logConCgp('Starting enhanced resiliency checks...');
        logConCgp(`Requiring ${requiredClearChecks} consecutive clear checks`);

        const resiliencyInterval = setInterval(() => {
            totalIterations++;
            
            if (modsExist()) {
                consecutiveClearChecks = 0; // Reset counter if modifications are found
                logConCgp(`Found existing modifications. Resetting consecutive clear counter. (Iteration ${totalIterations}/${maxTotalIterations})`);
            } else {
                consecutiveClearChecks++;
                logConCgp(`No modifications found. Consecutive clear checks: ${consecutiveClearChecks}/${requiredClearChecks}`);
            }

            // Check if we've reached our consecutive clear goal
            if (consecutiveClearChecks >= requiredClearChecks) {
                logConCgp('Reached required consecutive clear checks. Proceeding with initialization.');
                clearInterval(resiliencyInterval);
                enforceResiliency();
            }

            // Safety check to prevent infinite loops
            if (totalIterations >= maxTotalIterations) {
                logConCgp('Reached maximum iterations without achieving consecutive clear checks.');
                clearInterval(resiliencyInterval);
                
                // Only proceed if we're completely clear at this point
                if (!modsExist()) {
                    logConCgp('No modifications present after max iterations. Proceeding with caution.');
                    enforceResiliency();
                } else {
                    logConCgp('Modifications still present after max iterations. Aborting.');
                }
            }
        }, intervalDuration);
    }

    // Function to enforce resiliency by re-initializing without resiliency checks
    function enforceResiliency() {
        logConCgp('EnforceResiliency called. Re-initializing without resiliency checks.');
        init(false);
    }

    // Main initialization function
    function init(enableResiliency = true) {
        logConCgp('Initializing script...');
        
        if (modsExist() && !enableResiliency) {
            logConCgp('Modifications already exist and resiliency disabled. Skipping initialization.');
            return;
        }

        if (enableResiliency) {
            logConCgp('Starting enhanced resiliency system...');
            startResiliencyChecks();
            return;
        }

        // Load saved toggle states
        MaxExtensionInterface.loadToggleStates();
        logConCgp('Toggle states loaded.');

        // Wait for and modify the target element
        MaxExtensionUtils.waitForElement('div.flex.w-full.flex-col.gap-1\\.5.rounded-\\[26px\\].p-1\\.5.transition-colors.bg-\\[\\#f4f4f4\\].dark\\:bg-token-main-surface-secondary', (targetDiv) => {
            logConCgp('Target div found:', targetDiv);

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
            createAndAddToggles(customButtonsContainer);

            targetDiv.appendChild(customButtonsContainer);
            logConCgp('Custom elements inserted into the DOM.');
        });
    }

    // Function to initialize the script with a delay
    function initScript() {
        logConCgp('InitScript called. Waiting 500ms before initialization...');
        setTimeout(() => {
            logConCgp('500ms delay completed. Checking for existing modifications...');
            if (!modsExist()) {
                logConCgp('No existing modifications found. Detecting active website...');
                const activeWebsite = getActiveWebsite();

                switch (activeWebsite) {
                    case 'ChatGPT':
                        logConCgp('Active website detected: ChatGPT');
                        initScriptCGPT();
                        break;
                    case 'Claude':
                        logConCgp('Active website detected: Claude');
                        initScriptClaude();
                        break;
                    default:
                        logConCgp('Active website not supported. Initialization aborted.');
                }

                if (activeWebsite === 'ChatGPT' && MaxExtensionConfig.enableShortcuts) {
                    window.addEventListener('keydown', handleKeyboardShortcuts);
                    logConCgp('Keyboard shortcuts enabled and event listener added for ChatGPT.');
                }
            } else {
                logConCgp('Modifications already exist. Skipping initialization.');
            }
        }, 500);
    }

    // Expose the initScript function to the global scope
    window.initChatgptButtons = initScript;

    // Initialize the script
    initScript();

})(window, window.MaxExtensionConfig, window.MaxExtensionUtils, window.MaxExtensionButtons, window.MaxExtensionInterface);