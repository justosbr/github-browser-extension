chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (!changeInfo.url || !changeInfo.url.includes('github.com') || !changeInfo.url.includes('pull')) return;

  chrome.tabs.sendMessage(tabId, {
    type: "NEW",
  })
})
