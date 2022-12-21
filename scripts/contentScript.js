(() => {
  let githubScript

  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    main();
  })

  importGithubScript();

  main();


  function main() {
    if (!isPullRequestPage()) return;

    const button = createButton();
    addButtonToSidebar(button);
  }


  function isPullRequestPage() {
    return location.href.includes('github.com') && location.href.includes('/pull/');
  }

  function importGithubScript() {
    const src = chrome.runtime.getURL("scripts/github.js");

    import(src)
      .then((data) => {
        githubScript = data;
      });
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
    setTimeout(() => {
      const sidebar = document.getElementById('partial-discussion-sidebar');
      sidebar.appendChild(button);
    }, 500)
  }

  function onButtonClick() {
    githubScript.main();
  }
})();
