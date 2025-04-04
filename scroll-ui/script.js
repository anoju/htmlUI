const scrollAni = {
  ticking: false,
  features: null,
  onScroll: function(){
    if (!scrollAni.ticking) {
      window.requestAnimationFrame(() => {
        scrollAni.features.forEach(scrollAni.ani);
        scrollAni.ticking = false;
      });
      scrollAni.ticking = true;
    }
  },
  ani: function(el) {
    const elContent = el.querySelector('.feature');
    const aniEls = elContent.querySelectorAll('[data-scroll-ani]');
    const scrollParent = getScrollParent(el);
    const isWindowScroll = scrollParent === document.documentElement;
  
    const elRect = el.getBoundingClientRect();
    const scrollParentRect = scrollParent.getBoundingClientRect();
  
    const elTop = isWindowScroll ? el.offsetTop : elRect.top - scrollParentRect.top + scrollParent.scrollTop;
    const elHeight = el.offsetHeight;
    const scrollPosition = isWindowScroll ? window.scrollY : scrollParent.scrollTop;
    const viewportHeight = isWindowScroll ? window.innerHeight : scrollParent.clientHeight;
  
    if(elHeight === 0) return;
    // 스크롤 진행률 계산 (0 ~ 1)
    // let progress = isWindowScroll ? (scrollPosition - elTop + viewportHeight) / elHeight : (scrollPosition + viewportHeight - elTop) / (elHeight + viewportHeight);
    let progress = (scrollPosition + viewportHeight - elTop) / elHeight;

    if(progress < 0 || progress > 1) return;
    // 10% ~ 80% 범위로 조정
    progress = Math.max(0, Math.min(1, (progress - 0.1) / 0.8));
  
    if (progress >= 0 && progress <= 1) {
      aniEls.forEach(function(item) {
        const data = item.dataset.scrollAni;
        if (!data) return;
        const dataAry = data.split(' ');
  
        let transform = '';
        let opacity = 1;
  
        if (dataAry.includes('scale-up')) {
          const scale = 0.5 + (progress * 0.5);
          transform += `scale(${scale}) `;
        }
  
        if (dataAry.includes('slide-top')) {
          const translateY = -100 + (progress * 100);
          transform += `translateY(${translateY}%) `;
        } else if (dataAry.includes('slide-bottom')) {
          const translateY = 100 - (progress * 100);
          transform += `translateY(${translateY}%) `;
        }
  
        if (dataAry.includes('slide-left')) {
          const translateX = -100 + (progress * 100);
          transform += `translateX(${translateX}%) `;
        } else if (dataAry.includes('slide-right')) {
          const translateX = 100 - (progress * 100);
          transform += `translateX(${translateX}%) `;
        }
  
        if (dataAry.includes('fade-in')) {
          opacity = progress;
        }
  
        item.style.transform = transform.trim();
        item.style.opacity = opacity;
      });
      setTimeout(function(){
        if(!elContent.classList.contains('_ing')) elContent.classList.add('_ing');
      },0);
    }else{
      setTimeout(function(){
        if(elContent.classList.contains('_ing')) elContent.classList.remove('_ing');
      },0);
    }
  },
  scrollParentAry: [],
  addEvent: function(){
    scrollAni.features.forEach(feature => {
      const scrollParent = getScrollParent(feature);
      if(scrollParent !== document.documentElement && !scrollAni.scrollParentAry.includes(scrollParent)){
        scrollAni.scrollParentAry.push(scrollParent);
        scrollParent.addEventListener('scroll', scrollAni.onScroll);
      }
    });
  },
  init: function(){
    scrollAni.features = document.querySelectorAll('.feature-container');

    window.addEventListener('scroll', scrollAni.onScroll);
    scrollAni.onScroll(); // 초기 로드 시 애니메이션 적용
  }
}



function getScrollParent(element) {
  if (!element) return document.documentElement;
  
  const isScrollable = (el) => {
    const hasScrollableContent = el.scrollHeight > el.clientHeight;
    const overflowYStyle = window.getComputedStyle(el).overflowY;
    const isOverflowHidden = overflowYStyle.indexOf('hidden') === -1;
    
    return hasScrollableContent && isOverflowHidden;
  };

  if (isScrollable(element)) {
    return element;
  }

  return getScrollParent(element.parentElement);
};

function popupOpen(el){
  const $el = typeof el ==='string' ? document.querySelector(el) : el;
  $el.classList.add('open');
  scrollAni.addEvent();
  scrollAni.onScroll();
  document.documentElement.classList.add('pop-open');
};
function popupClose(el){
  const $el = typeof el ==='string' ? document.querySelector(el) : el;
  document.documentElement.classList.remove('pop-open');
  $el.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  scrollAni.init();  
});