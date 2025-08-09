// 옵션을 가지는 엘리먼트를 컨트롤하는 클래스 정의
class hiDatepicker {
  constructor(element, options = {}) {
    this.element = typeof element === 'string' ? document.querySelector(element) : element;
    this.value = null;
    this.setYear = null;
    this.setStartYear = null;
    this.setMonth = null;
    this.setStartMonthYear = null;
    this.wrap = null;
    this.isLayer = false;
    this.isLayerShow = false;
    this.showPanel = 'day';


    // 옵션들
    const preClassName = options.preClassName || 'hi';
    this.mobile = options.mobile || false;
    this.type = options.type || 'day';
    this.headerSuffix = options.headerSuffix || '.';
    this.headerSuffix2 = options.headerSuffix2 || '';
    this.valueUnit = options.valueUnit || '-';
    this.minDate = this.getMinMax(options.min) || '00000000';
    this.maxDate = this.getMinMax(options.max) || '99999999';
    this.holidays = options.holidays ? this.getArrayDate(options.holidays) : [];
    this.disabledDays = options.disabledDays ? this.getArrayDate(options.disabledDays) : [];
    this.disabledWeek = options.disabledWeek ? this.getArrayWeek(options.disabledWeek) : [];
    this.showSetValue = options.showSetValue || false;
    this.readonly = options.readonly || true;
    this.weekName = options.weekName || ['일', '월', '화', '수', '목', '금', '토'];
    this.showPrevNextMonthDays = options.showPrevNextMonthDays || false;
    this.fixedWeekRows = options.fixedWeekRows || false;
    this.showWeekToggle = options.showWeekToggle || false;
    this.weeklyView = false;

    // 클래스네임
    this.className = {
      target: preClassName + '-datepicker',
      wrap: preClassName + '-datepicker-wrap',
      show: preClassName + '-datepicker-show',
      layer: preClassName + '-datepicker-layer',
      mobile: preClassName + '-datepicker-mobile',
      inline: preClassName + '-datepicker-inline',
      dimm: preClassName + '-datepicker-dimm',
      inner: preClassName + '-datepicker-inner',
      header: preClassName + '-datepicker-header',
      headerBtn: preClassName + '-datepicker-header-btn',
      titleBtn: preClassName + '-datepicker-title-btn',
      titleSuffix: preClassName + '-datepicker-title-suffix',
      body: preClassName + '-datepicker-body',
      panelPre: preClassName + '-panel-',
      table: preClassName + '-datepicker-table',
      tableBtn: preClassName + '-datepicker-table-btn',
      list: preClassName + '-datepicker-list',
      listBtn: preClassName + '-datepicker-list-btn',
      weekToggle: preClassName + '-datepicker-week-toggle',
    }

    // 초기화 함수 호출
    this.init();
  }

  getMinMax(value) {
    const _this = this;
    let rtnVal;
    let $origin = value ? value.trim() : null;
    if ($origin === null) return null;
    const $num = _this.onlyNumber(value);
    if ($num.length === 8) {
      rtnVal = $num;
    } else {
      const $originTxt = $origin.toLowerCase();
      if ($originTxt === 'today') rtnVal = _this.todayString();
      else {
        const txtMatches = $originTxt.match(/[+-]?\d+[a-z]/g);
        if (txtMatches) {
          const variableMap = {};
          for (const match of txtMatches) {
            const variable = match.charAt(match.length - 1);
            const number = parseInt(match);
            variableMap[variable] = number;
          }
          const _d = variableMap['d'] || 0;
          const _m = variableMap['m'] || 0;
          const _y = variableMap['y'] || 0;
          rtnVal = _this.todayString(_d, _m, _y);
        }
      }
    }
    return rtnVal
  }

  getArrayDate(array) {
    const _this = this;
    const newArray = [];
    const isArray = Array.isArray(array);
    if (!isArray) return null;
    array.forEach(function(item) {
      newArray.push(_this.onlyNumber(item));
    });
    return newArray;
  }

  getArrayWeek(array) {
    const _this = this;
    const newArray = [];
    const isArray = Array.isArray(array);
    if (!isArray) return null;
    array.forEach(function(item) {
      newArray.push(item.trim());
    });
    return newArray;
  }

  init() {
    const _this = this;
    const $target = _this.element;
    if (!$target) return;
    if (_this.type !== 'day') _this.showPanel = _this.type;
    _this.isLayer = $target.tagName === 'INPUT';
    // let $wrap = $target.querySelector('.' + _this.className.wrap);
    // if ($wrap) $wrap.remove();
    const $wrap = document.createElement('div');
    $wrap.classList.add(_this.className.wrap);
    if (this.mobile) $wrap.classList.add(_this.className.mobile);
    let $innerHtml = ''
    if (this.mobile) $innerHtml += `<div class="${_this.className.dimm}" role="button" aria-label="달력닫음"></div>`;
    $innerHtml += `<div class="${_this.className.inner}" role="application" aria-label="날짜 선택 달력"></div>`;
    $wrap.innerHTML = $innerHtml;
    _this.wrap = $wrap;

    if (_this.isLayer) _this.targetInputInit();

    const $setVal = _this.todayString();
    // if (!_this.value) _this.value = _this.todayString();
    if (!_this.setYear) _this.setYear = $setVal.substr(0, 4);
    if (!_this.setStartYear) _this.setStartYear = _this.getStartYaer();
    if (!_this.setMonth) _this.setMonth = $setVal.substr(4, 2);

    if (_this.isLayer) {
      document.body.appendChild($wrap);
    } else {
      $wrap.classList.add(_this.className.inline);
      $target.appendChild($wrap);
    }

    _this.makeHeader();
    _this.makeBody();
    _this.headerBtnEvent();
  }

