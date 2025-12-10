/**
 * WheelPicker - HTML + JS Wheel Picker Component (Multi-column support)
 * Vue WheelPicker와 scroll-selector.js를 참고하여 제작
 */
class WheelPicker {
  constructor(options) {
    const defaults = {
      el: null,                    // 컨테이너 엘리먼트
      options: [],                 // 옵션 배열 또는 2차원 배열
      value: null,                 // 초기 선택 값 (단일 또는 배열)
      infinite: false,             // 무한 스크롤 여부
      height: 40,                  // 각 아이템 높이
      count: 5,                    // 보이는 아이템 개수 (홀수 권장)
      onChange: null,              // 값 변경 콜백
      sensitivity: 3,              // 스크롤 감도 (낮을수록 빠름)
      classNames: [],              // 각 컬럼별 클래스명
      ariaLabels: [],              // 각 컬럼별 aria-label
      showButtons: false,          // 이전/다음 버튼 표시 여부
    };

    this.config = Object.assign({}, defaults, options);
    this.container = typeof this.config.el === 'string'
      ? document.querySelector(this.config.el)
      : this.config.el;

    if (!this.container) {
      console.error('WheelPicker - Invalid Element');
      return;
    }

    // 다중 컬럼 여부 판단
    this.isMultiColumn = Array.isArray(this.config.options[0]);
    this.normalizedOptions = this.isMultiColumn
      ? this.config.options
      : [this.config.options];

    // 다중 값 정규화
    this.normalizedValue = Array.isArray(this.config.value)
      ? this.config.value
      : [this.config.value];

    // 컬럼 인스턴스들
    this.columns = [];

    this._init();
  }

  _init() {
    if (!this.normalizedOptions.length || !this.normalizedOptions[0].length) {
      console.warn('WheelPicker - No options provided');
      return;
    }

    this._createMarkup();
    this._createColumns();
  }

  _createMarkup() {
    this.container.classList.add('wheel-picker');
    this.container.innerHTML = '';
  }

  _createColumns() {
    this.normalizedOptions.forEach((columnOptions, index) => {
      const initialValue = this.normalizedValue[index] !== undefined
        ? this.normalizedValue[index]
        : columnOptions[0]?.value;

      const column = new WheelPickerColumn({
        container: this.container,
        options: columnOptions,
        value: initialValue,
        infinite: this.config.infinite,
        height: this.config.height,
        count: this.config.count,
        sensitivity: this.config.sensitivity,
        ariaLabel: this.config.ariaLabels[index] || `${index + 1}번째 항목 선택`,
        showButtons: this.config.showButtons,
        className: this.config.classNames[index],
        isFirstChild: index === 0,
        isLastChild: index === this.normalizedOptions.length - 1,
        onChange: (selected) => this._handleColumnChange(index, selected)
      });

      this.columns.push(column);
    });
  }

  _handleColumnChange(columnIndex, selected) {
    this.normalizedValue[columnIndex] = selected.value;

    if (this.config.onChange) {
      const returnValue = this.isMultiColumn
        ? [...this.normalizedValue]
        : this.normalizedValue[0];

      this.config.onChange(returnValue, columnIndex, selected);
    }
  }

  // Public API
  getValue() {
    return this.isMultiColumn ? [...this.normalizedValue] : this.normalizedValue[0];
  }

  getSelected() {
    const selected = this.columns.map(col => col.getSelected());
    return this.isMultiColumn ? selected : selected[0];
  }

  select(value, columnIndex = 0) {
    if (this.isMultiColumn && Array.isArray(value)) {
      value.forEach((val, idx) => {
        if (this.columns[idx]) {
          this.columns[idx].select(val);
        }
      });
    } else if (this.isMultiColumn) {
      if (this.columns[columnIndex]) {
        this.columns[columnIndex].select(value);
      }
    } else {
      if (this.columns[0]) {
        this.columns[0].select(value);
      }
    }
  }

  updateOptions(options, columnIndex = null) {
    this.config.options = options;
    this.isMultiColumn = Array.isArray(options[0]);
    this.normalizedOptions = this.isMultiColumn ? options : [options];

    if (columnIndex !== null && this.columns[columnIndex]) {
      this.columns[columnIndex].updateOptions(options);
    } else {
      this.destroy();
      this._init();
    }
  }

