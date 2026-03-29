# 🍎 ScrollInteractor Library

**ScrollInteractor**는 애플(Apple) 공식 사이트에서 볼 수 있는 최고급 스크롤 인터랙션 효과를 손쉽게 구현할 수 있도록 설계된 초경량 자바스크립트 라이브러리입니다. 캔버스 이미지 시퀀스 브라우징, 부드러운 스크롤 관성(Inertia), 선언적 애니메이션 시스템을 제공합니다.

---

## 🚀 주요 특징

- **Buttery Smooth Inertia**: `requestAnimationFrame`과 보간 로직을 통해 끊김 없는 부드러운 스크롤링 제공.
- **Canvas Scrubbing**: 고성능 이미지 시퀀스 재생 (반응형 화면에 맞춘 'Cover' 핏 자동 계산).
- **Declarative Animations**: 시작/종료 시점과 값을 정의하는 것만으로 복잡한 이동, 투명도, 스케일링 구현.
- **Advanced Callbacks**: `onUpdate`를 통해 물리적 스크롤값(`rawYOffset`)과 관성 값(`currentYOffset`)을 활용한 커스텀 인터랙션 가능.
- **Anti-Flicker**: 인접 섹션 선행 계산(Adjacent Drawing)을 통해 씬 전환 시의 결함(flicker) 방지.

---

## 📦 설치 및 시작하기

### 1. 파일 링크

```html
<!-- 라이브러리 스타일 -->
<link rel="stylesheet" href="./lib/scroll-interactor.css">

<!-- 라이브러리 스크립트 -->
<script src="./lib/scroll-interactor.js"></script>
```

### 2. 기본 HTML 구조

```html
<!-- Sticky 섹션 (고정형 인터랙션) -->
<section id="section-0" class="si-scroll-section">
  <div class="si-sticky-container">
    <canvas id="canvas-0"></canvas>
    <div class="si-sticky-elem msg-1">메시지 1</div>
  </div>
</section>

<!-- Normal 섹션 (일반 스크롤) -->
<section class="si-normal-section">
  <p>일반적인 스크롤 컨텐츠입니다.</p>
</section>
```

---

## ⚙️ 설정 가이드 (JavaScript)

```javascript
const interactor = new ScrollInteractor({
  container: "body", // 최상위 컨테이너 (기본값 'body')
  inertia: 0.1,      // 관성 강도 (0.01 ~ 0.5 권장, 낮을수록 부드러움)
  scenes: [
    {
      selector: "#section-0",
      type: "sticky",
      height: "500vh", // 스크롤 길이
      
      // 이미지 시퀀스 설정 (Canvas 전용)
      imageSequence: {
        path: "./assets/video/main/",
        prefix: "IMG_",
        startNum: 1,
        count: 300,
        extension: ".JPG"
      },

      // 선언적 애니메이션
      animations: {
        ".msg-1": {
          opacityIn: [0, 1, { start: 0.1, end: 0.2 }],    // 10%~20% 구간 페이드 인
          translateYIn: [20, 0, { start: 0.1, end: 0.2 }], // 아래에서 위로 등장
          opacityOut: [1, 0, { start: 0.3, end: 0.4 }]    // 30%~40% 구간 페이드 아웃
        }
      },

      // 고급 커스텀 업데이트 (수동 제어)
      onUpdate: ({ currentYOffset, rawYOffset, sceneHeight, scrollRatio, interactor, scene }) => {
        // 예: 스크롤에 따른 수동 스타일 제어
        // interactor.calcValue([0.5, 1.2, {start: 0.1, end: 0.5}], currentYOffset, sceneHeight) 로 값 계산 가능
      }
    }
  ]
});
```

---

## 🛠️ 고급 API 가이드

### `calcValue(values, currentYOffset, sceneHeight)`
특정 구간에서 상태 값을 계산하는 핵심 유틸리티입니다.
- `values`: `[시작값, 종료값, {start: 시작비율, end: 종료비율}]`
- 예: `interactor.calcValue([0.5, 1.2, {start: 0.1, end: 0.5}], ...)`

### `onUpdate` 파라미터 상세
- `currentYOffset`: 관성이 적용된 현재 씬 내의 스크롤 위치.
- `rawYOffset`: **관성이 없는** 실제 물리적 스크롤 위치 (고정 락킹 시 사용 권장).
- `scrollRatio`: 현재 씬의 진행도 (0.0 ~ 1.0).
- `interactor`: 라이브러리 인스턴스 그 자체 (메서드 참조용).

---

## 💡 유용한 팁

1. **초기 깜빡임 방지 (Flicker Prevention)**: 라이브러리는 현재 섹션의 ±1 섹션을 항상 같이 계산하므로, 씬 전환 시의 끊김이 없습니다.
2. **반응형 대응**: `si-sticky-container` 내부의 캔버스는 항상 화면 가득 차는 `object-fit: cover` 효과를 자동으로 지원합니다.
3. **Z-Index**: 새로운 섹션이 이전 섹션을 덮어야 하는 경우, `onUpdate` 내에서 `scene.el.style.zIndex`를 동적으로 변경할 수 있습니다.

---

**Antigravity** | Powered by Apple Style Interaction Design