  targetInputInit() {
    const _this = this;
    const $wrap = _this.wrap;
    const $target = _this.element;
    if ($target.classList.contains(_this.className.target)) return;
    if (!_this.mobile) $wrap.classList.add(_this.className.layer);
    $target.classList.add(_this.className.target);
    if (_this.readonly) $target.readOnly = true;
    const $targetVal = $target.value.trim();
    if ($targetVal) _this.value = _this.onlyNumber($target.value);
    $target.addEventListener('focus', _this.targetInputEvent.bind(_this));
    $target.addEventListener('click', _this.targetInputEvent.bind(_this));
    document.addEventListener('click', _this.documentEvent.bind(_this))
    if (_this.mobile) {
      const $dimm = $wrap.querySelector('.' + _this.className.dimm);
      if ($dimm) $dimm.addEventListener('click', _this.layerHide.bind(_this));
    }
  }

  targetInputUpdate() {
    const _this = this;
    const $target = _this.element;
    const $targetVal = $target.value.trim();
    if ($targetVal) {
      const $val = _this.onlyNumber($targetVal);
      _this.setYear = $val.substr(0, 4);
      _this.setStartYear = _this.getStartYaer();
      _this.setMonth = $val.substr(4, 2);

      _this.update();
    }
  }

  // update
  update(focusTarget) {
    const _this = this;
    setTimeout(function() {
      _this.makeHeader();
      _this.makeBody();
      _this.headerBtnEvent(); // 헤더 이벤트 재바인딩
      _this.headerBtnControl();
      
      // 포커스 복원
      if (focusTarget) {
        setTimeout(() => {
          const $targetBtn = _this.wrap.querySelector(focusTarget);
          if ($targetBtn) {
            $targetBtn.focus();
          }
        }, 50);
      }
      
      // 주별 보기 상태라면 적용
      if (_this.weeklyView && _this.type === 'day') {
        setTimeout(() => {
          _this.updateWeeklyView();
        }, 10);
      }
    }, 1);
  }



  // event
  headerBtnEvent() {
    const _this = this;
    const $wrap = _this.wrap;
    const $headerBtns = $wrap.querySelectorAll('.' + _this.className.headerBtn);
    $headerBtns.forEach(function($btn) {
      $btn.removeEventListener('click', _this.headerBtnClickEvent.bind(_this));
      $btn.addEventListener('click', _this.headerBtnClickEvent.bind(_this));
    });
    const $titleBtns = $wrap.querySelectorAll('.' + _this.className.titleBtn);
    $titleBtns.forEach(function($btn) {
      $btn.removeEventListener('click', _this.titleBtnClickEvent.bind(_this));
      $btn.addEventListener('click', _this.titleBtnClickEvent.bind(_this));
    });
  }

  headerBtnControl() {
    const _this = this;
    const $wrap = _this.wrap;
    const $showPanel = _this.showPanel;
    const $headerBtns = $wrap.querySelectorAll('.' + _this.className.headerBtn);
    const $monthBtn = $wrap.querySelectorAll('.' + _this.className.headerBtn + '[class*="month"]');
    const $yearBtn = $wrap.querySelectorAll('.' + _this.className.headerBtn + '[class*="year"]');
    const $year = Number(_this.setStartYear);
    const $monthYear = Number(_this.setStartMonthYear || _this.setYear);
    const $fullmonth = Number(_this.setYear + _this.setMonth);
    const $min = _this.minDate;
    const $minYear = Number($min.substr(0, 4));
    const $minMonth = Number($min.substr(0, 6));
    const $max = _this.maxDate;
    const $maxYear = Number($max.substr(0, 4));
    const $maxMonth = Number($max.substr(0, 6));

    if ($showPanel === 'month') {
      // 월 선택 모드: 월 버튼 숨김, 년 버튼만 활성화
      $monthBtn.forEach(function($btn) {
        $btn.style.display = 'none';
      });
      $yearBtn.forEach(function($btn) {
        $btn.style.display = 'block';
        $btn.disabled = false;
        if ($minYear >= $monthYear && $btn.classList.contains('prev-year')) $btn.disabled = true;
        if ($maxYear <= $monthYear && $btn.classList.contains('next-year')) $btn.disabled = true;
      });
    } else if ($showPanel === 'year') {
      // 년 선택 모드: 월 버튼 숨김, 년 버튼만 활성화  
      $monthBtn.forEach(function($btn) {
        $btn.style.display = 'none';
      });
      $yearBtn.forEach(function($btn) {
        $btn.style.display = 'block';
        $btn.disabled = false;
        if ($minYear >= $year && $btn.classList.contains('prev-year')) $btn.disabled = true;
        if ($maxYear <= ($year + 10) && $btn.classList.contains('next-year')) $btn.disabled = true;
      });
    } else {
      // 일 선택 모드: 모든 버튼 표시 및 활성화
      $headerBtns.forEach(function($btn) {
        $btn.style.display = 'block';
        $btn.disabled = false;
        if ($minMonth >= $fullmonth && $btn.classList.contains('prev-month')) $btn.disabled = true;
        if ($maxMonth <= $fullmonth && $btn.classList.contains('next-month')) $btn.disabled = true;
        if ($minMonth >= ($fullmonth - 100) && $btn.classList.contains('prev-year')) $btn.disabled = true;
        if ($maxMonth <= ($fullmonth + 100) && $btn.classList.contains('next-year')) $btn.disabled = true;
      });
    }
  }