  destroy() {
    this.columns.forEach(col => col.destroy());
    this.columns = [];
    this.container.classList.remove('wheel-picker');
    this.container.innerHTML = '';
  }
}

/**
 * WheelPickerColumn - 단일 컬럼 처리
 */
class WheelPickerColumn {
  constructor(options) {
    const defaults = {
      container: null,
      options: [],
      value: null,
      infinite: false,
      height: 40,
      count: 5,
      onChange: null,
      sensitivity: 3,
      ariaLabel: '옵션 선택',
      showButtons: false,
      className: '',
      isFirstChild: false,
      isLastChild: false
    };

    this.config = Object.assign({}, defaults, options);
    this.parentContainer = this.config.container;

    if (!this.parentContainer) {
      console.error('WheelPickerColumn - Invalid Container');
      return;
    }

    // wheel-picker__items 엘리먼트 생성
    this.container = document.createElement('div');
    this.container.className = 'wheel-picker__items';

    if (this.config.className) {
      this.container.classList.add(this.config.className);
    }

    this.parentContainer.appendChild(this.container);

    // 상수
    this.RESISTANCE = 0.3;
    this.MAX_VELOCITY = 30;
    this.count = this.config.count;
    this.half = Math.floor(this.count / 2) + 1;
    this.containerHeight = Math.round(this.config.height * this.count);
    this.baseDeceleration = this.config.sensitivity * 10;
    this.snapBackDeceleration = 10;

    // 상태
    this.scroll = 0;
    this.moveId = 0;
    this.dragging = false;
    this.normalizedOptions = [];

    this.touchData = {
      startY: 0,
      yList: [],
      touchScroll: 0,
      isClick: true,
      totalMovement: 0
    };

    // DOM 요소
    this.elements = {
      container: this.container,
      wheelList: null,
      wheelItems: [],
      highlight: null,
      highlightList: null,
      highlightItems: [],
      prevButton: null,
      nextButton: null,
      slider: null
    };

    this.dragController = null;

    this._init();
  }

  _init() {
    if (!this.config.options.length) {
      console.warn('WheelPickerColumn - No options provided');
      return;
    }

    this._normalizeOptions();
    this._createMarkup();
    this._bindEvents();
    this._initializeValue();
  }

  _normalizeOptions() {
    if (!this.config.infinite) {
      this.normalizedOptions = [...this.config.options];
      return;
    }

    const result = [];
    while (result.length < this.half) {
      result.push(...this.config.options);
    }
    this.normalizedOptions = result;
  }

