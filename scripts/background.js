chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (!tab.url || !tab.url.includes('github.com') || !tab.url.includes('pull')) return;

  console.log(tabId, tab);

  chrome.tabs.sendMessage(tabId, {
    type: "NEW",
    loQueQuiera: 'a'
  })
})
