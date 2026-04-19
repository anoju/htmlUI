document.addEventListener("DOMContentLoaded", () => {
  // DOM 요소 선택 (카멜 케이스 유지)
  const openShowModalBtn = document.getElementById("openShowModalBtn");
  const openShowBtn = document.getElementById("openShowBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const confirmModalBtn = document.getElementById("confirmModalBtn");
  const focusDialog = document.getElementById("focusDialog");

  // 방어적 코딩 - DOM 요소 누락 검사
  if (!openShowModalBtn || !openShowBtn || !closeModalBtn || !focusDialog) {
    console.error("필수 요소를 찾을 수 없습니다.");
    return;
  }

  /*
   * [닫기 인터랙션 로직]
   * 기본 close()를 바로 호출하면 애니메이션 없이 화면에서 바로 지워지므로,
   * CSS 페이드 아웃 애니메이션 클래스(.is-closing)를 먼저 추가하고
   * 애니메이션이 끝난 후(animationend) 최후에 close() 메서드를 호출하는 기법입니다.
   */
  const handleCloseModal = () => {
    // 만약 이미 닫는 애니메이션이 진행 중이라면 중복 실행 보호
    if (focusDialog.classList.contains("is-closing")) return;

    // 1단계: 닫힘 애니메이션 클래스 부착
    focusDialog.classList.add("is-closing");

    // 2단계: 애니메이션 완료 시 이벤트
    const onAnimationEnd = () => {
      focusDialog.classList.remove("is-closing");

      // 3단계: [ close() 메서드 ] - 실제 모달을 닫고 포커스를 되돌려줍니다.
      focusDialog.close();

      focusDialog.removeEventListener("animationend", onAnimationEnd);
    };

    // 애니메이션 종료 이벤트 리스너 등록
    focusDialog.addEventListener("animationend", onAnimationEnd);
  };

  /*
   * [ showModal() 메서드 바인딩 ]
   * 백그라운드를 차단(::backdrop 적용)하고 다른 요소로의 접근을 막는 전형적 "모달" 실행
   */
  openShowModalBtn.addEventListener("click", () => {
    try {
      focusDialog.showModal();
    } catch (error) {
      console.error("showModal 실행 에러:", error);
    }
  });

  /*
   * [ show() 메서드 바인딩 ]
   * 백그라운드 차단 없이 떠있는 "일반 팝업창" 스타일로 실행
   */
  openShowBtn.addEventListener("click", () => {
    try {
      focusDialog.show();
    } catch (error) {
      console.error("show 실행 에러:", error);
    }
  });

  // 버튼에 닫기 함수 연결
  closeModalBtn.addEventListener("click", handleCloseModal);
  confirmModalBtn?.addEventListener("click", handleCloseModal);

  // 다이얼로그 오버레이 클릭 시 닫기
  // (show() 방식에서는 모달 외부를 클릭할 수 있게 되므로, showModal()로 떴을 때만 발동합니다)
  focusDialog.addEventListener("click", (event) => {
    const rect = focusDialog.getBoundingClientRect();
    const isOutside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    // 모달 영역 바깥쪽을 클릭했을 시 닫기 동작 수행
    if (isOutside && focusDialog.open) {
      handleCloseModal();
    }
  });

  // --- 새로 추가된 모달 로직 (바텀시트, 풀팝업) ---
  const bottomSheetDialog = document.getElementById("bottomSheetDialog");
  const fullPopupDialog = document.getElementById("fullPopupDialog");
  const openBottomSheetBtn = document.getElementById("openBottomSheetBtn");
  const openFullPopupBtn = document.getElementById("openFullPopupBtn");
  const closeBottomBtn = document.getElementById("closeBottomBtn");
  const closeFullPopupBtn = document.getElementById("closeFullPopupBtn");
  const closeFullPopupIconBtn = document.getElementById("closeFullPopupIconBtn");

  // 열기 이벤트 연결
  if (openBottomSheetBtn) openBottomSheetBtn.addEventListener("click", () => bottomSheetDialog?.showModal());
  if (openFullPopupBtn) openFullPopupBtn.addEventListener("click", () => fullPopupDialog?.showModal());

  // 닫기 트랜지션 처리 및 닫기 이벤트 연결
  const handleCloseAnyModal = (dialogElement) => {
    if (!dialogElement || dialogElement.classList.contains("is-closing")) return;
    dialogElement.classList.add("is-closing");
    
    const onEnd = () => {
      dialogElement.classList.remove("is-closing");
      dialogElement.close();
      dialogElement.removeEventListener("animationend", onEnd);
    };
    dialogElement.addEventListener("animationend", onEnd);
  };

  if (closeBottomBtn) closeBottomBtn.addEventListener("click", () => handleCloseAnyModal(bottomSheetDialog));
  if (closeFullPopupBtn) closeFullPopupBtn.addEventListener("click", () => handleCloseAnyModal(fullPopupDialog));
  if (closeFullPopupIconBtn) closeFullPopupIconBtn.addEventListener("click", () => handleCloseAnyModal(fullPopupDialog));

  // 바깥쪽(백드롭) 클릭 시 닫기 이벤트 연결
  [bottomSheetDialog, fullPopupDialog].forEach(dialog => {
    if (!dialog) return;
    dialog.addEventListener("click", (event) => {
      const rect = dialog.getBoundingClientRect();
      const isOutside =
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom;

      if (isOutside && dialog.open) {
        handleCloseAnyModal(dialog);
      }
    });
  });
});
