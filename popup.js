document.addEventListener("DOMContentLoaded", () => {
    const originalTextArea = document.getElementById("originalText");
    const translatedTextArea = document.getElementById("translatedText");
    const saveButton = document.getElementById("saveButton");
    const copyButton = document.getElementById("copyButton");

    // Fetch story text from the webpage
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getStoryText" }, (response) => {
            console.log("Response from content.js:", response); // Debug log for response
            if (response && response.storyText) {
                originalTextArea.value = response.storyText.trim(); // Populate and trim the original text area
            } else {
                originalTextArea.value = "Failed to fetch story text.";
            }
        });
    });

    // Copy text to clipboard without an alert
    copyButton.addEventListener("click", () => {
        const textToCopy = originalTextArea.value.trim(); // Clean up the text
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy).catch((err) => {
                console.error("Failed to copy text: ", err);
            });
        }
    });

    // Save translation and update the page without breaking the DOM structure
    saveButton.addEventListener("click", () => {
        const translation = translatedTextArea.value.trim();

        if (translation) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: (newText) => {
                        const storyContainer = document.querySelector('.story_typable');
                        if (storyContainer) {
                            // Update text content while preserving the DOM structure
                            const tokens = storyContainer.querySelectorAll('.token_unit');
                            let translationIndex = 0;

                            tokens.forEach(token => {
                                if (newText[translationIndex]) {
                                    token.textContent = newText[translationIndex];
                                    translationIndex++;
                                } else {
                                    token.textContent = ""; // Clear extra tokens
                                }
                            });
                        }
                    },
                    args: [translation],
                });
            });
        }
    });
});
