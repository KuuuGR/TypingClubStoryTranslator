// background.js or content.js (depending on manifest version)

chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.query({ url: '*://*.edclub.com/*' }, (tabs) => {
      tabs.forEach(tab => {
        chrome.scripting.insertCSS({
          target: { tabId: tab.id },
          files: ['content.css']
        });
      });
    });
  });
  