  _createMarkup() {
    const clipHeight = this.config.height;
    const clipTop = clipHeight * Math.floor(this.count / 2);
    const clipBottom = clipTop + clipHeight;
    const clipPath = `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% ${clipBottom}px, 100% ${clipBottom}px, 100% ${clipTop}px, 0% ${clipTop}px, 0% 0%)`;

    let wheelItemsHTML = '';
    this.normalizedOptions.forEach((option, index) => {
      wheelItemsHTML += `<li class="wheel-picker__options-item" data-index="${index}">${option.label}</li>`;
    });

    if (this.config.infinite) {
      const optLength = this.normalizedOptions.length;
      for (let i = 0; i < this.half; i++) {
        const prependIndex = -i - 1;
        const appendIndex = i + optLength;
        const prependOption = this.normalizedOptions[optLength - i - 1];
        const appendOption = this.normalizedOptions[i];

        wheelItemsHTML = `<li class="wheel-picker__options-item" data-index="${prependIndex}">${prependOption.label}</li>` + wheelItemsHTML;
        wheelItemsHTML += `<li class="wheel-picker__options-item" data-index="${appendIndex}">${appendOption.label}</li>`;
      }
    }

    let highlightItemsHTML = '';
    this.normalizedOptions.forEach((option, index) => {
      highlightItemsHTML += `<li class="wheel-picker__highlight-item">${option.label}</li>`;
    });

    if (this.config.infinite) {
      const firstItem = this.normalizedOptions[0];
      const lastItem = this.normalizedOptions[this.normalizedOptions.length - 1];
      highlightItemsHTML = `<li class="wheel-picker__highlight-item">${lastItem.label}</li>` + highlightItemsHTML;
      highlightItemsHTML += `<li class="wheel-picker__highlight-item">${firstItem.label}</li>`;
    }

    const buttonsHTML = this.config.showButtons ? `
        <button class="wheel-picker__prev-button" type="button" aria-label="이전 항목 선택"></button>
        <button class="wheel-picker__next-button" type="button" aria-label="다음 항목 선택"></button>
    ` : '';

    // radius 클래스 추가
    let highlightClass = 'wheel-picker__highlight';
    if (this.config.isFirstChild) {
      highlightClass += ' wheel-picker__highlight--first';
    }
    if (this.config.isLastChild) {
      highlightClass += ' wheel-picker__highlight--last';
    }

    const template = `
      <div class="wheel-picker__options" style="-webkit-clip-path:${clipPath};clip-path:${clipPath};">
        <ul class="wheel-picker__options-list" role="listbox">
          ${wheelItemsHTML}
        </ul>
      </div>
      <div class="${highlightClass}" style="height: ${this.config.height}px; line-height: ${this.config.height}px;">
        <ul class="wheel-picker__highlight-list" style="top: ${this.config.infinite ? -this.config.height : 0}px;">
          ${highlightItemsHTML}
        </ul>
      </div>
      ${buttonsHTML}
      <input
        type="range"
        class="wheel-picker__slider"
        min="0"
        max="${this.normalizedOptions.length - 1}"
        value="0"
        style="height: ${this.config.height}px;"
        aria-label="${this.config.ariaLabel}"
      />
    `;

    this.container.style.height = `${this.containerHeight}px`;
    this.container.innerHTML = template;

    this.elements.wheelList = this.container.querySelector('.wheel-picker__options-list');
    this.elements.wheelItems = this.container.querySelectorAll('.wheel-picker__options-item');
    this.elements.highlight = this.container.querySelector('.wheel-picker__highlight');
    this.elements.highlightList = this.container.querySelector('.wheel-picker__highlight-list');
    this.elements.highlightItems = this.container.querySelectorAll('.wheel-picker__highlight-item');
    this.elements.prevButton = this.container.querySelector('.wheel-picker__prev-button');
    this.elements.nextButton = this.container.querySelector('.wheel-picker__next-button');
    this.elements.slider = this.container.querySelector('.wheel-picker__slider');
  }

  _bindEvents() {
    this._handleDragStart = this._handleDragStart.bind(this);
    this._handleDragMove = this._handleDragMove.bind(this);
    this._handleDragEnd = this._handleDragEnd.bind(this);
    this._handleItemClick = this._handleItemClick.bind(this);

    this.container.addEventListener('touchstart', this._handleDragStart, { passive: false });
    this.container.addEventListener('touchend', this._handleDragEnd, { passive: false });

    // 이벤트 다중실행 방지: document 이벤트는 한 번만 등록
    if (!this._documentEventsAttached) {
      document.addEventListener('mousedown', this._handleDragStart, { passive: false });
      document.addEventListener('mouseup', this._handleDragEnd, { passive: false });
      this._documentEventsAttached = true;
    }

    this.elements.wheelItems.forEach(item => {
      item.addEventListener('click', this._handleItemClick);
    });

    if (this.config.showButtons) {
      if (this.elements.prevButton) {
        this.elements.prevButton.addEventListener('click', () => this._selectPreviousItem());
      }
      if (this.elements.nextButton) {
        this.elements.nextButton.addEventListener('click', () => this._selectNextItem());
      }
    }

    this.elements.slider.addEventListener('input', (e) => this._handleSliderInput(e));
  }

  _handleDragStart(e) {
    const isTargetValid = this.container.contains(e.target) || e.target === this.container;

    if ((this.dragging || isTargetValid) && e.cancelable) {
      e.preventDefault();
      if (this.normalizedOptions.length) {
        this._initiateDragGesture(e);
      }
    }
  }

  _initiateDragGesture(e) {
    this.dragging = true;
    this.dragController = new AbortController();
    const { signal } = this.dragController;

    this.container.addEventListener('touchmove', this._handleDragMove, { signal, passive: false });
    document.addEventListener('mousemove', this._handleDragMove, { signal, passive: false });

    const startY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
    this.touchData.startY = startY;
    this.touchData.yList = [[startY, Date.now()]];
    this.touchData.touchScroll = this.scroll;
    this.touchData.isClick = true;
    this.touchData.totalMovement = 0;

    this._cancelAnimation();
  }

