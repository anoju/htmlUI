document.addEventListener('DOMContentLoaded', () => {
  const features = document.querySelectorAll('.feature-container');
  let ticking = false;
  const scrollThreshold = 10;
  let lastScrollPosition = 0;

  function animateFeature(feature) {
      const featureContent = feature.querySelector('.feature');
      const image = featureContent.querySelector('.feature-image img');
      const featureTop = feature.offsetTop;
      const featureHeight = feature.offsetHeight;
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      // 스크롤 진행률 계산 (0 ~ 1)
      let progress = (scrollPosition - featureTop + windowHeight) / (featureHeight);

      // 5% ~ 95% 범위로 조정
      progress = Math.max(0, Math.min(1, (progress - 0.05) / 0.9));

      if (progress >= 0 && progress <= 1) {
          if (image.parentElement.classList.contains('scale-up')) {
              const scale = 0.5 + (progress * 0.5);
              image.style.transform = `scale(${scale})`;
          } else if (image.parentElement.classList.contains('slide-left')) {
              const translateX = -100 + (progress * 100);
              image.style.transform = `translateX(${translateX}%)`;
          } else if (image.parentElement.classList.contains('slide-right')) {
              const translateX = 100 - (progress * 100);
              image.style.transform = `translateX(${translateX}%)`;
          } else if (image.parentElement.classList.contains('fade-in')) {
              image.style.opacity = progress;
          }
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