  addBodyBtnEvent() {
    const _this = this;
    const $wrap = _this.wrap;
    const $tableBtns = $wrap.querySelectorAll('.' + _this.className.tableBtn)
    $tableBtns.forEach(function($btn) {
      $btn.addEventListener('click', _this.tableBtnClickEvent.bind(_this));
    });
    const $listBtns = $wrap.querySelectorAll('.' + _this.className.listBtn)
    $listBtns.forEach(function($btn) {
      $btn.addEventListener('click', _this.listBtnClickEvent.bind(_this));
    });
    const $weekToggleBtns = $wrap.querySelectorAll('.' + _this.className.weekToggle)
    $weekToggleBtns.forEach(function($btn) {
      $btn.addEventListener('click', _this.weekToggleClickEvent.bind(_this));
    });
  }

  removeBodyBtnEvent() {
    const _this = this;
    const $wrap = _this.wrap;
    const $tableBtns = $wrap.querySelectorAll('.' + _this.className.tableBtn)
    $tableBtns.forEach(function($btn) {
      $btn.removeEventListener('click', _this.tableBtnClickEvent.bind(_this));
    });
    const $listBtns = $wrap.querySelectorAll('.' + _this.className.listBtn)
    $listBtns.forEach(function($btn) {
      $btn.removeEventListener('click', _this.listBtnClickEvent.bind(_this));
    });
    const $weekToggleBtns = $wrap.querySelectorAll('.' + _this.className.weekToggle)
    $weekToggleBtns.forEach(function($btn) {
      $btn.removeEventListener('click', _this.weekToggleClickEvent.bind(_this));
    });
  }

  showPanelEvent() {
    const _this = this;
    const $wrap = _this.wrap;
    const $showPanel = _this.showPanel;
    const $panel = $wrap.querySelector('.' + _this.className.panelPre + $showPanel);
    const $siblings = _this.getSiblings($panel);
    if ($siblings.length) {
      $panel.style.display = 'block';
      $siblings.forEach(function(sibling) {
        sibling.style.display = 'none';
      });
    }
    _this.headerBtnControl();
  }

  targetInputEvent(e) {
    const _this = this;
    _this.layerShow();
    _this.isLayerShow = true;
  }

  layerShow() {
    const _this = this;
    const $wrap = _this.wrap;
    const $target = _this.element;
    $wrap.classList.add(_this.className.show);
    if (_this.showSetValue && !_this.value) {
      const $today = _this.todayString();
      if (_this.type === 'year') _this.value = $today.substr(0, 4);
      else if (_this.type === 'month') _this.value = $today.substr(0, 6);
      else _this.value = $today;
      $target.value = _this.dateFormat(_this.value);
    }
    if (!_this.mobile) _this.layerPosition();
    _this.targetInputUpdate();
  }

  layerPosition() {
    console.log('layerPosition');
    const _this = this;
    const $target = _this.element;
    console.log($target)
    const $wrap = _this.wrap;
    const $top = _this.getOffset($target).top + $target.offsetHeight;
    let $left = _this.getOffset($target).left + ($target.offsetWidth / 2) - ($wrap.offsetWidth / 2);
    if ($left > window.innerWidth - $wrap.offsetWidth) $left = window.innerWidth - $wrap.offsetWidth;
    if ($left < 0) $left = 0;
    $wrap.style.top = $top + 'px';
    $wrap.style.left = $left + 'px';
  }

  layerHide() {
    const _this = this;
    if (!_this.isLayerShow) return;
    const $wrap = _this.wrap;
    $wrap.classList.remove(_this.className.show);
    $wrap.style.top = '';
    $wrap.style.left = '';
    _this.isLayerShow = false;
  }

  documentEvent(e) {
    const _this = this;
    const $wrap = _this.wrap;
    const $target = e.target;
    const $layer = $target.closest('.' + _this.className.wrap);
    if ($target === _this.element) return;
    if (!_this.mobile && (!$layer || $layer !== $wrap)) _this.layerHide();
  }

