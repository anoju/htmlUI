
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

/* UTILS */

/* pubList */
const pubList = {
	init(){
		const wrap = document.querySelector('.pub-wrap');
		if(wrap && wrap.getAttribute('data-layout') === 'index'){
			pubList.makeList();
		}
	},
	makeList(){
		const pubPage = document.querySelector('.pub-page');
		const contentHtml = document.createElement('div');
    contentHtml.className = 'pub-content';
		const groupDep1 = pubList.groupByDep1(pubJSON);
		if(!groupDep1.length) return;
		
		const fragment = document.createDocumentFragment();
		groupDep1.forEach(item => {
			const section = pubList.createSection(item);
			fragment.appendChild(section);
		});
		contentHtml.appendChild(fragment);
		pubPage.appendChild(contentHtml);
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
	createSection(data){
		const dataTit = data.dep1.replace(/ /gi,"").replace(/[/]/gi, 'ㆍ').replace(/[(]/gi, '！').replace(/[)]/gi, '？');

		const dataItems = data.items;
		const fragment = document.createDocumentFragment();
		dataItems.forEach(item => {
			const row = pubList.createTableRow(item);
			// fragment.appendChild(row);
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
	createTableRow(){

	}
}

document.addEventListener('DOMContentLoaded', () => {
	if(typeof pubJSON !== 'undefined'){
		// loading.open();
		pubList.init();
	}
});
