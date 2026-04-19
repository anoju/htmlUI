const dialog = {
  /**
   * ============================================
   * 1. 코어 제어 메서드
   * ============================================
   */
  open: (target, isModal = true) => {
    const el =
      typeof target === "string" ? document.getElementById(target) : target;

    if (!el) {
      console.warn(`[dialog.open] 엘리먼트를 찾을 수 없습니다:`, target);
      return;
    }

    if (isModal) {
      el.showModal();
      // 모달 오픈 시 배경 스크롤 차단
      document.body.classList.add("scroll-lock");
    } else {
      el.show();
    }
  },

  close: (target) => {
    const el =
      typeof target === "string" ? document.getElementById(target) : target;
    dialog.closeAnimation(el);
  },

  closeAnimation: (el) => {
    if (!el || el.classList.contains("is-closing")) return;

    el.classList.add("is-closing");

    const onAnimationEnd = () => {
      el.classList.remove("is-closing");
      el.close();
      // 애니메이션이 끝나고 완전히 닫힌 후 배경 스크롤 차단 해제
      document.body.classList.remove("scroll-lock");
      el.removeEventListener("animationend", onAnimationEnd);
    };

    el.addEventListener("animationend", onAnimationEnd);
  },

  /**
   * ============================================
   * 2. 이벤트 핸들러 모음
   * ============================================
   */
  handlers: {
    handleOpenModalClick: (e) => {
      const targetId = e.currentTarget.getAttribute("data-open");
      dialog.open(targetId, true);
    },

    handleOpenPopupClick: (e) => {
      const targetId = e.currentTarget.getAttribute("data-show");
      dialog.open(targetId, false);
    },

    handleCloseClick: (e) => {
      const targetId = e.currentTarget.getAttribute("data-close");
      dialog.close(targetId);
    },

    handleBackdropClick: (e) => {
      const el = e.currentTarget;
      if (!el.open) return;

      const rect = el.getBoundingClientRect();
      const isOutside =
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom;

      if (isOutside) {
        dialog.close(el);
      }
    },
  },

  /**
   * ============================================
   * 3. 이벤트 매핑 (Init) 영역
   * - 각 속성마다 고유한 바운드 플래그(-bound)를 부여하여 중복 이벤트만 방어
   * ============================================
   */
  init: () => {
    // [data-open] : showModal() 바인딩
    document
      .querySelectorAll("[data-open]:not([data-open-bound='true'])")
      .forEach((btn) => {
        btn.addEventListener("click", dialog.handlers.handleOpenModalClick);
        btn.setAttribute("data-open-bound", "true");
      });

    // [data-show] : show() 바인딩
    document
      .querySelectorAll("[data-show]:not([data-show-bound='true'])")
      .forEach((btn) => {
        btn.addEventListener("click", dialog.handlers.handleOpenPopupClick);
        btn.setAttribute("data-show-bound", "true");
      });

    // [data-close] : close() 바인딩
    document
      .querySelectorAll("[data-close]:not([data-close-bound='true'])")
      .forEach((btn) => {
        btn.addEventListener("click", dialog.handlers.handleCloseClick);
        btn.setAttribute("data-close-bound", "true");
      });

    // [data-backdrop-close] : 백드롭 바인딩 (속성값 유무만 체크하도록 변경)
    document
      .querySelectorAll(
        "dialog[data-backdrop-close]:not([data-backdrop-bound='true'])",
      )
      .forEach((el) => {
        el.addEventListener("click", dialog.handlers.handleBackdropClick);
        el.setAttribute("data-backdrop-bound", "true");
      });
  },
};

/**
 * ============================================
 * 참고 목적의 별도 예제 코드 (서버 통신 딜레이 후 모달 오픈 시뮬레이션용)
 * ============================================
 */
const initProgrammaticTestExample = () => {
  const pyTestBtn = document.getElementById("openProgrammaticBtn");

  if (!pyTestBtn || pyTestBtn.hasAttribute("data-example-bound")) return;

  pyTestBtn.addEventListener("click", (e) => {
    const btn = e.currentTarget;
    const originalText = btn.innerText;

    btn.innerText = "⏳ 데이터 통신 중... (1.5초)";
    btn.style.opacity = "0.6";
    btn.style.cursor = "not-allowed";
    btn.disabled = true;

    setTimeout(() => {
      const targetElement = document.getElementById("focusDialog");
      dialog.open(targetElement, true);

      btn.innerText = originalText;
      btn.removeAttribute("style");
      btn.disabled = false;
    }, 1500);
  });

  pyTestBtn.setAttribute("data-example-bound", "true");
};

/**
 * ============================================
 * 모듈 / DOM 로드 시 실행
 * ============================================
 */
document.addEventListener("DOMContentLoaded", () => {
  dialog.init();

  // JS 별도 함수 호출로 열기 예제
  initProgrammaticTestExample();
});