  // click event
  headerBtnClickEvent(e) {
    const _this = this;
    const $target = e.target;
    const $isYear = _this.showPanel === 'year';
    const $isMonth = _this.showPanel === 'month';
    let $year = $isYear ? parseInt(_this.setStartYear) : parseInt(_this.setYear);
    let $month = parseInt(_this.setMonth);
    
    // 포커스 타겟 식별
    let focusSelector = null;
    if ($target.classList.contains('first')) {
      focusSelector = '.first';
    } else if ($target.classList.contains('prev')) {
      focusSelector = '.prev';
    } else if ($target.classList.contains('next')) {
      focusSelector = '.next';
    } else if ($target.classList.contains('last')) {
      focusSelector = '.last';
    }
    
    // 주별 모드에서의 특별 처리
    if (_this.weeklyView && _this.type === 'day') {
      if ($target.classList.contains('prev-week')) {
        _this.handleWeekNavigation(false);
        return;
      } else if ($target.classList.contains('next-week')) {
        _this.handleWeekNavigation(true);
        return;
      } else if ($target.classList.contains('prev-month') && !$target.classList.contains('prev-week')) {
        // 이전 달로 이동
        $month -= 1;
        if ($month < 1) {
          $month = 12;
          $year -= 1;
        }
        _this.setYear = String($year);
        _this.setMonth = _this.changeStringDay($month);
        _this.currentWeek = 0; // 첫 번째 주로 설정
        _this.update(focusSelector);
        setTimeout(() => {
          _this.updateWeeklyView();
        }, 10);
        return;
      } else if ($target.classList.contains('next-month') && !$target.classList.contains('next-week')) {
        // 다음 달로 이동
        $month += 1;
        if ($month > 12) {
          $month = 1;
          $year += 1;
        }
        _this.setYear = String($year);
        _this.setMonth = _this.changeStringDay($month);
        _this.currentWeek = 0; // 첫 번째 주로 설정
        _this.update(focusSelector);
        setTimeout(() => {
          _this.updateWeeklyView();
        }, 10);
        return;
      }
    }
    
    if ($isMonth) {
      // 월 선택 모드에서는 년 버튼으로 년도 변경
      if (!_this.setStartMonthYear) _this.setStartMonthYear = _this.setYear;
      if ($target.classList.contains('prev-year')) {
        _this.setStartMonthYear = Number(_this.setStartMonthYear) - 1;
      } else if ($target.classList.contains('next-year')) {
        _this.setStartMonthYear = Number(_this.setStartMonthYear) + 1;
      }
    } else {

      if ($target.classList.contains('prev-month')) {
        $month -= 1;
        if ($month < 1) {
          $month = $month + 12;
          $year -= 1;
        }
      } else if ($target.classList.contains('next-month')) {
        $month += 1;
        if ($month > 12) {
          $month = $month - 12;
          $year += 1;
        }
      }
    }

    const $yeraNum = $isYear ? 10 : 1;
    if ($target.classList.contains('prev-year')) {
      $year -= $yeraNum;
    } else if ($target.classList.contains('next-year')) {
      $year += $yeraNum;
    }
    $year = String($year);
    $month = _this.changeStringDay($month);
    if ($isYear) {
      _this.setStartYear = $year;
    } else if (_this.setYear !== $year) {
      _this.setYear = $year;
      _this.getStartYaer();
    }
    if (_this.setMonth !== $month) _this.setMonth = $month;
    _this.update(focusSelector);
  }

  titleBtnClickEvent(e) {
    const _this = this;
    const $target = e.target;
    if ($target.classList.contains('title-month')) {
      _this.showPanel = 'month';
    } else if ($target.classList.contains('title-year')) {
      _this.showPanel = 'year';
    }
    _this.showPanelEvent();
  }

  tableBtnClickEvent(e) {
    const _this = this;
    const $target = e.target;
    _this.value = $target.dataset.fullDay;
    _this.update();
    _this.targetSetValue();
    if (_this.isLayer) _this.layerHide();
    if (_this.type === 'day' && typeof _this.seletedClickCallback === 'function') {
      _this.seletedClickCallback(_this);
    }
  }

  listBtnClickEvent(e) {
    const _this = this;
    let $target = e.target;
    if (!$target.classList.contains(_this.className.listBtn)) $target = $target.closest('.' + _this.className.listBtn);
    if (!$target) return;

    let $value;
    if ($target.classList.contains('year')) {
      const $btnYear = $target.dataset.year;
      _this.setYear = $btnYear;
      const $fullMonth = Number($btnYear + _this.setMonth);
      const $minMonth = Number(_this.minDate.substr(0, 6));
      const $maxMonth = Number(_this.maxDate.substr(0, 6));
      if ($fullMonth < $minMonth) _this.setMonth = _this.minDate.substr(4, 2);
      else if ($maxMonth < $fullMonth) _this.setMonth = _this.maxDate.substr(4, 2);

      if (_this.type === 'year') $value = $btnYear;
    }
    if ($target.classList.contains('month')) {
      const $btnMonth = $target.dataset.month;
      _this.setMonth = $btnMonth;

      if (_this.type === 'month') $value = $target.dataset.fullMonth;
    }

    if ($value) {
      _this.value = $value;
      _this.targetSetValue();
      if (_this.isLayer) _this.layerHide();
    }

    _this.setStartMonthYear = null;
    _this.update();
    _this.showPanel = _this.type;
    _this.showPanelEvent();

    if (_this.type !== 'day' && typeof _this.seletedClickCallback === 'function') {
      _this.seletedClickCallback(_this);
    }
  }

  weekToggleClickEvent(e) {
    const _this = this;
    _this.weeklyView = !_this.weeklyView;
    
    // 전체 재구성
    _this.update();
  }

  updateWeeklyView() {
    const _this = this;
    const $wrap = _this.wrap;
    const $table = $wrap.querySelector('.' + _this.className.table);
    const $tbody = $table ? $table.querySelector('tbody') : null;
    
    if (!$tbody) return;
    
    // 토글 버튼 텍스트 업데이트
    const $toggleBtn = $wrap.querySelector('.' + _this.className.weekToggle);
    if ($toggleBtn) {
      const $toggleText = _this.weeklyView ? '펼치기' : '접기';
      $toggleBtn.textContent = $toggleText;
      $toggleBtn.setAttribute('aria-label', `주별 보기 ${$toggleText}`);
    }
    
    if (_this.weeklyView) {
      // 주별 보기 - 선택된 날짜가 있는 주만 표시
      const $selectedDay = _this.value ? Number(_this.value.substr(6, 2)) : null;
      let $targetWeek = 0;
      
      if ($selectedDay) {
        const $startIdx = new Date(_this.setYear, (_this.setMonth - 1), 1, 0, 0, 0, 0).getDay();
        $targetWeek = Math.floor(($startIdx + $selectedDay - 1) / 7);
      }
      
      // currentWeek 저장
      _this.currentWeek = $targetWeek;
      
      // 모든 주를 숨기고 해당 주만 표시
      const $rows = $tbody.querySelectorAll('tr');
      $rows.forEach((row, index) => {
        row.style.display = index === $targetWeek ? '' : 'none';
      });
    } else {
      // 전체 보기 - 모든 주 표시
      const $rows = $tbody.querySelectorAll('tr');
      $rows.forEach(row => {
        row.style.display = '';
      });
      _this.currentWeek = null;
    }
  }

