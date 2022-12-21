(async () => {
  console.log('contentScript', chrome, location.href);

  if (!isPullRequestPage()) return;

  const button = createButton();
  addButtonToSidebar(button);

  const src = chrome.runtime.getURL("scripts/github.js");
  const githubScript = await import(src);



  function isPullRequestPage() {
    return location.href.includes('github.com') && location.href.includes('/pull/');
  }

  function createButton() {
    const button = document.createElement('button');
    button.innerText = 'Copy included PRs to clipboard';
    button.style = `
    display: block;
    padding: 1rem;
    margin: 2rem auto;
    color: white;
    background-color: #2457ff;
    border-radius: 0.5rem;
    outline: none;
    border: none;
    `
    button.onclick = () => onButtonClick();

    return button;
  }

  function addButtonToSidebar(button) {
    const sidebar = document.getElementById('partial-discussion-sidebar');
    sidebar.appendChild(button);
  }

  function onButtonClick() {
    githubScript.main();
  }
})();
