
const pubJSON = pub_index_data;

/* LOADING */
const loading = {
	open() {
		const loader = document.createElement('div');
    loader.id = 'loadingbar';
    loader.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100%;z-index:10000;';
    
    const img = document.createElement('img');
    img.src = 'https://nwww-t.sgic.co.kr/resource/pc/images/common/loading.gif';
    img.alt = '로딩중';
    img.style.cssText = 'position:fixed;inset:0;margin:auto;';
    
    loader.appendChild(img);
    document.body.appendChild(loader);
	},
	close() {
		const loader = document.getElementById('loadingbar');
    if (loader) loader.remove();
	}
}

/* pubUtil */
const pubUtil = {
	getWeek (date) {
		const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
		let rtnVal = weekdays[new Date(date).getDay()]
		if(rtnVal) return `(${rtnVal})`;
		else return '';
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
		setTimeout(function() {
			msg.remove();
		}, 600);
	},
	jsonToCSV(jsonData){
		const excludedHeaders = ['COUNT', 'URL', 'WBS', 'SB', 'MEMO', 'MODIFY'];
		// if (dev === '0') excludedHeaders.push('DEV');
		// if (dgn === '0') excludedHeaders.push('DGN');
		// if (pla === '0') excludedHeaders.push('PLA');
	
		const headers = Object.keys(jsonData[0]).filter(header => !excludedHeaders.includes(header));
		const csvRows = [headers.join(',')];
	
		jsonData.forEach(row => {
			if (row.STATUS === '0') {
				row.STATUS = '삭제';
			} else {
				row.STATUS = '';
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
	
		csvRows[0] = csvRows[0].split(',').map(cell => cell.replace('DEP', 'Depth')).join(',');
		csvRows[0] = csvRows[0].replace('SCREEN', '화면명');
		csvRows[0] = csvRows[0].replace('TYPE', '유형');
		csvRows[0] = csvRows[0].replace('ID', '화면ID');
		csvRows[0] = csvRows[0].replace('PLA', '기획');
		csvRows[0] = csvRows[0].replace('DGN', '디자인');
		csvRows[0] = csvRows[0].replace('PUB', '퍼블리싱');
		csvRows[0] = csvRows[0].replace('DEV', '개발');
		csvRows[0] = csvRows[0].replace('STATUS', '상태');
		csvRows[0] = csvRows[0].replace('WBS', '완료예정일');
		csvRows[0] = csvRows[0].replace('END', '최종완료일');
		return csvRows.join('\n');
	},
};


/* pubList */
const pubList = {
	init(){
		const wrap = document.querySelector('.pub-wrap');
		if(wrap && wrap.getAttribute('data-layout') === 'index'){
			pubList.makeList();
		}
		pubList.action();
	},
	makeList(){
		const pubPage = document.querySelector('.pub-page');
		const pubHeader = document.querySelector('.pub-header');
		const contentHtml = document.createElement('div');
    contentHtml.className = 'pub-content';
		const groupDep1 = pubList.groupByDep1(pubJSON);
		if(!groupDep1.length) return;
		
		const navAry = [];
		const fragment = document.createDocumentFragment();
		groupDep1.forEach(item => {
			navAry.push(item.dep1);
			const section = pubList.createSection(item);
			fragment.appendChild(section);
		});
		contentHtml.appendChild(fragment);
		pubPage.appendChild(contentHtml);

		//pubList.createMobileFrame(pubPage);
		pubList.createNav(pubHeader, navAry);

		const countObj = pubList.getCount(pubJSON)
		
		pubList.createSide(pubHeader, countObj);
		countObj.modify = pubJSON.filter(item => item.MODIFY.trim() !== '').length;
		pubList.createSide(pubHeader, countObj);
	},
	getPercent (val1, val2){
		const rtnVal = ((val1/val2)*100).toFixed(2);
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
							<select>
									<option value="375*667">iPhone 6/7/8</option>
									<option value="375*812">iPhone 12 Mini</option>
									<option value="390*844">iPhone 12 Pro</option>
									<option value="360*740" selected="selected">Galaxy S8+</option>
									<option value="280*653">Galaxy Fold</option>
							</select>
					</div>
					<div class="pub-screen">
							<button type="button">&#8634;</button>
							<div class="link"></div>
					</div>
					<div class="pub-iframe"><iframe src frameborder="0"></div>
					<button type="button" class="pub-frame-toggle">
							<span>닫기</span>
					</button>
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
	createSide(element, countObj, ){
		const sideHtml = document.createElement('div');
    sideHtml.className = 'pub-side';
		const totalHtml = `<div class="pub-total">
			<strong>
				${countObj.end}
				<span><em>${countObj.endDel}</em></span>
			</strong>
			<span>/</span>
			<strong>
				${countObj.useTotal - countObj.del}
				<span><em>${countObj.del}</em></span>
			</strong>
			<em>
				<span>
					<span>진척률</span>
					<strong>${pubList.getPercent(countObj.end, countObj.useTotal - countObj.del)}</strong>%
				</span>
				<button type="button" class="pub-button-detail" aria-expanded="false"></button>
			</em>	
			<ul class="pub-total-layer">
					<li>
							<em>전체<span>(<strong>${countObj.total}</strong>)</span></em>
					</li>
					<li class="unuse">
							<em>미포함<span>(<strong>${countObj.unuse}</strong>)</span></em>
							<span><strong>${pubList.getPercent(countObj.unuse, countObj.total)}</strong>%</span>
					</li>
					<li class="del">
							<em>삭제<span>(<strong>${countObj.del}</strong>)</span></em>
							<span><strong>${pubList.getPercent(countObj.del, countObj.total)}</strong>%</span>
					</li>
					<li class="wait">
							<em>대기<span>(<strong>${countObj.wait}</strong>)</span></em>
							<span><strong>${pubList.getPercent(countObj.wait, countObj.total)}</strong>%</span>
					</li>
					<li class="ing">
							<em>퍼블중<span>(<strong>${countObj.ing}</strong>)</span></em>
							<span><strong>${pubList.getPercent(countObj.ing, countObj.total)}</strong>%</span>
					</li>
					<li class="chk">
							<em>재/검토중<span>(<strong>${countObj.chk+countObj.reChk}</strong>)</span></em>
							<span><strong>${pubList.getPercent(countObj.chk+countObj.reChk, countObj.total)}</strong>%</span>
					</li>
					<li class="end">
							<em>완료<span>(<strong>${countObj.end}</strong>)</span></em>
							<span><strong>${pubList.getPercent(countObj.end, countObj.total)}</strong>%</span>
					</li>
			</ul>
		</div>`;
		/*
		const util1Html = `<div class="pub-group">
			<button class="pub-unlock on">&#8634;</button>
			<div class="pub-record">
				<button type="button" aria-expanded="false"># 전체</button>
				<div class="pub-option">
					<button type="button" data-value="optionAll" class="on"># 전체</button>
					<div class="pub-option-inr">
						<div class="progress"></div>
						<div class="type"></div>
						<div class="wbs"></div>
						<div class="pub-team"></div>
					</div>
				</div>
			</div>
			<div class="pub-search">
				<input type="text" placeholder="메뉴명"><button class="pub-search-btn"></button>
			</div>
			<button type="button" class="pub-viewer" aria-pressed="false"></button>
			<button type="button" aria-pressed="false" class="pub-toggle"></button>
		</div>`;
		*/
		const util1Html = '';
		const alarmHtml = function(num){
			if(num) return `<strong class="pub-alarm"><span>${num}</span></strong>`;
			else return '';
		}
		const util2Html = `<div class="pub-label">
			<ul>
				<li class="wait">
					${alarmHtml(countObj.wait)}
					<button type="button" class="pub-filter-status"  ${countObj.wait?'':`disabled="disabled"`}>대기중</button>
				</li>
				<li class="ing">
					${alarmHtml(countObj.ing)}
					<button type="button" class="pub-filter-status"  ${countObj.ing?'':`disabled="disabled"`}>퍼블중</button>
				</li>
				<li class="chk">
					${alarmHtml(countObj.chk+countObj.reChk)}
					<button type="button" class="pub-filter-status"  ${countObj.chk+countObj.reChk?'':`disabled="disabled"`}>재/검토중</button>
				</li>
				<li class="del">
					${alarmHtml(countObj.del)}
					<button type="button" class="pub-filter-status" ${countObj.del?'':`disabled="disabled"`}>삭제</button>
				</li>
			</ul>
			<ul>
				<li class="history">
					<button type="button" class="pub-modify-open" ${countObj.modify ? `disabled="disabled"`: ''}>수정이력</button>
				</li>
			</ul>
			<ul>
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
	getCount(data){
		const rtnObj = {};
		rtnObj.total = data.length; // 전체
		rtnObj.unuse = data.filter(item => parseInt(item.COUNT) === 0).length; // 미포함
		rtnObj.useTotal = rtnObj.total - rtnObj.unuse;
		rtnObj.del = data.filter(item => parseInt(item.STATUS) === 0 && parseInt(item.COUNT) !== 0).length;
		rtnObj.end = data.filter(item => item.END.trim() !== '' && parseInt(item.STATUS) !== 0 && parseInt(item.COUNT) !== 0).length;
		rtnObj.endDel = data.filter(item => item.END.trim() !== '' && parseInt(item.STATUS) === 0 && parseInt(item.COUNT) !== 0).length;
		rtnObj.wait = data.filter(item => parseInt(item.STATUS) === 1 && item.END.trim() === '' && parseInt(item.COUNT) !== 0).length;
		rtnObj.ing = data.filter(item => parseInt(item.STATUS) === 2 && item.END.trim() === '' && parseInt(item.COUNT) !== 0).length;
		rtnObj.chk = data.filter(item => parseInt(item.STATUS) === 3 && item.END.trim() === '' && parseInt(item.COUNT) !== 0).length;
		rtnObj.reChk = data.filter(item => parseInt(item.STATUS) === 4 && item.END.trim() === '' && parseInt(item.COUNT) !== 0).length;

		return rtnObj;
	},
	createSection(data){
		const dataTit = data.dep1.replace(/ /gi,"").replace(/[/]/gi, 'ㆍ').replace(/[(]/gi, '！').replace(/[)]/gi, '？');

		const dataItems = data.items;
		const fragment = document.createDocumentFragment();
		dataItems.forEach((item, i) => {
			const row = pubList.createTableRow(item, i);
			fragment.appendChild(row);
		});

		const depKeys = ['DEP2', 'DEP3', 'DEP4', 'DEP5', 'DEP6'];
		const depList = pubList.countByMultipleKeys(dataItems, depKeys);
		const depOpts = pubList.changeDepOpt(depList);
		const depSelect = (idx,str) => {
			let rtnVal = str;
			if(depOpts[idx].length){
				rtnVal = `<select>
					<option value="">${str}</option>
					${depOpts[idx]}
				</select>`;
			}
			return rtnVal;
		};

		const siteHtml = document.createElement('div');
    siteHtml.className = 'pub-site';
		const innerHtml = `
			<div class="pub-site-title">
				<h2>
					<span>${dataTit}</span><div class="pub-progress"></div>
				</h2>
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
								<th class="dep2">${depSelect(0, 'D2')}</th>
								<th class="dep3">${depSelect(1, 'D3')}</th>
								<th class="dep4">${depSelect(2, 'D4')}</th>
								<th class="dep5">${depSelect(3, 'D5')}</th>
								<th class="dep6">${depSelect(4, 'D6')}</th>
								<th class="screen">화면명</th>
								<th class="type">유형</th>
								<th class="url">URL</th>
								<th class="id">화면ID</th>
								<th class="publisher">퍼블</th>
								<th class="designer">디자인</th>
								<th class="planner">기획</th>
								<th class="developer">개발</th>
								<th class="wbs">완료예정일</th>
								<th class="status">최종완료일</th>
								<th class="modify">수정이력</th>
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
		if(depList.length){
			depList.forEach(item => {
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
		}	;

    return keys.map(key => ({
        key,
        counts: countByKey(data, key)
    }));
	},
	changeDepOpt(data){
		const rtnVal = [];
		data.forEach(function(dataItem){
			let html ='';
			dataItem.counts.forEach(item => {
				html += `<option value="${item.value}">${item.value} (${item.count})</option>`;
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

		const trClassAry = ['tr'];
		if(depth2Name) trClassAry.push('tr-dep2_'+depth2Name);
		if(depth3Name) trClassAry.push('tr-dep3_'+depth3Name);
		if(depth4Name) trClassAry.push('tr-dep4_'+depth4Name);
		if(depth5Name) trClassAry.push('tr-dep5_'+depth5Name);
		if(depth6Name) trClassAry.push('tr-dep6_'+depth6Name);
		if(id) trClassAry.push('tr-id_'+id);
		if(count === 0) {
			trClassAry.push('unuse');
		}else{
			if(end){
				if(status === 0) trClassAry.push('del');
				else trClassAry.push('end');
				const endStr = end.replace(/-/g, '');
				trClassAry.push('tr-end_'+endStr);
			}else{
				if(status === 0) trClassAry.push('del');
				else if(status === 1) trClassAry.push('wait');
				else if(status === 2) trClassAry.push('ing');
				else if(status === 3) trClassAry.push('chk');
				else if(status === 4) trClassAry.push('chk re');
			}
		}

		const depth2Html = pubList.beforeTr.dep2 === depth2Name ? `<span>${depth2Name}</span>` : `<strong>${depth2Name}</strong>`;
		const depth3Html = pubList.beforeTr.dep3 === depth3Name ? `<span>${depth3Name}</span>` : `<strong>${depth3Name}</strong>`;
		const depth4Html = pubList.beforeTr.dep4 === depth4Name ? `<span>${depth4Name}</span>` : `<strong>${depth4Name}</strong>`;
		const depth5Html = pubList.beforeTr.dep5 === depth5Name ? `<span>${depth5Name}</span>` : `<strong>${depth5Name}</strong>`;
		const depth6Html = pubList.beforeTr.dep6 === depth6Name ? `<span>${depth6Name}</span>` : `<strong>${depth6Name}</strong>`;

		const typeTd = size ? `<td class="type" data-size="${size}">${type}</td>`: `<td class="type">${type}</td>`;

		const idTd = () => {
			let rtnVal = id;
			const preUrl = '..';
			const file = typeof pubSetting !== 'undefined' && typeof pubSetting.file !== 'undefined' ? pubSetting.file : 'html';
			if(url && id && (status !== 1 || end)){
				const setUrl = url.slice(-1) === '/' ? preUrl+url+id+'.'+file : preUrl+url;
				rtnVal = `<a href="${setUrl}" target="_blank"><strong>${id}</strong></a><button type="button" class="pub-copy" title="메뉴복사"></button>`;
			}
			return rtnVal;
		}

		const statusTd = () => {
			let rtnVal = ''
			if(end){
				rtnVal = `<em><span>${end}</span>${pubUtil.getWeek(end)}</em>`;
			}else if(count !== 0){
				if(status === 2) rtnVal = '<em>퍼블중</em>';
				else if(status === 3) rtnVal = '<em>검토중</em>';
				else if(status === 4) rtnVal = '<em>재검토중</em>';
			}
			return rtnVal;
		};

		const convertModifyList = (htmlString) => {
			// 각각의 li 항목을 매칭하는 정규식
			const regex = /\[(\d{4}-\d{2}-\d{2}) (.*?)\]/g;
			// replace 함수를 사용하여 매칭되는 모든 항목을 변환
			return htmlString.replace(regex, (match, dateStr, content) => {
					const weekday = pubUtil.getWeek(dateStr);
					
					const dateStr2 = dateStr.replace(/-/g, '');
					trClassAry.push('tr-modify_'+dateStr2);

					// 새로운 형식으로 변환
					return `<li title="${dateStr} ${content}"><em><span>${dateStr}</span>${weekday}</em><p>${content}</p></li>`;
			});
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

		if(depth2Name) pubList.beforeTr.dep2 = depth2Name;
		if(depth3Name) pubList.beforeTr.dep3 = depth3Name;
		if(depth4Name) pubList.beforeTr.dep4 = depth4Name;
		if(depth5Name) pubList.beforeTr.dep5 = depth5Name;
		if(depth6Name) pubList.beforeTr.dep5 = depth6Name;

		return fragment;
	},
	action(){
		let beforeTarget = null;
		document.addEventListener('click', (e) => {
			const target = e.target;
			const pubSide = document.querySelector('.pub-side');

			//진척률 툴팁
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

			//메뉴 복사
			if(target.matches('.pub-copy')){
				const depAry = []
				const tr = target.closest('tr');
				const dep1El = target.closest('.pub-site').querySelector('.pub-site-title h2 > span');
				const dep2El = tr.querySelector('td.dep2');
				const dep3El = tr.querySelector('td.dep3');
				const dep4El = tr.querySelector('td.dep4');
				const dep5El = tr.querySelector('td.dep5');
				const dep6El = tr.querySelector('td.dep6');
				const screenEl = tr.querySelector('td.screen');
				if(dep1El) depAry.push(dep1El.textContent);
				if(dep2El) depAry.push(dep2El.textContent);
				if(dep3El) depAry.push(dep3El.textContent);
				if(dep4El) depAry.push(dep4El.textContent);
				if(dep5El) depAry.push(dep5El.textContent);
				if(dep6El) depAry.push(dep6El.textContent);
				if(screenEl) depAry.push(screenEl.textContent);
				const idEl = tr.querySelector('td.id');
				const copyMsg = '· '+ depAry.join(' > ')+'\n  '+idEl.textContent;
				pubUtil.clipboardCopy(copyMsg);
			}
				

			//csv 파일 다운로드
			if (target.matches('.pub-csv-down')){
				console.log('csv 파일 다운로드');
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

			if(beforeTarget !== target) beforeTarget = target;
		});
	}
}

document.addEventListener('DOMContentLoaded', () => {
	if(typeof pubJSON !== 'undefined'){
		// loading.open();
		pubList.init();
	}
});
