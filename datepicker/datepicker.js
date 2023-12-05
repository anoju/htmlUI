// 옵션을 가지는 엘리먼트를 컨트롤하는 클래스 정의
class uiCalendar {
  constructor(element, options = {}) {
    this.element = element;
    this.setYear = null;
    this.setMonth = null;
    this.options = {
      option1: options.option1 || 'defaultOption1',
      option2: options.option2 || 'defaultOption2',
      // 추가적인 옵션들...
    };
    // console.log('aaa', this.init)
    // 초기화 함수 호출
    this.init();
  }

  // 엘리먼트 초기화 함수
  init() {
    const _this = this;
    const $target = document.querySelectorAll(_this.element);
    if (!$target.length) return;
    $target.forEach(function($item) {
      _this.ready($item)
    })
  }

  ready(element) {
    const _this = this;
    const $target = element;
    let $inner = $target.querySelector('.pub-datepicker-inner');
    if ($inner) $inner.remove();
    $inner = document.createElement('div');
    $inner.className = 'pub-datepicker-inner';

    const $todayYear = _this.todayTimeString().substr(0, 4);
    if (!_this.setYear) _this.setYear = $todayYear;
    const $todayMonth = _this.todayTimeString().substr(4, 2);
    if (!_this.setMonth) _this.setMonth = $todayMonth;
    $inner.innerHTML = _this.makeHeader(_this.setYear, _this.setMonth) + _this.makeBody();

    $target.appendChild($inner);
  }

  makeHeader(_year, _month) {
    const $html = `<div class="pub-datepicker-header">
      <button type="button" class="pub-datepicker-header-btn prev-year">이전 년도</button>
      <button type="button" class="pub-datepicker-header-btn prev-month">이전 달</button>
      <div class="pub-datepicker-title">
        <button type="button" class="pub-datepicker-title-btn title-year">${_year}</button>
        <button type="button" class="pub-datepicker-title-btn title-month">${_month}</button>
      </div>
      <button type="button" class="pub-datepicker-header-btn next-month">다음 달</button>
      <button type="button" class="pub-datepicker-header-btn next-year">다음 년도</button>
    </div>`;
    return $html;
  }

  makeBody() {
    const _this = this;
    const _daysBody = _this.makeDaysBody();
    const _monthsBody = _this.makeMonthsBody();
    const _yearsBody = _this.makeYearsBody();
    const $html = `<div class="pub-datepicker-body">
      ${_daysBody}
      ${_monthsBody}
      ${_yearsBody}
    </div>`;
    return $html;
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
      if ($weekIdx === 0) $tbodyHtml += '<tr>';
      if (i < $startIdx || $lastIdx <= i) {
        $tbodyHtml += `<td data-week-idx="${$weekIdx}"></td>`;
      } else {
        $tbodyHtml += `<td data-week-idx="${$weekIdx}"><button type="button" class="pub-datepicker-cell" data-day="${$day}">${$day}</button></td>`;
      }
      if ($weekIdx === 6) $tbodyHtml += '</tr>';
    }

    const $html = `<div class="pub-datepicker-table">
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
    for (let i = 1; i <= 12; i += 1) {
      const $month = i;
      const $selected = $month === _this.setMonth ? ' selected' : '';
      $btnHtml += `<li><button type="button" class="pub-datepicker-body-btn month${$selected}" data-month="${$month}">${$month}월</button></li>`;
    }
    const $html = `<div class="pub-datepicker-list months"><ul>${$btnHtml}</ul></div>`;
    return $html;
  }
  makeYearsBody() {
    const _this = this;
    const $startYear = Math.floor(_this.setYear / 10) * 10 + 1;
    let $btnHtml = '';
    for (let i = 0; i < 10; i += 1) {
      const $year = $startYear + i;
      const $selected = $year === _this.setYear ? ' selected' : '';
      $btnHtml += `<li><button type="button" class="pub-datepicker-body-btn year${$selected}" data-year="${$year}">${$year}년</button></li>`;
    }
    const $html = `<div class="pub-datepicker-list years"><ul>${$btnHtml}</ul></div>`;
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



  dateCalculation(Y, M, D, i = 1) {
    const $date = new Date()
    let $dateYear = $date.getFullYear()
    let $dateMonth = $date.getMonth()
    let $dateDate = $date.getDate()
    if (Y !== undefined) $dateYear += (Number(Y) * i)
    if (M !== undefined) $dateMonth += (Number(M) * i)
    if (D !== undefined) $dateDate += (Number(D) * i)
    const $rtnDate = new Date($dateYear, $dateMonth, $dateDate)
    return this.dateTimeString($rtnDate).substr(0, 8)
  }

  // 달력 배열
  calAryPush(idx, type) {
    if (type === undefined) type = 'next'
    if (type !== 'prev' && type !== 'next') return
    let year = this.calendarYear
    let month = this.calendarMonth
    month += idx
    const n = Math.abs(Math.floor(month / 12))
    if (month < 1) {
      year -= n
      month += (12 * n)
    } else if (month > 12) {
      year += n
      month -= (12 * n)
    }
    if (month === 0) {
      year -= 1
      month = 12
    }
    if ((`${month}`).length === 1) month = `0${month}`
    if (this.minDate !== null) {
      if (Number(this.minDate.substr(0, 6)) > Number(`${year}${month}`)) {
        this.isPrevDisabled = true
        return
      }
    }
    if (this.maxDate !== null) {
      if (Number(this.maxDate.substr(0, 6)) < Number(`${year}${month}`)) return
    }

    if (type === 'prev') this.calendarAry.unshift({
      idx: `${idx}`,
      Y: `${year}`,
      M: `${month}`
    })
    if (type === 'next') this.calendarAry.push({
      idx: `${idx}`,
      Y: `${year}`,
      M: `${month}`
    })
  }

  yaerAryPush(year) {
    this.yearAry = []
    const start = (Math.floor(year / 10) * 10) - 1
    const end = ((Math.floor(year / 10) + 1) * 10)
    for (let i = start; i <= end; i += 1) {
      this.yearAry.push(`${i}`)
    }
  }

  // 클래스 메소드로도 접근 가능
  static staticMethod() {
    // 클래스 레벨의 동작 수행
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