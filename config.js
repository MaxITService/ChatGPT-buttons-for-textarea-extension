// config.js
// Version: 1.0
// Instructions for AI: do not remove comments! MUST NOT REMOVE COMMENTS.

(function(window) {
    'use strict';

    window.MaxExtensionConfig = {
        // Configuration
        ENABLE_SHORTCUTS_DEFAULT: true, // Default state for keyboard shortcuts
        globalAutoSendEnabled: true, // Global auto-send state
        enableShortcuts: true, // Global hotkeys state

        customButtons: [
            // Thinking and explanation buttons
            { icon: '🧠', text: ' Before answering, write chain of thought, step by step, in <thinking> tag </thinking> then CRITICALLY review thinking in <critics> tag, then write horizontal line using markdown, then write final answer, which should be pinnacle of thought', autoSend: true },
            { icon: '🧐', text: ' Explain this concept or process in detail. Make Easier to understand.', autoSend: true },
            { icon: '💡', text: ' <Rewrite this text, keeping all original information. Add explanations to non-obvious concepts only, don\'t explain basic things, only explain advanced concepts, like you would explain to an advanced expert, just this particular field is new to him.', autoSend: true },
            { separator: true },

            // Text processing and information buttons
            { icon: '🎓', text: ' This was text of my conspectus. Correct this conspectus. Start your response with a percentage of correctness, then explain what went wrong. only go about real, serious errors. "Clarity" is out of review now', autoSend: true },
            { icon: '➕', text: ' ... Add additional information to this text, especially continue from this point. Focus on providing new content beyond what has already been written.', autoSend: true },
            { icon: '🗜️', text: ' Provide a concise and focused explanation on this topic, answer directly to question', autoSend: true },
            { icon: '📖', text: ' Read this large chunk of text. Respond with "Acknowledged" for now. I will ask questions about this text later.', autoSend: true },
            { icon: '🌐', text: ' Perform a web search on this topic and provide an answer based on the results. Cite sources or inform about source fetch failure.', autoSend: true },
            { separator: true },

            // Output format buttons
            { icon: '📅', text: ' Provide your next answer in a form of a table', autoSend: false },
            { icon: '💻', text: ' output ONLY CODE, not explanations. Start by typing code in a code block', autoSend: true },
            { icon: '🗒️', text: ' start by typing code in a code block, put all the explanation in code comments only! Ensure no code outside the code block', autoSend: true },
            { icon: '📝', text: ' <Just check grammar in this text, and retype it correctly. Frame corrected text with the MD horizontal lines. Explain grammatical errors found or state if none is found.', autoSend: true },
            { separator: true },

            // Language and style buttons
            { icon: '🇷🇺', text: ' Explain in Russian', autoSend: true },
            { icon: '🔄', text: ' just answer normally', autoSend: true },
            { separator: true }, // New separator at the end of the buttons
        ]
    };

})(window);
