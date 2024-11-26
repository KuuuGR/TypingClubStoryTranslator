// popup.js

// Cross-browser compatibility
var extension = typeof browser !== 'undefined' ? browser : chrome;

document.addEventListener("DOMContentLoaded", () => {
  const originalTextArea = document.getElementById("originalText");
  const translatedTextArea = document.getElementById("translatedText");
  const copyButton = document.getElementById("copyButton");
  const pasteButton = document.getElementById("pasteButton");
  const loadButton = document.getElementById("loadButton");

  // Fetch story text from the webpage
  extension.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]) {
      console.error("No active tab found");
      originalTextArea.value = "Could not access the current tab.";
      return;
    }

    extension.tabs.sendMessage(tabs[0].id, { action: "getStoryText" }, (response) => {
      if (extension.runtime.lastError) {
        console.error("Message passing error:", extension.runtime.lastError);
        originalTextArea.value = "Failed to communicate with the page.";
        return;
      }

      if (response) {
        if (response.error) {
          console.error("Error from content script:", response.error);
          originalTextArea.value = response.error;
        } else if (response.storyText) {
          console.log("Received story text:", response.storyText);
          originalTextArea.value = response.storyText.trim();
        } else {
          console.warn("No story text received.");
          originalTextArea.value = "Failed to fetch story text.";
        }
      } else {
        console.warn("No response from content script.");
        originalTextArea.value = "Failed to fetch story text.";
      }
    });
  });

  // Copy text to clipboard
  copyButton.addEventListener("click", () => {
    const textToCopy = originalTextArea.value.trim();
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        console.log("Text copied to clipboard successfully.");
      }).catch((err) => {
        console.error("Failed to copy text: ", err);
      });
    } else {
      console.warn("No text available to copy.");
    }
  });

  // Paste text from clipboard into the translatedTextArea
  pasteButton.addEventListener("click", () => {
    navigator.clipboard.readText().then((text) => {
      translatedTextArea.value = text;
      console.log("Text pasted from clipboard.");
    }).catch((err) => {
      console.error("Failed to read text from clipboard: ", err);
    });
  });

  // Load translation and update the page
  loadButton.addEventListener("click", () => {
    const translation = translatedTextArea.value.trim();

    if (translation) {
      extension.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]) {
          console.error("No active tab found");
          alert("Could not access the current tab.");
          return;
        }

        extension.tabs.sendMessage(
          tabs[0].id,
          { action: "applyTranslation", translatedText: translation },
          (response) => {
            if (extension.runtime.lastError) {
              console.error("Error sending message to content script:", extension.runtime.lastError);
              alert("Failed to send translation to the page.");
            } else if (response && response.success) {
              console.log("Translation applied successfully.");
              alert("Translation applied successfully.");
            } else {
              console.error("Failed to apply translation.");
              alert("Failed to apply translation.");
            }
          }
        );
      });
    } else {
      console.warn("No translation provided to load.");
    }
  });
});