  handleWeekNavigation(isNext) {
    const _this = this;
    const $wrap = _this.wrap;
    const $table = $wrap.querySelector('.' + _this.className.table);
    const $tbody = $table ? $table.querySelector('tbody') : null;
    
    if (!$tbody) return;
    
    const $rows = $tbody.querySelectorAll('tr');
    let $newWeek = _this.currentWeek || 0;
    
    if (isNext) {
      $newWeek += 1;
      if ($newWeek >= $rows.length) {
        // 다음 달로 이동
        let $month = parseInt(_this.setMonth);
        let $year = parseInt(_this.setYear);
        $month += 1;
        if ($month > 12) {
          $month = 1;
          $year += 1;
        }
        _this.setYear = String($year);
        _this.setMonth = _this.changeStringDay($month);
        $newWeek = 0;
        _this.update();
        return;
      }
    } else {
      $newWeek -= 1;
      if ($newWeek < 0) {
        // 이전 달로 이동
        let $month = parseInt(_this.setMonth);
        let $year = parseInt(_this.setYear);
        $month -= 1;
        if ($month < 1) {
          $month = 12;
          $year -= 1;
        }
        _this.setYear = String($year);
        _this.setMonth = _this.changeStringDay($month);
        _this.update();
        // 이전 달의 마지막 주로 설정
        setTimeout(() => {
          const $newTbody = _this.wrap.querySelector('.' + _this.className.table + ' tbody');
          if ($newTbody) {
            const $newRows = $newTbody.querySelectorAll('tr');
            _this.currentWeek = $newRows.length - 1;
            _this.updateWeeklyView();
          }
        }, 10);
        return;
      }
    }
    
    _this.currentWeek = $newWeek;
    
    // 주 표시 업데이트
    $rows.forEach((row, index) => {
      row.style.display = index === $newWeek ? '' : 'none';
    });
  }

  // make
  makeHeader(_year, _month) {
    const _this = this;
    const $wrap = _this.wrap;
    let $header = $wrap.querySelector('.' + _this.className.header);
    
    // 기존 헤더가 있으면 제거
    if ($header) {
      $header.remove();
    }
    
    // 새 헤더 생성
    $header = document.createElement('div');
    $header.classList.add(_this.className.header);
    
    let $btnHtml = '<button type="button" class="' + _this.className.titleBtn + ' title-year"></button>';
    if (_this.type !== 'year') {
      $btnHtml += '<div class="' + _this.className.titleSuffix + '">' + _this.headerSuffix + '</div>';
      $btnHtml += '<button type="button" class="' + _this.className.titleBtn + ' title-month"></button>';
    }
    if (_this.headerSuffix2) $btnHtml += '<div class="' + _this.className.titleSuffix + '">' + _this.headerSuffix2 + '</div>';

    let $headerBtnHtml;
    if (_this.weeklyView && _this.type === 'day') {
      $headerBtnHtml = `<button type="button" class="${_this.className.headerBtn} first prev-month" aria-label="이전 달">이전 달</button>
      <button type="button" class="${_this.className.headerBtn} prev prev-week" aria-label="이전 주">이전 주</button>
      <div class="pub-datepicker-title">${$btnHtml}</div>
      <button type="button" class="${_this.className.headerBtn} next next-week" aria-label="다음 주">다음 주</button>
      <button type="button" class="${_this.className.headerBtn} last next-month" aria-label="다음 달">다음 달</button>`;
    } else {
      $headerBtnHtml = `<button type="button" class="${_this.className.headerBtn} first prev-year" aria-label="이전 년도">이전 년도</button>
      <button type="button" class="${_this.className.headerBtn} prev prev-month" aria-label="이전 달">이전 달</button>
      <div class="pub-datepicker-title">${$btnHtml}</div>
      <button type="button" class="${_this.className.headerBtn} next next-month" aria-label="다음 달">다음 달</button>
      <button type="button" class="${_this.className.headerBtn} last next-year" aria-label="다음 년도">다음 년도</button>`;
    }
    
    $header.innerHTML = $headerBtnHtml;
    $wrap.querySelector('.' + _this.className.inner).appendChild($header);
    
    // 타이틀 업데이트
    const $titleYear = $header.querySelector('.title-year');
    if ($titleYear) $titleYear.innerHTML = _this.setYear;
    const $titleMonth = $header.querySelector('.title-month');
    if ($titleMonth) $titleMonth.innerHTML = _this.changeStringDay(_this.setMonth);
  }

