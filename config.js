// config.js
// Version: 1.0
// Instructions for AI: do not remove comments! MUST NOT REMOVE COMMENTS.

'use strict';

// Declare that we're using the global logConCgp
/* global logConCgp */

// Initialize configuration first so it's available throughout the file
window.MaxExtensionConfig = {
    // Configuration
    ENABLE_SHORTCUTS_DEFAULT: true, // Default state for keyboard shortcuts
    globalAutoSendEnabled: true, // Global auto-send state
    enableShortcuts: true, // Global hotkeys state
    customButtons: [
        { icon: '📝', text: ' <Just check grammar in this text, and retype it correctly. Frame corrected text with the MD horizontal lines. Explain grammatical errors found or state if none is found.', autoSend: true },
        { separator: true },
        // Language and style buttons
        { icon: '🇷🇺', text: ' Explain in Russian', autoSend: true },
        { icon: '🔄', text: ' just answer normally', autoSend: true },
        { separator: true }, // New separator at the end of the buttons
    ],

    // These will be defined after the helper functions
    loadConfig: null,
    switchProfile: null
};
logConCgp('[Config] !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! STARTING CONFIG');

/**
 * Validates button structure and data
 * @param {Array} buttons - Array of button objects to validate
 * @returns {Array} - Validated and cleaned button array
 */
function validateButtons(buttons) {
    logConCgp('[validateButtons] Entering function');
    if (!Array.isArray(buttons)) {
        logConCgp('[Config] Invalid buttons format detected, using defaults');
        return window.MaxExtensionConfig.customButtons;
    }
    
    const validatedButtons = buttons.filter(button => {
        if (button.separator === true) {
            logConCgp('[Config] Validated separator button');
            return true;
        }
        
        const isValid = 
            typeof button === 'object' &&
            typeof button.icon === 'string' &&
            typeof button.text === 'string' &&
            typeof button.autoSend === 'boolean';
            
        if (!isValid) {
            logConCgp(`[Config] Invalid button removed: ${JSON.stringify(button)}`);
        } else {
            logConCgp(`[Config] Validated button: ${button.icon}`);
        }
        return isValid;
    });

    logConCgp(`[Config] Button validation complete. Valid buttons: ${validatedButtons.length}`);
    return validatedButtons;
}

/**
 * Loads custom buttons for specific profile from Chrome storage
 * @param {string} profileId - Current profile identifier
 * @returns {Promise<Array>}
 */
async function loadCustomButtons(profileId) {
    logConCgp('[loadCustomButtons] Entering function');
    try {
        logConCgp(`[Config] Loading custom buttons for profile: ${profileId}`);
        const result = await chrome.storage.sync.get(['profiles', 'customButtons']);
        
        if (chrome.runtime.lastError) {
            throw new Error(`[Config] Chrome storage error: ${chrome.runtime.lastError.message}`);
        }

        // Check if we have profile-specific buttons
        if (result.profiles && result.profiles[profileId]?.customButtons) {
            logConCgp(`[Config] Found profile-specific buttons for ${profileId}`);
            const validatedButtons = validateButtons(result.profiles[profileId].customButtons);
            logConCgp(`[Config] Validated ${validatedButtons.length} profile-specific buttons`);
            return validatedButtons;
        }
        
        // Fall back to global buttons if they exist
        if (result.customButtons) {
            logConCgp('[Config] Using global custom buttons (no profile-specific buttons found)');
            const validatedButtons = validateButtons(result.customButtons);
            logConCgp(`[Config] Validated ${validatedButtons.length} global buttons`);
            return validatedButtons;
        }
        
        logConCgp('[Config] No stored buttons found, using defaults');
        return window.MaxExtensionConfig.customButtons;
        
    } catch (error) {
        logConCgp(`[Config] Error loading custom buttons: ${error.message}`);
        return window.MaxExtensionConfig.customButtons;
    }
}

/**
 * Loads or creates user profile
 * @returns {Promise<Object>}
 */
async function loadUserProfile() {
    logConCgp('[loadUserProfile] Entering function');
    try {
        logConCgp('[Config] Loading user profile configuration');
        const result = await chrome.storage.sync.get(['currentProfile', 'profiles']);
        
        if (chrome.runtime.lastError) {
            throw new Error(`[Config] Chrome storage error: ${chrome.runtime.lastError.message}`);
        }

        // Check if we have a current profile set
        if (!result.currentProfile) {
            logConCgp('[Config] No current profile found, creating default profile');
            const defaultProfile = {
                id: 'default',
                name: 'Default Profile',
                enableShortcuts: window.MaxExtensionConfig.ENABLE_SHORTCUTS_DEFAULT,
                globalAutoSendEnabled: window.MaxExtensionConfig.globalAutoSendEnabled,
                customButtons: window.MaxExtensionConfig.customButtons
            };

            // Save default profile
            await chrome.storage.sync.set({
                currentProfile: 'default',
                profiles: { default: defaultProfile }
            });

            return defaultProfile;
        }

        // Load existing profile
        if (result.profiles && result.profiles[result.currentProfile]) {
            const profile = result.profiles[result.currentProfile];
            logConCgp(`[Config] Loaded profile: ${profile.name} (${profile.id})`);
            return profile;
        }

        logConCgp('[Config] Current profile not found in profiles, resetting to default');
        throw new Error('[Config] Profile data inconsistent');

    } catch (error) {
        logConCgp(`[Config] Error loading profile: ${error.message}`);
        return {
            id: 'default',
            name: 'Default Profile',
            enableShortcuts: window.MaxExtensionConfig.ENABLE_SHORTCUTS_DEFAULT,
            globalAutoSendEnabled: window.MaxExtensionConfig.globalAutoSendEnabled,
            customButtons: window.MaxExtensionConfig.customButtons
        };
    }
}

// Define the methods on MaxExtensionConfig after helper functions are defined
window.MaxExtensionConfig.loadConfig = async function() {
    logConCgp('[loadConfig] Entering function');
    logConCgp('[Config] Starting configuration loading process');
    try {
        // First load profile
        const profile = await loadUserProfile();
        
        // Store current profile info
        this.currentProfile = profile.id;
        this.profileName = profile.name;
        
        // Load profile-specific buttons
        this.customButtons = await loadCustomButtons(profile.id);
        
        // Update settings from profile
        this.enableShortcuts = profile.enableShortcuts;
        this.globalAutoSendEnabled = profile.globalAutoSendEnabled;

        logConCgp(`[Config] Configuration loaded successfully for profile: ${profile.name}`);
        return this;

    } catch (error) {
        logConCgp(`[Config] Critical error loading configuration: ${error.message}`);
        logConCgp('[Config] Falling back to default configuration');
        return this;
    }
};

window.MaxExtensionConfig.switchProfile = async function(profileId) {
    logConCgp('[switchProfile] Entering function');
    logConCgp(`[Config] Attempting to switch to profile: ${profileId}`);
    try {
        await chrome.storage.sync.set({ currentProfile: profileId });
        await this.loadConfig();
        logConCgp(`[Config] Successfully switched to profile: ${profileId}`);
    } catch (error) {
        logConCgp(`[Config] Error switching profiles: ${error.message}`);
    }
};
