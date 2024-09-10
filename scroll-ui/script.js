document.addEventListener('DOMContentLoaded', () => {
  const features = document.querySelectorAll('.feature-container');
  let ticking = false;
  const scrollThreshold = 10;
  let lastScrollPosition = 0;

  function animateFeature(feature) {
    const featureContent = feature.querySelector('.feature');
    const aniEls = featureContent.querySelectorAll('[data-scroll-ani]');
    const featureTop = feature.offsetTop;
    const featureHeight = feature.offsetHeight;
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;

    // 스크롤 진행률 계산 (0 ~ 1)
    let progress = (scrollPosition - featureTop + windowHeight) / (featureHeight);

    // 5% ~ 95% 범위로 조정
    progress = Math.max(0, Math.min(1, (progress - 0.1) / 0.8));

    if (progress >= 0 && progress <= 1) {
      aniEls.forEach(function(item) {
        const data = item.dataset.scrollAni;
        if (!data) return;
        const dataAry = data.split(' ');

        if (dataAry.includes('scale-up')) {
          const scale = 0.5 + (progress * 0.5);
          item.style.transform = `scale(${scale})`;
        }

        if (dataAry.includes('slide-top')) {
          const translateY = -100 + (progress * 100);
          item.style.transform = `translateY(${translateY}%)`;
        } else if (dataAry.includes('slide-bottom')) {
          const translateY = 100 - (progress * 100);
          item.style.transform = `translateY(${translateY}%)`;
        }

        if (dataAry.includes('slide-left')) {
          const translateX = -100 + (progress * 100);
          item.style.transform = `translateX(${translateX}%)`;
        } else if (dataAry.includes('slide-right')) {
          const translateX = 100 - (progress * 100);
          item.style.transform = `translateX(${translateX}%)`;
        }

        if (dataAry.includes('fade-in')) {
          item.style.opacity = progress;
        }
      });
    }
  }

  function animateOnScroll() {
    const currentScrollPosition = window.scrollY;
    if (!ticking && Math.abs(currentScrollPosition - lastScrollPosition) > scrollThreshold) {
      window.requestAnimationFrame(() => {
        features.forEach(animateFeature);
        ticking = false;
        lastScrollPosition = currentScrollPosition;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // 초기 로드 시 애니메이션 적용
});