  makeBody() {
    const _this = this;
    const $wrap = _this.wrap;
    let $body = $wrap.querySelector('.' + _this.className.body);
    if ($body) {
      _this.removeBodyBtnEvent();
      $body.remove();
    }

    $body = document.createElement('div');
    $body.classList.add(_this.className.body);
    const _daysBody = _this.type === 'day' ? _this.makeDaysBody() : '';
    const _monthsBody = _this.type !== 'year' ? _this.makeMonthsBody() : '';
    const _yearsBody = _this.makeYearsBody();
    const $html = `${_daysBody}${_monthsBody}${_yearsBody}`;

    $body.innerHTML = $html;
    $wrap.querySelector('.' + _this.className.inner).appendChild($body);
    _this.addBodyBtnEvent();

    _this.showPanelEvent();
  }

  makeDaysBody() {
    const _this = this;
    const $lastDay = _this.getLastDay(_this.setYear, _this.setMonth);
    const $startIdx = new Date(_this.setYear, (_this.setMonth - 1), 1, 0, 0, 0, 0).getDay();
    const $lastIdx = $startIdx + $lastDay;
    let $endIdx = ($lastIdx) % 7 === 0 ? $lastIdx : $lastIdx + (7 - $lastIdx % 7);
    
    // fixedWeekRows 옵션이 true면 6주 고정
    if (_this.fixedWeekRows) {
      $endIdx = 42; // 6주 × 7일 = 42일
    }
    
    const $holidays = _this.holidays;
    const $disabledDays = _this.disabledDays;
    const $disabledWeek = _this.disabledWeek;

    // 이전달과 다음달 정보 계산
    const $prevMonth = _this.setMonth === '01' ? '12' : _this.changeStringDay(Number(_this.setMonth) - 1);
    const $prevYear = _this.setMonth === '01' ? String(Number(_this.setYear) - 1) : _this.setYear;
    const $nextMonth = _this.setMonth === '12' ? '01' : _this.changeStringDay(Number(_this.setMonth) + 1);
    const $nextYear = _this.setMonth === '12' ? String(Number(_this.setYear) + 1) : _this.setYear;
    const $prevMonthLastDay = _this.getLastDay($prevYear, $prevMonth);

    let $tbodyHtml = '';
    for (let i = 0; i < $endIdx; i += 1) {
      const $weekIdx = i % 7;
      const $isDisabledWeek = $disabledWeek.includes(String($weekIdx))
      
      if ($weekIdx === 0) $tbodyHtml += '<tr>';
      
      if (i < $startIdx) {
        // 이전달 날짜
        if (_this.showPrevNextMonthDays) {
          const $prevDay = $prevMonthLastDay - ($startIdx - i - 1);
          const $prevFullday = $prevYear + $prevMonth + _this.changeStringDay($prevDay);
          const $isPrevHolidays = $holidays.includes($prevFullday);
          const prevHolidayClass = $isPrevHolidays ? ' holiday' : '';
          const $prevToday = _this.todayString() === $prevFullday;
          const $prevSelected = _this.value === $prevFullday;
          const $isPrevDisableddays = $disabledDays.includes($prevFullday);
          const $prevNotDisabled = Number(_this.minDate) <= Number($prevFullday) && Number($prevFullday) <= Number(_this.maxDate);
          const $prevDisabled = (!$prevNotDisabled || $isPrevDisableddays || $isDisabledWeek) ? ' disabled' : '';
          const $prevTodayClass = $prevToday ? ' today' : '';
          const $prevSelectedClass = $prevSelected ? ' selected' : '';
          const $prevTitle = _this.getButtonTitle($prevFullday, $prevToday, $prevSelected);
          
          $tbodyHtml += `<td data-week-idx="${$weekIdx}"${prevHolidayClass}><button type="button" class="${_this.className.tableBtn} prev-month-day${$prevTodayClass}${$prevSelectedClass}" data-day="${$prevDay}" data-full-day="${$prevFullday}" title="${$prevTitle}" aria-label="${$prevTitle}"${$prevDisabled}>${$prevDay}</button></td>`;
        } else {
          $tbodyHtml += `<td data-week-idx="${$weekIdx}"></td>`;
        }
      } else if (i >= $lastIdx) {
        // 다음달 날짜
        if (_this.showPrevNextMonthDays) {
          const $nextDay = i - $lastIdx + 1;
          const $nextFullday = $nextYear + $nextMonth + _this.changeStringDay($nextDay);
          const $isNextHolidays = $holidays.includes($nextFullday);
          const nextHolidayClass = $isNextHolidays ? ' holiday' : '';
          const $nextToday = _this.todayString() === $nextFullday;
          const $nextSelected = _this.value === $nextFullday;
          const $isNextDisableddays = $disabledDays.includes($nextFullday);
          const $nextNotDisabled = Number(_this.minDate) <= Number($nextFullday) && Number($nextFullday) <= Number(_this.maxDate);
          const $nextDisabled = (!$nextNotDisabled || $isNextDisableddays || $isDisabledWeek) ? ' disabled' : '';
          const $nextTodayClass = $nextToday ? ' today' : '';
          const $nextSelectedClass = $nextSelected ? ' selected' : '';
          const $nextTitle = _this.getButtonTitle($nextFullday, $nextToday, $nextSelected);
          
          $tbodyHtml += `<td data-week-idx="${$weekIdx}"${nextHolidayClass}><button type="button" class="${_this.className.tableBtn} next-month-day${$nextTodayClass}${$nextSelectedClass}" data-day="${$nextDay}" data-full-day="${$nextFullday}" title="${$nextTitle}" aria-label="${$nextTitle}"${$nextDisabled}>${$nextDay}</button></td>`;
        } else {
          $tbodyHtml += `<td data-week-idx="${$weekIdx}"></td>`;
        }
      } else {
        // 현재달 날짜
        const $day = i - $startIdx + 1;
        const $fullday = _this.setYear + _this.setMonth + _this.changeStringDay($day);
        const $isHolidays = $holidays.includes($fullday);
        const holidayClass = $isHolidays ? ' class="holiday"' : '';
        const $today = _this.todayString() === $fullday;
        const $selected = _this.value === $fullday;
        const $todayClass = $today ? ' today' : '';
        const $selectedClass = $selected ? ' selected' : '';
        const $isDisableddays = $disabledDays.includes($fullday);
        const $notDisabled = Number(_this.minDate) <= Number($fullday) && Number($fullday) <= Number(_this.maxDate);
        const $disabled = (!$notDisabled || $isDisableddays || $isDisabledWeek) ? ' disabled' : '';
        const $title = _this.getButtonTitle($fullday, $today, $selected);
        
        $tbodyHtml += `<td data-week-idx="${$weekIdx}"${holidayClass}><button type="button" class="${_this.className.tableBtn}${$todayClass}${$selectedClass}" data-day="${$day}" data-full-day="${$fullday}" title="${$title}" aria-label="${$title}"${$disabled}>${$day}</button></td>`;
      }
      
      if ($weekIdx === 6) $tbodyHtml += '</tr>';
    }

    let $theadHtml = '<tr>';
    for (let i = 0; i < 7; i += 1) {
      $theadHtml += '<th data-week-idx="' + i + '">' + _this.weekName[i] + '</th>';
    }
    $theadHtml += '</tr>';

    // 주별 보기 토글 버튼 추가
    let $toggleBtn = '';
    if (_this.type === 'day' && _this.showWeekToggle) {
      const $toggleText = _this.weeklyView ? '펼치기' : '접기';
      $toggleBtn = `<div style="text-align: center; padding: 10px 0;"><button type="button" class="${_this.className.weekToggle}" aria-label="주별 보기 ${$toggleText}">${$toggleText}</button></div>`;
    }

    const $html = `<div class="${_this.className.table} ${_this.className.panelPre}day">
      <table role="grid" aria-label="달력 날짜 선택">
        <colgroup>
          <col style="width: 14.2857%;">
          <col style="width: 14.2857%;">
          <col style="width: 14.2857%;">
          <col style="width: 14.2857%;">
          <col style="width: 14.2857%;">
          <col style="width: 14.2857%;">
          <col style="width: 14.2857%;">
        </colgroup>
        <thead>${$theadHtml}</thead>
        <tbody>${$tbodyHtml}</tbody>
      </table>
      ${$toggleBtn}
    </div>`;
    return $html;
  }

