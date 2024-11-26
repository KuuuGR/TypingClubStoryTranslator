// background.js

chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed.");
  });
  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (
      changeInfo.status === 'complete' &&
      tab.url &&
      /^https:\/\/(www\.)?edclub\.com\//.test(tab.url)
    ) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
      }, () => {
        if (chrome.runtime.lastError) {
          console.error("Error injecting content script:", chrome.runtime.lastError);
        } else {
          console.log("Content script injected into tab", tabId);
        }
      });
    }
  });
  