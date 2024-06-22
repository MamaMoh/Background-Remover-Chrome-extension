// public/background.js

chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({ url: "https://www.youtube.com/watch?v=FN3r-k_EMgg" });
  });
  
  // Other background script logic as needed
  