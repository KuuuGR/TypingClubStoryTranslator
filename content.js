// content.js

// Cross-browser compatibility
var extension = typeof browser !== 'undefined' ? browser : chrome;

console.log('TypingClub Story Translator content script loaded at', window.location.href);

let currentTranslation = '';

// Function to extract the original story text
function extractStoryText() {
  console.log('extractStoryText() called.');
  const storyContainer = document.querySelector('.story_typable');

  if (!storyContainer) {
    const errorMsg = 'Story container not found. Are you on the right page?';
    console.error(errorMsg);
    return { success: false, error: errorMsg };
  }

  const tokens = storyContainer.querySelectorAll('.token_unit');
  let storyText = '';

  tokens.forEach(token => {
    const textContent = token.textContent || '';
    storyText += textContent;
  });

  console.log('Extracted Story Text:', storyText);
  return { success: true, storyText };
}

// Function to apply the translation to the story
function applyTranslation() {
  console.log('Applying translation...');
  const storyContainer = document.querySelector('.story_typable');
  if (storyContainer) {
    const tokens = storyContainer.querySelectorAll('.token_unit');
    let translationIndex = 0;

    tokens.forEach(token => {
      if (translationIndex < currentTranslation.length) {
        const newChar = currentTranslation[translationIndex];

        // Modify only the text node to preserve event listeners and attributes
        if (token.firstChild && token.firstChild.nodeType === Node.TEXT_NODE) {
          token.firstChild.textContent = newChar;
        }
        translationIndex++;
      }
    });

    console.log("Translation applied.");
  } else {
    console.error("Story container not found.");
  }
}

// Function to set up the MutationObserver
function setupMutationObserver() {
  console.log('Setting up MutationObserver...');
  const storyContainer = document.querySelector('.story_typable');
  if (!storyContainer) {
    console.error("Story container not found for MutationObserver.");
    return;
  }

  const observer = new MutationObserver(() => {
    console.log("DOM changed, re-applying translation.");
    applyTranslation();
  });

  observer.observe(storyContainer, { childList: true, subtree: true });
}

// Message listener to handle messages from popup.js
extension.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request);
  if (request.action === "applyTranslation") {
    currentTranslation = request.translatedText;
    applyTranslation();
    setupMutationObserver();
    sendResponse({ success: true });
  } else if (request.action === "getStoryText") {
    const result = extractStoryText();
    if (result.success) {
      sendResponse({ storyText: result.storyText });
    } else {
      sendResponse({ error: result.error });
    }
  }
});
