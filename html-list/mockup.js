// Made By Anoju (zun5761@gmail.com)

// const isJQuery = () =>{
//   return typeof jQuery === 'function'
// }
/* LOADING */
const loading = {
  open() {
    const loadingEl = document.createElement('div');
    loadingEl.id = 'loadingbar';
    loadingEl.className = 'loading';

    const loadingInnerEl = `<div class="loading-svg" role="img" aria-label="화면을 불러오는중입니다.">
      <svg width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
      </svg>
    </div>`;
    // const loadingInnerEl = `<img src="../../resource/pc/images/common/loading.gif" alt="로딩중" />`;

    loadingEl.innerHTML = loadingInnerEl;
    document.body.appendChild(loadingEl);
  },
  close() {
    const loadingEl = document.getElementById('loadingbar');
    if (loadingEl) loadingEl.remove();
  }
};

/* pubUtil */
const pubUtil = {
  getWeek (date) {
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    let rtnVal = weekdays[new Date(date).getDay()]
    if(rtnVal) return `(${rtnVal})`;
    else return '';
  },
  getToday(setDate){
    let today = setDate ? new Date(setDate) : new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },
  getPrevDates(setDate) {
    const result = [];
    let date = setDate ? new Date(setDate) : new Date();
    date.setDate(date.getDate() - 1); // 어제 날짜로 설정
    while (true) {
        const formattedDate = pubUtil.getToday(date);
        const dayOfWeek = date.getDay(); // 0은 일요일, 6은 토요일

        if (dayOfWeek === 0 || dayOfWeek === 6 || setting.holiday.includes(formattedDate)) {
            result.push(formattedDate);
            date.setDate(date.getDate() - 1); // 하루 전으로 이동
        } else {
            result.push(formattedDate); // 평일이면서 공휴일이 아닌 경우 마지막 날짜 추가
            break; // 반복 종료
        }
    }
    return result;
  },
  isValidDate (dateStr) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;
    
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date);
  },
  clipboardCopy(text){
    const textarea = document.createElement('textarea');
    textarea.id = 'pub-modify-textarea';
    textarea.style.zIndex = -1;
    textarea.style.opacity = 0;
    textarea.style.position = 'fixed';
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('Copy');
    document.body.removeChild(textarea);
    pubUtil.toastPop('클립보드에 복사되었습니다.');
  },
  toastPop(text){
    const msg = document.createElement('div');
    msg.className = 'toast-pop';
    msg.textContent = text;
    document.body.appendChild(msg);
    setTimeout(() => {
      msg.remove();
    }, 1500);
  },
  jsonToCSV(jsonData){
    const excludedHeaders = ['URL', 'WBS', 'SB', 'MEMO', 'MODIFY']; //제외항목
    let headers = Object.keys(jsonData[0]).filter(header => !excludedHeaders.includes(header));
    headers = headers.map(header => header
      .replace('COUNT', '사용여부')
      .replace('DEP', '뎁스')
      .replace('SCREEN', '화면명')
      .replace('TYPE', '유형')
      .replace('ID', '화면ID')
      .replace('PLA', '기획')
      .replace('DGN', '디자인')
      .replace('PUB', '퍼블리싱')
      .replace('DEV', '개발')
      .replace('STATUS', '상태')
      .replace('WBS', '완료예정일')
      .replace('END', '최종완료일')
    );
    console.log(headers)
    const csvRows = [headers.join(',')];

    jsonData.forEach(row => {
      if(row.COUNT){
        if (row.COUNT === '0') row.COUNT = '미사용';
        if (row.COUNT === '1') row.COUNT = '사용';
      }
      if(row.STATUS){
        if (row.STATUS === '0') row.STATUS = '삭제';
        if (row.STATUS === '1') row.STATUS = '대기';
        if (row.STATUS === '2') row.STATUS = '퍼블중';
        if (row.STATUS === '3') row.STATUS = '검토중';
        if (row.STATUS === '4') row.STATUS = '재검토중';
      }
      if (row.TYPE) {
        row.TYPE = row.TYPE.toUpperCase();
        if (row.TYPE === 'F') row.TYPE = 'F(메인)';
        if (row.TYPE === 'T') row.TYPE = 'T(탭)';
        if (row.TYPE === 'L') row.TYPE = 'L(링크)';
        if (row.TYPE === 'P') row.TYPE = 'P(팝업)';
        if (row.TYPE === 'WP') row.TYPE = 'P(팝업)';
        if (row.TYPE === 'FP') row.TYPE = 'P(팝업)';
        if (row.TYPE === 'CP') row.TYPE = 'P(팝업)';
        if (row.TYPE === 'BP') row.TYPE = 'P(팝업)';
      }

      if (!String(row.COUNT).startsWith('0')) {
        const values = headers.map(header => {
          const escapedValue = ('' + row[header]).replace(/"/g, '""');
          return `"${escapedValue}"`;
        });
        csvRows.push(values.join(','));
      }
    });

    return csvRows.join('\n');
  },
  changeTxt(str){
    return str.replace(/\s+/g, '_').replace(/[^가-힣a-zA-Z0-9_-]/g, '__');
  },
  getUrlParams() {
    const params = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, (str, key, value) => {
      params[key] = value;
    });
    return params;
  },
  setUrlParams(key, value){
    const currentUrl = new URL(window.location.href);
    const params = new URLSearchParams(currentUrl.search);
    let newUrl = currentUrl.pathname;
    if(key){
      params.set(key, value);
      newUrl = newUrl+'?'+params.toString();
    }
    history.pushState(null, '', newUrl);
  }
};

