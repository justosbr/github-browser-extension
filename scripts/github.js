
export function main() {
  const elements = [...document.querySelectorAll('[data-test-selector="pr-timeline-commits-list"]')]
    .flatMap((n) => [...n.querySelectorAll('[data-hovercard-type="pull_request"]')]);

  const pullRequests = elements.map((el) => ({
    number: getPrNumber(el.href),
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

function getStory(el) {
  const storyAnchorEl = [...el.parentElement.children].find((e) => e.href?.startsWith('https://app.shortcut.com/justosbr/story/'));
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

function getPrNumber(link) {
  const lastSlashIndex = link.lastIndexOf('/') + 1;
  return link.substring(lastSlashIndex);
}
