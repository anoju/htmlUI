document.addEventListener("DOMContentLoaded", () => {
  // 카멜 케이스(camelCase) 사용
  const openModalBtn = document.getElementById("openModalBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const confirmModalBtn = document.getElementById("confirmModalBtn");
  const focusDialog = document.getElementById("focusDialog");

  // 방어적 코딩 - 요소가 있는지 검증
  if (!openModalBtn || !closeModalBtn || !focusDialog) {
    console.error("필수 요소를 찾을 수 없습니다.");
    return;
  }

  // 모달 닫기 함수
  const handleCloseModal = () => {
    try {
      focusDialog.close();
    } catch (error) {
      console.error("모달 닫기 중 에러 발생:", error);
    }
  };

  // 이벤트 리스너 등록
  openModalBtn.addEventListener("click", () => {
    try {
      // showModal() 호출 시 기본적으로 첫 번째 포커스 가능한 요소로 이동 (여기서는 input)
      focusDialog.showModal();
    } catch (error) {
      console.error("모달 열기 중 에러 발생:", error);
    }
  });

  closeModalBtn.addEventListener("click", handleCloseModal);
  confirmModalBtn?.addEventListener("click", handleCloseModal);

  // 다이얼로그 오버레이(배경) 클릭 시 닫기
  focusDialog.addEventListener("click", (event) => {
    const rect = focusDialog.getBoundingClientRect();
    const isOutside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    if (isOutside) {
      handleCloseModal();
    }
  });
});
