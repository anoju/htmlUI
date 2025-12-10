# WheelPicker

Vue WheelPicker 컴포넌트와 scroll-selector.js를 참고하여 제작한 HTML + JS용 휠 피커 컴포넌트입니다.

## 파일 구조

```
WheelPicker/
├── wheel-picker.js      # 메인 자바스크립트 파일
├── wheel-picker.css     # 스타일시트
├── index.html          # 데모 페이지
└── README.md           # 문서
```

## 사용법

### 1. 파일 포함

```html
<link rel="stylesheet" href="wheel-picker.css">
<script src="wheel-picker.js"></script>
```

### 2. HTML 컨테이너 생성

```html
<div id="myPicker"></div>
```

### 3. 초기화

```javascript
const picker = new WheelPicker({
  el: '#myPicker',
  options: [
    { value: '1', label: '옵션 1' },
    { value: '2', label: '옵션 2' },
    { value: '3', label: '옵션 3' }
  ],
  value: '2',
  onChange: (selected) => {
    console.log('선택된 값:', selected);
  }
});
```

## 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `el` | String \| Element | `null` | 컨테이너 엘리먼트 (필수) |
| `options` | Array | `[]` | 옵션 배열 `{value: xx, label: xx}` (필수) |
| `value` | String \| Number | `null` | 초기 선택 값 |
| `infinite` | Boolean | `false` | 무한 스크롤 여부 |
| `height` | Number | `40` | 각 아이템 높이 (px) |
| `count` | Number | `5` | 보이는 아이템 개수 (홀수 권장) |
| `onChange` | Function | `null` | 값 변경 콜백 함수 |
| `sensitivity` | Number | `3` | 스크롤 감도 (낮을수록 빠름) |

## API 메소드

### select(value)
특정 값을 선택합니다.

```javascript
picker.select('apple');
```

### getValue()
현재 선택된 값을 반환합니다.

```javascript
const currentValue = picker.getValue();
```

### getSelected()
현재 선택된 옵션 객체를 반환합니다.

```javascript
const selected = picker.getSelected();
// { value: 'apple', label: '사과' }
```

### updateOptions(options)
옵션을 업데이트합니다.

```javascript
picker.updateOptions([
  { value: 'a', label: '새 옵션 A' },
  { value: 'b', label: '새 옵션 B' }
]);
```

### destroy()
인스턴스를 파괴하고 모든 이벤트를 제거합니다.

```javascript
picker.destroy();
```

## 예제

### 단일 선택

```javascript
const picker = new WheelPicker({
  el: '#picker1',
  options: [
    { value: 'mon', label: '월요일' },
    { value: 'tue', label: '화요일' },
    { value: 'wed', label: '수요일' }
  ],
  value: 'mon',
  onChange: (selected) => {
    console.log('선택:', selected.label);
  }
});
```

### 무한 스크롤

```javascript
const infinitePicker = new WheelPicker({
  el: '#infinitePicker',
  options: [
    { value: 'red', label: '빨강' },
    { value: 'green', label: '초록' },
    { value: 'blue', label: '파랑' }
  ],
  infinite: true,
  onChange: (selected) => {
    console.log('선택:', selected.label);
  }
});
```

### 다중 피커 (날짜 선택)

```javascript
const yearPicker = new WheelPicker({
  el: '#yearPicker',
  options: [
    { value: 2023, label: '2023년' },
    { value: 2024, label: '2024년' },
    { value: 2025, label: '2025년' }
  ]
});

const monthPicker = new WheelPicker({
  el: '#monthPicker',
  options: Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}월`
  }))
});

const dayPicker = new WheelPicker({
  el: '#dayPicker',
  options: Array.from({ length: 31 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}일`
  }))
});
```

## 특징

- ✅ 터치 및 마우스 드래그 지원
- ✅ 관성 스크롤
- ✅ 무한 스크롤 옵션
- ✅ 접근성 지원 (키보드, 스크린 리더)
- ✅ 다중 피커 조합 가능
- ✅ 모바일 친화적
- ✅ 커스터마이징 가능한 스타일

## 브라우저 지원

- Chrome (최신)
- Firefox (최신)
- Safari (최신)
- Edge (최신)
- 모바일 브라우저

## 라이선스

MIT
