(() => {
  let githubScript

  const defaultButtonText = 'Copy included PRs to clipboard';
  const buttonStyle = `
    display: block;
    padding: 1rem;
    margin: 2rem auto;
    color: white;
    background-color: #2457ff;
    border-radius: 0.5rem;
    outline: none;
    border: none;
    transition: all .25s;
    `

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
    button.onclick = () => onButtonClick(button);
    setButtonDefaultValues(button);

    return button;
  }

  function addButtonToSidebar(button) {
    setTimeout(() => {
      const sidebar = document.getElementById('partial-discussion-sidebar');
      sidebar.appendChild(button);
    }, 500)
  }

  function onButtonClick(button) {
    const numberOfPrs = githubScript.main();
    button.innerText = `${numberOfPrs} PRs copied to clipboard!`;
    button.style.backgroundColor = '#99b1ff';
    button.disabled = true;

    setTimeout(() => {
      setButtonDefaultValues(button);
    }, 1500)
  }

  function setButtonDefaultValues(button) {
    button.innerText = defaultButtonText;
    button.style = buttonStyle;
    button.disabled = false;
  }
})();
