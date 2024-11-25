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

    // Copy text to clipboard
    copyButton.addEventListener("click", () => {
        const textToCopy = originalTextArea.value.trim(); // Clean up the text
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                alert("Text copied to clipboard!");
            }).catch((err) => {
                console.error("Failed to copy text: ", err);
            });
        } else {
            alert("No text to copy!");
        }
    });

    // Save translation and replace text on the webpage
    saveButton.addEventListener("click", () => {
        const translation = translatedTextArea.value.trim();

        if (translation) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: (newText) => {
                        const storyContainer = document.querySelector('.story_typable');
                        if (storyContainer) {
                            // Replace the text with the new translation
                            storyContainer.innerHTML = `<span>${newText}</span>`;
                        }
                    },
                    args: [translation],
                });
            });
        }
    });
});
