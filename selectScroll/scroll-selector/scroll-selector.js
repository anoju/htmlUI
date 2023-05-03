// wheel datepicker
var easing = {
  easeOutCubic: function(pos) {
    return Math.pow(pos - 1, 3) + 1;
  },
  easeOutQuart: function(pos) {
    return -(Math.pow(pos - 1, 4) - 1);
  }
};

//class scrollSelector {
var scrollSelector = class {
  constructor(options) {
    let defaults = {
      el: '', // dom
      type: 'infinite',
      count: 20,
      sensitivity: 0.8,
      source: [], // 옵션 {value: xx, text: xx}
      value: null,
      onChange: null
    };

    this.options = Object.assign({}, defaults, options);
    this.options.count = this.options.count - (this.options.count % 4);
    Object.assign(this, this.options);

    this.halfCount = this.options.count / 2;
    this.quarterCount = this.options.count / 4;
    this.a = this.options.sensitivity * 10; // 스크롤 감속
    this.minV = Math.sqrt(1 / this.a); // 최소 초기 속도
    this.selected = this.source[0];

    this.exceedA = 10; // 초과감속
    this.moveT = 0; // 스크롤 tick
    this.moving = false;

    this.elems = {
      el: document.querySelector(this.options.el),
      circleList: null,
      circleItems: null, // list

      highlight: null,
      highlightList: null,
      highListItems: null // list
    };
    this.events = {
      touchstart: null,
      touchmove: null,
      touchend: null
    };

    this.itemHeight = (this.elems.el.offsetHeight * 3) / this.options.count; // 각 높이
    this.itemAngle = 90 / this.options.count; // 각 항목 사이의 회전 각도
    this.radius = this.itemHeight / Math.tan((this.itemAngle * Math.PI) / 260); // 링 반경

    this.scroll = 0; // 단위는 항목의 높이입니다.
    this._init();
  }

  _init() {
    this._create(this.options.source);

    let touchData = {
      startY: 0,
      yArr: []
    };

    for (let eventName in this.events) {
      this.events[eventName] = ((eventName) => {
        return (e) => {
          if (this.elems.el.contains(e.target) || e.target === this.elems.el) {
            e.preventDefault();
            if (this.source.length) {
              this['_' + eventName](e, touchData);
            }
          }
        };
      })(eventName);
    }

    this.elems.el.addEventListener('touchstart', this.events.touchstart, {
      passive: false
    });
    document.addEventListener('mousedown', this.events.touchstart, {
      passive: false
    });
    this.elems.el.addEventListener('touchend', this.events.touchend, {
      passive: false
    });
    document.addEventListener('mouseup', this.events.touchend, {
      passive: false
    });
    if (this.source.length) {
      this.value = this.value !== null ? this.value : this.source[0].value;
      this.select(this.value);
    }
  }

  _touchstart(e, touchData) {
    this.elems.el.addEventListener('touchmove', this.events.touchmove, {
      passive: false
    });
    document.addEventListener('mousemove', this.events.touchmove, {
      passive: false
    });
    let eventY = e.clientY || e.touches[0].clientY;
    touchData.startY = eventY;
    touchData.yArr = [
      [eventY, new Date().getTime()]
    ];
    touchData.touchScroll = this.scroll;
    this._stop();
  }

  _touchmove(e, touchData) {
    let eventY = e.clientY || e.touches[0].clientY;
    touchData.yArr.push([eventY, new Date().getTime()]);
    if (touchData.length > 5) {
      touchData.unshift();
    }

    let scrollAdd = (touchData.startY - eventY) / this.itemHeight;
    let moveToScroll = scrollAdd + this.scroll;

    // 무한 스크롤이 아닌 경우 범위를 벗어나면 스크롤이 어려워집니다.
    if (this.type === 'normal') {
      if (moveToScroll < 0) {
        moveToScroll *= 0.3;
      } else if (moveToScroll > this.source.length) {
        moveToScroll = this.source.length + (moveToScroll - this.source.length) * 0.3;
      }
      // console.log(moveToScroll);
    } else {
      moveToScroll = this._normalizeScroll(moveToScroll);
    }

    touchData.touchScroll = this._moveTo(moveToScroll);
  }

  _touchend(e, touchData) {
    // console.log(e);
    this.elems.el.removeEventListener('touchmove', this.events.touchmove);
    document.removeEventListener('mousemove', this.events.touchmove);

    let v;

    if (touchData.yArr.length === 1) {
      v = 0;
    } else {
      let startTime = touchData.yArr[touchData.yArr.length - 2][1];
      let endTime = touchData.yArr[touchData.yArr.length - 1][1];
      let startY = touchData.yArr[touchData.yArr.length - 2][0];
      let endY = touchData.yArr[touchData.yArr.length - 1][0];

      // 계산 속도
      v = (((startY - endY) / this.itemHeight) * 1000) / (endTime - startTime);
      let sign = v > 0 ? 1 : -1;

      v = Math.abs(v) > 30 ? 30 * sign : v;
    }

    this.scroll = touchData.touchScroll;
    this._animateMoveByInitV(v);

    // console.log('end');
  }

  _create(source) {
    if (!source.length) {
      return;
    }

    let template = `
		<div class="select-wrap">
			<ul class="select-options" style="transform: translate3d(0, 0, ${-this.radius}px) rotateX(0deg);">
			{{circleListHTML}}
			<!-- <li class="select-option">a0</li> -->
			</ul>
			<div class="highlight">
			<ul class="highlight-list">
				<!-- <li class="highlight-item"></li> -->
				{{highListHTML}}
			</ul>
			</div>
		</div>
		`;

    // source 처리
    if (this.options.type === 'infinite') {
      let concatSource = [].concat(source);
      while (concatSource.length < this.halfCount) {
        concatSource = concatSource.concat(source);
      }
      source = concatSource;
    }
    this.source = source;
    let sourceLength = source.length;

    // selected HTML
    let circleListHTML = '';
    for (let i = 0; i < source.length; i++) {
      circleListHTML += `<li class="select-option"
						style="
						top: ${this.itemHeight * -0.5}px;
						height: ${this.itemHeight}px;
						line-height: ${this.itemHeight}px;
						transform: rotateX(${-this.itemAngle * i}deg) translate3d(0, 0, ${this.radius}px);
						"
						data-index="${i}"
						>${source[i].text}</li>`;
    }

    // 중간 강조 HTML
    let highListHTML = '';
    for (let i = 0; i < source.length; i++) {
      highListHTML += `<li class="highlight-item" style="height: ${this.itemHeight}px;">
							${source[i].text}
						</li>`;
    }

    if (this.options.type === 'infinite') {
      // 링 head tail
      for (let i = 0; i < this.quarterCount; i++) {
        // head
        circleListHTML =
          `<li class="select-option"
						style="
							top: ${this.itemHeight * -0.5}px;
							height: ${this.itemHeight}px;
							line-height: ${this.itemHeight}px;
							transform: rotateX(${this.itemAngle * (i + 1)}deg) translate3d(0, 0, ${this.radius}px);
						"
						data-index="${-i - 1}"
						>${source[sourceLength - i - 1].text}</li>` + circleListHTML;
        // tail
        circleListHTML += `<li class="select-option"
						style="
							top: ${this.itemHeight * -0.5}px;
							height: ${this.itemHeight}px;
							line-height: ${this.itemHeight}px;
							transform: rotateX(${-this.itemAngle * (i + sourceLength)}deg) translate3d(0, 0, ${this.radius}px);
						"
						data-index="${i + sourceLength}"
						>${source[i].text}</li>`;
      }

      // 강조
      highListHTML =
        `<li class="highlight-item" style="height: ${this.itemHeight}px;">
							${source[sourceLength - 1].text}
						</li>` + highListHTML;
      highListHTML += `<li class="highlight-item" style="height: ${this.itemHeight}px;">${source[0].text}</li>`;
    }

    this.elems.el.innerHTML = template.replace('{{circleListHTML}}', circleListHTML).replace('{{highListHTML}}', highListHTML);
    this.elems.circleList = this.elems.el.querySelector('.select-options');
    this.elems.circleItems = this.elems.el.querySelectorAll('.select-option');

    this.elems.highlight = this.elems.el.querySelector('.highlight');
    this.elems.highlightList = this.elems.el.querySelector('.highlight-list');
    this.elems.highlightitems = this.elems.el.querySelectorAll('.highlight-item');

    if (this.type === 'infinite') {
      this.elems.highlightList.style.top = -this.itemHeight + 'px';
    }

    this.elems.highlight.style.height = this.itemHeight + 'px';
    this.elems.highlight.style.lineHeight = this.itemHeight + 'px';
  }

  /**
   * 모듈로 스크롤, 예: source.length = 5 scroll = 6.1
   * 모듈로 normalizedScroll = 1.1 이후
   * @param {init} scroll
   * @return 모듈로 후 normalizedScroll
   */
  _normalizeScroll(scroll) {
    let normalizedScroll = scroll;

    while (normalizedScroll < 0) {
      normalizedScroll += this.source.length;
    }
    normalizedScroll = normalizedScroll % this.source.length;
    return normalizedScroll;
  }

  /**
   * 스크롤로 이동, 애니메이션 없음
   * @param {init} scroll
   * @return 지정된 정규화 후 스크롤을 반환
   */
  _moveTo(scroll) {
    if (this.type === 'infinite') {
      scroll = this._normalizeScroll(scroll);
    }
    this.elems.circleList.style.transform = `translate3d(0, 0, ${-this.radius}px) rotateX(${this.itemAngle * scroll}deg)`;
    this.elems.highlightList.style.transform = `translate3d(0, ${-scroll * this.itemHeight}px, 0)`;

    [...this.elems.circleItems].forEach((itemElem) => {
      if (Math.abs(itemElem.dataset.index - scroll) > this.quarterCount) {
        itemElem.style.visibility = 'hidden';
      } else {
        itemElem.style.visibility = 'visible';
      }
    });

    // console.log(scroll);
    // console.log(`translate3d(0, 0, ${-this.radius}px) rotateX(${-this.itemAngle * scroll}deg)`);
    return scroll;
  }

  /**
   * 초기 속도 initV로 스크롤
   * @param {init} initV， initV가 재설정
   * 가속을 기반으로 정수 스크롤로 스크롤하려면(스크롤하여 선택한 값을 찾을 수 있도록 보장)
   */
  async _animateMoveByInitV(initV) {
    // console.log(initV);

    let initScroll;
    let finalScroll;
    let finalV;

    let totalScrollLen;
    let a;
    let t;

    if (this.type === 'normal') {
      if (this.scroll < 0 || this.scroll > this.source.length - 1) {
        a = this.exceedA;
        initScroll = this.scroll;
        finalScroll = this.scroll < 0 ? 0 : this.source.length - 1;
        totalScrollLen = initScroll - finalScroll;

        t = Math.sqrt(Math.abs(totalScrollLen / a));
        initV = a * t;
        initV = this.scroll > 0 ? -initV : initV;
        finalV = 0;
        await this._animateToScroll(initScroll, finalScroll, t);
      } else {
        initScroll = this.scroll;
        a = initV > 0 ? -this.a : this.a; // 감속 가속
        t = Math.abs(initV / a); // 0으로 감속 시간
        totalScrollLen = initV * t + (a * t * t) / 2; // 총 롤 길이
        finalScroll = Math.round(this.scroll + totalScrollLen); // 정확한 최종 스크롤이 정수인지 확인하기 위해 반올림됨
        finalScroll = finalScroll < 0 ? 0 : finalScroll > this.source.length - 1 ? this.source.length - 1 : finalScroll;

        totalScrollLen = finalScroll - initScroll;
        t = Math.sqrt(Math.abs(totalScrollLen / a));
        await this._animateToScroll(this.scroll, finalScroll, t, 'easeOutQuart');
      }
    } else {
      initScroll = this.scroll;

      a = initV > 0 ? -this.a : this.a; // 감속 가속
      t = Math.abs(initV / a); // 0으로 감속 시간
      totalScrollLen = initV * t + (a * t * t) / 2; // 총 롤 길이
      finalScroll = Math.round(this.scroll + totalScrollLen); // 정확한 최종 스크롤이 정수인지 확인하기 위해 반올림됨
      await this._animateToScroll(this.scroll, finalScroll, t, 'easeOutQuart');
    }

    // await this._animateToScroll(this.scroll, finalScroll, initV, 0);

    this._selectByScroll(this.scroll);
  }

  _animateToScroll(initScroll, finalScroll, t, easingName = 'easeOutQuart') {
    if (initScroll === finalScroll || t === 0) {
      this._moveTo(initScroll);
      return;
    }

    let start = new Date().getTime() / 1000;
    let pass = 0;
    let totalScrollLen = finalScroll - initScroll;

    // console.log(initScroll, finalScroll, initV, finalV, a);
    return new Promise((resolve, reject) => {
      this.moving = true;
      let tick = () => {
        pass = new Date().getTime() / 1000 - start;

        if (pass < t) {
          this.scroll = this._moveTo(initScroll + easing[easingName](pass / t) * totalScrollLen);
          this.moveT = requestAnimationFrame(tick);
        } else {
          resolve();
          this._stop();
          this.scroll = this._moveTo(initScroll + totalScrollLen);
        }
      };
      tick();
    });
  }

  _stop() {
    this.moving = false;
    cancelAnimationFrame(this.moveT);
  }

  _selectByScroll(scroll) {
    scroll = this._normalizeScroll(scroll) | 0;
    if (scroll > this.source.length - 1) {
      scroll = this.source.length - 1;
      this._moveTo(scroll);
    }
    this._moveTo(scroll);
    this.scroll = scroll;
    this.selected = this.source[scroll];
    this.value = this.selected.value;
    this.onChange && this.onChange(this.selected);
  }

  updateSource(source) {
    this._create(source);

    if (!this.moving) {
      this._selectByScroll(this.scroll);
    }
  }

  select(value) {
    for (let i = 0; i < this.source.length; i++) {
      if (this.source[i].value === value) {
        window.cancelAnimationFrame(this.moveT);
        // this.scroll = this._moveTo(i);
        let initScroll = this._normalizeScroll(this.scroll);
        let finalScroll = i;
        let t = Math.sqrt(Math.abs((finalScroll - initScroll) / this.a));
        this._animateToScroll(initScroll, finalScroll, t);
        setTimeout(() => this._selectByScroll(i));
        return;
      }
    }
    throw new Error(`can not select value: ${value}, ${value} match nothing in current source`);
  }

  destroy() {
    this._stop();
    // document event 바인딩 해제
    for (let eventName in this.events) {
      this.elems.el.removeEventListener('eventName', this.events[eventName]);
    }
    document.removeEventListener('mousedown', this.events['touchstart']);
    document.removeEventListener('mousemove', this.events['touchmove']);
    document.removeEventListener('mouseup', this.events['touchend']);
    // 요소제거
    this.elems.el.innerHTML = '';
    this.elems = null;
  }
};