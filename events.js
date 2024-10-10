// events.js
// Version: 1.0
// Instructions for AI: do not remove comments! MUST NOT REMOVE COMMENTS.

(function(window) {
    'use strict';

    console.log('[Chatgpt-Buttons] Events script loaded.');

    // Function to handle path changes
    function handlePathChange() {
        console.log('[Chatgpt-Buttons] Path change detected. Re-initializing script...');
        if (typeof window.initChatgptButtons === 'function') {
            window.initChatgptButtons();
        } else {
            console.error('[Chatgpt-Buttons] initChatgptButtons function is not available.');
        }
    }

    // Function to set up path change detection using MutationObserver
    function setupPathChangeDetection() {
        let lastPath = window.location.pathname;

        // Callback for MutationObserver
        const observerCallback = () => {
            const currentPath = window.location.pathname;
            if (currentPath !== lastPath) {
                lastPath = currentPath;
                handlePathChange();
            }
        };

        // Create a MutationObserver to watch for changes in the DOM that might indicate a path change
        const observer = new MutationObserver(observerCallback);

        // Start observing the document body for changes in child elements and subtree
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('[Chatgpt-Buttons] MutationObserver for path changes has been set up.');
    }

    // Alternative method: Override history methods to detect path changes
    function overrideHistoryMethods() {
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function(...args) {
            originalPushState.apply(history, args);
            handlePathChange();
        };

        history.replaceState = function(...args) {
            originalReplaceState.apply(history, args);
            handlePathChange();
        };

        console.log('[Chatgpt-Buttons] History methods overridden to detect path changes.');
    }

    // Initialize path change detection
    function initPathChangeDetection() {
        setupPathChangeDetection();
        overrideHistoryMethods();

        // Also listen to the popstate event
        window.addEventListener('popstate', handlePathChange);
        console.log('[Chatgpt-Buttons] popstate event listener added.');
    }

    // Start path change detection
    initPathChangeDetection();

})(window);
