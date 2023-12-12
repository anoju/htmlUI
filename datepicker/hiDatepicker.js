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
    this.mobile = options.mobile || null;
    this.type = options.type || 'day';
    this.headerSuffix = options.headerSuffix || '.';
    this.headerSuffix2 = options.headerSuffix2 || '';
    this.format = options.format || '-';
    this.minDate = this.getMinMax(options.min) || '00000000';
    this.maxDate = this.getMinMax(options.max) || '99999999';
    this.holidays = options.holidays ? this.getArrayDate(options.holidays) : [];
    this.disabledDays = options.disabledDays ? this.getArrayDate(options.disabledDays) : [];
    this.disabledWeek = options.disabledWeek ? this.getArrayWeek(options.disabledWeek) : [];
    this.showSetValue = options.showSetValue || false;

    // 클래스네임
    this.className = {
      target: preClassName + '-datepicker',
      wrap: preClassName + '-datepicker-wrap',
      show: preClassName + '-datepicker-show',
      layer: preClassName + '-datepicker-layer',
      mobile: preClassName + '-datepicker-mobile',
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
    if (this.mobile) $innerHtml += `<div class="${_this.className.dimm}"></div>`;
    $innerHtml += `<div class="${_this.className.inner}"></div>`;
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
    $target.readOnly = true;
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
  update() {
    const _this = this;
    setTimeout(function() {
      _this.makeHeader();
      _this.makeBody();
      _this.headerBtnControl();
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
      $yearBtn.forEach(function($btn) {
        $btn.disabled = true;
      });
      $monthBtn.forEach(function($btn) {
        $btn.disabled = false;
        if ($minYear >= $monthYear && $btn.classList.contains('prev-month')) $btn.disabled = true;
        if ($maxYear <= $monthYear && $btn.classList.contains('next-month')) $btn.disabled = true;
      });
    } else if ($showPanel === 'year') {
      $yearBtn.forEach(function($btn) {
        $btn.disabled = false;
        if ($minYear >= $year && $btn.classList.contains('prev-year')) $btn.disabled = true;
        if ($maxYear <= ($year + 10) && $btn.classList.contains('next-year')) $btn.disabled = true;
      });
      $monthBtn.forEach(function($btn) {
        $btn.disabled = true;
      });
    } else {
      $headerBtns.forEach(function($btn) {
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
    const $targetVal = $target.value.trim();
    $wrap.classList.add(_this.className.show);
    if (_this.showSetValue && !_this.value) {
      const $today = _this.todayString();
      if (_this.type === 'year') _this.value = $today.substr(0, 4);
      else if (_this.type === 'month') _this.value = $today.substr(0, 6);
      else _this.value = $today;
      $target.value = _this.dateFormat(_this.value, _this.format);
    }

    if (this.mobile) _this.layerPosition();
    _this.targetInputUpdate();
  }

  layerPosition() {
    const _this = this;
    const $target = _this.element;
    const $wrap = _this.wrap;
    const $top = _this.getOffset($target).top + $target.offsetHeight;
    let $left = _this.getOffset($target).left + ($target.offsetWidth / 2) - ($wrap.offsetWidth / 2);
    if ($left > window.innerWidth - $wrap.offsetWidth) $left = window.innerWidth - $wrap.offsetWidth;
    if ($left < 0) $left = 0;
    $wrap.style.top = $top;
    $wrap.style.left = $left;
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
    if ($isMonth) {
      if (!_this.setStartMonthYear) _this.setStartMonthYear = _this.setYear;
      if ($target.classList.contains('prev-month')) {
        _this.setStartMonthYear = Number(_this.setStartMonthYear) - 1;
      } else if ($target.classList.contains('next-month')) {
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
    _this.update();
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
  }

  // make
  makeHeader(_year, _month) {
    const _this = this;
    const $wrap = _this.wrap;
    let $header = $wrap.querySelector('.' + _this.className.header);
    if (!$header) {
      $header = document.createElement('div');
      $header.classList.add(_this.className.header);
      let $btnHtml = '<button type="button" class="' + _this.className.titleBtn + ' title-year"></button>';
      if (_this.type !== 'year') {
        $btnHtml += '<div class="' + _this.className.titleSuffix + '">' + _this.headerSuffix + '</div>';
        $btnHtml += '<button type="button" class="' + _this.className.titleBtn + ' title-month"></button>';
      }
      if (_this.headerSuffix2) $btnHtml += '<div class="' + _this.className.titleSuffix + '">' + _this.headerSuffix2 + '</div>';

      const $html = `<button type="button" class="${_this.className.headerBtn} prev-year">이전 년도</button>
      <button type="button" class="${_this.className.headerBtn} prev-month">이전 달</button>
      <div class="pub-datepicker-title">${$btnHtml}</div>
      <button type="button" class="${_this.className.headerBtn} next-month">다음 달</button>
      <button type="button" class="${_this.className.headerBtn} next-year">다음 년도</button>`;
      $header.innerHTML = $html;
      $wrap.querySelector('.' + _this.className.inner).appendChild($header);
    }
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
    const $endIdx = ($lastIdx) % 7 === 0 ? $lastIdx : $lastIdx + (7 - $lastIdx % 7);
    const $holidays = _this.holidays;
    const $disabledDays = _this.disabledDays;
    const $disabledWeek = _this.disabledWeek;

    let $tbodyHtml = '';
    for (let i = 0; i < $endIdx; i += 1) {
      const $weekIdx = i % 7;
      const $isDisabledWeek = $disabledWeek.includes(String($weekIdx))
      const $day = i - $startIdx + 1;
      const $fullday = _this.setYear + _this.setMonth + _this.changeStringDay($day);
      const $isHolidays = $holidays.includes($fullday);
      const holidayClass = $isHolidays ? ' class="holiday"' : '';
      const $today = _this.todayString() === $fullday ? ' today' : '';
      const $selected = _this.value === $fullday ? ' selected' : '';
      const $isDisableddays = $disabledDays.includes($fullday);
      const $notDisabled = Number(_this.minDate) <= Number($fullday) && Number($fullday) <= Number(_this.maxDate);
      const $disabled = (!$notDisabled || $isDisableddays || $isDisabledWeek) ? ' disabled' : '';
      if ($weekIdx === 0) $tbodyHtml += '<tr>';
      if (i < $startIdx || $lastIdx <= i) {
        $tbodyHtml += `<td data-week-idx="${$weekIdx}"></td>`;
      } else {
        $tbodyHtml += `<td data-week-idx="${$weekIdx}"${holidayClass}><button type="button" class="${_this.className.tableBtn}${$today}${$selected}" data-day="${$day}" data-full-day="${$fullday}"${$disabled}>${$day}</button></td>`;
      }
      if ($weekIdx === 6) $tbodyHtml += '</tr>';
    }

    const $html = `<div class="${_this.className.table} ${_this.className.panelPre}day">
      <table>
        <thead>
          <tr>
            <th data-week-idx="0">일</th>
            <th data-week-idx="1">월</th>
            <th data-week-idx="2">화</th>
            <th data-week-idx="3">수</th>
            <th data-week-idx="4">목</th>
            <th data-week-idx="5">금</th>
            <th data-week-idx="6">토</th>
          </tr>
        </thead>
        <tbody>${$tbodyHtml}</tbody>
      </table>
    </div>`;
    return $html;
  }

  makeMonthsBody() {
    const _this = this;
    let $btnHtml = '';
    const $valMonth = _this.type === 'month' ? _this.value : _this.setYear + _this.setMonth;
    const $year = _this.setStartMonthYear || _this.setYear;
    for (let i = 1; i <= 12; i += 1) {
      const $month = i;
      const $fullmonth = $year + _this.changeStringDay($month);
      const $notDisabled = Number(_this.minDate.substr(0, 6)) <= Number($fullmonth) && Number($fullmonth) <= Number(_this.maxDate.substr(0, 6));
      const $disabled = !$notDisabled ? ' disabled' : '';
      const $today = _this.todayString().substr(0, 6) === $fullmonth ? ' today' : '';
      const $selected = $fullmonth === $valMonth ? ' selected' : '';
      $btnHtml += `<li><button type="button" class="${_this.className.listBtn} month${$today}${$selected}" data-month="${$month}" data-full-month="${$fullmonth}"${$disabled}><strong>${$month}</strong>월</button></li>`;
    }
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
      const $today = Number(_this.todayString().substr(0, 4)) === $year ? ' today' : '';;
      const $notDisabled = Number(_this.minDate.substr(0, 4)) <= $year && $year <= Number(_this.maxDate.substr(0, 4));
      const $disabled = !$notDisabled ? ' disabled' : '';
      const $selected = $year === $valYear ? ' selected' : '';
      $btnHtml += `<li><button type="button" class="${_this.className.listBtn} year${$today}${$selected}" data-year="${$year}"${$disabled}><strong>${$year}</strong>년</button></li>`;
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
      $target.value = _this.dateFormat(_this.value, _this.format);
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

  // etc
  dateFormat(str, mark) {
    const $str = typeof str === 'number' ? str.toString() : str;
    // const $str
    const $date = $str.replace(/[^0-9]/g, '');
    const $dateAry = [];
    if (!mark) mark = '-';
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
    return $dateAry.join(mark);
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
}

// 사용 예시
// const element = document.getElementById('yourElementId');
// const controller = new CustomElementController(element, {
//   option1: 'customOption1',
//   option2: 'customOption2',
// });

// 클래스 메소드 호출
// CustomElementController.staticMethod();

// 옵션 업데이트
// controller.updateOption1('newCustomOption1');