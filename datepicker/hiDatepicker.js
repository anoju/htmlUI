// 옵션을 가지는 엘리먼트를 컨트롤하는 클래스 정의
class hiDatepicker {
  constructor(element, options = {}) {
    this.element = element;
    this.value = null;
    this.setYear = null;
    this.setStartYear = null;
    this.setMonth = null;
    this.wrap = null;
    this.isLayer = null;
    this.showPanel = 'days';


    // 옵션들
    this.headerSuffix = options.headerSuffix || '.';
    this.format = options.format || '-';
    const preClassName = options.preClassName || 'hi';

    // 클래스네임
    this.className = {
      target: preClassName + '-datepicker',
      wrap: preClassName + '-datepicker-wrap',
      layer: preClassName + '-datepicker-layer',
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


  init() {
    const _this = this;
    const $target = document.querySelector(_this.element);
    if (!$target) return;
    _this.isLayer = $target.tagName === 'INPUT';
    // let $wrap = $target.querySelector('.' + _this.className.wrap);
    // if ($wrap) $wrap.remove();
    const $wrap = document.createElement('div');
    $wrap.classList.add(_this.className.wrap);
    if (_this.isLayer) {
      $wrap.classList.add(_this.className.layer);
      $target.classList.add(_this.className.target);
      $target.readOnly = true;
      const $targetVal = $target.value.trim();
      if (!$targetVal) {
        _this.value = _this.todayTimeString();
        $target.value = _this.dateFormat(_this.todayTimeString(), _this.format);
      } else {
        _this.value = _this.onlyNumber($target.value);
      }
    }

    if (!_this.value) _this.value = _this.todayTimeString();
    if (!_this.setYear) _this.setYear = _this.value.substr(0, 4);
    if (!_this.setStartYear) _this.setStartYear = _this.getStartYaer();
    if (!_this.setMonth) _this.setMonth = _this.value.substr(4, 2);

    const $innerHtml = `<div class="${_this.className.inner}"></div>`;
    $wrap.innerHTML = $innerHtml;

    if (_this.isLayer) {
      document.body.appendChild($wrap);
    } else {
      $target.appendChild($wrap);
    }
    _this.wrap = $wrap;

    _this.makeHeader();
    _this.makeBody();
    _this.headerBtnEvent();
  }

  getStartYaer() {
    const _this = this
    const _start = Math.floor(_this.setYear / 10) * 10;
    const rtnVal = _this.setYear % 10 === 0 ? _start - 9 : _start + 1;
    return rtnVal;
  }

  makeHeader(_year, _month) {
    const _this = this;
    const $wrap = _this.wrap;
    let $header = $wrap.querySelector('.' + _this.className.header);
    if (!$header) {
      $header = document.createElement('div');
      $header.classList.add(_this.className.header);
      const $html = `<button type="button" class="${_this.className.headerBtn} prev-year">이전 년도</button>
      <button type="button" class="${_this.className.headerBtn} prev-month">이전 달</button>
      <div class="pub-datepicker-title">
        <button type="button" class="${_this.className.titleBtn} title-year"></button>
        <div class="${_this.className.titleSuffix}">${this.headerSuffix}</div>
        <button type="button" class="${_this.className.titleBtn} title-month"></button>
      </div>
      <button type="button" class="${_this.className.headerBtn} next-month">다음 달</button>
      <button type="button" class="${_this.className.headerBtn} next-year">다음 년도</button>`;
      $header.innerHTML = $html;
      $wrap.querySelector('.' + _this.className.inner).appendChild($header);
    }
    const $titleYear = $header.querySelector('.title-year');
    $titleYear.innerHTML = _this.setYear;
    const $titleMonth = $header.querySelector('.title-month');
    $titleMonth.innerHTML = _this.changeStringDay(_this.setMonth);
  }

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

  // click
  headerBtnClickEvent(e) {
    const _this = this;
    const $target = e.target;
    const $isYear = _this.showPanel === 'year';
    let $year = $isYear ? parseInt(_this.setStartYear) : parseInt(_this.setYear);
    let $month = parseInt(_this.setMonth);
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

    const $yeraNum = $isYear ? 10 : 1;
    if ($target.classList.contains('prev-year')) {
      $year -= $yeraNum;
    } else if ($target.classList.contains('next-year')) {
      $year += $yeraNum;
    }
    console.log($year);
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
  }

  targetSetValue() {
    const _this = this;
    const $target = document.querySelector(_this.element);
    if (!$target) return;
    if (_this.isLayer) {
      $target.value = _this.dateFormat(_this.value, _this.format);
    }
  }

  listBtnClickEvent(e) {
    const _this = this;
    let $target = e.target;
    if (!$target.classList.contains(_this.className.listBtn)) $target = $target.closest('.' + _this.className.listBtn);
    if (!$target) return;
    if ($target.classList.contains('year')) {
      const $btnYear = $target.dataset.year;
      _this.setYear = $btnYear;
    }
    if ($target.classList.contains('month')) {
      const $btnMonth = $target.dataset.month;
      _this.setMonth = $btnMonth;
    }

    _this.update();
    _this.showPanel = 'days';
    _this.showPanelEvent();
  }

  update() {
    const _this = this;
    _this.makeHeader();
    _this.makeBody();
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
    const _daysBody = _this.makeDaysBody();
    const _monthsBody = _this.makeMonthsBody();
    const _yearsBody = _this.makeYearsBody();
    const $html = `${_daysBody}${_monthsBody}${_yearsBody}`;

    $body.innerHTML = $html;
    $wrap.querySelector('.' + _this.className.inner).appendChild($body);
    _this.addBodyBtnEvent();

    _this.showPanelEvent();
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

    const $headerBtns = $wrap.querySelectorAll('.' + _this.className.headerBtn);
    const $monthBtn = $wrap.querySelectorAll('.' + _this.className.headerBtn + '[class*="month"]');
    if ($showPanel === 'month') {
      $headerBtns.forEach(function($btn) {
        $btn.disabled = true;
      });
    } else if ($showPanel === 'year') {
      $monthBtn.forEach(function($btn) {
        $btn.disabled = true;
      });
    } else {
      $headerBtns.forEach(function($btn) {
        $btn.disabled = false;
      });
    }
  }

  makeDaysBody() {
    const _this = this;
    const $lastDay = _this.getLastDay(_this.setYear, _this.setMonth);
    const $startIdx = new Date(_this.setYear, (_this.setMonth - 1), 1, 0, 0, 0, 0).getDay();
    const $lastIdx = $startIdx + $lastDay;
    const $endIdx = ($lastIdx) % 7 === 0 ? $lastIdx : $lastIdx + (7 - $lastIdx % 7);

    let $tbodyHtml = '';
    for (let i = 0; i < $endIdx; i += 1) {
      const $weekIdx = i % 7;
      const $day = i - $startIdx + 1;
      const $fullday = _this.setYear + _this.setMonth + _this.changeStringDay($day);
      const $today = _this.todayTimeString() === $fullday ? ' today' : '';
      const $selected = _this.value === $fullday ? ' selected' : '';
      if ($weekIdx === 0) $tbodyHtml += '<tr>';
      if (i < $startIdx || $lastIdx <= i) {
        $tbodyHtml += `<td data-week-idx="${$weekIdx}"></td>`;
      } else {
        $tbodyHtml += `<td data-week-idx="${$weekIdx}"><button type="button" class="${_this.className.tableBtn}${$today}${$selected}" data-day="${$day}" data-full-day="${$fullday}">${$day}</button></td>`;
      }
      if ($weekIdx === 6) $tbodyHtml += '</tr>';
    }

    const $html = `<div class="${_this.className.table} ${_this.className.panelPre}days">
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
    //const $valMonth = Number(_this.value.substr(4, 2)) || Number(_this.setMonth);
    const $valMonth = Number(_this.setMonth);
    for (let i = 1; i <= 12; i += 1) {
      const $month = i;
      const $fullmonth = _this.setYear + _this.changeStringDay($month);
      const $today = _this.todayTimeString().substr(0, 6) === $fullmonth ? ' today' : '';
      const $selected = $month === $valMonth ? ' selected' : '';
      $btnHtml += `<li><button type="button" class="${_this.className.listBtn} month${$today}${$selected}" data-month="${$month}" data-full-month="${$fullmonth}"><strong>${$month}</strong>월</button></li>`;
    }
    const $html = `<div class="${_this.className.list} ${_this.className.panelPre}month"><ul>${$btnHtml}</ul></div>`;
    return $html;
  }
  makeYearsBody() {
    const _this = this;
    const $startYear = Number(_this.setStartYear);
    // const $valYear = Number(_this.value.substr(0, 4)) || Number(_this.setYear);
    const $valYear = Number(_this.setYear);
    let $btnHtml = '';
    for (let i = 0; i < 10; i += 1) {
      const $year = $startYear + i;
      const $today = _this.todayTimeString().substr(0, 4) === $year ? ' today' : '';;
      const $selected = $year === $valYear ? ' selected' : '';
      $btnHtml += `<li><button type="button" class="${_this.className.listBtn} year${$today}${$selected}" data-year="${$year}"><strong>${$year}</strong>년</button></li>`;
    }
    const $html = `<div class="${_this.className.list} ${_this.className.panelPre}year"><ul>${$btnHtml}</ul></div>`;
    return $html;
  }

  todayTimeString(addDay) {
    const $today = new Date()
    if (addDay) $today.setDate($today.getDate() + addDay)
    return this.dateTimeString($today)
  }

  dateTimeString(date) {
    const $year = date.getFullYear()
    let $month = date.getMonth() + 1
    let $day = date.getDate()
    if ((`${$month}`).length === 1) $month = `0${$month}`
    if ((`${$day}`).length === 1) $day = `0${$day}`
    return (`${$year}${$month}${$day}`)
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

  onlyNumber(num) {
    return num.toString().replace(/[^0-9]/g, '');
  }

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