// Extract text from the story container
function extractStoryText() {
  const storyContainer = document.querySelector('.story_typable');
  if (!storyContainer) {
      console.error("Story container not found!");
      return "Story text not found!";
  }

  // Collect all text from spans with the class `token_unit`
  let storyText = "";
  storyContainer.querySelectorAll('.token_unit').forEach(token => {
      if (token.textContent) {
          storyText += token.textContent;
      }
  });
  console.log("Extracted Story Text:", storyText); // Debug log
  return storyText.trim();
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getStoryText") {
      const storyText = extractStoryText(); // Extract text
      sendResponse({ storyText });
  }
});
