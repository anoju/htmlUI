// 옵션을 가지는 엘리먼트를 컨트롤하는 클래스 정의
class hiDatepicker {
  constructor(element, options = {}) {
    this.element = element;
    this.value = null;
    this.setYear = null;
    this.setMonth = null;
    this.wrap = null;

    this.options = {
      preClassName: options.preClassName || 'hi',
      // 추가적인 옵션들...
    };
    this.headerSuffix = options.headerSuffix || '.';
    this.format = options.format || '-';
    const preClassName = options.preClassName || 'hi';

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
    const $isInput = $target.tagName === 'INPUT';
    let $wrap = $target.querySelector('.' + _this.className.wrap);
    if ($wrap) $wrap.remove();
    $wrap = document.createElement('div');
    $wrap.classList.add(_this.className.wrap);
    if ($isInput) {
      $wrap.classList.add(_this.className.layer);
      $target.classList.add(_this.className.target);
      $target.readOnly = true;
      const $targetVal = $target.value.trim();
      if (!$targetVal) {
        _this.value = _this.todayTimeString();
        // $target.value = _this.dateFormat(_this.todayTimeString(), _this.format);
      } else {
        _this.value = _this.onlyNumber($target.value);
      }
    }

    if (!_this.value) _this.value = _this.todayTimeString();
    if (!_this.setYear) _this.setYear = _this.value.substr(0, 4);
    if (!_this.setMonth) _this.setMonth = _this.value.substr(4, 2);

    const $innerHtml = `<div class="${_this.className.inner}"></div>`;
    $wrap.innerHTML = $innerHtml;

    if ($isInput) {
      document.body.appendChild($wrap);
    } else {
      $target.appendChild($wrap);
    }
    _this.wrap = $wrap;

    _this.makeHeader();
    _this.makeBody();
    _this.headerBtnEvent($wrap);

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
    $titleMonth.innerHTML = _this.setMonth;
  }

  headerBtnEvent($wrap) {
    const _this = this;
    const $btns = $wrap.querySelectorAll('.' + _this.className.headerBtn)
    $btns.forEach(function($btn) {
      $btn.removeEventListener('click', _this.headerBtnClickEvent.bind(_this));
      $btn.addEventListener('click', _this.headerBtnClickEvent.bind(_this));
    });
  }

  headerBtnClickEvent(e) {
    const _this = this;
    const $target = e.target;
    let $year = parseInt(_this.setYear);
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

    if ($target.classList.contains('prev-year')) {
      $year -= 1;
    } else if ($target.classList.contains('next-year')) {
      $year += 1;
    }
    $year = String($year);
    $month = $month < 10 ? '0' + $month : String($month);
    if (_this.setYear !== $year) _this.setYear = $year;
    if (_this.setMonth !== $month) _this.setMonth = $month;

    _this.update();
  }

  update() {
    const _this = this;
    _this.makeHeader();
    _this.makeBody();
  }

  makeBody() {
    const _this = this;
    const $wrap = _this.wrap;
    let $body = $wrap.querySelector('.' + _this.className.body);
    if ($body) $body.remove();

    $body = document.createElement('div');
    $body.classList.add(_this.className.body);
    const _daysBody = _this.makeDaysBody();
    const _monthsBody = _this.makeMonthsBody();
    const _yearsBody = _this.makeYearsBody();
    const $html = `${_daysBody}${_monthsBody}${_yearsBody}`;

    $body.innerHTML = $html;
    $wrap.querySelector('.' + _this.className.inner).appendChild($body);
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
      const $allday = _this.setYear + _this.setMonth + ($day < 10 ? '0' + $day : String($day));
      const $today = _this.todayTimeString() === $allday ? ' today' : '';
      if ($weekIdx === 0) $tbodyHtml += '<tr>';
      if (i < $startIdx || $lastIdx <= i) {
        $tbodyHtml += `<td data-week-idx="${$weekIdx}"></td>`;
      } else {
        $tbodyHtml += `<td data-week-idx="${$weekIdx}"><button type="button" class="${_this.className.tableBtn}${$today}" data-day="${$allday}">${$day}</button></td>`;
      }
      if ($weekIdx === 6) $tbodyHtml += '</tr>';
    }

    const $html = `<div class="${_this.className.table}">
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
    const $nowMonth = Number(_this.value.substr(4, 2));
    for (let i = 1; i <= 12; i += 1) {
      const $month = i;
      const $selected = $month === $nowMonth ? ' selected' : '';
      $btnHtml += `<li><button type="button" class="${_this.className.listBtn} month${$selected}" data-month="${$month}"><strong>${$month}</strong>월</button></li>`;
    }
    const $html = `<div class="${_this.className.list} months"><ul>${$btnHtml}</ul></div>`;
    return $html;
  }
  makeYearsBody() {
    const _this = this;
    const $startYear = Math.floor(_this.setYear / 10) * 10 + 1;
    const $nowYeawr = Number(_this.value.substr(0, 4));
    let $btnHtml = '';
    for (let i = 0; i < 10; i += 1) {
      const $year = $startYear + i;
      const $selected = $year === $nowYeawr ? ' selected' : '';
      $btnHtml += `<li><button type="button" class="${_this.className.listBtn} year${$selected}" data-year="${$year}"><strong>${$year}</strong>년</button></li>`;
    }
    const $html = `<div class="${_this.className.list} years"><ul>${$btnHtml}</ul></div>`;
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
    let $day = 31
    if (month === 4 || month === 6 || month === 9 || month === 11) {
      $day = 30
    } else if (month === 2) {
      if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
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