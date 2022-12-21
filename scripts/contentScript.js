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
    }, 500);
  }

  function setButtonDefaultValues(button) {
    button.innerText = defaultButtonText;
    button.style = buttonStyle;
    button.disabled = false;
  }

  function onButtonClick(button) {
    disableButton(button)

    const loadMoreCommitsButton = document.querySelector('#js-progressive-timeline-item-container button[type=submit]')

    if (!loadMoreCommitsButton) {
      execute(button);
      return;
    }

    loadMoreCommitsButton.click();

    disableButton(button);
    button.innerText = 'Loading more commits';

    setTimeout(() => {
      onButtonClick(button);
    }, 500);
  }

  function execute(button) {
    const numberOfPrs = githubScript.main();
    disableButton(button);
    button.innerText = `${numberOfPrs} PRs copied to clipboard!`;

    setTimeout(() => {
      setButtonDefaultValues(button);
    }, 3000);
  }

  function disableButton(button, text) {
    button.disabled = true;
    button.style.backgroundColor = '#99b1ff';
  }
})();