  _handleDragMove(e) {
    if (!this.dragging && !this.container.contains(e.target) && e.target !== this.container) {
      return;
    }

    if (e.cancelable) {
      e.preventDefault();
    }

    if (this.normalizedOptions.length) {
      this._updateScrollDuringDrag(e);
    }
  }

  _updateScrollDuringDrag(e) {
    const currentY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

    if (this.touchData.isClick) {
      const dragThreshold = 5;
      const totalMovement = Math.abs(currentY - this.touchData.startY);
      this.touchData.totalMovement = totalMovement;

      if (totalMovement > dragThreshold) {
        this.touchData.isClick = false;
      }
    }

    this.touchData.yList.push([currentY, Date.now()]);
    if (this.touchData.yList.length > 5) {
      this.touchData.yList.shift();
    }

    const dragDelta = (this.touchData.startY - currentY) / this.config.height;
    let nextScroll = this.scroll + dragDelta;

    if (this.config.infinite) {
      nextScroll = this._normalizeScroll(nextScroll);
    } else {
      const maxIndex = this.normalizedOptions.length;
      if (nextScroll < 0) {
        nextScroll *= this.RESISTANCE;
      } else if (nextScroll > maxIndex) {
        nextScroll = maxIndex + (nextScroll - maxIndex) * this.RESISTANCE;
      }
    }

    this.touchData.touchScroll = this._scrollTo(nextScroll);
  }

  _handleDragEnd(e) {
    if (!this.normalizedOptions.length) return;

    const isDragging = this.dragging;
    const isTargetValid = this.container.contains(e.target) || e.target === this.container;

    if ((isDragging || isTargetValid) && e.cancelable) {
      e.preventDefault();
      this._finalizeDragAndStartInertiaScroll(e);
    }
  }

  _finalizeDragAndStartInertiaScroll(event) {
    try {
      if (this.dragController) {
        this.dragController.abort();
        this.dragController = null;
      }

      // 드래그 상태를 먼저 false로 설정하여 클릭 이벤트 방지
      this.dragging = false;

      if (this.touchData.isClick) {
        // 모바일에서 preventDefault로 클릭 이벤트가 발생하지 않는 이슈로 여기서 클릭 이벤트 처리
        if (event && event.changedTouches) {
          const touch = event.changedTouches[0];
          if (touch) {
            // 터치 이벤트에서 클릭된 아이템 찾기
            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            const listItem = element?.closest('.wheel-picker__options-item');
            if (listItem && listItem.dataset.index) {
              const clickedIndex = parseInt(listItem.dataset.index);
              this._handleItemClick({ currentTarget: listItem });
            }
          }
        }
        return;
      }

      let velocity = 0;
      const { yList } = this.touchData;

      if (yList.length > 1) {
        const len = yList.length;
        const [startY, startTime] = yList[len - 2] || [0, 0];
        const [endY, endTime] = yList[len - 1] || [0, 0];
        const timeDiff = endTime - startTime;

        if (timeDiff > 0) {
          const distance = startY - endY;
          const velocityPerSecond = ((distance / this.config.height) * 1000) / timeDiff;
          const direction = velocityPerSecond > 0 ? 1 : -1;
          const absVelocity = Math.min(Math.abs(velocityPerSecond), this.MAX_VELOCITY);
          velocity = absVelocity * direction;
        }
      }

      this.scroll = this.touchData.touchScroll ?? this.scroll;
      this._decelerateAndAnimateScroll(velocity);
    } catch (error) {
      console.error('Error in finalizeDragAndStartInertiaScroll:', error);
    }
  }

  _handleItemClick(e) {
    // 드래그 중이거나 드래그 이동이 있었다면 무시
    if (this.dragging || (this.touchData.totalMovement && this.touchData.totalMovement > 5)) {
      return;
    }

    const itemIndex = parseInt(e.currentTarget.dataset.index);
    if (isNaN(itemIndex)) return;

    this._cancelAnimation();
    this._animateScroll(this.scroll, itemIndex, 0.3, () => {
      this._selectByScroll(itemIndex);
    });
  }

