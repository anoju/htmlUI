import {
  getPageContent,
  onLinkNavigate,
  transitionHelper,
  getLink
} from '../utils.js';

let galleryPath = '/view-transition/7-expanding-image-ratio/';
if (location.host === 'anoju.github.io') galleryPath = '/htmlUI' + galleryPath;
const catsPath = `${galleryPath}cats/`;

function getNavigationType(fromPath, toPath) {
  if (fromPath.startsWith(catsPath) && toPath === galleryPath) {
    return 'cat-page-to-gallery';
  }

  if (fromPath === galleryPath && toPath.startsWith(catsPath)) {
    return 'gallery-to-cat-page';
  }

  return 'other';
}

function setUrl() {
  if (location.host === 'anoju.github.io') {
    const _link = document.querySelectorAll('.gallery a')
    _link.forEach(function(item) {
      const _href = item.getAttribute('href');
      item.setAttribute('href', '/htmlUI' + _href);
    })
  }
}
setUrl();

onLinkNavigate(async ({
  fromPath,
  toPath
}) => {
  const navigationType = getNavigationType(fromPath, toPath);
  const content = await getPageContent(toPath);
  let targetThumbnail;

  if (navigationType === 'gallery-to-cat-page') {
    targetThumbnail = getLink(toPath).querySelector('img');
    targetThumbnail.style.viewTransitionName = 'banner-img';
  } else {
    setUrl();
  }

  const transition = transitionHelper({
    classNames: navigationType,
    updateDOM() {
      // This is a pretty heavy-handed way to update page content.
      // In production, you'd likely be modifying DOM elements directly,
      // or using a framework.
      // innerHTML is used here just to keep the DOM update super simple.
      document.body.innerHTML = content;

      if (navigationType === 'cat-page-to-gallery') {
        targetThumbnail = getLink(fromPath).querySelector('img');
        targetThumbnail.style.viewTransitionName = 'banner-img';
      }
    }
  });

  transition.finished.finally(() => {
    // Clear the temporary tag
    if (targetThumbnail) targetThumbnail.style.viewTransitionName = '';
  });
});