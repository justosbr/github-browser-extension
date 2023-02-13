
export function main() {
  const prElements = Array.from(document.querySelectorAll('code'))
    .filter(el => el.textContent.includes('Merge pull request'))

  const pullRequests = prElements.map((el) => ({
    number: getPrNumber(el),
    author: getAuthor(el),
    ...getStory(el),
  }));

  // formatting to markdown
  const md = pullRequests
    .map((pr) => {
      const storyLink = pr.storyLink ? `[[${pr.storyCode}]](${pr.storyLink}) ` : '';
      return ` - #${pr.number} ${storyLink}${pr.author}`;
    })
    .join('\n');
  navigator.clipboard.writeText(md)
  console.log(`%c${pullRequests.length} PRs copied to the clipboard!\nPaste them in the PR's description.`, 'color: red; font-size: 30px');
  return pullRequests.length;
}

function getPrNumber(el) {
  const index = el.textContent.indexOf('#');
  const lastIndex = el.textContent.indexOf(' ', index);

  return el.textContent.substring(index + 1, lastIndex)
}

function getStory(el) {
  const storyAnchorEl = [...el.children].find((e) => e.href?.startsWith('https://app.shortcut.com/justosbr/story/'));
  return {
    storyCode: storyAnchorEl?.innerText,
    storyLink: storyAnchorEl?.href,
  };
}

function getAuthor(el) {
  try {
    return el.parentElement.parentElement.parentElement.querySelector('[data-test-selector="commits-avatar-stack-avatar-image"]').alt;
  } catch (err) {
    console.error(el);
    throw err;
  }
}