  makeMonthsBody() {
    const _this = this;
    let $btnHtml = '';
    const $valMonth = _this.type === 'month' ? _this.value : _this.setYear + _this.setMonth;
    const $year = _this.setStartMonthYear || _this.setYear;
    for (let i = 1; i <= 12; i += 1) {
      const $month = _this.changeStringDay(i);
      const $fullmonth = $year + $month;
      const $notDisabled = Number(_this.minDate.substr(0, 6)) <= Number($fullmonth) && Number($fullmonth) <= Number(_this.maxDate.substr(0, 6));
      const $disabled = !$notDisabled ? ' disabled' : '';
      const $isToday = _this.todayString().substr(0, 6) === $fullmonth;
      const $isSelected = $fullmonth === $valMonth;
      const $today = $isToday ? ' today' : '';
      const $selected = $isSelected ? ' selected' : '';
      const $title = _this.getMonthButtonTitle($fullmonth, $isToday, $isSelected);
      $btnHtml += `<li><button type="button" class="${_this.className.listBtn} month${$today}${$selected}" data-month="${$month}" data-full-month="${$fullmonth}" title="${$title}" aria-label="${$title}"${$disabled}><small>${$year}</small>${_this.headerSuffix}${$month}</button></li>`;
    }
    // const $html = `<div class="${_this.className.list} ${_this.className.panelPre}month"><p class="${_this.className.list}-tit"><strong>${$year}</strong></p><ul>${$btnHtml}</ul></div>`;
    const $html = `<div class="${_this.className.list} ${_this.className.panelPre}month"><ul>${$btnHtml}</ul></div>`;
    return $html;
  }

  makeYearsBody() {
    const _this = this;
    const $startYear = Number(_this.setStartYear);
    // const $valYear = Number(_this.value.substr(0, 4)) || Number(_this.setYear);
    const $valYear = _this.type === 'year' ? Number(_this.value) : Number(_this.setYear);
    let $btnHtml = '';
    for (let i = 0; i < 10; i += 1) {
      const $year = $startYear + i;
      const $isToday = Number(_this.todayString().substr(0, 4)) === $year;
      const $today = $isToday ? ' today' : '';
      const $notDisabled = Number(_this.minDate.substr(0, 4)) <= $year && $year <= Number(_this.maxDate.substr(0, 4));
      const $disabled = !$notDisabled ? ' disabled' : '';
      const $isSelected = $year === $valYear;
      const $selected = $isSelected ? ' selected' : '';
      const $title = _this.getYearButtonTitle($year, $isToday, $isSelected);
      $btnHtml += `<li><button type="button" class="${_this.className.listBtn} year${$today}${$selected}" data-year="${$year}" title="${$title}" aria-label="${$title}"${$disabled}>${$year}</button></li>`;
    }
    const $html = `<div class="${_this.className.list} ${_this.className.panelPre}year"><ul>${$btnHtml}</ul></div>`;
    return $html;
  }

