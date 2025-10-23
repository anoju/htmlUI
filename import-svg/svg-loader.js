/**
 * SVG Auto Loader
 * data-svg 속성을 가진 요소를 찾아 해당 SVG 파일을 로드하여 삽입합니다.
 */

/**
 * SVG 파일을 로드하여 요소에 삽입
 * @param {HTMLElement} element - SVG를 삽입할 요소
 * @param {string} svgName - SVG 파일명 (확장자 제외)
 */
function loadSvg(element, svgName) {
  // 이미 로드 중인 경우 중복 실행 방지
  if (element.dataset.svgLoading === 'true') {
    return;
  }

  // 로딩 상태 표시
  element.dataset.svgLoading = 'true';

  const svgPath = `./svg/${svgName}.svg`;

  fetch(svgPath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`SVG 파일을 찾을 수 없습니다: ${svgPath}`);
      }
      return response.text();
    })
    .then(svgContent => {
      // SVG 내용을 요소에 삽입
      element.innerHTML = svgContent;

      // 로딩 관련 속성 모두 제거
      delete element.dataset.svgLoading;
      delete element.dataset.svg;

      // 로드 완료 이벤트 발생
      element.dispatchEvent(new CustomEvent('svg-loaded', {
        detail: { svgName, svgPath }
      }));
    })
    .catch(error => {
      console.error(`SVG 로드 실패 [${svgName}]:`, error);
      delete element.dataset.svgLoading;
      element.classList.add('svg-load-error');
    });
}

/**
 * data-svg 속성을 가진 요소를 찾아 SVG 로드
 * @param {HTMLElement|Document} [target=document] - 검색할 대상 요소 (기본값: document)
 */
function initSvg(target = document) {
  const elements = target.querySelectorAll('[data-svg]');

  elements.forEach(element => {
    const svgName = element.getAttribute('data-svg');

    if (svgName) {
      loadSvg(element, svgName);
    } else {
      console.warn('data-svg 속성 값이 비어있습니다:', element);
    }
  });
}
