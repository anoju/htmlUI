/**
 * WheelPicker - HTML + JS Wheel Picker Component
 * Vue WheelPicker와 scroll-selector.js를 참고하여 제작
 */
class WheelPicker {
  constructor(options) {
    const defaults = {
      el: null,                    // 컨테이너 엘리먼트
      options: [],                 // 옵션 배열 {value: xx, label: xx}
      value: null,                 // 초기 선택 값
      infinite: false,             // 무한 스크롤 여부
      height: 40,                  // 각 아이템 높이
      count: 5,                    // 보이는 아이템 개수 (홀수 권장)
      onChange: null,              // 값 변경 콜백
      sensitivity: 3,              // 스크롤 감도 (낮을수록 빠름)
    };

    this.config = Object.assign({}, defaults, options);
    this.container = typeof this.config.el === 'string'
      ? document.querySelector(this.config.el)
      : this.config.el;

    if (!this.container) {
      console.error('WheelPicker - Invalid Element');
      return;
    }

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

    // 이벤트 컨트롤러
    this.dragController = null;

    this._init();
  }

  _init() {
    if (!this.config.options.length) {
      console.warn('WheelPicker - No options provided');
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

    // infinite일 때 옵션을 충분히 반복
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

    // infinite일 때 앞뒤에 아이템 추가
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

    const template = `
      <div class="wheel-picker__items" style="height: ${this.containerHeight}px;">
        <div class="wheel-picker__options" style="-webkit-clip-path:${clipPath};clip-path:${clipPath};">
          <ul class="wheel-picker__options-list" role="listbox">
            ${wheelItemsHTML}
          </ul>
        </div>
        <div class="wheel-picker__highlight" style="height: ${this.config.height}px; line-height: ${this.config.height}px;">
          <ul class="wheel-picker__highlight-list" style="top: ${this.config.infinite ? -this.config.height : 0}px;">
            ${highlightItemsHTML}
          </ul>
        </div>
        <button class="wheel-picker__prev-button" type="button" aria-label="이전 항목 선택"></button>
        <input
          type="range"
          class="wheel-picker__slider"
          min="0"
          max="${this.normalizedOptions.length - 1}"
          value="0"
          style="height: ${this.config.height}px;"
          aria-label="옵션 선택"
        />
        <button class="wheel-picker__next-button" type="button" aria-label="다음 항목 선택"></button>
      </div>
    `;

    this.container.classList.add('wheel-picker');
    this.container.innerHTML = template;

    // DOM 요소 저장
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
    // 터치/마우스 이벤트
    this._handleDragStart = this._handleDragStart.bind(this);
    this._handleDragMove = this._handleDragMove.bind(this);
    this._handleDragEnd = this._handleDragEnd.bind(this);
    this._handleItemClick = this._handleItemClick.bind(this);

    this.container.addEventListener('touchstart', this._handleDragStart, { passive: false });
    this.container.addEventListener('touchend', this._handleDragEnd, { passive: false });
    document.addEventListener('mousedown', this._handleDragStart, { passive: false });
    document.addEventListener('mouseup', this._handleDragEnd, { passive: false });

    // 아이템 클릭 이벤트
    this.elements.wheelItems.forEach(item => {
      item.addEventListener('click', this._handleItemClick);
    });

    // 접근성 버튼
    this.elements.prevButton.addEventListener('click', () => this._selectPreviousItem());
    this.elements.nextButton.addEventListener('click', () => this._selectNextItem());

    // 슬라이더
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
      this._finalizeDragAndStartInertiaScroll();
    }
  }

  _finalizeDragAndStartInertiaScroll() {
    try {
      if (this.dragController) {
        this.dragController.abort();
        this.dragController = null;
      }

      this.dragging = false;

      if (this.touchData.isClick) {
        const currentScroll = this.touchData.touchScroll ?? this.scroll;
        this._selectByScroll(currentScroll);
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
    if (this.dragging || (this.touchData.totalMovement && this.touchData.totalMovement > 5)) {
      return;
    }

    const itemIndex = parseInt(e.currentTarget.dataset.index);
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

        // 각 아이템의 위치와 스타일 설정
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

  // Public API
  select(value) {
    const index = this.normalizedOptions.findIndex(opt => opt.value === value);
    if (index === -1) {
      console.warn(`WheelPicker - Cannot select value: ${value}`);
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

    // 이벤트 제거
    this.container.removeEventListener('touchstart', this._handleDragStart);
    this.container.removeEventListener('touchend', this._handleDragEnd);
    document.removeEventListener('mousedown', this._handleDragStart);
    document.removeEventListener('mouseup', this._handleDragEnd);

    if (this.dragController) {
      this.dragController.abort();
    }

    // DOM 정리
    this.container.classList.remove('wheel-picker');
    this.container.innerHTML = '';

    this.elements = null;
    this.normalizedOptions = null;
  }
}
