
// hello-page-script.js
// Version: 1.0
// Main script for Max Extension configuration interface

(function() {
    'use strict';

    // State management
    let currentProfile = null;
    let isDirty = false;

    // DOM Elements
    const elements = {
        profileSelect: document.getElementById('profileSelect'),
        buttonIcon: document.getElementById('buttonIcon'),
        buttonText: document.getElementById('buttonText'),
        buttonList: document.getElementById('buttonList'),
        autoSendToggle: document.getElementById('autoSendToggle'),
        shortcutsToggle: document.getElementById('shortcutsToggle'),
        console: document.getElementById('console'),
        saveStatus: document.getElementById('saveStatus')
    };

    // Console logging
    function logToConsole(message) {
        const timestamp = new Date().toLocaleTimeString();
        elements.console.innerHTML += `[${timestamp}] ${message}\n`;
        elements.console.scrollTop = elements.console.scrollHeight;
        logConCgp(message);
    }

    // Profile Management
    async function loadProfiles() {
        try {
            const result = await chrome.storage.sync.get(['currentProfile', 'profiles']);
            if (!result.currentProfile || !result.profiles) {
                logToConsole('No profiles found. Creating default profile...');
                await createDefaultProfile();
            } else {
                currentProfile = result.currentProfile;
                updateProfileSelect(result.profiles);
                loadProfileData(result.profiles[currentProfile]);
            }
        } catch (error) {
            logToConsole(`Error loading profiles: ${error.message}`);
        }
    }

    async function createDefaultProfile() {
        const defaultProfile = {
            id: 'default',
            name: 'Default Profile',
            enableShortcuts: true,
            globalAutoSendEnabled: true,
            customButtons: window.MaxExtensionConfig.customButtons
        };

        try {
            await chrome.storage.sync.set({
                currentProfile: 'default',
                profiles: { default: defaultProfile }
            });
            currentProfile = 'default';
            loadProfileData(defaultProfile);
            logToConsole('Default profile created successfully');
        } catch (error) {
            logToConsole(`Error creating default profile: ${error.message}`);
        }
    }

    // Button Management
    function createButtonElement(button, index) {
        const buttonElement = document.createElement('div');
        buttonElement.className = 'button-item';
        buttonElement.draggable = true;
        buttonElement.dataset.index = index;

        if (button.separator) {
            buttonElement.classList.add('separator-item');
            buttonElement.innerHTML = `
                <button class="neuromorphic-button danger" onclick="deleteButton(${index})">Delete</button>
            `;
        } else {
            buttonElement.innerHTML = `
                <span class="button-icon">${button.icon}</span>
                <span class="button-text">${button.text}</span>
                <button class="neuromorphic-button danger" onclick="deleteButton(${index})">Delete</button>
            `;
        }

        return buttonElement;
    }

    function updateButtonList(buttons) {
        elements.buttonList.innerHTML = '';
        buttons.forEach((button, index) => {
            elements.buttonList.appendChild(createButtonElement(button, index));
        });
    }

    // Event Handlers
    document.getElementById('addButton').addEventListener('click', () => {
        const icon = elements.buttonIcon.value.trim();
        const text = elements.buttonText.value.trim();
        
        if (!icon || !text) {
            logToConsole('Please fill in both icon and text fields');
            return;
        }

        const newButton = {
            icon,
            text,
            autoSend: true
        };

        addButton(newButton);
        elements.buttonIcon.value = '';
        elements.buttonText.value = '';
    });

    document.getElementById('addSeparator').addEventListener('click', () => {
        addButton({ separator: true });
    });

    // Drag and Drop Implementation
    elements.buttonList.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('button-item')) {
            e.target.classList.add('dragging');
            e.dataTransfer.setData('text/plain', e.target.dataset.index);
        }
    });

    elements.buttonList.addEventListener('dragend', (e) => {
        if (e.target.classList.contains('button-item')) {
            e.target.classList.remove('dragging');
        }
    });

    elements.buttonList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const dragging = document.querySelector('.dragging');
        const siblings = [...elements.buttonList.querySelectorAll('.button-item:not(.dragging)')];
        const nextSibling = siblings.find(sibling => {
            const box = sibling.getBoundingClientRect();
            return e.clientY <= box.top + box.height / 2;
        });

        if (nextSibling) {
            elements.buttonList.insertBefore(dragging, nextSibling);
        } else {
            elements.buttonList.appendChild(dragging);
        }
    });

    // Save Changes
    async function saveChanges() {
        try {
            const currentButtons = [...elements.buttonList.children].map(el => {
                const index = parseInt(el.dataset.index);
                return window.MaxExtensionConfig.customButtons[index];
            });

            const profileData = {
                enableShortcuts: elements.shortcutsToggle.checked,
                globalAutoSendEnabled: elements.autoSendToggle.checked,
                customButtons: currentButtons
            };

            await chrome.storage.sync.set({
                [`profiles.${currentProfile}`]: profileData
            });

            updateSaveStatus();
            isDirty = false;
            logToConsole('Changes saved successfully');
        } catch (error) {
            logToConsole(`Error saving changes: ${error.message}`);
        }
    }

    function updateSaveStatus() {
        const timestamp = new Date().toLocaleString();
        elements.saveStatus.textContent = `Last saved: ${timestamp}`;
    }

    // Initialize
    loadProfiles();

    // Add auto-save on changes
    const saveDebounced = _.debounce(saveChanges, 1000);
    elements.buttonList.addEventListener('change', () => {
        isDirty = true;
        saveDebounced();
    });

    // Export necessary functions
    window.deleteButton = function(index) {
        const buttons = [...elements.buttonList.children];
        buttons[index].remove();
        isDirty = true;
        saveDebounced();
    };
})();