  _normalizeScroll(scroll) {
    return ((scroll % this.normalizedOptions.length) + this.normalizedOptions.length) % this.normalizedOptions.length;
  }

  _calculateDistance(itemIndex, scrollPosition) {
    if (this.config.infinite) {
      const normalizedItemIndex = ((itemIndex % this.normalizedOptions.length) + this.normalizedOptions.length) % this.normalizedOptions.length;
      const distance = Math.abs(normalizedItemIndex - scrollPosition);
      return Math.min(distance, this.normalizedOptions.length - distance);
    }
    return Math.abs(itemIndex - scrollPosition);
  }

  _scrollTo(scroll) {
    const normalizedScroll = this.config.infinite ? this._normalizeScroll(scroll) : scroll;

    if (this.elements.wheelList) {
      this.elements.wheelList.style.transform = `translateY(${-normalizedScroll * this.config.height}px)`;

      this.elements.wheelItems.forEach(item => {
        const itemIndex = parseInt(item.dataset.index);
        const distance = this._calculateDistance(itemIndex, normalizedScroll);
        const isVisible = distance <= this.half;

        item.style.top = `${-this.config.height / 2}px`;
        item.style.height = `${this.config.height}px`;
        item.style.lineHeight = `${this.config.height}px`;
        item.style.transform = `translateY(${itemIndex * this.config.height}px)`;
        item.style.visibility = isVisible ? 'visible' : 'hidden';

        if (itemIndex === Math.round(normalizedScroll)) {
          item.classList.add('active');
          item.setAttribute('aria-selected', 'true');
        } else {
          item.classList.remove('active');
          item.setAttribute('aria-selected', 'false');
        }
      });
    }

    if (this.elements.highlightList) {
      this.elements.highlightList.style.transform = `translateY(${-normalizedScroll * this.config.height}px)`;
    }

    return normalizedScroll;
  }

  _cancelAnimation() {
    if (this.moveId) {
      cancelAnimationFrame(this.moveId);
      this.moveId = 0;
    }
  }

  _easeOutCubic(p) {
    return Math.pow(p - 1, 3) + 1;
  }

  _animateScroll(startScroll, endScroll, duration, onComplete) {
    if (startScroll === endScroll || duration === 0) {
      this._scrollTo(startScroll);
      return;
    }

    const startTime = performance.now();
    const totalDistance = endScroll - startScroll;

    const tick = (currentTime) => {
      const elapsed = (currentTime - startTime) / 1000;

      if (elapsed < duration) {
        const progress = this._easeOutCubic(elapsed / duration);
        const currentScroll = startScroll + progress * totalDistance;
        this.scroll = this._scrollTo(currentScroll);
        this.moveId = requestAnimationFrame(tick);
      } else {
        this._cancelAnimation();
        this.scroll = this._scrollTo(endScroll);
        if (onComplete) onComplete();
      }
    };

    requestAnimationFrame(tick);
  }

  _decelerateAndAnimateScroll(initialVelocity) {
    const currentScroll = this.scroll;
    let targetScroll = currentScroll;
    let deceleration = initialVelocity > 0 ? -this.baseDeceleration : this.baseDeceleration;
    let duration = 0;

    if (this.config.infinite) {
      duration = Math.abs(initialVelocity / deceleration);
      const scrollDistance = initialVelocity * duration + 0.5 * deceleration * duration * duration;
      targetScroll = Math.round(currentScroll + scrollDistance);
    } else if (currentScroll < 0 || currentScroll > this.normalizedOptions.length - 1) {
      const target = Math.max(0, Math.min(currentScroll, this.normalizedOptions.length - 1));
      const scrollDistance = currentScroll - target;
      deceleration = this.snapBackDeceleration;
      duration = Math.sqrt(Math.abs(scrollDistance / deceleration));
      initialVelocity = deceleration * duration;
      initialVelocity = currentScroll > 0 ? -initialVelocity : initialVelocity;
      targetScroll = target;
    } else {
      duration = Math.abs(initialVelocity / deceleration);
      const scrollDistance = initialVelocity * duration + 0.5 * deceleration * duration * duration;
      targetScroll = Math.round(currentScroll + scrollDistance);
      targetScroll = Math.max(0, Math.min(targetScroll, this.normalizedOptions.length - 1));
      const adjustedDistance = targetScroll - currentScroll;
      duration = Math.sqrt(Math.abs(adjustedDistance / deceleration));
    }

    this._animateScroll(currentScroll, targetScroll, duration + 0.2, () => {
      this._selectByScroll(this.scroll);
    });
  }

