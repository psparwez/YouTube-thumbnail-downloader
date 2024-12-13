chrome.runtime.onInstalled.addListener(() => {
  console.log("YouTube Thumbnail Downloader Extension Installed.");

  chrome.runtime.openOptionsPage();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "THUMBNAIL_INFO") {
    chrome.storage.local.set({ currentThumbnail: message });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url.includes("youtube.com/watch")
  ) {
    chrome.tabs.sendMessage(tabId, { type: "VIDEO_CHANGED" });
  }
});