  // set util 
  targetSetValue() {
    const _this = this;
    const $target = _this.element;
    if (!$target) return;
    if (_this.isLayer) {
      $target.value = _this.dateFormat(_this.value);
    }
  }

  // get 
  getStartYaer() {
    const _this = this
    const _start = Math.floor(_this.setYear / 10) * 10;
    const rtnVal = _this.setYear % 10 === 0 ? _start - 9 : _start + 1;
    return rtnVal;
  }

  getLastDay(year, month) {
    const $year = typeof year === 'string' ? Number(year) : year;
    const $month = typeof month === 'string' ? Number(month) : month;
    let $day = 31
    if ($month === 4 || $month === 6 || $month === 9 || $month === 11) {
      $day = 30
    } else if ($month === 2) {
      if ($year % 4 === 0 && ($year % 100 !== 0 || $year % 400 === 0)) {
        $day = 29
      } else {
        $day = 28
      }
    }
    return $day
  }

  // aria label 생성 함수들
  getDateLabel(year, month, day) {
    if (day) {
      return `${year}년 ${Number(month)}월 ${Number(day)}일`;
    } else if (month) {
      return `${year}년 ${Number(month)}월`;
    } else {
      return `${year}년`;
    }
  }

  getButtonTitle(fullDay, isToday, isSelected) {
    const year = fullDay.substr(0, 4);
    const month = fullDay.substr(4, 2);
    const day = fullDay.substr(6, 2);
    
    let title = this.getDateLabel(year, month, day);
    if (isToday) title += ' 오늘';
    if (isSelected) title += ' 선택됨';
    
    return title;
  }

  getMonthButtonTitle(fullMonth, isToday, isSelected) {
    const year = fullMonth.substr(0, 4);
    const month = fullMonth.substr(4, 2);
    
    let title = this.getDateLabel(year, month);
    if (isToday) title += ' 오늘';
    if (isSelected) title += ' 선택됨';
    
    return title;
  }

  getYearButtonTitle(year, isToday, isSelected) {
    let title = this.getDateLabel(year);
    if (isToday) title += ' 오늘';
    if (isSelected) title += ' 선택됨';
    
    return title;
  }

  // etc
  dateFormat(str) {
    const _this = this;
    const $str = typeof str === 'number' ? str.toString() : str;
    // const $str
    const $date = $str.replace(/[^0-9]/g, '');
    const $dateAry = [];
    if ($date.length < 5) {
      $dateAry.push($date);
    } else if ($date.length < 7) {
      $dateAry.push($date.substr(0, 4));
      $dateAry.push($date.substr(4, 2));
    } else {
      $dateAry.push($date.substr(0, 4));
      $dateAry.push($date.substr(4, 2));
      $dateAry.push($date.substr(6));
    }
    return $dateAry.join(_this.valueUnit);
  }

  changeStringDay(str) {
    let rtnval;
    if (typeof str === 'string') rtnval = str.length === 1 ? '0' + str : str;
    else if (typeof str === 'number') rtnval = str < 10 ? '0' + str : String(str);
    return rtnval;
  }

  todayString(addDay, addMonth, addYear) {
    // const $type = addType ? addType : 'day';
    const $today = new Date();
    if (!!addDay && addDay !== 0) $today.setDate($today.getDate() + addDay);
    if (!!addMonth && addMonth !== 0) $today.setMonth($today.getMonth() + addMonth);
    if (!!addYear && addYear !== 0) $today.setFullYear($today.getFullYear() + addYear);
    return this.getDateString($today);
  }

  getDateString(date) {
    const $year = date.getFullYear()
    let $month = date.getMonth() + 1
    let $day = date.getDate()
    if ((`${$month}`).length === 1) $month = `0${$month}`
    if ((`${$day}`).length === 1) $day = `0${$day}`
    return (`${$year}${$month}${$day}`)
  }

  // util
  onlyNumber(num) {
    if (num === undefined) return null;
    return num.toString().replace(/[^0-9]/g, '');
  }

  getSiblings(element) {
    const rtnAry = [];
    const siblings = Array.from(element.parentElement.children);
    siblings.forEach(function(sibling) {
      if (sibling !== element) {
        rtnAry.push(sibling);
      }
    });
    return rtnAry;
  }

  getOffset(element) {
    let $el = element;
    let $elX = 0;
    let $elY = 0;
    let isSticky = false;
    while ($el && !Number.isNaN($el.offsetLeft) && !Number.isNaN($el.offsetTop)) {
      let $style = window.getComputedStyle($el);
      // const $matrix = new WebKitCSSMatrix($style.transform);
      if ($style.position === 'sticky') {
        isSticky = true;
        $el.style.position = 'static';
      }
      $elX += $el.offsetLeft;
      // $elX += $matrix.m41; //translateX
      $elY += $el.offsetTop;
      // $elY += $matrix.m42;  //translateY
      if (isSticky) {
        isSticky = false;
        $el.style.position = '';
        if ($el.getAttribute('style') === '') $el.removeAttribute('style');
      }
      $el = $el.offsetParent;
      if ($el !== null) {
        $style = window.getComputedStyle($el);
        $elX += parseInt($style.borderLeftWidth);
        $elY += parseInt($style.borderTopWidth);
      }
    }
    return {
      left: $elX,
      top: $elY
    };
  }

  seletedClick(callback) {
    this.seletedClickCallback = callback;
  }
}