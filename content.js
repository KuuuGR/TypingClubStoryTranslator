// content.js

// Cross-browser compatibility
var extension = typeof browser !== 'undefined' ? browser : chrome;

console.log('TypingClub Story Translator content script loaded at', window.location.href);

let currentTranslation = '';

function applyTranslation() {
  const storyContainer = document.querySelector('.story_typable');
  if (storyContainer) {
    const tokens = storyContainer.querySelectorAll('.token_unit');
    let translationIndex = 0;

    tokens.forEach(token => {
      if (translationIndex < currentTranslation.length) {
        const newChar = currentTranslation[translationIndex];

        if (token.firstChild && token.firstChild.nodeType === Node.TEXT_NODE) {
          if (token.firstChild.textContent !== newChar) {
            token.firstChild.textContent = newChar;
          }
        }
        translationIndex++;
      }
    });

    console.log("Translation applied.");
  } else {
    console.error("Story container not found.");
  }
}

let mutationTimeout;

function setupMutationObserver() {
  const observer = new MutationObserver(() => {
    if (mutationTimeout) clearTimeout(mutationTimeout);

    mutationTimeout = setTimeout(() => {
      applyTranslation();
    }, 10); // Short debounce time for responsiveness
  });

  observer.observe(document.body, {
    characterData: true,
    childList: true,
    subtree: true
  });
}

extension.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