/* pubList */
let pubJSON = null;
const pubList = {
  async init(data, setting){
    pubList.device();
    if(setting)pubList.setting = {...pubList.setting, ...setting};
    const wrap = document.querySelector('.pub-wrap');
    if(wrap) {
      if(wrap.getAttribute('data-layout') === 'index'){
        if(typeof data === 'undefined') {
          loading.close();
          return;
        }
        pubJSON = data;
        await pubList.makeList();
        let tabIdx = pubUtil.getUrlParams().tab;
        if(tabIdx){
          tabIdx = parseInt(tabIdx);
          const tabBtn = document.querySelector(`.pub-nav .pub-menu > ul > li:nth-child(${tabIdx}) a`);
          if(tabBtn) tabBtn.click();
        }
      }else if(wrap.getAttribute('data-layout') === 'guide'){
        await pubList.makeGuideMenu();
      }
      loading.close();
    }
    pubList.action();
  },
  setting: {
    preURL: '',
    file: 'html',
    holiday: [],
  },
  device() {
    const filter="win16|win32|win64|mac";
    const isMobile=navigator.userAgent.match(/Android|Mobile|iP(hone|od|ad)|BlackBerry|IEMobile|kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/) || filter.indexOf(navigator.platform.toLowerCase()) < 0 ? true : false;
    const docEl = document.documentElement;
    if (isMobile) {
      docEl.id = 'isMobile';
    } else {
      docEl.removeAttribute('id');
      // document.body.class.remove('pub-nav-up');
      // document.body.class.add('pub-nav-down');
    }
  },
  makeGuideMenu(){
    //guide menu
    const titleEl = document.querySelector('.pub-header .pub-title');
    const menus = document.querySelectorAll('.pub-site .pub-site-title h2>span');
    const navHtml = document.createElement('div');
    navHtml.className = 'pub-nav';
    let navListHtml ='';
    if(menus.length){
      navListHtml += '<ul>';
      menus.forEach((menu, i) => {
        const text = menu.textContent;
        navListHtml += `<li><a href="#menu${i}" title="${text}"><span>${text}</span></a></li>`;
      });
      navListHtml += '/<ul>';
      const sites = document.querySelectorAll('.pub-site');
      sites.forEach((site, i) => {
        site.id = `menu${i}`;
      });
    }
    const navInnerHtml = `
      <div class="pub-nav-inr">
        <div class="pub-all"><a href="#all" class="on"><span>전체</span></a></div>
        <div class="pub-menu">${navListHtml}</div>
      </div>
    `;
    navHtml.innerHTML = navInnerHtml;
    // titleEl.insertAdjacentHTML('afterend', navHtml);
    titleEl.parentNode.insertBefore(navHtml, titleEl.nextSibling);


    //guide 복사버튼
    const codes = document.querySelectorAll('.pub-site .pub-template .pub-code');
    if(codes.length){
      codes.forEach(code => {
        const btnHtml = document.createElement('button');
        btnHtml.type = 'button';
        btnHtml.className = 'pub-copy-code';
        btnHtml.title = 'Copy Code';
        btnHtml.innerHTML = '<i></i>코드 복사';
        code.appendChild(btnHtml);
      });
    }
  },
  makeList(){
    return new Promise((resolve) => {
      const pubPage = document.querySelector('.pub-page');
      const pubHeader = document.querySelector('.pub-header');
      const contentHtml = document.createElement('div');
      contentHtml.className = 'pub-content';

      const groupDep1 = pubList.groupByDep1(pubJSON);
      if(!groupDep1.length) {
        resolve();
        return;
      }

      const navAry = [];
      const fragment = document.createDocumentFragment();

      groupDep1.forEach((item, i) => {
        navAry.push(item.dep1);
        const section = pubList.createSection(item, i);
        fragment.appendChild(section);
      });

      contentHtml.appendChild(fragment);
      pubPage.appendChild(contentHtml);

      pubList.createMobileFrame(pubPage);
      pubList.createNav(pubHeader, navAry);

      const filterState = pubList.getFilterState(pubJSON);
      pubList.createSide(pubHeader, filterState);

      // DOM 업데이트가 완료되었음을 보장하기 위해
      // requestAnimationFrame 사용
      requestAnimationFrame(() => {
        resolve();
      });
    });
  },
  getPercent (val1, val2){
    let rtnVal = ((val1/val2)*100).toFixed(2);
    if (isNaN(rtnVal)) rtnVal = 0;
    return rtnVal;
  },
  groupByDep1 (data) {
    // 먼저 객체로 그룹화
    const grouped = data.reduce((acc, curr) => {
        const dep1 = curr.DEP1;
        if (!acc[dep1]) {
            acc[dep1] = [];
        }
        acc[dep1].push(curr);
        return acc;
    }, {});

    // 그룹화된 객체를 배열로 변환
    return Object.entries(grouped).map(([dep1, items]) => ({
        dep1,
        items
    }));
  },
  createMobileFrame(element){
    const frameHtml = document.createElement('div');
    frameHtml.className = 'pub-mobile-frame';
    const frameInnerHtml = `
      <div class="pub-mobile-frame-inr">
          <div class="pub-device">
              <select class="pub-device-select">
                  <option value="375*667">iPhone 6/7/8</option>
                  <option value="375*812">iPhone 12 Mini</option>
                  <option value="390*844">iPhone 12 Pro</option>
                  <option value="360*740" selected>Galaxy S8+</option>
                  <option value="280*653">Galaxy Fold</option>
              </select>
          </div>
          <div class="pub-screen">
              <button type="button">&#8634;</button>
              <div class="link"></div>
          </div>
          <div class="pub-iframe"></div>
          <button type="button" class="pub-frame-toggle"><span>닫기</span></button>
      </div>
    `;
    frameHtml.innerHTML = frameInnerHtml;
    element.appendChild(frameHtml);
  },
  createNav(element, data){
    const navHtml = document.createElement('div');
    navHtml.className = 'pub-nav';
    let navListHtml ='';
    if(data.length){
      navListHtml += '<ul>';
      data.forEach((item, i) => {
        navListHtml += `<li><a href="#menu${i}" title="${item}"><span>${item}</span></a></li>`
      });
      navListHtml += '/<ul>';
    }
    const navInnerHtml = `
      <div class="pub-nav-inr">
        <div class="pub-all"><a href="#all" class="on"><span>전체</span></a></div>
        <div class="pub-menu">${navListHtml}</div>
      </div>
    `;
    navHtml.innerHTML = navInnerHtml;
    element.appendChild(navHtml);
  },
  createSide(element, filterData){
    const sideHtml = document.createElement('div');
    sideHtml.className = 'pub-side';
    const totalHtml = `<div class="pub-total">
      <strong>
        ${filterData.end.length}
        <span><em>${filterData.endDel.length}</em></span>
      </strong>
      <span>/</span>
      <strong>
        ${filterData.useTotal.length - filterData.del.length}
        <span><em>${filterData.del.length}</em></span>
      </strong>
      <em>
        <span>
          <span>진척률</span>
          <strong>${pubList.getPercent(filterData.end.length, filterData.useTotal.length - filterData.del.length)}</strong>%
        </span>
        <button type="button" class="pub-button-detail" aria-expanded="false"></button>
      </em>
      <ul class="pub-total-layer">
          <li>
              <em>전체<span>(<strong>${filterData.total.length}</strong>)</span></em>
          </li>
          <li class="unuse">
              <em>미포함<span>(<strong>${filterData.unuse.length}</strong>)</span></em>
              <span><strong>${pubList.getPercent(filterData.unuse.length, filterData.total.length)}</strong>%</span>
          </li>
          <li class="del">
              <em>삭제<span>(<strong>${filterData.del.length}</strong>)</span></em>
              <span><strong>${pubList.getPercent(filterData.del.length, filterData.total.length)}</strong>%</span>
          </li>
          <li class="wait">
              <em>대기<span>(<strong>${filterData.wait}</strong>)</span></em>
              <span><strong>${pubList.getPercent(filterData.wait.length, filterData.total.length)}</strong>%</span>
          </li>
          <li class="ing">
              <em>퍼블중<span>(<strong>${filterData.ing.length}</strong>)</span></em>
              <span><strong>${pubList.getPercent(filterData.ing.length, filterData.total.length)}</strong>%</span>
          </li>
          <li class="chk">
              <em>재/검토중<span>(<strong>${filterData.chk.length+filterData.reChk.length}</strong>)</span></em>
              <span><strong>${pubList.getPercent(filterData.chk.length+filterData.reChk.length, filterData.total.length)}</strong>%</span>
          </li>
          <li class="end">
              <em>완료<span>(<strong>${filterData.end.length}</strong>)</span></em>
              <span><strong>${pubList.getPercent(filterData.end.length, filterData.total.length)}</strong>%</span>
          </li>
          <li class="delay">
              <em>지연<span>(<strong>${filterData.delay.length}</strong>)</span></em>
              <span><strong>${pubList.getPercent(filterData.delay.length, filterData.total.length)}</strong>%</span>
          </li>
      </ul>
    </div>`;
    const util1Html =  `<div class="pub-group">
      <button class="pub-reset">&#8634;</button>
      <div class="pub-search">
        <input type="text" class="pub-search-inp" placeholder="메뉴명" /><button class="pub-search-btn"></button>
      </div>
      <button type="button" class="pub-viewer" aria-pressed="false"></button>
      <button type="button" aria-pressed="false" class="pub-toggle"></button>
    </div>`;
    const alarmHtml = (num) => {
      if(num) return `<strong class="pub-alarm"><span>${num}</span></strong>`;
      else return '';
    }
    const util2Html = `<div class="pub-label">
      <ul>
        <li>
          <button type="button" class="pub-filter-sb">SB</button>
        </li>
      </ul>
      <ul>
        <li class="wait">
          ${alarmHtml(filterData.wait.length)}
          <button type="button" class="pub-filter-status"  ${filterData.wait.length?'':`disabled="disabled"`} data-status="1">대기중</button>
        </li>
        <li class="ing">
          ${alarmHtml(filterData.ing.length)}
          <button type="button" class="pub-filter-status"  ${filterData.ing.length?'':`disabled="disabled"`} data-status="2">퍼블중</button>
        </li>
        <li class="chk">
          ${alarmHtml(filterData.chk.length+filterData.reChk.length)}
          <button type="button" class="pub-filter-status"  ${filterData.chk.length+filterData.reChk.length?'':`disabled="disabled"`} data-status="3">재/검토중</button>
        </li>
        <li class="del">
          ${alarmHtml(filterData.del.length)}
          <button type="button" class="pub-filter-status" ${filterData.del.length?'':`disabled="disabled"`} data-status="0">삭제</button>
        </li>
      </ul>
      <ul>
        <li class="history">
          <button type="button" class="pub-modify-open" ${!filterData.modify.length ? `disabled="disabled"`: ''}>수정이력</button>
        </li>
        <li class="down">
          <button type="button" class="pub-csv-down">CSV 다운</button>
        </li>
      </ul>
    </div>`;
    const sideInnerHtml = `
      <div class="pub-side-inr">
        ${totalHtml}
        <div class="pub-legend">
          ${util1Html}
          ${util2Html}
        </div>
      </div>
    `;
    sideHtml.innerHTML = sideInnerHtml;
    element.appendChild(sideHtml);
  },
  getFilterState(data){
    const rtnObj = {};
    rtnObj.total = data; // 전체
    rtnObj.unuse = data.filter(item => parseInt(item.COUNT) === 0);
    rtnObj.useTotal = data.filter(item => parseInt(item.COUNT) !== 0);
    rtnObj.del = data.filter(item => parseInt(item.STATUS) === 0 && parseInt(item.COUNT) !== 0);
    rtnObj.end = data.filter(item => item.END.trim() !== '' && parseInt(item.STATUS) !== 0 && parseInt(item.COUNT) !== 0);
    rtnObj.endDel = data.filter(item => item.END.trim() !== '' && parseInt(item.STATUS) === 0 && parseInt(item.COUNT) !== 0);
    rtnObj.wait = data.filter(item => parseInt(item.STATUS) === 1 && item.END.trim() === '' && parseInt(item.COUNT) !== 0);
    rtnObj.ing = data.filter(item => parseInt(item.STATUS) === 2 && item.END.trim() === '' && parseInt(item.COUNT) !== 0);
    rtnObj.chk = data.filter(item => parseInt(item.STATUS) === 3 && item.END.trim() === '' && parseInt(item.COUNT) !== 0);
    rtnObj.reChk = data.filter(item => parseInt(item.STATUS) === 4 && item.END.trim() === '' && parseInt(item.COUNT) !== 0);
    rtnObj.modify = data.filter(item => {
      return item.MODIFY.replace(/\[/g, '').replace(/\]/g, '').trim() !== '' && parseInt(item.STATUS) !== 0 && parseInt(item.COUNT) !== 0
    });
    rtnObj.delay = data.filter(item => {
      return item.WBS.trim() !== '' && new Date(item.WBS.trim()) > new Date() && item.END.trim() !== '' && parseInt(item.STATUS) !== 0 && parseInt(item.COUNT) !== 0
    });
    return rtnObj;
  },
  createSection(data, idx){
    // const dataTit = data.dep1.replace(/ /gi,"").replace(/[/]/gi, 'ㆍ').replace(/[(]/gi, '！').replace(/[)]/gi, '？');
    const dataTit = data.dep1;

    const dataItems = data.items;
    const fragment = document.createDocumentFragment();
    const allModifyDateAry = new Set(); 
    dataItems.forEach((item, i) => {
      const row = pubList.createTableRow(item, i);
      const tr = row.querySelector('tr');
      const modifyDates = JSON.parse(tr.dataset.modifyDates || '[]');
      delete tr.dataset.modifyDates;
      modifyDates.forEach(date => allModifyDateAry.add(date));
      fragment.appendChild(row);
    });
    const sortedModifyDates = Array.from(allModifyDateAry).sort((a, b) => b - a); // 내림차순 정렬
    const modifySelect = (str) => {
      let rtnVal = str;
      if(sortedModifyDates.length > 1){
        const modifyDateOptions = sortedModifyDates.map(date => {
          const formattedDate = `${date.slice(0,4)}-${date.slice(4,6)}-${date.slice(6,8)}`;
          return `<option value="${date}">${formattedDate}</option>`;
        }).join('');

        rtnVal = `<select>
          <option value="">${str}</option>
          ${modifyDateOptions}
        </select>`;
      }
      return rtnVal;
    }
    

    const thSelKeys = ['DEP2', 'DEP3', 'DEP4', 'DEP5', 'DEP6', 'END'];
    const thSelList = pubList.countByMultipleKeys(dataItems, thSelKeys);
    const thSelOpts = pubList.changeSelOpt(thSelList);
    const thSelect = (idx,str) => {
      let rtnVal = str;
      if(thSelOpts[idx].length > 1){
        rtnVal = `<select>
          <option value="">${str}</option>
          ${thSelOpts[idx]}
        </select>`;
      }
      return rtnVal;
    };

    const filterState = pubList.getFilterState(dataItems);
    const titleCount = (type) => {
      let rtnVal = '';
      let rtnVal2 = '';
      if(filterState.useTotal.length-filterState.del.length){
        rtnVal = `<p>
          <strong>${filterState.end.length}</strong>
          <span>/</span>
          <strong>${filterState.useTotal.length-filterState.del.length}</strong>
          <em>
            (
            <span class="total">전체</span><strong>${filterState.useTotal.length}</strong>,
            <span class="end">완료</span><strong>${filterState.end.length}</strong>,
            <span class="delay">지연</span><strong>${filterState.delay.length}</strong>,
            <span class="chk">재/검토중</span><strong>${filterState.chk.length+filterState.reChk.length}</strong>,
            <span class="ing">퍼블중</span><strong>${filterState.ing.length}</strong>,
            <span class="wait">대기</span><strong>${filterState.wait.length}</strong>,
            <span class="del">삭제</span><strong>${filterState.del.length}</strong>
            )
          </em>
        </p>
        <div class="pub-progress"><span style="width:${pubList.getPercent(filterState.end.length, filterState.useTotal.length-filterState.del.length)}%"></span></div>`;
        rtnVal2 = `<div class="pub-total"><em><span><span>진척률</span><strong>${pubList.getPercent(filterState.end.length, filterState.useTotal.length-filterState.del.length)}</strong>%</span></em></div>`;
      }
      if(type == 'ty2') return rtnVal2;
      else return rtnVal;
    }

    const siteHtml = document.createElement('div');
    siteHtml.className = 'pub-site';
    siteHtml.id = 'menu'+idx;
    const innerHtml = `
      <div class="pub-site-title">
        <h2>
          <span>${dataTit}</span><div class="pub-progress"></div>
          ${titleCount()}
        </h2>
        ${titleCount('ty2')}
      </div>
      <div class="pub-table" id="index_${dataTit}">
        <div class="pub-thead">
          <table>
            <colgroup>
              <col class="no">
              <col class="dep2">
              <col class="dep3">
              <col class="dep4">
              <col class="dep5">
              <col class="dep6">
              <col class="screen">
              <col class="type">
              <col class="url">
              <col class="id">
              <col class="publisher">
              <col class="designer">
              <col class="planner">
              <col class="developer">
              <col class="wbs">
              <col class="status">
              <col class="modify">
              <col class="memo">
            </colgroup>
            <thead>
              <tr>
                <th class="no">번호</th>
                <th class="dep2">${thSelect(0, 'D2')}</th>
                <th class="dep3">${thSelect(1, 'D3')}</th>
                <th class="dep4">${thSelect(2, 'D4')}</th>
                <th class="dep5">${thSelect(3, 'D5')}</th>
                <th class="dep6">${thSelect(4, 'D6')}</th>
                <th class="screen">화면명</th>
                <th class="type">유형</th>
                <th class="url">URL</th>
                <th class="id">화면ID</th>
                <th class="publisher">퍼블</th>
                <th class="designer">디자인</th>
                <th class="planner">기획</th>
                <th class="developer">개발</th>
                <th class="wbs">완료예정일</th>
                <th class="status">${thSelect(5, '최종완료일')}</th>
                <th class="modify">
                  ${modifySelect('수정이력')}
                  <button type="button" aria-pressed="false"></button>
                </th>
                <th class="memo">비고</th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="pub-tbody">
          <table>
            <colgroup>
              <col class="no">
              <col class="dep2">
              <col class="dep3">
              <col class="dep4">
              <col class="dep5">
              <col class="dep6">
              <col class="screen">
              <col class="type">
              <col class="url">
              <col class="id">
              <col class="publisher">
              <col class="designer">
              <col class="planner">
              <col class="developer">
              <col class="wbs">
              <col class="status">
              <col class="modify">
              <col class="memo">
            </colgroup>
            <tbody></tbody>
          </table>
        </div>
      </div>
    `;
    siteHtml.innerHTML = innerHtml;
    siteHtml.querySelector('.pub-tbody tbody').append(fragment);
    if(thSelList.length){
      thSelList.forEach(item => {
        if(item.counts.length === 0){
          let removeEls = null;
          if(item.key === 'DEP2') removeEls = siteHtml.querySelectorAll('.dep2');
          else if(item.key === 'DEP3') removeEls = siteHtml.querySelectorAll('.dep3');
          else if(item.key === 'DEP4') removeEls = siteHtml.querySelectorAll('.dep4');
          else if(item.key === 'DEP5') removeEls = siteHtml.querySelectorAll('.dep5');
          else if(item.key === 'DEP6') removeEls = siteHtml.querySelectorAll('.dep6');
          if(removeEls){
            removeEls.forEach(element => {
              element.remove();
            });
          }
        }
      });
    }
    pubList.setColspan(siteHtml);
    return siteHtml;
  },
  countByMultipleKeys (data, keys) {
    const countByKey = (data, key) => {
      const counts = data.reduce((acc, curr) => {
        const value = curr[key];
        // 값이 비어있지 않은 경우에만 카운트
        if (value && value.trim() !== '') {
            acc[value] = (acc[value] || 0) + 1;
        }
        return acc;
      }, {});

      return Object.entries(counts).map(([value, count]) => ({
        value,
        count,
        items: data.filter(item => item[key] === value)
      }));
    }  ;

    return keys.map(key => ({
        key,
        counts: countByKey(data, key)
    }));
  },
  changeSelOpt(data){
    const rtnVal = [];
    data.forEach(dataItem => {
      let html ='';
      let newAry = [...dataItem.counts];

      // 날짜형식인지 체크
      let isDate = false;
      if(dataItem.counts[0] && pubUtil.isValidDate(dataItem.counts[0].value)) {
        isDate = true;
        newAry = newAry.sort((a, b) => {
          return new Date(b.value) - new Date(a.value);
        });
      }
      newAry.forEach(item => {
        const setVal = isDate ? item.value.replace(/-/g, ''):pubUtil.changeTxt(item.value);
        html += `<option value="${setVal}">${item.value} (${item.count})</option>`;
      });
      rtnVal.push(html);
    });
    return rtnVal;
  },
  setColspan(element){
    const theadTh = element.querySelectorAll('.pub-thead thead th');
    const theadThVisible = Array.from(theadTh).filter(th => {
      const style = window.getComputedStyle(th);
      return style.display !== 'none';
    });
    const thLength = theadThVisible.length;
    element.querySelectorAll('tr.sb').forEach(item => {
      item.querySelector('td').setAttribute('colspan', thLength);
    });
  },
  beforeTr :{
    dep2: null,
    dep3: null,
    dep4: null,
    dep5: null,
    dep6: null,
  },
  createTableRow(rowData, index){
    const count = parseInt(typeof rowData.COUNT === 'string' ? rowData.COUNT.trim() : rowData.COUNT);
    // const depth1Name = rowData.DEP1.replace(/ /gi,"").replace(/[/]/gi, 'ㆍ').replace(/[(]/gi, '！').replace(/[)]/gi, '？');
    const depth2Name = rowData.DEP2.trim();
    const depth3Name = rowData.DEP3.trim();
    const depth4Name = rowData.DEP4.trim();
    const depth5Name = rowData.DEP5.trim();
    const depth6Name = rowData.DEP6.trim();
    const screen = rowData.SCREEN.trim();
    const type = rowData.TYPE.trim();
    const size = rowData.SIZE ? rowData.SIZE.trim() : null;
    const url = rowData.URL.trim();
    const id = rowData.ID.trim();
    const publisher = rowData.PUB.trim();
    const designer = rowData.DGN.trim();
    const planner = rowData.PLA.trim();
    const developer = rowData.DEV.trim();
    const status = parseInt(typeof rowData.STATUS === 'string' ? rowData.STATUS.trim() : rowData.STATUS);
    const schedule = rowData.WBS.trim();
    const end = rowData.END.trim();
    const modify = rowData.MODIFY.trim();
    const memo = rowData.MEMO.trim();
    const sb = rowData.SB.trim();

    const fragment = document.createDocumentFragment();
    if(sb) {
      const sbHtml = document.createElement('tr');
      sbHtml.className = 'sb';
      sbHtml.innerHTML = `<td><em>${sb}</em></td>`;
      fragment.appendChild(sbHtml);
    }

    let isEnd = false;
    const trClassAry = ['tr'];
    if(count === 0) {
      trClassAry.push('unuse');
    }else{
      if(end){
        if(status === 0) {
          trClassAry.push('del');
        }else {
          isEnd = true;
          trClassAry.push('end');
        }
      }else{
        if(status === 0) trClassAry.push('del');
        else if(status === 1) trClassAry.push('wait');
        else if(status === 2) trClassAry.push('ing');
        else if(status === 3) trClassAry.push('chk');
        else if(status === 4) trClassAry.push('chk re');

        if(schedule){
          if(new Date(schedule) < new Date()) trClassAry.push('delay');
        }
      }
    }
    if(depth2Name) trClassAry.push('tr-dep2_'+pubUtil.changeTxt(depth2Name));
    if(depth3Name) trClassAry.push('tr-dep3_'+pubUtil.changeTxt(depth3Name));
    if(depth4Name) trClassAry.push('tr-dep4_'+pubUtil.changeTxt(depth4Name));
    if(depth5Name) trClassAry.push('tr-dep5_'+pubUtil.changeTxt(depth5Name));
    if(depth6Name) trClassAry.push('tr-dep6_'+pubUtil.changeTxt(depth6Name));
    if(id) trClassAry.push('tr-id_'+id);
    if(isEnd){
      const endStr = end.replace(/-/g, '');
      trClassAry.push('tr-end_'+endStr);
    }

    const depth2Html = pubList.beforeTr.dep2 === depth2Name ? `<span>${depth2Name}</span>` : `<strong>${depth2Name}</strong>`;
    const depth3Html = pubList.beforeTr.dep3 === depth3Name ? `<span>${depth3Name}</span>` : `<strong>${depth3Name}</strong>`;
    const depth4Html = pubList.beforeTr.dep4 === depth4Name ? `<span>${depth4Name}</span>` : `<strong>${depth4Name}</strong>`;
    const depth5Html = pubList.beforeTr.dep5 === depth5Name ? `<span>${depth5Name}</span>` : `<strong>${depth5Name}</strong>`;
    const depth6Html = pubList.beforeTr.dep6 === depth6Name ? `<span>${depth6Name}</span>` : `<strong>${depth6Name}</strong>`;

    const typeTd = size ? `<td class="type" data-size="${size}">${type}</td>`: `<td class="type">${type}</td>`;

    const idTd = () => {
      let rtnVal = id;
      const preURL = pubList.setting.preURL;
      const file = pubList.setting.file ? '.'+pubList.setting.file : '';
      if(url && id && (status !== 1 || end)){
        const setUrl = url.slice(-1) === '/' ? preURL+url+id+file : preURL+url;
        rtnVal = `<a href="${setUrl}" target="_blank" class="td-link"><strong>${id}</strong></a><button type="button" class="pub-copy" title="메뉴복사"></button>`;
      }
      return rtnVal;
    }

    let isStateYesterday = false;
    let isStateToday = false;
    const prevDates = pubUtil.getPrevDates();
    const todayDate = pubUtil.getToday();
    const statusTd = () => {
      let rtnVal = ''
      if(end){
        if(prevDates.includes(end)) isStateYesterday = true;
        if(end === todayDate) isStateToday = true;
        rtnVal = `<em><span>${end}</span>${pubUtil.getWeek(end)}</em>`;
      }else if(count !== 0){
        if(status === 2) rtnVal = '<em>퍼블중</em>';
        else if(status === 3) rtnVal = '<em>검토중</em>';
        else if(status === 4) rtnVal = '<em>재검토중</em>';
      }
      return rtnVal;
    };

    let isDuplicate = false;
    let isModifyYesterday = false;
    let isModifyToday = false;
    const modifyDateAry = [];
    const convertModifyList = (htmlString) => {
      // 유효성 검사 함수
      const isValidDate = (dateStr) => {
        const date = new Date(dateStr);
        return date instanceof Date && !isNaN(date);
      };
  
      // 모든 매칭을 객체 배열로 변환
      const matches = Array.from(htmlString.matchAll(/\[(\d{4}-\d{2}-\d{2}) (.*?)\]/g))
        .map(([match, date, content]) => ({
          date,
          content,
          timestamp: new Date(date).getTime()
        }))
        .filter(item => isValidDate(item.date)); // 유효한 날짜만 필터링
  
      // 날짜별 중복 체크
      const duplicates = matches.reduce((acc, item) => {
        acc[item.date] = (acc[item.date] || 0) + 1;
        return acc;
      }, {});
  
      // 중복 날짜 경고
      Object.entries(duplicates)
        .filter(([date, count]) => count > 1)
        .forEach(([date, count]) => {
          isDuplicate = true;
          // console.warn(`경고: ${id}항목의 ${date} 날짜가 ${count}번 중복되었습니다.`);
          alert(`경고: ${id}항목의 수정이력 날짜 ${date}가 ${count}번 중복되었습니다.`);
        });
  
      // 타임스탬프로 정렬 (내림차순)
      const sortedMatches = matches.sort((a, b) => b.timestamp - a.timestamp);
  
      // HTML 생성
      const result = sortedMatches.map(({ date, content }) => {
        const weekday = pubUtil.getWeek(date);
        if(prevDates.includes(date)) isModifyYesterday = true;
        if(date === todayDate) isModifyToday = true;
        const dateWithoutHyphen = date.replace(/-/g, '');
        modifyDateAry.push(dateWithoutHyphen);
        trClassAry.push('tr-modify_' + dateWithoutHyphen);

        return `<li title="${date} ${content}"><em><span>${date}</span>${weekday}</em><p>${content}</p></li>`;
      }).join('');
  
      // 처리된 항목 수 반환 (디버깅용)
      // console.log(`총 ${sortedMatches.length}개 항목 처리됨`);
      
      return result;
    };
    const getModifyTd = () => {
      const txt = modify.replace(/\[/g, '').replace(/\]/g, '').trim();
      const liHtml = convertModifyList(modify);
      return txt ? `<button type="button" aria-pressed="false"></button><ul>${liHtml}</ul>`: '';
    };
    const modifyTd = getModifyTd();

    const trHtml = document.createElement('tr');
    trHtml.className = trClassAry.join(' ');
    const trInnerHtml = `
      <td class="no"><span>${index+1}</span></td>
      <td class="dep2">${depth2Html}</td>
      <td class="dep3">${depth3Html}</td>
      <td class="dep4">${depth4Html}</td>
      <td class="dep5">${depth5Html}</td>
      <td class="dep6">${depth6Html}</td>
      <td class="screen"><span>${screen}</span></td>
      ${typeTd}
      <td class="url">${url}</td>
      <td class="id">${idTd()}</td>
      <td class="publisher">${publisher}</td>
      <td class="designer">${designer}</td>
      <td class="planner">${planner}</td>
      <td class="developer">${developer}</td>
      <td class="wbs"><em><span>${schedule}</span>${pubUtil.getWeek(schedule)}</em></td>
      <td class="status">${statusTd()}</td>
      <td class="modify">${modifyTd}</td>
      <td class="memo">${memo}</td>
    `;
    trHtml.innerHTML = trInnerHtml;
    fragment.appendChild(trHtml);

    if(isDuplicate){
      const ul = fragment.querySelector('.modify ul');
      if(ul) ul.classList.add('error-cell');
    }

    if(depth2Name) pubList.beforeTr.dep2 = depth2Name;
    if(depth3Name) pubList.beforeTr.dep3 = depth3Name;
    if(depth4Name) pubList.beforeTr.dep4 = depth4Name;
    if(depth5Name) pubList.beforeTr.dep5 = depth5Name;
    if(depth6Name) pubList.beforeTr.dep5 = depth6Name;
    trHtml.dataset.modifyDates = JSON.stringify(modifyDateAry);
    if(isStateYesterday) trHtml.querySelector('.status').classList.add('yesterday-cell');
    if(isStateToday) trHtml.querySelector('.status').classList.add('today-cell');
    if(isModifyYesterday) trHtml.querySelector('.modify').classList.add('yesterday-cell');
    if(isModifyToday) trHtml.querySelector('.modify').classList.add('today-cell');
    return fragment;
  },
  action(){
    function toggleAllTr(isShow){
      const trs = document.querySelectorAll('.tr');
      if(trs){
        // if(isShow) trs.forEach(tr => tr.style.removeProperty('display'));
        // else trs.forEach(tr => tr.style.display = 'none');
        trs.forEach(tr => tr.classList.toggle('d-none', !isShow));
      }
    }
    function showStateTr(str){
      const num = typeof str === 'string' ? Number(str) : str;
      let className = null;
      if(num === 0) className = '.del'
      else if(num === 1) className = '.wait'
      else if(num === 2) className = '.ing'
      else if(num === 3) className = '.chk'
      if(!className) return;
      const trs = document.querySelectorAll('.tr'+className);
      // if(trs) trs.forEach(tr => tr.style.removeProperty('display'));
      if(trs) trs.forEach(tr => tr.classList.remove('d-none'));
    }
    function toggleAllTable(isShow){
      const tables = document.querySelectorAll('.pub-table');
      if(tables){
        // if(isShow) tables.forEach(table => table.style.removeProperty('display'));
        // else tables.forEach(table => table.style.display = 'none');
        tables.forEach(table => table.classList.toggle('d-none', !isShow));
      }
    }
    function toggleTableTr(target, isShow){
      const wrap = target.closest('.pub-site');
      const trs = wrap.querySelectorAll('.tr');
      if(trs){
        // if(isShow) trs.forEach(tr => tr.style.removeProperty('display'));
        // else trs.forEach(tr => tr.style.display = 'none');
        trs.forEach(tr => tr.classList.toggle('d-none', !isShow));
      }
    }
    function showTableTr(target, className){
      const wrap = target.closest('.pub-site');
      const trs = wrap.querySelectorAll(className);
      // if(trs) trs.forEach(tr => tr.style.removeProperty('display'));
      if(trs) trs.forEach(tr => tr.classList.remove('d-none'));
    }
    function tableSelectReset(target){
      let selects = null;
      if(target){
        const wrap = target.closest('.pub-site');
        selects = wrap.querySelectorAll('.pub-thead select');
      }else{
        selects = document.querySelectorAll('.pub-thead select');
      }
      if(!selects) return;
      selects.forEach(sel => {
        if(sel !== target) {
          sel.value = '';
          sel.classList.remove('on');
        }
      });
    }
    function buttonReset(){
      const onBtns = document.querySelectorAll('.pub-label button.on');;
      if(onBtns) onBtns.forEach(btn => btn.class.remove('on'));

      const pressedBtns = document.querySelectorAll('button[aria-pressed="true"]');;
      if(pressedBtns) pressedBtns.forEach(btn => btn.ariaPressed = 'false');
    }
    function navActive(el){
      /*if(isJQuery()){
        const $el = $(el);
        const $href = $el.attr('href');
        $('.pub-nav a').removeClass('on');
        $el.addClass('on');
        if($href === '#all') $('.pub-site').removeClass('d-none');
        else $($href+'.pub-site').removeClass('d-none').siblings('.pub-site').addClass('d-none');
      }else{*/
        const href = el.getAttribute('href');
        const navBtns = document.querySelectorAll('.pub-nav a');
        navBtns.forEach(btn => btn.classList.remove('on'));
        el.classList.add('on');
        const pubSites = document.querySelectorAll('.pub-site');
        if(href === '#all'){
          // if(pubSites) pubSites.forEach(el => el.style.removeProperty('display'));
          if(pubSites) pubSites.forEach(el => el.classList.remove('d-none'));
          pubUtil.setUrlParams(false);
        }else{
          const showSite = document.querySelector(href+'.pub-site');
          if(pubSites && showSite) {
            // pubSites.forEach(el => el.style.display = 'none');
            // showSite.style.removeProperty('display');
            pubSites.forEach(el => el.classList.add('d-none'));
            showSite.classList.remove('d-none');
          }
          const idx = parseInt(href.replace(/\D/g, ''));
          pubUtil.setUrlParams('tab', idx);
        }
      //}
    }
    function navReset(){
      const tab = document.querySelector('.pub-nav .pub-all a');
      navActive(tab);
    }
    let isSearch = false;
    function searchRemove(){
      // 이전 하이라이트 제거
      const highlighted = document.querySelectorAll('.pub-highlight');
      highlighted.forEach(el => {
        // highlight 태그의 내용만 추출하여 부모 노드에 직접 삽입
        const text = el.textContent;
        el.outerHTML = text;
      });
    }
    function searchResult(str){
      searchRemove();

      // 검색어가 비어있으면 하이라이트 제거만 하고 종료
      if (!str.trim()) return;

      // 각 td를 순회하며 검색어 강조
      const cells = document.querySelectorAll('tr.tr td');
      cells.forEach(cell => {
        const hasMatch = highlightTextNodes(cell, str);
        if (hasMatch) {
          const tr = cell.closest('tr');
          // tr.style.removeProperty('display');
          tr.classList.remove('d-none');
        }
      });
    }
    function highlightTextNodes(node, searchText){
      const regex = new RegExp(searchText, 'gi');
      if(node.nodeType === Node.TEXT_NODE){
        console.log(node.textContent.match(regex))
        if(node.textContent.match(regex)){
          const span = document.createElement('span');
          span.className = 'pub-highlight' ;
          span.textContent = node.textContent;
          node.replaceWith(span);
          console.log(span)
          span.innerHTML = span.textContent.replace(
            regex, 
            `<span class="pub-highlight">$&</span>`
          );
          return true;
        }
        return false;
      }

      let hasMatch = false;
      const childNodes = [...node.childNodes];
      childNodes.forEach(child => {
        const result = highlightTextNodes(child, searchText);
        hasMatch = hasMatch || result;
      });

      return hasMatch;
    }
    function searchInit(){
      const inp = document.querySelector('.pub-search-inp');
      const inpVal = inp.value.trim();
      if(inpVal.length === 1){
        pubUtil.toastPop('2글자 이상 입력해주세요.');
      }else{
        if(inpVal !== '') {
          isSearch = true;
          toggleAllTr(false);
        }else if(isSearch) {
          isSearch = false;
          tableSelectReset()
          navReset();
          toggleAllTr(true);
        }
        searchResult(inpVal);
      }
    }
    function searchReset(){
      searchRemove();
      const inp = document.querySelector('.pub-search-inp');
      inp.value = '';
    }
    const viewer = document.querySelector('.pub-mobile-frame');
    function toggleViewer(isShow, isOn){
      if(!viewer) return;
      const className = 'show';
      if(isShow){
        viewer.classList.add(className);
        setViewerSize();
      }else{
        if(viewer.classList.contains('on')) viewer.classList.remove('on');
        viewer.classList.remove(className);
      }
    }
    function toggleViewerOn(){
      if(viewer.classList.contains('on')) viewer.classList.remove('on');
      else viewer.classList.add('on');
    }
    function setViewerSize(){
      const select = viewer.querySelector('.pub-device-select');
      const value = select.value;
      const sizes = value.split('*');
      const width = sizes[0];
      const height = sizes[1];
      viewer.style.setProperty('--iframe-width', `${width}px`);
      viewer.style.setProperty('--iframe-height', `${height}px`);
    }
    function setViewerIframe(target){
      const href = target.getAttribute('href');
      const text = target.textContent;
      const linkHtml = '<a href="'+href+'" target="_blank"><strong>'+text+'</strong></a>';
      viewer.querySelector('.link').innerHTML = linkHtml;
      let iframe = viewer.querySelector('iframe');
      if(iframe){
        iframe.src = href;
      }else{
        iframe = document.createElement('iframe');
        iframe.src = href;
        iframe.frameborder = '0;'
        viewer.querySelector('.pub-iframe').appendChild(iframe);
      }
    }
    function resetTDlink(){
      const links = document.querySelectorAll('.td-link.active');
      if(links) links.forEach(link => link.classList.remove('active'));
    }
    

    let beforeTarget = null;
    // 클릭 이벤트
    document.addEventListener('click', (e) => {
      const target = e.target;
      
      //진척률 툴팁
      const pubSide = document.querySelector('.pub-side');
      if (target.matches('.pub-button-detail')) {
        e.preventDefault();
        if (target.ariaExpanded === 'false'){
          target.ariaExpanded = 'true';
          pubSide.classList.add('on');
        }else{
          target.ariaExpanded = 'false';
          pubSide.classList.remove('on');
        }
      }else if(beforeTarget && beforeTarget.matches('.pub-button-detail')){
        beforeTarget.ariaExpanded = 'false';
        pubSide.classList.remove('on');
      }

      //초기화 pub-reset
      if(target.matches('.pub-reset')){
        e.preventDefault();
        toggleAllTable(true);
        toggleAllTr(true);
        tableSelectReset();
        buttonReset();
        navReset();
        searchReset();
        toggleViewer(false);
      }

      // 검색버튼
      if(target.matches('.pub-search-btn')){
        e.preventDefault();
        searchInit();
      }

      // 모바일 뷰어
      if(target.matches('.pub-viewer')){
        e.preventDefault();
        if(target.ariaPressed === 'false'){
          target.ariaPressed = 'true';
          toggleViewer(true);
        }else{
          target.ariaPressed = 'false';
          toggleViewer(false);
        }
      }
      if(target.matches('.pub-frame-toggle')){
        e.preventDefault();
        toggleViewerOn();
      }

      //토글버튼 pub-toggle
      if(target.matches('.pub-toggle')){
        e.preventDefault();
        if(target.ariaPressed === 'false'){
          target.ariaPressed = 'true';
          tableSelectReset();
          navReset();
          toggleAllTable(false);
        }else{
          target.ariaPressed = 'false';
          toggleAllTable(true);
        }
      }

      // SB버튼
      if(target.matches('.pub-filter-sb')){
        e.preventDefault();
        if(target.classList.contains('on')){
          target.classList.remove('on');
          toggleAllTr(true);
        }else{
          target.classList.add('on');
          toggleAllTr(false);
        }
      }

      //status 버튼
      if(target.matches('.pub-filter-status')){
        e.preventDefault();
        const status = target.dataset.status;
        if(target.classList.contains('on')){
          target.classList.remove('on');
          toggleAllTr(true);
        }else{
          target.classList.add('on');
          toggleAllTr(false);
          showStateTr(status);;
        }
      }

      //nav
      if(target.matches('.pub-nav a')){
        e.preventDefault();
        if(target.classList.contains('on')) return;
        navActive(target);
      }

      // ID 링크 클릭
      if(target.matches('.td-link')){
        resetTDlink();
        target.classList.add('active');
        if(viewer.classList.contains('on')){
          e.preventDefault();
          setViewerIframe(target);
        }
      }

      //메뉴 복사
      if(target.matches('.pub-copy')){
        e.preventDefault();
        const depAry = []
        const tr = target.closest('tr');
        const dep1El = target.closest('.pub-site').querySelector('.pub-site-title h2 > span');
        const dep2El = tr.querySelector('td.dep2');
        const dep3El = tr.querySelector('td.dep3');
        const dep4El = tr.querySelector('td.dep4');
        const dep5El = tr.querySelector('td.dep5');
        const dep6El = tr.querySelector('td.dep6');
        const screenEl = tr.querySelector('td.screen');
        if(dep1El && dep1El.textContent) depAry.push(dep1El.textContent);
        if(dep2El && dep2El.textContent) depAry.push(dep2El.textContent);
        if(dep3El && dep3El.textContent) depAry.push(dep3El.textContent);
        if(dep4El && dep4El.textContent) depAry.push(dep4El.textContent);
        if(dep5El && dep5El.textContent) depAry.push(dep5El.textContent);
        if(dep6El && dep6El.textContent) depAry.push(dep6El.textContent);
        if(screenEl && screenEl.textContent) depAry.push(screenEl.textContent);
        const idEl = tr.querySelector('td.id');
        const copyMsg = '· '+ depAry.join(' > ')+'\n  '+idEl.textContent;
        pubUtil.clipboardCopy(copyMsg);
      }

      //수정이력 확장버튼
      if (target.matches('th.modify button, td.modify button')){
        e.preventDefault();
        const cell = target.closest('.modify')
        
        let setVal = null;
        if (target.ariaPressed === 'false') setVal = 'true';
        else setVal = 'false';
        target.ariaPressed = setVal;

        if(cell.tagName === 'TH'){
          const table = target.closest('.pub-table');
          const tdBtn = table.querySelectorAll('.pub-tbody td.modify button');
          if(tdBtn){
            tdBtn.forEach(btn => {
              btn.ariaPressed = setVal;
            });
          }
        }
      }

      //csv 파일 다운로드
      if (target.matches('.pub-csv-down')){
        e.preventDefault();
        if(typeof pubJSON === 'undefined'){
          console.error('pub_index_data json 목록이 없습니다.');
          return
        }
        if(pubJSON.length === 0){
          console.error('pub_index_data json 목록 비엿습니다.');
          return
        }

        const pubTabOn = document.querySelector('.pub-tab.on');
        const csvData = pubUtil.jsonToCSV(pubJSON);
        const fileTxt = pubTabOn ? pubTabOn.textContent + '_' : '';
        const bom = '\uFEFF';
        const blob = new Blob([bom+csvData], {type: 'text/csv;charset=utf-8;'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileTxt+'json_data.csv';
        link.click();
      }

      //수정이력 관련 action: s
      if (target.matches('.pub-modify-open')){
        e.preventDefault();
        pubModify.open();
      }
      if (target.matches('.pub-modify-close')){
        e.preventDefault();
        pubModify.close();
      }
      if (target.matches('.pub-modify-copy')){
        e.preventDefault();
        pubModify.copyAll();
      }
      if (target.matches('.pub-modify-copy2')){
        e.preventDefault();
        pubModify.copySection(e);
      }
      if (target.matches('.pub-date-more')){
        e.preventDefault();
        pubModify.loadMoreDates();
      }
      //수정이력 관련 action: e
      

      if (target.matches('.pub-copy-code')){
        e.preventDefault();
        const prevEl = target.previousElementSibling;
        if(prevEl && prevEl.classList.contains('pub-pre')){
          const code = prevEl.innerText;
          pubUtil.clipboardCopy(code);
        }
      }

      if(beforeTarget !== target) beforeTarget = target;
    });

    // change 이벤트
    document.addEventListener('change', (e) => {
      const target = e.target;

      if (target.matches('th.dep2 select, th.dep3 select, th.dep4 select, th.dep5 select, th.dep6 select, th.status select, th.modify select')) {
        const selVal = target.value;
        if (selVal === '') {
          toggleTableTr(target, true);
          target.classList.remove('on');
        } else {
          tableSelectReset(target);
          toggleTableTr(target, false);
          target.classList.add('on');
          let className = null;
          if(target.closest('th[class^="dep"]')){
            const depNum = target.closest('[class^="dep"]').className.match(/\d+/)[0];
            className = `.tr-dep${depNum}_${selVal}`;
          }else if(target.closest('th.status')){
            className = '.tr-end_'+selVal;
          }else if(target.closest('th.modify')){
            className = '.tr-modify_'+selVal;
          }
          if(className) showTableTr(target, className);
        }
      }  

      //수정이력 관련
      if (target.matches('[name="view-option"]')){
        pubModify.changeView(e);
      }
      if (target.matches('.pub-modify-select')){
        pubModify.changeList(e);
      }
      

      if(beforeTarget !== target) beforeTarget = target;
    });

    // 키보드 이벤트
    document.addEventListener('keydown', (e) => {
      const target = e.target;
      const key = e.key;
      const keyCode = e.keyCode || e.which;
      // console.log(key,keyCode);
      
      if(target.matches('.pub-search-inp') && (key === 'Enter' || keyCode === 13)){
        e.preventDefault();
        searchInit();
      }

      if(beforeTarget !== target) beforeTarget = target;
    });
  }
}

const pubModify = {
  open() {
    const modifyPop = document.querySelector('.pub-modify');
    if(modifyPop){
      modifyPop.style.display = 'block';
    }else{
      const popup = this.createPopup();
      document.querySelector('.pub-wrap').appendChild(popup);
      this.loadDateView(); // 초기 날짜별 보기 로드
    }
  },

  close() {
    document.querySelector('.pub-modify').style.display = 'none';
  },

  createPopup() {
    const div = document.createElement('div');
    div.className = 'pub-modify';
    div.style.display = 'block';
    
    div.innerHTML = `
      <div class="pub-radio">
        <span>
          <input type="radio" name="view-option" value="date" id="pub-radio1" checked>
          <label for="pub-radio1">수정일로 보기</label>
          <button type="button" class="pub-date-more">더보기</button>
        </span>
        <span>
          <input type="radio" name="view-option" value="menu" id="pub-radio2">
          <label for="pub-radio2">메뉴별로 보기</label>
        </span>
      </div>
      <div class="pub-modify-inr date">
        <select multiple class="pub-modify-select"></select>
        <div class="pub-modify-list"></div>
      </div>
      <div class="pub-modify-inr menu">
        <select multiple class="pub-modify-select"></select>
        <div class="pub-modify-list"></div>
      </div>
      <p class="pub-msg">
        <strong>※ 업데이트후 수정일(YYYY-MM-DD)을 검색해주세요. (동일 수정일이 존재할 수 있으니 전체적으로 검색)</strong>
      </p>
      <button type="button" class="pub-modify-copy">전체복사</button>
      <button type="button" class="pub-modify-close" title="닫기"><span></span><span></span><span></span></button>
    `;

    return div;
  },
  loadDateView(start = 0, limit = 10) {
    const wrap = document.querySelector('.pub-modify-inr.date');
    document.querySelector('.pub-modify-inr.menu').classList.remove('on');
    wrap.classList.add('on');
    const select = wrap.querySelector('.pub-modify-select');
    const selVal = select.value;
    if(selVal !== '' & start === 0) return;
    const modifyList = wrap.querySelector('.pub-modify-list');

    // 날짜별 수정이력 데이터 가져오기
    const dates = this.getModifyDates();
    
    const prevDates = pubUtil.getPrevDates();
    const todayDate = pubUtil.getToday();

    // select options 생성 및 추가
    const newOptions = dates.slice(start, start + limit)
      .map(date => {
        const option = document.createElement('option');
        option.value = date.replace(/-/g, '');
        option.textContent = date;
        if(date === todayDate) option.className = 'today';
        else if(prevDates.includes(date)) option.className = 'yesterday';
        return option;
      });
    newOptions.forEach(option => select.appendChild(option));

    // 수정이력 목록 생성 및 추가
    const newListHTML = this.createDateListHTML(dates.slice(start, start + limit));
    modifyList.insertAdjacentHTML('beforeend', newListHTML);

    // 더보기 버튼 상태 업데이트
    const moreButton = document.querySelector('.pub-date-more');
    if (start + limit >= dates.length) {
      moreButton.disabled = true;
    } else {
      moreButton.disabled = false;
    }

    if(!selVal){
      select.selectedIndex = 0;
      const firstList = modifyList.querySelector('.list:first-child');
      firstList.classList.add('on');
    }
  },

  loadMenuView() {
    const wrap = document.querySelector('.pub-modify-inr.menu');
    document.querySelector('.pub-modify-inr.date').classList.remove('on');
    wrap.classList.add('on');
    const select = wrap.querySelector('.pub-modify-select');
    const selVal = select.value;
    if(selVal) return;
    const modifyList = wrap.querySelector('.pub-modify-list');
    
    // 메뉴별 데이터 가져오기
    const menus = this.getMenuData();

    // select options 생성
    select.innerHTML = menus
      .map(menu => `<option value="${menu.name}">${menu.name}</option>`)
      .join('');

    // 메뉴별 수정이력 목록 생성
    modifyList.innerHTML = this.createMenuListHTML(menus);

    // 초기 세팅
    select.selectedIndex = 0;
    const firstList = modifyList.querySelector('.list:first-child');
    firstList.classList.add('on');
  },

  changeView(e) {
    const value = e.target.value;
    const wrap = document.querySelector('.pub-modify-inr.'+value);
    const select = wrap.querySelector('.pub-modify-select');
    if (value === 'date') {
      this.loadDateView();
      //document.querySelector('.pub-date-more').style.removeProperty('display');
      document.querySelector('.pub-date-more').classList.remove('d-none');
    } else if (value === 'menu'){
      this.loadMenuView();
      // document.querySelector('.pub-date-more').style.display = 'none';
      document.querySelector('.pub-date-more').classList.add('d-none');
    }
  },

  changeList(e) {
    const target = e.target;
    const value = target.value;
    const className = '.mb-'+value;
    const wrap = target.closest('.pub-modify-inr');
    const listWrap = wrap.querySelector('.pub-modify-list');
    const showEl = listWrap.querySelector(className);
    if(showEl){
      const lists = listWrap.querySelectorAll('.list');
      lists.forEach(list => list.classList.remove('on'));
      showEl.classList.add('on');
    }
  },

  loadMoreDates() {
    const currentCount = document.querySelector('.pub-modify select').options.length;
    this.loadDateView(currentCount);
  },

  copyAll() {
    const content = document.querySelector('.pub-modify-inr.on .pub-modify-list .list.on').innerText;
    pubUtil.clipboardCopy(content);
  },
  copySection(e){
    const target = e.target;
    const sectionWrap =  target.closest('.list');
    const title = sectionWrap.querySelector('.list-tit');
    const titTxt = title.textContent + '\n'
    const section =  target.closest('.mb2-list');
    const content = section.innerText;
    pubUtil.clipboardCopy(titTxt+content);
  },

  getModifyDates() {
    // pubJSON 데이터에서 수정이력이 있는 항목들의 날짜를 추출
    const dates = [];
    pubJSON.forEach(item => {
      if (item.MODIFY) {
        const matches = item.MODIFY.match(/\[(\d{4}-\d{2}-\d{2})/g);
        if (matches) {
          matches.forEach(match => {
            const date = match.replace('[', '');
            if (!dates.includes(date)) {
              dates.push(date);
            }
          });
        }
      }
    });
    // 날짜 내림차순 정렬
    return dates.sort((a, b) => new Date(b) - new Date(a));
  },

  getMenuData() {
    // 1뎁스 메뉴별로 데이터 그룹화
    const menuGroups = {};
    pubJSON.forEach(item => {
      if (item.MODIFY && item.DEP1) {
        if (!menuGroups[item.DEP1]) {
          menuGroups[item.DEP1] = {
            name: item.DEP1,
            items: []
          };
        }
        menuGroups[item.DEP1].items.push(item);
      }
    });
    return Object.values(menuGroups);
  },

  createDateListHTML(dates) {
    return dates.map(date => {
      // 해당 날짜의 수정이력 항목들 필터링
      const modifiedItems = pubJSON.filter(item => {
        return item.MODIFY && item.MODIFY.includes(`[${date}`);
      });
  
      // DEP1, DEP2 기준으로 그룹화
      const groupedItems = modifiedItems.reduce((acc, item) => {
        const key = `${item.DEP1}_${item.DEP2}`;
        if (!acc[key]) {
          acc[key] = {
            DEP1: item.DEP1,
            DEP2: item.DEP2,
            items: []
          };
        }
        acc[key].items.push(item);
        return acc;
      }, {});
  
      // 그룹별 HTML 생성
      const groupsHTML = Object.values(groupedItems).map(group => {
        const itemsInGroup = group.items.map(item => {
          const modifyMatch = item.MODIFY.match(new RegExp(`\\[${date} (.*?)\\]`));
          const modifyContent = modifyMatch ? modifyMatch[1] : '';
          const preURL = pubList.setting.preURL;
          const file = pubList.setting.file ? '.'+pubList.setting.file : '';;
          const setURL = item.URL && item.ID ? preURL+item.URL+item.ID+file : '#';
          return `
            ● ${[item.DEP3, item.DEP4, item.DEP5, item.DEP6, item.SCREEN].filter(Boolean).join('<span> &gt; </span>')}
            <br>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <a href="${setURL}" target="_blank"><strong>${item.ID}</strong></a>
            <br>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <strong>${modifyContent}</strong>
            <br>
            <br>
          `;
        }).join('');
  
        return `
          <div class="mb2-list">
            <em>[${group.DEP1} > ${group.DEP2}]<button type="button" class="pub-modify-copy2"></button></em><br>
            ${itemsInGroup}
          </div>
        `;
      }).join('');
  
      return `
        <div class="list mb-${date.replace(/-/g, '')}">
          <mark class="list-tit"><strong>${date}</strong></mark><br>
          ${groupsHTML}
        </div>
      `;
    }).join('');
  },

  createMenuListHTML(menus) {
    return menus.map(menu => {
      // 메뉴별 수정이력 날짜 추출 및 정렬
      const dates = new Set();
      menu.items.forEach(item => {
        const matches = item.MODIFY.match(/\[(\d{4}-\d{2}-\d{2})/g);
        if (matches) {
          matches.forEach(match => dates.add(match.replace('[', '')));
        }
      });
      const sortedDates = Array.from(dates).sort((a, b) => new Date(b) - new Date(a));

      // 날짜별 수정이력 HTML 생성
      let datesHTML = sortedDates.map(date => {
        const dateItems = menu.items.filter(item => item.MODIFY.includes(`[${date}`));
        
        return `
          <div class="mb2-list">
            <em>${date}<button type="button" class="pub-modify-copy2"></button></em><br>
            ${dateItems.map(item => {
              const modifyMatch = item.MODIFY.match(new RegExp(`\\[${date} (.*?)\\]`));
              const modifyContent = modifyMatch ? modifyMatch[1] : '';
              const preURL = pubList.setting.preURL;
              const file = pubList.setting.file;
              const setURL = item.URL && item.ID ? preURL+item.URL+item.ID+'.'+file : '#';
              return `
                ● ${[item.DEP1, item.DEP2, item.DEP3, item.DEP4, item.DEP5, item.DEP6, item.SCREEN].filter(Boolean).join('<span> &gt; </span>')}
                <br>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <a href="${setURL}" target="_blank"><strong>${item.ID}</strong></a>
                <br>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <strong>${modifyContent}</strong>
                <br>
                <br>
              `;
            }).join('')}
          </div>
        `;
      }).join('');

      if(datesHTML === ''){
        datesHTML = `<div class="mb2-list">
          <em>수정이력 없음</em>
        </div>`;
      }

      return `
        <div class="list mb-${pubUtil.changeTxt(menu.name)}">
          <mark><strong>${menu.name}</strong></mark><br>
          ${datesHTML}
        </div>
      `;
    }).join('');
  }
};