  _selectByScroll(scroll) {
    const normalized = this._normalizeScroll(scroll) | 0;
    const boundedScroll = this.config.infinite
      ? normalized
      : Math.min(Math.max(normalized, 0), this.normalizedOptions.length - 1);

    if (!this.config.infinite && boundedScroll !== scroll) return;

    this.scroll = this._scrollTo(boundedScroll);
    const selected = this.normalizedOptions[this.scroll];

    if (selected) {
      this.config.value = selected.value;
      this._updateSlider();

      if (this.config.onChange) {
        this.config.onChange(selected);
      }
    }
  }

  _initializeValue() {
    const index = this.normalizedOptions.findIndex(opt => opt.value === this.config.value);

    if (index >= 0) {
      this.scroll = index;
      this._scrollTo(index);
      this._updateSlider();
    } else if (this.normalizedOptions.length > 0) {
      this.config.value = this.normalizedOptions[0].value;
      this.scroll = 0;
      this._scrollTo(0);
      this._updateSlider();
    }
  }

  _updateSlider() {
    if (this.elements.slider) {
      this.elements.slider.value = Math.round(this.scroll);
    }
  }

  _selectPreviousItem() {
    const currentIndex = Math.round(this.scroll);
    let previousIndex;

    if (this.config.infinite) {
      previousIndex = currentIndex === 0 ? this.normalizedOptions.length - 1 : currentIndex - 1;
    } else {
      if (currentIndex <= 0) return;
      previousIndex = Math.max(0, currentIndex - 1);
    }

    this._cancelAnimation();
    this._animateScroll(this.scroll, previousIndex, 0.3, () => {
      this._selectByScroll(previousIndex);
    });
  }

  _selectNextItem() {
    const currentIndex = Math.round(this.scroll);
    const maxIndex = this.normalizedOptions.length - 1;
    let nextIndex;

    if (this.config.infinite) {
      nextIndex = currentIndex === maxIndex ? 0 : currentIndex + 1;
    } else {
      if (currentIndex >= maxIndex) return;
      nextIndex = Math.min(maxIndex, currentIndex + 1);
    }

    this._cancelAnimation();
    this._animateScroll(this.scroll, nextIndex, 0.3, () => {
      this._selectByScroll(nextIndex);
    });
  }

  _handleSliderInput(e) {
    const newIndex = parseInt(e.target.value);
    if (!isNaN(newIndex)) {
      this._cancelAnimation();
      this._animateScroll(this.scroll, newIndex, 0.2);
    }
  }

  select(value) {
    const index = this.normalizedOptions.findIndex(opt => opt.value === value);
    if (index === -1) {
      console.warn(`WheelPickerColumn - Cannot select value: ${value}`);
      return;
    }

    this._cancelAnimation();
    const initScroll = this._normalizeScroll(this.scroll);
    const finalScroll = index;
    const t = Math.sqrt(Math.abs((finalScroll - initScroll) / this.baseDeceleration));

    this._animateScroll(initScroll, finalScroll, t, () => {
      this._selectByScroll(index);
    });
  }

  getValue() {
    return this.config.value;
  }

  getSelected() {
    return this.normalizedOptions[Math.round(this.scroll)];
  }

  updateOptions(options) {
    this.config.options = options;
    this._normalizeOptions();
    this._createMarkup();
    this._bindEvents();
    this._initializeValue();
  }

  destroy() {
    this._cancelAnimation();

    this.container.removeEventListener('touchstart', this._handleDragStart);
    this.container.removeEventListener('touchend', this._handleDragEnd);
    document.removeEventListener('mousedown', this._handleDragStart);
    document.removeEventListener('mouseup', this._handleDragEnd);

    if (this.dragController) {
      this.dragController.abort();
    }

    this.container.innerHTML = '';
    this.elements = null;
    this.normalizedOptions = null;
  }
}
