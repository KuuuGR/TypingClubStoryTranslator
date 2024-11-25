// Extract text from the story container
function extractStoryText() {
  const storyContainer = document.querySelector('.story_typable');
  if (!storyContainer) {
      return "Story text not found!";
  }

  // Collect text from spans
  let storyText = "";
  storyContainer.querySelectorAll('.token_unit').forEach(token => {
      if (token.textContent) {
          storyText += token.textContent;
      }
  });
  return storyText.trim();
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getStoryText") {
      const storyText = extractStoryText();
      sendResponse({ storyText });
  }
});
