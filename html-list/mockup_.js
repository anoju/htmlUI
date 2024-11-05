/* LOADINGBAR */
function loadingBarStart() {
	var backGroundCover = '<div id="loadingbar" style="display:none;position:fixed;left:0;top:0;width:100%;height:100%;z-index:10000;"><img src="https://nwww-t.sgic.co.kr/resource/pc/images/common/loading.gif" alt="로딩중" style="position:fixed;inset:0;margin:auto;"></div>';
	$('body').append(backGroundCover);
	$('#loadingbar').show();
} loadingBarStart();
function loadingBarEnd() {
	$('#loadingbar').hide();
}

setTimeout(function() {
	/* INDEX */
	if ($('.pub-wrap').attr('data-layout')=='index') {
		markupLayout();
		markupList();

		//Guide Markup Layout
		function markupLayout() {
			var pub_index_site='<div class="pub-content">';
				pub_index_site += '</div>';
			$('.pub-page').append(pub_index_site);
		}

		//Guide Markup List Rander
		function markupList() {
			var pub_index_list='';
			for(var i=0; i < pub_index_data.length; i++) {
				var count=pub_index_data[i].COUNT,
					depth1Name=pub_index_data[i].DEP1.replace(/ /gi,"").replace(/[/]/gi, 'ㆍ').replace(/[(]/gi, '！').replace(/[)]/gi, '？');
					depth2Name=pub_index_data[i].DEP2,
					depth3Name=pub_index_data[i].DEP3,
					depth4Name=pub_index_data[i].DEP4,
					depth5Name=pub_index_data[i].DEP5,
					depth6Name=pub_index_data[i].DEP6,
					screen=pub_index_data[i].SCREEN,
					type=pub_index_data[i].TYPE,
					size=pub_index_data[i].SIZE,
					url=pub_index_data[i].URL,
					id=pub_index_data[i].ID,
					publisher=pub_index_data[i].PUB,
					designer=pub_index_data[i].DGN,
					planner=pub_index_data[i].PLA,
					developer=pub_index_data[i].DEV,
					status=pub_index_data[i].STATUS,
					schedule=pub_index_data[i].WBS,
					end=pub_index_data[i].END,
					modify=pub_index_data[i].MODIFY.replace(/\[/g, '<li><p>').replace(/\]/g, '</p></li>'),
					memo=pub_index_data[i].MEMO,
					sb=pub_index_data[i].SB;

				var pub_index_site='';
					if(count==0) pub_index_site += '<div class="pub-site nocount">';
					else pub_index_site += '<div class="pub-site">';
						pub_index_site += '<div class="pub-site-title">';
							pub_index_site += '<h2>';
								pub_index_site += '<span>'+ depth1Name +'</span><div class="pub-progress"></div>';
							pub_index_site += '</h2>';
						pub_index_site += '</div>';
						pub_index_site += '<div class="pub-table" id="index_'+ depth1Name +'">';
							pub_index_site += '<div class="pub-thead">';
								pub_index_site += '<table>';
									pub_index_site += '<colgroup><col class="no"><col class="dep2"><col class="dep3"><col class="dep4"><col class="dep5"><col class="dep6"><col class="screen"><col class="type"><col class="url"><col class="id"><col class="publisher"><col class="designer"><col class="planner"><col class="developer"><col class="wbs"><col class="status"><col class="modify"><col class="memo"></colgroup>';
									pub_index_site += '<thead>';
									pub_index_site += '</thead>';
								pub_index_site += '</table>';
							pub_index_site += '</div>';
							pub_index_site += '<div class="pub-tbody">';
								pub_index_site += '<table>';
									pub_index_site += '<colgroup><col class="no"><col class="dep2"><col class="dep3"><col class="dep4"><col class="dep5"><col class="dep6"><col class="screen"><col class="type"><col class="url"><col class="id"><col class="publisher"><col class="designer"><col class="planner"><col class="developer"><col class="wbs"><col class="status"><col class="modify"><col class="memo"></colgroup>';
									pub_index_site += '<tbody>';
									pub_index_site += '</tbody>';
								pub_index_site += '</table>';
							pub_index_site += '</div>';
						pub_index_site += '</div>';
					pub_index_site += '</div>';

				var pub_index_thead='';
					pub_index_thead += '<tr>';
						pub_index_thead += '<th class="no">번호</th>';
						pub_index_thead += '<th class="dep2"><select><option value="">D2</option></select></th>';
						pub_index_thead += '<th class="dep3"><select><option value="">D3</option></select></th>';
						pub_index_thead += '<th class="dep4"><select><option value="">D4</option></select></th>';
						pub_index_thead += '<th class="dep5"><select><option value="">D5</option></select></th>';
						pub_index_thead += '<th class="dep6"><select><option value="">D6</option></select></th>';
						pub_index_thead += '<th class="screen">화면명</th>';
						pub_index_thead += '<th class="type">유형</th>';
						pub_index_thead += '<th class="url">URL</th>';
						pub_index_thead += '<th class="id">화면ID</th>';
						pub_index_thead += '<th class="publisher">퍼블</th>';
						pub_index_thead += '<th class="designer">디자인</th>';
						pub_index_thead += '<th class="planner">기획</th>';
						pub_index_thead += '<th class="developer">개발</th>';
						pub_index_thead += '<th class="wbs">완료예정일</th>';
						pub_index_thead += '<th class="status">최종완료일</th>';
						pub_index_thead += '<th class="modify">수정이력</th>';
						pub_index_thead += '<th class="memo">비고</th>';
					pub_index_thead += '</tr>';

				var pub_index_tbody='';
					if (sb.length) pub_index_tbody += '<tr data-sb="'+ sb +'" class="';
					else pub_index_tbody += '<tr class="';
					if (count==2) pub_index_tbody += 'v2 ';
					if (count==4) pub_index_tbody += 'after ';
					
					if (count.indexOf('0')==-1 && status.indexOf('2')==-1 && status.indexOf('3')==-1 && status.indexOf('4')==-1 && status.indexOf('0')==-1 && end.indexOf('-')==-1) pub_index_tbody += 'wait';
					if (chk!='0') {
						if (count.indexOf('0')==-1 && status.indexOf('2')!=-1 && end.indexOf('-')==-1) pub_index_tbody += 'ing';
						if (count.indexOf('0')==-1 && status.indexOf('3')!=-1 && end.indexOf('-')==-1) pub_index_tbody += 'chk';
						if (count.indexOf('0')==-1 && status.indexOf('4')!=-1 && end.indexOf('-')==-1) pub_index_tbody += 'chk re';
					} else {
						if (count.indexOf('0')==-1 && status.indexOf('2')!=-1 && end.indexOf('-')==-1)  pub_index_tbody += 'ing';
						if (count.indexOf('0')==-1 && status.indexOf('3')!=-1 && end.indexOf('-')==-1) pub_index_tbody += 'ing';
						if (count.indexOf('0')==-1 && status.indexOf('4')!=-1 && end.indexOf('-')==-1) pub_index_tbody += 'ing';
					}
					if (count.indexOf('0')==-1 && end.indexOf('-')!=-1) pub_index_tbody += 'end';
					if (status.indexOf('0')!=-1 && end.indexOf('-')==-1) pub_index_tbody += 'del';
					if (status.indexOf('0')!=-1 && end.indexOf('-')!=-1) pub_index_tbody += ' del';
					if (end.indexOf('-')!=-1) status = end.replace(/[가-힣a-zA-Z\s]|[\{\}\[\]\/?.,;:|\)*~`!^\_+<>@\#$%&\\\=\(\'\"]/gi, '');
					pub_index_tbody += '">';
						pub_index_tbody += '<td class="dep2"><span>'+ depth2Name +'</span></td>';
						pub_index_tbody += '<td class="dep3"><span>'+ depth3Name +'</span></td>';
						pub_index_tbody += '<td class="dep4"><span>'+ depth4Name +'</span></td>';
						pub_index_tbody += '<td class="dep5"><span>'+ depth5Name +'</span></td>';
						pub_index_tbody += '<td class="dep6"><span>'+ depth6Name +'</span></td>';
						pub_index_tbody += '<td class="screen"><span>'+ screen +'</span></td>';
						if(size) pub_index_tbody += '<td class="type" data-size="'+size+'">'+ type +'</td>';
						else pub_index_tbody += '<td class="type">'+ type +'</td>';
						pub_index_tbody += '<td class="url">'+ url +'</td>';
						pub_index_tbody += '<td class="id">'+ id +'</td>';
						pub_index_tbody += '<td class="publisher">'+ publisher +'</td>';
						pub_index_tbody += '<td class="designer">'+ designer +'</td>';
						pub_index_tbody += '<td class="planner">'+ planner +'</td>';
						pub_index_tbody += '<td class="developer">'+ developer +'</td>';
						pub_index_tbody += '<td class="wbs">'+ schedule +'</td>';
						pub_index_tbody += '<td class="status">'+ status +'</td>';
						pub_index_tbody += '<td class="modify"><ul>'+ modify +'</ul></td>';
						pub_index_tbody += '<td class="memo">'+ memo +'</td>';
					pub_index_tbody += '</tr>';

				if ($('.pub-content').find('#index_'+ depth1Name).length==0) $('.pub-content').append(pub_index_site);
				$('#index_'+ depth1Name).find('.pub-tbody tbody').append(pub_index_tbody);
			}
			$('.pub-content').append(pub_index_list);
			$('.pub-thead thead').append(pub_index_thead);
			$('.pub-site .pub-site-title h2 > span').each(function() {
				var el=$(this),
					elText=el.text().replace(/[ㆍ]/gi, '/').replace(/[！]/gi, '(').replace(/[？]/gi, ')');
				el.html(elText);
			});
		}

		$('.pub-page').after('<div class="pub-mobile-frame"><div class="pub-mobile-frame-inr"><div class="pub-device"><select><option value="375*667">iPhone 6/7/8</option><option value="375*812">iPhone 12 Mini</option><option value="390*844">iPhone 12 Pro</option><option value="360*740" selected="selected">Galaxy S8+</option><option value="280*653">Galaxy Fold</option></select></div><div class="pub-screen"><button type="button">&#8634;</button><div class="link"></div></div><div class="pub-iframe"></div><button type="button" class="pub-frame-toggle"><span>닫기</span></button></div></div><div class="pub-modify"></div>');
		$('.pub-wrap .pub-header .pub-title').after('<div class="pub-side"><div class="pub-side-inr"><div class="pub-total"></div><div class="pub-legend"><div class="pub-group"><button class="pub-unlock on">&#8634;</button><div class="pub-record"></div><div class="pub-search"><input type="text" placeholder="메뉴명"><button class="pub-search-btn"></button></div><button type="button" class="pub-viewer" aria-pressed="false"></button><button type="button" aria-pressed="false" class="pub-toggle"></button></div><ul class="pub-label"><li class="end yesterday"><button type="button"><em>전일</em></button></li><li class="end" title="개발 진행(수정이력 제공)"><em>완료일</em></li><li class="modify yesterday"><button type="button"><em>전일</em></button></li><li class="modify" title="퍼블 파일내 수정일자(YYYY-MM-DD) 검색"><em>수정일</em></li><li class="history"><button type="button" class="pub-modify-open" disabled><span></span></button></li><li class="down"><button type="button" class="pub-csv-down"><span>CSV 다운</span></button></li></ul></div></div></div>');

		/* CONTENT */
		if (env!='1') $('.pub-viewer, .pub-mobile-frame').remove();
		if (tab!='0') $('.pub-tab-list').show();
		if (scn=='0') $('.pub-site .pub-table .screen').remove();
		if (wbs=='0') $('.pub-site .pub-table .wbs').remove();
		if (pub=='0') $('.pub-site .pub-table .publisher').remove();
		if (dgn=='0') $('.pub-site .pub-table .designer').remove();
		if (pla=='0') $('.pub-site .pub-table .planner').remove();
		if (dev=='0') $('.pub-site .pub-table .developer').remove();
		if (fin!='0') $('.pub-wrap').addClass('fin');

		$('.pub-header .pub-tab-list .pub-tab.on').attr('disabled', true);

		var now=new Date(),
			year=now.getFullYear(),
			mon=(now.getMonth()+1)>9 ? ''+(now.getMonth()+1):'0'+(now.getMonth()+1),
			day=now.getDate()>9 ? ''+now.getDate() : '0'+now.getDate(),
			today=Number(year+mon+day),
			nowLastDay=(new Date(year, mon, 0)).getDate(),
			nowLastDate=Number(year+mon+nowLastDay),
			prevMon=(now.getMonth()+1)>9 ? ''+(now.getMonth()):'0'+(now.getMonth()),
			prevLastDay=(new Date(year, mon-1, 0)).getDate(),
			prevLastDate=Number(year+prevMon+prevLastDay),
			nextMon=(now.getMonth()+1)>9 ? ''+(now.getMonth()+2): '0'+(now.getMonth()+2),
			nextFirstDate=Number(year+nextMon+'0'+1);
		var week=['일', '월', '화', '수', '목', '금', '토'],
			monday='월',
			dayOfWeek=week[new Date(now).getDay()];
		$('.pub-site .pub-table .pub-tbody tbody').each(function() {
			var el=$(this).children('tr:not(.sb)'),
				elCount=el.length;
			for (var i=0; i<=elCount; i++) el.eq(i).prepend('<td class="no"><span>'+(i+1)+'</span></td>');
		});
		$('.pub-site .pub-table .pub-tbody td.status').each(function() {
			var el=$(this),
				eltext=el.text(),
				elDate=Number(eltext.replace(/-/g,''));
			if (el.html()!='' && !el.closest('tr').hasClass('ing')) el.html('<em><span>'+eltext+'</span></em>');
			if (elDate==today && !el.closest('tr').hasClass('del')) el.addClass('today');
			else if (elDate==today-1 && !el.closest('tr').hasClass('del')) el.addClass('yesterday');
			else if (day=='01' && elDate==prevLastDate && !el.closest('tr').hasClass('del')) el.addClass('yesterday');
			else if (dayOfWeek==monday && elDate==today-2 && !el.closest('tr').hasClass('del')) el.addClass('yesterday');
			else if (dayOfWeek==monday && elDate==today-3 && !el.closest('tr').hasClass('del')) el.addClass('yesterday');
			else if (dayOfWeek==monday && day=='01' && elDate==prevLastDate && !el.closest('tr').hasClass('del')) el.addClass('yesterday');
			else if (dayOfWeek==monday && day=='01' && elDate==prevLastDate-1 && !el.closest('tr').hasClass('del')) el.addClass('yesterday');
			else if (dayOfWeek==monday && day=='01' && elDate==prevLastDate-2 && !el.closest('tr').hasClass('del')) el.addClass('yesterday');
			else if (dayOfWeek==monday && day=='02' && elDate==prevLastDate && !el.closest('tr').hasClass('del')) el.addClass('yesterday');
			else if (dayOfWeek==monday && day=='02' && elDate==prevLastDate-1 && !el.closest('tr').hasClass('del')) el.addClass('yesterday');
			else if (dayOfWeek==monday && day=='03' && elDate==prevLastDate && !el.closest('tr').hasClass('del')) el.addClass('yesterday');
			$.each(holiday, function(index, item) {
				var item=item.replace(/\-/g, '');
				if (item==today-1 && elDate==today-2 && !el.closest('tr').hasClass('del')) el.addClass('yesterday');
			});
			if (el.html()!='') {
				var week2=week[new Date(eltext).getDay()];
				if (week2!=undefined) el.find('span').parent().append('('+week2+')');
			}
		});
		var depth='dep'+parseInt(dep);
		$('.pub-wrap .pub-table [class*=dep]').each(function() {
			if ($(this).hasClass(depth)) $(this).addClass('last');
			if ($(this).hasClass('last')) $(this).find('~ [class*=dep]').remove();
		});
		$('.pub-site .pub-table .pub-tbody tr').each(function() {
			var el=$(this),
				elState=el.find('td.status').text();
			if (el.find('td.id').html()=='' && !el.hasClass('del')) el.removeClass('ing chk end').addClass('wait');
			if (!el.closest('.pub-site').hasClass('nocount') && el.hasClass('wait')) $(this).find('td.status').html('<em>대기</em>');
			if (el.hasClass('ing')) $(this).find('td.status').html('<em>퍼블중</em>');
			if (el.hasClass('chk')) $(this).find('td.status').html('<em>검토중</em>');
			if (el.hasClass('chk re')) $(this).find('td.status').html('<em>재검토중</em>');
			if ((el.hasClass('del') && elState.indexOf('-')==-1) || (el.closest('.pub-site').hasClass('nocount'))) $(this).find('td.status em').remove();
			if (el.find('td.screen span').html()=='') el.find('td.screen span').remove();
		});

		$('.pub-site .pub-table .pub-tbody tr[data-sb]').each(function() {
			var el=$(this),
				elSb=el.attr('data-sb'),
				elColNum=el.find('td:visible').length;
			el.before('<tr class="sb"><td colspan="'+ elColNum +'"><em>'+ elSb +'</em></td></tr>').removeAttr('data-sb');
		});

		$('.pub-site .pub-table .pub-tbody td.modify li').each(function() {
			var $this=$(this);
			var el=$this.find('p');
			if (el.html()!='') {
				var modify=el.text(),
					date=modify.substring(0, 10),
					text=modify.substring(10),
					week2=week[new Date(date).getDay()];
				var list=$this.parent(),
					itemsArray=Array.from(list.children());
				// console.log(itemsArray);
				function extractDate(itemText) {
					var match=itemText.match(/\d{4}-\d{2}-\d{2}/);
					if (match) return new Date(match[0]);
					return null;
				}
				itemsArray.sort(function(a, b) {
					var dateA=extractDate(a.textContent);
					var dateB=extractDate(b.textContent);
					if (dateA && dateB) return dateB - dateA;
					return 0;
				});
				itemsArray.forEach(function(item) {
					list.append(item);
				});
				el.html(text).before('<em><span>'+date+'</span></em>');
				el.closest('li').attr('title', modify);
				el.prev().append('('+week2+')');

				var elSpan=$(this).find('span'),
					elSpanText=elSpan.text(),
					elDate=Number(elSpanText.replace(/-/g,''));
				if (elDate==today && !el.closest('tr').hasClass('del')) el.closest('li').addClass('today');
				else if (elDate==today-1 && !el.closest('tr').hasClass('del')) el.closest('li').addClass('yesterday');
				else if (day=='01' && elDate==prevLastDate && !el.closest('tr').hasClass('del')) el.closest('li').addClass('yesterday');
				else if (dayOfWeek==monday && elDate==today-2 && !el.closest('tr').hasClass('del')) el.closest('li').addClass('yesterday');
				else if (dayOfWeek==monday && elDate==today-3 && !el.closest('tr').hasClass('del')) el.closest('li').addClass('yesterday');
				else if (dayOfWeek==monday && day=='01' && elDate==prevLastDate && !el.closest('tr').hasClass('del')) el.closest('li').addClass('yesterday');
				else if (dayOfWeek==monday && day=='01' && elDate==prevLastDate-1 && !el.closest('tr').hasClass('del')) el.closest('li').addClass('yesterday');
				else if (dayOfWeek==monday && day=='01' && elDate==prevLastDate-2 && !el.closest('tr').hasClass('del')) el.closest('li').addClass('yesterday');
				else if (dayOfWeek==monday && day=='02' && elDate==prevLastDate && !el.closest('tr').hasClass('del')) el.closest('li').addClass('yesterday');
				else if (dayOfWeek==monday && day=='02' && elDate==prevLastDate-1 && !el.closest('tr').hasClass('del')) el.closest('li').addClass('yesterday');
				else if (dayOfWeek==monday && day=='03' && elDate==prevLastDate && !el.closest('tr').hasClass('del')) el.closest('li').addClass('yesterday');
				$.each(holiday, function(index, item) {
					var item=item.replace(/\-/g, '');
					if (item==today-1 && elDate==today-2 && !el.closest('tr').hasClass('del')) el.closest('li').addClass('yesterday');
				});
			} else {
				el.closest('td.modify ul').remove();
			}
		});

		$('.pub-site .pub-table .pub-tbody td.modify').each(function() {
			var el=$(this);
			if (el.find('li').length>1) {
				el.find('ul').before('<button type=\"button\" aria-pressed=\"false\"></button>');
				if (!el.closest('.pub-table').find('.pub-thead th.modify button').length) el.closest('.pub-table').find('.pub-thead th.modify').append('<button type=\"button\" aria-pressed=\"false\"></button>');
			}
		});
		$('.pub-site .pub-table .pub-tbody td.modify button').on('click', function() {
			if ($(this).attr('aria-pressed')=='false') $(this).attr('aria-pressed', 'true');
			else $(this).attr('aria-pressed', 'false');
		});
		$('.pub-site .pub-table .pub-thead th.modify button').on('click', function() {
			if ($(this).attr('aria-pressed')=='false') $(this).closest('.pub-table').find('.modify button').attr('aria-pressed', 'true');
			else $(this).closest('.pub-table').find('.modify button').attr('aria-pressed', 'false');
		});
		$('.pub-site:not(.nocount) .pub-table .pub-tbody td.modify').each(function() {
			if ($(this).children().length>0) $('.pub-modify-open').attr('disabled', false);
		});

		$('.pub-site .pub-table .pub-tbody td[class*="dep"] span').each(function() {
			var el=$(this);
			if (el.html()=='') el.remove();
		});
		$('.pub-header .pub-record').each(function() {
			var el=$(this);
			el.append('<button type="button" aria-expanded="false"># 전체</button><div class="pub-option"><button type="button" data-value="optionAll" class="on"># 전체</button><div class="pub-option-inr"><div class="progress"></div><div class="type"></div><div class="wbs"></div><div class="pub-team"></div></div></div>');
			if (wbs=='0') el.find('.wbs').remove();
			if (pla=='0' && dev=='0' && pub=='0') el.find('.pub-team').remove();
			if (fin=='1') el.find('.wbs, .pub-team').remove();
		});
		$(document).on('click', '.pub-header .pub-record>button', function() {
			var el=$(this),
				spd=200;
			if (el.attr('aria-expanded')=='false') {
				el.attr('aria-expanded', 'true').next().slideDown(spd);
			} else {
				el.attr('aria-expanded', 'false').next().slideUp(spd);
				setTimeout(function() {
					if ($('.pub-record .pub-option>button').hasClass('on')) {
						$('.pub-record a').removeClass('on').next().hide();
						$('.pub-record .progress a').addClass('on').next().show();
					} else {
						$('.pub-record button.on').closest('div').show().prev().addClass('on').parent().siblings().find('a.on').removeClass('on').next().hide();
					}
				}, spd);
			}
		});
		$(document).stop().on('click', '.pub-header .pub-record .pub-option button', function() {
			resetSearch();
			resetDepth2();
			resetLabel();
			var el=$(this),
				elText =el.text();
			$('.pub-record .pub-option button').removeClass('on');
			$(this).addClass('on').closest('.pub-option').slideUp(200).prev().attr('aria-expanded', 'false');
			if (el.attr('data-value')=='optionAll') {
				$('.pub-header .pub-record>button').removeClass('on').html(elText);
				el.next('.pub-option-inr').find('button').removeClass('on');
				el.next('.pub-option-inr').find('a').removeClass('on').next().hide();
				el.next('.pub-option-inr').find('.progress a').addClass('on').next().show();
			}
			else $('.pub-header .pub-record>button').addClass('on').html(elText);
		});

		$('.pub-wrap .pub-header .pub-total').each(function() {
			var url=0, del=0, status=0, statusDel=0, wait=0, ing=0, check=0, checkre=0, endYesterday=0, modifyYesterday=0, nocount=0, v2=0;
			$('.pub-site:not(.nocount) .pub-table .pub-tbody tr:not(.sb)').each(function() {
				if ($(this).length) url++;
			});
			$('.pub-site:not(.nocount) .pub-table .pub-tbody tr.del').each(function() {
				if ($(this).length) del++;
			});
			$('.pub-site:not(.nocount) .pub-table .pub-tbody td.status').each(function() {
				if ($(this).html()!='') status++;
			});
			$('.pub-site:not(.nocount) .pub-table .pub-tbody tr.del td.status').each(function() {
				if ($(this).html()!='') statusDel++;
			});
			$('.pub-site:not(.nocount) .pub-table .pub-tbody tr.wait').each(function() {
				if ($(this).html()!='') wait++;
			});
			$('.pub-site:not(.nocount) .pub-table .pub-tbody tr.ing:not(.chk)').each(function() {
				if ($(this).html()!='') ing++;
			});
			$('.pub-site:not(.nocount) .pub-table .pub-tbody tr.chk').each(function() {
				if ($(this).html()!='') check++;
			});
			$('.pub-site:not(.nocount) .pub-table .pub-tbody tr.chk.re').each(function() {
				if ($(this).html()!='') checkre++;
			});
			$('.pub-site .pub-table .pub-tbody tr').each(function() {
				if ($(this).find('.status.yesterday').length>0) endYesterday++;
			});
			$('.pub-site .pub-table .pub-tbody tr').each(function() {
				if ($(this).find('.modify .yesterday').length>0) modifyYesterday++;
			});
			$('.pub-site:not(.nocount) .pub-table .pub-tbody tr.after').each(function() {
				if ($(this).html()!='') nocount++;
			});
			$('.pub-site:not(.nocount) .pub-table .pub-tbody tr.v2').each(function() {
				if ($(this).html()!='') v2++;
			});
			count1=(url);
			count2=(status-statusDel)-(wait)-(ing)-(check);
			count3=(status-statusDel+del)-(wait)-(ing);
			count4=(wait);
			count5=(ing);
			count6=(check);
			count7=(check)-(checkre);
			count8=(checkre);
			var nanValue1=((count2/count1)*100).toFixed(1),
				nanValue2=((count3/count1)*100).toFixed(1),
				nanValue3=((count4/count1)*100).toFixed(1),
				nanValue4=((count5/count1)*100).toFixed(1),
				nanValue5=((count6/count1)*100).toFixed(1);
			if (isNaN(nanValue1)) nanValue1=0;
			if (isNaN(nanValue2)) nanValue2=0;
			if (isNaN(nanValue3)) nanValue3=0;
			if (isNaN(nanValue4)) nanValue4=0;
			if (isNaN(nanValue5)) nanValue5=0;

			//total
			if (chk!='0') $(this).prepend('<strong>'+count3+'<span><em>'+del+'</em></span><span></strong><span>/</span><strong>'+count1+'</span><span><em>'+del+'</em></span></strong><em><span><span>진척률</span><strong>'+nanValue2+'</strong>%</span><button type="button" class="pub-button-detail" aria-expanded="false"></button></em><ul class="pub-total-layer"><li class="end"><em>완료<span> (<strong>'+count2+'</strong>)</span></em><span><strong>'+nanValue1+'</strong>%</span></li><li class="chk"><em>재/검토중<span> (<strong>'+count6+'</strong>)</span></em><span><strong>'+nanValue5+'</strong>%</span></li><li class="ing"><em>퍼블중<span> (<strong>'+count5+'</strong>)</span></em><span><strong>'+nanValue4+'</strong>%</span></li><li class="wait"><em>대기<span> (<strong>'+count4+'</strong>)</span></em><span><strong>'+nanValue3+'</strong>%</span></li></ul>');
			else $(this).prepend('<strong>'+count3+'<span>/'+count1+'</span><span>(<em>'+del+'</em>)</span></strong><em><span><span>진척률</span><strong>'+nanValue2+'</strong>%</span><button type="button" class="pub-button-detail" aria-expanded="false"></button></em><ul class="pub-total-layer"><li class="end"><em>완료<span> (<strong>'+count2+'</strong>)</span></em><span><strong>'+nanValue1+'</strong>%</span></li><li class="ing"><em>퍼블중<span> (<strong>'+count5+'</strong>)</span></em><span><strong>'+nanValue4+'</strong>%</span></li><li class="wait"><em>대기<span> (<strong>'+count4+'</strong>)</span></em><span><strong>'+nanValue3+'</strong>%</span></li></ul>');

			//sorting
			$('.pub-header .pub-side .progress').append('<a href="javascript:void(0)" class="on"><strong>진행상태</strong></a><div style="display:block;"><ul><li class="end"><button type="button" data-value="option1_1"><em>완료</em></button></li><li class="ing"><button type="button" data-value="option1_4"><em>퍼블중</em></button></li><li class="wait"><button type="button" data-value="option1_3"><em>대기</em></button></li><li><button type="button" data-value="option1_6"><em>삭제</em></button></li><li><button type="button" data-value="option1_10"><em>지연</em></button></li><li><button type="button" data-value="option1_12"><em>V2</em></button></li></ul></div>');
			if (chk!='0') $('.pub-header .pub-record .pub-option li.ing').before('<li class="chk"><button type="button" data-value="option1_5"><em>검토중</em></button></li><li class="chk re"><button type="button" data-value="option1_7"><em>재검토중</em></button></li>');

			$('.pub-header .pub-side .progress button').each(function() {
				if ($(this).attr('data-value')=='option1_1') $(this).append(' <span>(<strong>'+(count2)+'</strong>)</span>'); //완료
				if ($(this).attr('data-value')=='option1_4') $(this).append(' <span>(<strong>'+(count5)+'</strong>)</span>'); //퍼블중
				if ($(this).attr('data-value')=='option1_5') $(this).append(' <span>(<strong>'+(count7)+'</strong>)</span>'); //검토중
				if ($(this).attr('data-value')=='option1_7') $(this).append(' <span>(<strong>'+(count8)+'</strong>)</span>'); //재검토중
				if ($(this).attr('data-value')=='option1_3') $(this).append(' <span>(<strong>'+(count4)+'</strong>)</span>'); //대기
				if ($(this).attr('data-value')=='option1_6') $(this).append(' <span>(<strong>'+(del)+'</strong>)</span>'); //삭제
				if ($(this).attr('data-value')=='option1_12') $(this).append(' <span>(<strong>'+(v2)+'</strong>)</span>'); //V2
			});
			$('.pub-header .pub-legend').each(function() {
				if (count6!='0') $(this).find('.pub-label').prepend('<li class="chk"><strong class="pub-alarm"><span>'+count6+'</span></strong><button type="button"><em>재/검토중</em></button></li>');
				if (endYesterday!='0') $(this).find('.end.yesterday').prepend('<strong class="pub-alarm"><span>'+endYesterday+'</span></strong>');
				else $(this).find('.end.yesterday button').attr('disabled', true);
				if (modifyYesterday!='0') $(this).find('.modify.yesterday').prepend('<strong class="pub-alarm"><span>'+modifyYesterday+'</span></strong>');
				else $(this).find('.modify.yesterday button').attr('disabled', true);
			});
		});
		$('.pub-site').each(function() {
			$(this).find('.pub-site-title').append('<div class="pub-total"></div>');
			if (!$(this).hasClass('nocount')) {
				var url=0, del=0, status=0, statusDel=0, wait=0, ing=0, check=0, checkre=0;
				$(this).find('.pub-tbody tr:not(.sb)').each(function() {
					if ($(this).length) url++;
				});
				$(this).find('.pub-tbody tr.del').each(function() {
					if ($(this).length) del++;
				});
				$(this).find('td.status').each(function() {
					if ($(this).html()!='') status++;
				});
				$(this).find('tr.del td.status').each(function() {
					if ($(this).html()!='') statusDel++;
				});
				$(this).find('tr.wait').each(function() {
					if ($(this).length) wait++;
				});
				$(this).find('tr.ing:not(.chk)').each(function() {
					if ($(this).length) ing++;
				});
				$(this).find('tr.chk').each(function() {
					if ($(this).length) check++;
				});
				$(this).find('tr.chk.re').each(function() {
					if ($(this).length) checkre++;
				});
				count1=(url);
				count2=(status-statusDel)-(wait)-(ing)-(check);
				count3=(status-statusDel+del)-(wait)-(ing);
				count4=(wait);
				count5=(ing);
				count6=(check-checkre);
				count7=(checkre);
				var nanValue=((count3)/count1*100).toFixed(1);
				if (isNaN(nanValue)) nanValue=0;

				//total
				if (chk!='0') $(this).find('h2>span').after('<p><strong>'+count3+'<span></span></strong><span>/</span><strong>'+count1+'<span></span></strong><em>(<span class="end">완료</span><strong>'+count2+'</strong>,<span class="chk">재/검토중</span><strong>'+(count6+count7)+'</strong>,<span class="ing">퍼블중</span><strong>'+count5+'</strong>,<span class="wait">대기</span><strong>'+count4+'</strong>,<span class="del">삭제</span><strong>'+del+'</strong>)</em></p>');
				else $(this).find('h2>span').after('<p><strong>'+count3+'</strong>/<strong>'+count1+'</strong><em>(<span class="end">완료</span><strong>'+count2+'</strong>,<span class="ing">퍼블중</span><strong>'+count5+'</strong>,<span class="wait">대기</span><strong>'+count4+'</strong>,<span class="del">삭제</span><strong>'+del+'</strong>)</em></p>');
				
				$(this).find('.pub-site-title .pub-total').prepend('<em><span><span>진척률</span><strong>'+nanValue+'</strong>%</span>');
				$(this).find('.pub-progress').append('<span style="width:'+nanValue+'%"></span>');
			}
		});

		//유형
		var types=new Array();
		$('.pub-site .pub-table .pub-tbody td.type').each(function(index, item) {
			var el=$(this),
				elText=el.text().toUpperCase();
			if (elText.length && !el.closest('tr').hasClass('del')) types.push($(item).text().toUpperCase());
			if ($(this).html()!='') el.html('<span>'+elText+'</span>');
		});
		if (types.length) {
			$('.pub-header .pub-side .type').append('<a href="javascript:void(0)"><strong>유형</strong></a><div><ul></ul></div>');
			var result=types.sort().reduce((accu, curr) => {
				accu.set(curr, (accu.get(curr)||0)+1);
				return accu;
			}, new Map());
			for (let [key, value] of result.entries()) {
				if (key.length) {
					$('.pub-header .pub-side .type ul').append('<li><button type="button" data-value="optionType"><span>'+key+'</span> ('+value+')</button></li>');
				} else {
					$('.pub-header .pub-side .type ul').prepend('<li><button type="button" data-value="optionType">TBD<span></span> ('+value+')</button></li>');
				}
			}
		}
		$('.pub-header .pub-side .type li span').each(function() {
			var el = $(this),
				elText = el.text();
			if (elText === 'F') el.after(' 메인');
			if (elText === 'T') el.after(' 탭');
			if (elText === 'P') el.after(' 팝업');
			if (elText === 'L') el.after(' 링크');
			if (elText === 'I') el.after(' 인크루드');
			if (elText === 'WP') el.after(' 새창');
			if (elText === 'CP') el.after(' 센터팝업');
			if (elText === 'FP') el.after(' 풀팝업');
			if (elText === 'BP') el.after(' 바텀팝업');
		});

		//완료예정일
		var wbs=new Array();
		$('.pub-site:not(.nocount) .pub-table .pub-tbody tr td.wbs').each(function(index, item) {
			var el=$(this),
				elText=el.text(),
				elDate=Number(elText.replace(/-/g,''));
			el.html('<em><span>'+elText+'</span></em>');
			if (!el.closest('tr').hasClass('del')) {
				if (today==elDate && !el.closest('tr').hasClass('del') && !el.closest('tr').hasClass('chk') && !el.closest('tr').hasClass('end') && el.find('span').html()!='') el.addClass('hurry');
				// if (today==elDate-1 && !el.closest('tr').hasClass('del') && !el.closest('tr').hasClass('chk') && !el.closest('tr').hasClass('end') && el.find('span').html()!='') el.addClass('hurry');
				if (today==nowLastDate && elDate==nextFirstDate && !el.closest('tr').hasClass('del') && !el.closest('tr').hasClass('chk') && !el.closest('tr').hasClass('end') && el.find('span').html()!='') el.addClass('hurry');
				if (today>elDate && !el.closest('tr').hasClass('del') && !el.closest('tr').hasClass('chk') && !el.closest('tr').hasClass('end') && el.find('span').html()!='') el.addClass('delay');
				wbs.push($(item).text().replace(/-/g,''));
			}
			if (el.find('span').html()!='') {
				var week2=week[new Date(elText).getDay()];
				el.find('em').append('('+week2+')');
			}
		});
		if (wbs.length) {
			$('.pub-header .pub-side .wbs').append('<a href="javascript:void(0)"><strong>완료예정일</strong></a><div><ul></ul></div>');
			var result=wbs.sort(function(a,b) { return b-a }).reduce((accu, curr) => {
				accu.set(curr, (accu.get(curr)||0)+1);
				return accu;
			}, new Map());
			for (let [key, value] of result.entries()) {
				if (key.length) {
					var key1 = key.slice(0,4)+'-'+key.slice(4,6)+'-'+key.slice(6,8);
					$('.pub-header .pub-side .wbs ul').append('<li><button type="button" data-value="optionDate"><span>'+key1+'</span> ('+value+')</button></li>');
				} else {
					$('.pub-header .pub-side .wbs ul').prepend('<li><button type="button" data-value="optionDate">TBD<span></span> ('+value+')</button></li>');
				}
			}
		}
		$('.pub-header .pub-side .wbs span').each(function() {
			var $this=$(this).text(),
				$thisText=$this.replace(/-/g,'');
			if($thisText==today) $(this).parent().addClass('today');
		});

		//작업자
		$('.pub-header .pub-side .pub-team').html('<a href="javascript:void(0)"><strong>작업자</strong></a><div class="pub-list"></div>');
		
		const works = ['publisher', 'designer', 'planner', 'developer'];
		const roleNames = {
			publisher: '퍼블',
			designer: '디자인',
			planner: '기획',
			developer: '개발',
		};

		works.forEach(type => {
			let dataArray = [];
			const name = eval(type + 's');

			if ($(`.pub-site .pub-table .pub-tbody td.${type}`).text().length) {
				const spanContent = name ? `<span>${name}(PL)</span>` : '';
				$('.pub-header .pub-side .pub-team .pub-list').append(`
					<div class="${type}">
						<em>${roleNames[type]} ${spanContent}</em>
						<ul></ul>
					</div>
				`);
			}

			$(`.pub-site:not(.nocount) .pub-table .pub-tbody tr:not(.del) td.${type}`).each(function() {
				const text = $(this).text().trim();
				dataArray.push(text);
				if (text.length) {
					$(this).html(`<span>${text}</span>`);
				}
			});

			if (dataArray.length) {
				const $result = dataArray.sort().reduce((accu, curr) => {
					accu.set(curr, (accu.get(curr)||0)+1);
					return accu;
				}, new Map());
				for (let [key, value] of $result.entries()) {
					if (key.length) {
						$(`.pub-header .pub-side .pub-team .pub-list div.${type} ul`).append(`<li><button type="button" data-value="option${type.charAt(0).toUpperCase() + type.slice(1)}"><span>${key}</span></button></li>`);
					} else {
						$(`.pub-header .pub-side .pub-team .pub-list div.${type} ul`).append(`<li><button type="button" data-value="option${type.charAt(0).toUpperCase() + type.slice(1)}">TBD (${value})</button></li>`);
					}
				}
			}
		});

		if ($('.pub-header .pub-side .pub-team ul').length!=1) $('.pub-header .pub-side .pub-team').addClass('on');
		if ($('.pub-header .pub-side .pub-team > div').text().length==0) $('.pub-header .pub-side .pub-team').remove();
		if ($('.pub-site .pub-table .pub-tbody tr').hasClass('sb')) $('.pub-header .pub-side .type ul').append('<li><button type="button" data-value="optionSB"><span>SB Version</button></li>');

		//항목
		$('.pub-site').each(function() {
			var $this=$(this);
			for (var i=1;i<=dep+1;i++) {
				var $deps=new Array();
				$this.find('.pub-table .pub-tbody td.dep'+i+'').each(function(index, item) {
					var $depi=$(this),
						$text=$depi.text(),
						$tr = $depi.closest('tr');
					if ($text.length && !$tr.hasClass('after')) {$deps.push($(item).text());}
				});
				if ($deps.length) {
					var $result=$deps.sort().reduce((accu, curr) => {
						accu.set(curr, (accu.get(curr)||0)+1);
						return accu;
					}, new Map());
					for (let [key, value] of $result.entries()) {
						$this.find('.pub-table .pub-thead th.dep'+i+' select').append('<option value="'+key+'">'+key+' ('+value+')</option>');
					}
				}
			}
			$this.find('.pub-table .pub-thead th[class*="dep"] select').on('change', function() {
				var $option=$(this),
					$idx=$option.parent().index()+1,
					$value=$option.find('option:selected').attr('value');
				if ($option.find('option:first').prop('selected') === true) {
					$this.find('.pub-table .pub-tbody tr').css('display', '');
					$this.find('.pub-table .pub-thead th[class*="dep"] select').removeClass('on');
				} else {
					$option.closest('th[class*="dep"]').siblings().find('select').find('option:first').prop('selected', true);
					$this.find('.pub-table .pub-thead th[class*="dep"] select').removeClass('on');
					$this.find('.pub-table .pub-tbody tr').each(function() {
						if ($value===$(this).find('td.dep'+$idx+'').text()) $(this).css('display', '');
						else $(this).hide();
					});
					$option.addClass('on');
				}
				var $tbody=$option.closest('.pub-site').find('.pub-tbody');
				var $scrOffset=$tbody.offset();
				var $navH=$('.pub-header .pub-nav').outerHeight();
				var $titleH=$('.pub-site .pub-site-title').outerHeight();
				var $theadH=$('.pub-site .pub-table .pub-thead').outerHeight();
				var $sTop=$(document).scrollTop();
				if (($navH+$titleH+$theadH) < $scrOffset.top-$sTop) {
					$('html, body').stop().animate({
						'scrollTop': $scrOffset.top - ($navH+$titleH+$theadH + 42) + 'px'
					}, 100);
				} else {
					$('html, body').stop().animate({
						'scrollTop': $scrOffset.top - (172 - 5) + 'px'
					}, 100);
				}
				resetRecord();
				resetSearch();
				resetLabel();
			});
		});

		$('.pub-site .pub-table .pub-tbody td.id').each(function() {
			var id=$(this).text(),
				url=$(this).closest('tr').find('.url').text(),
				type=$(this).closest('tr').find('.type').text(),
				size = $(this).closest('tr').find('.type').data('size'),
				path=window.location.href;
			if (ext=='html') {
				if ($(this).closest('tr').find('.url').html()=='') path=path.substring(0, path.lastIndexOf(id));
				else path='..'+path.substring(0, path.lastIndexOf(id));
			}
			if (ext=='xml') path=path.substring(0, path.lastIndexOf('=')+1);
			if (ext=='vue') path=path.substring(0, path.lastIndexOf(id));
			var href=path+url+id;
			var setHref = ext=='vue' ? href: href+'.'+ext;
			if ($(this).html()!='') {
				if(type === 'WP') $(this).html('<a href="'+setHref+'" class="winpop" data-size="'+size+'"><strong>'+id+'</strong></a>');
				else $(this).html('<a href="'+setHref+'" target="_blank"><strong>'+id+'</strong></a>');
			}
			$(this).find('a').on('click', function() {
				$('.pub-site .pub-table .pub-tbody td.id a').removeClass('active');
				$(this).addClass('active');
				//모바일뷰
				if ($('.pub-viewer').attr('aria-pressed')=='true') {
					if (!$('#isMobile').length) {
						$('.pub-mobile-frame .pub-screen .link').html('<a href="'+setHref+'" target="_blank"><strong>'+id+'</strong></a>');
						mobileFrameAction();
						$('.pub-mobile-frame .pub-iframe').html('<iframe src="'+setHref+'" frameborder="0">');
						setTimeout(function() {
							$('.pub-mobile-frame .pub-iframe iframe').contents().find('head').append('<style>body::-webkit-scrollbar {width:0;height:0;}</style>');
						}, 50);
						return false;
					}
				}
			});
		});
		$('.pub-site .pub-table .pub-tbody td.id a.winpop').click(function(e){
			e.preventDefault();
			var $this = $(this);
			var $href = $this.attr('href');
			var $name = $href.split('/').pop();
			var $size = $this.data('size').split(',');
			var $width = parseInt($size[0]);
			var $height = parseInt($size[1]);
			window.open($href, $name, 'width=' + $width + ', height=' + $height);
		});
		var idArray1=[];
		$('.pub-site .pub-table .pub-tbody td.id a').each(function(index, item) {
			var elText = $(this).text();
			if ($.inArray(elText, idArray1)===-1) idArray1.push(elText);
			else $(this).closest('tr').addClass('overlap-id');
		});
		var idArray2=[];
		$($('.pub-site .pub-table .pub-tbody td.id a').get().reverse()).each(function(index, item) {
			var elText = $(this).text();
			if ($.inArray(elText, idArray2)===-1) idArray2.push(elText);
			else $(this).closest('tr').addClass('overlap-id');
		});
		if ($('.pub-site .pub-table .pub-tbody tr.overlap-id').length) $('.pub-header .pub-side .type ul').append('<li><button type="button" data-value="optionID"><span>ID Overlap</button></li>');

		$('.pub-header .pub-label li.chk button').stop().on('click', function() {
			var el=$(this);
			$('html,body').animate({scrollTop: 0}, 200);
			if (!el.hasClass('on')) {
				resetRecord();
				resetDepth();
				resetLabel();
				$('.pub-header .pub-record .pub-option button.on').click();
				el.addClass('on');
				$('.pub-site .pub-table .pub-tbody tr:not([style*="none"]').each(function() {
					if ($(this).hasClass('chk')) {
						$(this).css('display','');
					} else {
						$(this).hide();
					}
				});
			} else {
				el.removeClass('on');
				$('.pub-site .pub-table .pub-tbody tr').css('display','');
				$('.pub-header .pub-record .pub-option button.on').click();
			}
			$('.pub-header .pub-label li.modify.yesterday button, .pub-header .pub-label li.end.yesterday button').removeClass('on');
		});
		$('.pub-header .pub-label li.end.yesterday button').stop().on('click', function() {
			var el=$(this);
			$('html,body').animate({scrollTop: 0}, 200);
			if (!el.hasClass('on')) {
				resetRecord();
				resetDepth();
				resetLabel();
				$('.pub-header .pub-record .pub-option button.on').click();
				el.addClass('on');
				$('.pub-site .pub-table .pub-tbody tr:not([style*="none"]').each(function() {
					if ($(this).find('td.status').hasClass('yesterday')) {
						$(this).css('display','');
					} else {
						$(this).hide();
					}
				});
			} else {
				el.removeClass('on');
				$('.pub-site .pub-table .pub-tbody tr').css('display','');
				$('.pub-header .pub-record .pub-option button.on').click();
			}
			$('.pub-header .pub-label li.modify.yesterday button, .pub-header .pub-label li.chk button').removeClass('on');
		});
		$('.pub-header .pub-label li.modify.yesterday button').stop().on('click', function() {
			var el=$(this);
			$('html,body').animate({scrollTop: 0}, 200);
			if (!el.hasClass('on')) {
				resetRecord();
				resetDepth();
				resetLabel();
				$('.pub-site .pub-table .pub-thead .modify button[aria-pressed="true"]').click();
				$('.pub-header .pub-record .pub-option button.on').click();
				el.addClass('on');
				$('.pub-site .pub-table .pub-tbody tr:not([style*="none"]').each(function() {
					if ($(this).find('td.modify li').hasClass('yesterday')) {
						$(this).css('display','');
						$(this).find('td.modify li').hide();
						$(this).find('td.modify li.yesterday').show();
					} else {
						$(this).hide();
					}
				});
			} else {
				el.removeClass('on');
				$('.pub-site .pub-table .pub-tbody tr').css('display','');
				$('.pub-site .pub-table .pub-tbody tr').find('td.modify li').css('display','');
				$('.pub-header .pub-record .pub-option button.on').click();
			}
			$('.pub-header .pub-label li.end.yesterday button, .pub-header .pub-label li.chk button').removeClass('on');
		});
		$('.pub-header .pub-record .pub-option button').on('click', function() {
			var el=$(this),
				elText=el.text();
				elText2=el.find('span').text();
			$('html,body').animate({scrollTop: 0}, 200);
			$('.pub-site .pub-table').parent().removeClass('fixed');
			$('.pub-site .pub-table .pub-tbody tr').each(function() {
				if (el.attr('data-value')=='optionAll') {
					$(this).css('display','');
				} else if (el.attr('data-value')=='option1_1') { //완료
					if (!$(this).closest('.pub-site').hasClass('nocount') && $(this).find('td.status').html()!='' && !$(this).hasClass('wait') && !$(this).hasClass('ing') && !$(this).hasClass('chk') && !$(this).hasClass('del') || $(this).hasClass('sb')) $(this).css('display','');
					else $(this).hide();
				} else if (el.attr('data-value')=='option1_5') { //검토중
					if (!$(this).closest('.pub-site').hasClass('nocount') && $(this).hasClass('chk') && !$(this).hasClass('chk re') && !$(this).hasClass('del') || $(this).hasClass('sb')) $(this).css('display','');
					else $(this).hide();
				} else if (el.attr('data-value')=='option1_7') { //재검토중
					if (!$(this).closest('.pub-site').hasClass('nocount') && $(this).hasClass('chk re') && !$(this).hasClass('del') || $(this).hasClass('sb')) $(this).css('display','');
					else $(this).hide();
				} else if (el.attr('data-value')=='option1_4') { //퍼블중
					if (!$(this).closest('.pub-site').hasClass('nocount') && $(this).hasClass('ing') && !$(this).hasClass('chk') && !$(this).hasClass('del') || $(this).hasClass('sb')) $(this).css('display','');
					else $(this).hide();
				} else if (el.attr('data-value')=='option1_3') { //대기
					if (!$(this).closest('.pub-site').hasClass('nocount') && $(this).hasClass('wait') && !$(this).hasClass('chk') && !$(this).hasClass('del') || $(this).hasClass('sb') && !$(this).hasClass('after')) $(this).css('display','');
					else $(this).hide();
				} else if (el.attr('data-value')=='option1_6') { //삭제
					if (!$(this).closest('.pub-site').hasClass('nocount') && $(this).hasClass('del') || $(this).hasClass('sb')) $(this).css('display','');
					else $(this).hide();
				} else if (el.attr('data-value')=='option1_10') { //지연
					if (!$(this).closest('.pub-site').hasClass('nocount') && $(this).find('td.wbs').hasClass('delay') && !$(this).hasClass('del') || $(this).hasClass('sb')) $(this).css('display','');
					else $(this).hide();
				} else if (el.attr('data-value')=='optionType') { //유형
					if ($(this).find('.type span').text()==elText2 || $(this).hasClass('sb')) $(this).css('display','');
					else $(this).hide();
				} else if (el.attr('data-value')=='optionDesigner') { //디자인
					if ($(this).find('.designer').text()==elText2 || $(this).hasClass('sb')) $(this).css('display','');
					else $(this).hide();
				} else if (el.attr('data-value')=='optionPlanner') { //기획
					if ($(this).find('.planner').text()==elText2 || $(this).hasClass('sb')) $(this).css('display','');
					else $(this).hide();
				} else if (el.attr('data-value')=='optionDeveloper') { //개발
					if ($(this).find('.developer').text()==elText2 || $(this).hasClass('sb')) $(this).css('display','');
					else $(this).hide();
				} else if (el.attr('data-value')=='optionPublisher') { //퍼블
					if ($(this).find('.publisher').text()==elText2 || $(this).hasClass('sb')) $(this).css('display','');
					else $(this).hide();
				} else if (el.attr('data-value')=='optionDate') { //완료예정일
					if (!$(this).closest('.pub-site').hasClass('nocount') && !$(this).hasClass('del') && $(this).find('.wbs span').text()==elText2 || $(this).hasClass('sb')) $(this).css('display','');
					else $(this).hide();
				} else if (el.attr('data-value')=='optionSB') { //스토리보드
					if ($(this).hasClass('sb')) $(this).css('display','');
					else $(this).hide();
				} else if (el.attr('data-value')=='optionID') { //아이디중복
					if ($(this).hasClass('overlap-id')) $(this).css('display','');
					else $(this).hide();
				} else if (el.attr('data-value')=='option1_12') { //V2
					if ($(this).hasClass('v2') || $(this).hasClass('sb')) $(this).css('display','');
					else $(this).hide();
				}
			});
		});
		$(document).on('click', '.pub-header .pub-record .pub-option a', function() {
			var el=$(this),
				spd=300;
			el.addClass('on').next().slideDown(spd).parent().siblings().find('a').removeClass('on').next().slideUp(spd);
		});

		$('.pub-mobile-frame .pub-screen button').on('click', function() {
			$('.pub-mobile-frame iframe').attr('src', $('.pub-mobile-frame iframe').attr('src'));
		});
		$('.pub-mobile-frame select').each(function() {
			frame();
			$(this).on('change', function() { frame(); });
		});
		function frame() {
			var el=$('.pub-mobile-frame select'),
				elFrame=el.closest('.pub-mobile-frame').find('.pub-iframe'),
				elOption=el.find('option:selected').val(),
				elOptionStr=elOption.split('*');
			el.attr('title', elOption);
			elFrame.css({'width': elOptionStr[0], 'height': elOptionStr[1]});
		}
		$('.pub-header .pub-side .progress button').each(function() {
			var delayCount=$('.pub-site .pub-table .pub-tbody td.delay').length;
			if ($(this).attr('data-value')=='option1_10') $(this).append(' <span>(<strong>'+(delayCount)+'</strong>)</span>'); //지연
		});
		$('.pub-site .pub-table .pub-tbody td.dep2').each(function() {
			elText=$(this).text();
			if (elText!=$(this).parent().next().find('td.dep2').text()) $(this).parent().next().addClass('first');
		});
		$('.pub-site .pub-table .pub-tbody tr').each(function() {
			if ((!$(this).closest('.pub-site').hasClass('nocount')) && (!$(this).hasClass('wait') && $(this).find('td.publisher').html()=='')) $(this).find('td.publisher').addClass('worker').html('TBD');
			if ((!$(this).closest('.pub-site').hasClass('nocount')) && ($(this).find('td.developer').html()=='')) $(this).find('td.developer').addClass('worker').html('TBD');
			thisDepth=new Array();
			prevDepth=new Array();
			var el=$(this),
				elDepTotal=el.children('td[class*=dep]').length;
			for (var i=1;i<=elDepTotal+1;i++) {
				thisDepth[i]=el.find('td.dep'+i);
				prevDepth[i]=el.prev('tr').find('td.dep'+i);
				if (thisDepth[i].text()!=prevDepth[i].text() || el.hasClass('first')) thisDepth[i].addClass('overlap-dep');
				else if (el.prev().hasClass('del') && !el.hasClass('del') && thisDepth[i].html()!='') thisDepth[i].addClass('overlap-dep');
			}

			//수정일자 중복체크
			const textValues = {};
			const duplicates = [];
			el.find('td.modify li > em span').each(function() {
				const text = $(this).text().trim();
				if (textValues[text]) {
					duplicates.push($(this));
				} else {
					textValues[text] = $(this);
				}
			});
			duplicates.forEach(span => {
				span.closest('ul').css('border', '2px solid blue');
			});
			if (duplicates.length > 0) {
				alert('수정일자가 중복되었습니다.\n한 날짜에 수정내역을 합쳐주세요.');
			}

			//수정일자 누락체크
			var hasMissingDates = false;
			el.find('td.modify li').each(function() {
				const $li = $(this);
				const text = $li.text().trim();
				if (text.match('undefined')) {
					$li.closest('ul').css('border', '2px solid red');
					hasMissingDates = true;
				}
			});
			if (hasMissingDates) {
				alert('수정일자가 누락되었습니다.');
			}
		});
		$('.pub-total .pub-button-detail').on('click', function() {
			if ($(this).attr('aria-expanded')=='false') {
				$('.pub-total .pub-button-detail').attr('aria-expanded', 'false');
				$('.pub-total').parent().parent().removeClass('on');
				$(this).attr('aria-expanded', 'true').closest('.pub-total').parent().parent().addClass('on');
			}
			else $(this).attr('aria-expanded', 'false').closest('.pub-total').parent().parent().removeClass('on');
		});
		$('.pub-header .pub-toggle').on('click', function() {
			$('.pub-nav .pub-all a').click();
			if ($(this).attr('aria-pressed')=='false') {
				$(this).attr('aria-pressed', 'true');
				$('.pub-site .pub-table').hide();
			} else {
				$(this).attr('aria-pressed', 'false');
				$('.pub-site .pub-table').show();
			}
		});

		//메뉴복사
		$('.pub-site .pub-table .pub-tbody td.id').each(function() {
			var el=$(this);
			el.append('<button type="button" class="pub-copy" title="메뉴복사"></button>')
		});
		$('.pub-site .pub-table .pub-tbody td .pub-copy').on('click', function() {
			var el=$(this),
				dep1=el.closest('.pub-site').find('.pub-site-title h2 > span').text(),
				dep2=el.closest('tr').find('td.dep2').text(),
				dep3=el.closest('tr').find('td.dep3').text(),
				dep4=el.closest('tr').find('td.dep4').text(),
				dep5=el.closest('tr').find('td.dep5').text(),
				dep6=el.closest('tr').find('td.dep6').text(),
				screen=el.closest('tr').find('td.screen').text(),
				id=el.closest('tr').find('td.id').text();
			if (dep2) var dep2=' > ' + dep2;
			if (dep3) var dep3=' > ' + dep3;
			if (dep4) var dep4=' > ' + dep4;
			if (dep5) var dep5=' > ' + dep5;
			if (dep6) var dep6=' > ' + dep6;
			if (screen) var screen=' > ' + screen;
			var screen=dep1+dep2+dep3+dep4+dep5+dep6+screen+" - "+id;
			$('body').append('<textarea id="pub-screen-textarea"></textarea>');
			$('#pub-screen-textarea').val(screen).select();
			document.execCommand('Copy');
			$('#pub-screen-textarea').remove();
			clipboardCopyMsg();
		});

		//모바일뷰
		var elFrame=$('.pub-mobile-frame'),
			elFrameInner=elFrame.find('.pub-mobile-frame-inr'),
			elWidth=elFrameInner.outerWidth(),
			btnWidth=$('.pub-frame-toggle').outerWidth();
		elFrame.css('visibility', 'visible');
		elFrameInner.css('right', -elWidth);
		$('.pub-viewer').on('click', function () {
			if ($(this).attr('aria-pressed')=='false') $(this).attr('aria-pressed', 'true');
			else $(this).attr('aria-pressed', 'false');
			var nowFrame=$('.pub-mobile-frame .pub-mobile-frame-inr'),
				nowWidth=nowFrame.outerWidth();
			if ($('.pub-viewer').attr('aria-pressed')=='true') nowFrame.css('right', -nowWidth + btnWidth);
			else $('.pub-mobile-frame').removeClass('on').find('.pub-mobile-frame-inr').css('right', -nowWidth);
		});
		elFrame.find('.pub-frame-toggle').on('click', function () {
			mobileFrameAction();
			var frame=$(this).closest('.pub-mobile-frame'),
				frameInner=frame.find('.pub-mobile-frame-inr'),
				width=frameInner.outerWidth();
			if (frame.hasClass('on')) frameInner.animate({ right: -width + btnWidth }, 0, function () {
				frame.removeClass('on');
			});
		});
		function mobileFrameAction() {
			elFrameInner.animate({right: 12}, 100, function () {
				elFrame.addClass('on');
			});
		}
		$(window).on('resize', function () {
			if ($('html').attr('id')=='isMobile') {
				if ($('.pub-viewer').attr('aria-pressed')=='true') elFrameInner.css('right', -elFrameInner.outerWidth() + btnWidth);
				else elFrameInner.css('right', -elFrameInner.outerWidth() - btnWidth);
				elFrame.removeClass('on');
			}
		});

		$('.pub-modify-open').off('click').on('click', function (e) {
			if ($('.pub-modify-open').hasClass('on')) {
				$('.pub-modify-open').removeClass('on');
				$('.pub-content').show();
				$('.pub-modify').hide();
			} else {
				$('.pub-modify-open').addClass('on');
				$('.pub-content').hide();
				$('.pub-modify').show();
				showModifyList();
			}
		});

		//수정이력창
		var groupBy=function groupBy(data, key) {
			return data.reduce(function (carry, el) {
				var $group=el[key];
				if (carry[$group]==undefined) carry[$group]=[];
				carry[$group].push(el);
				return carry;
			}, {});
		};
		function showModifyList(groupByDeveloper = false) {
			var a=$('.pub-site .pub-table .pub-tbody tr:not(.del, .ing) .modify span')
				.filter(':contains(20)')
				.toArray()
				.map(function (el) {
				var $this=$(el);
				var $li=$this.closest('li');
				var $title=$this.closest('.pub-site').find('.pub-site-title h2>span');
				var $tr=$this.closest('tr');
				var $date=$this.text().trim().split('(')[0];
				var $modify=$li.find('p').text().trim();
				var $id2=$tr.find('.id a');
				var $id=$id2.text();
				var $url2=$tr.find('td.url');
				var $url=$url2.text();
				var $path=window.location.href;
				var $dep='';
				var $developer;

				if (ext=='html') {
					if ($url2.html()=='') $path=$path.substring(0, $path.lastIndexOf($id));
					else $path='..'+$path.substring(0, $path.lastIndexOf($id));
					var $href=$path+$url+$id;
					if ($id2.html()!='') {
						$href=('<a href="'+$href+'.'+ext+'" target="_blank"><strong>'+$id+'<strong></a>');
					}
				}
				if (ext=='vue') {
					if ($url2.html()=='') $path=$path.substring(0, $path.lastIndexOf($id));
					else $path='..'+$path.substring(0, $path.lastIndexOf($id));
					var $href=$url+$id;
					if ($id2.html()!='') {
						$href=('<a href="'+$href+'" target="_blank"><strong>'+$id+'<strong></a>');
					}
				}
				if (ext=='xml') {
					$path=$path.substring(0, $path.lastIndexOf('=')+1);
					var $href=$path+$url+$id;
					if ($id2.html()!='') {
						$href=('<a href="'+$href+'.'+ext+'" target="_blank"><strong>'+$id+'<strong></a>');
					}
				}

				if (groupByDeveloper) {
					if (dev!=0) {
						if ($title.text()) $dep += $title.text();
						$developer = $tr.find('.developer').text();
						['dep2', 'dep3', 'dep4', 'dep5', 'dep6', 'screen'].forEach(function(depClass) {
							if ($tr.find('.' + depClass).text()) {
								$dep += '<span> > </span>' + $tr.find('.' + depClass).text();
							}
						});
					} else {
						$developer = $tr.closest('.pub-site').find('.pub-site-title h2>span').text();
						$dep += '' + $tr.find('.dep2').text();
						['dep3', 'dep4', 'dep5', 'dep6', 'screen'].forEach(function(depClass) {
							if ($tr.find('.' + depClass).text()) {
								$dep += '<span> > </span>' + $tr.find('.' + depClass).text();
							}
						});
					}
				} else {
					if (dev!=0) {
						if ($title.text()) $dep += $title.text();
						$developer = $tr.find('.developer').text();
						['dep2', 'dep3', 'dep4', 'dep5', 'dep6', 'screen'].forEach(function(depClass) {
							if ($tr.find('.' + depClass).text()) {
								$dep += '<span> > </span>' + $tr.find('.' + depClass).text();
							}
						});
					} else {
						if (dep > 2) {
							$developer1 = $tr.closest('.pub-site').find('.pub-site-title h2>span').text();
							$developer2 = $tr.find('.dep2').text();
							$developer = $developer1 + ' > ' + $developer2;
							$dep += '' + $tr.find('.dep3').text();
							['dep4', 'dep5', 'dep6', 'screen'].forEach(function(depClass) {
								if ($tr.find('.' + depClass).text()) {
									$dep += '<span> > </span>' + $tr.find('.' + depClass).text();
								}
							});
						} else {
							$developer1 = $tr.closest('.pub-site').find('.pub-site-title h2>span').text();
							$developer2 = $tr.find('.dep2').text();
							$developer = $developer1 + ' > ' + $developer2;
							$dep += '' + $tr.find('.screen').text();
						}
					}
				}

				$dep = $dep.trim();
				return { date: $date, developer: $developer, dep: $dep, modify: $modify, href: $href };
			});

			function groupAndSortData(data, primaryGroupKey, secondaryGroupKey) {
				const groupedData = groupBy(data, primaryGroupKey);
				const result = [];

				for (const primaryKey in groupedData) {
					const secondaryGroupedData = groupBy(groupedData[primaryKey], secondaryGroupKey);

					let sortedSecondaryGroups;
					if (primaryGroupKey === 'developer') {
						sortedSecondaryGroups = Object.keys(secondaryGroupedData)
							.sort((a, b) => b.localeCompare(a));
					} else {
						sortedSecondaryGroups = Object.keys(secondaryGroupedData)
							.sort();
					}

					const sortedSecondaryGroupObject = sortedSecondaryGroups.reduce((acc, key) => {
						acc[key] = secondaryGroupedData[key];
						return acc;
					}, {});

					result.push({
						[primaryGroupKey]: primaryKey,
						group: sortedSecondaryGroupObject,
						count: groupedData[primaryKey].length
					});
				}

				result.sort((a, b) => {
					if (primaryGroupKey === 'developer') {
						return b[primaryGroupKey].localeCompare(a[primaryGroupKey]);
					} else if (primaryGroupKey === 'date') {
						return new Date(b[primaryGroupKey]) - new Date(a[primaryGroupKey]);
					}
					return 0;
				});
				return result;
			}

			var result = groupByDeveloper ? groupAndSortData(a, 'developer', 'date') : groupAndSortData(a, 'date', 'developer');

			var $resultObj = result.map(function(groupData) {
				var list = '';
				Object.keys(groupData.group).forEach(function(groupKey) {
					var content = groupData.group[groupKey].map(function(item) {
						return '● ' + item.dep + '<br>\n' + item.href + '<br>\n' + item.modify + '<br><br>';
					}).join('\n\n');

					list += '\n\n<br><div class="mb2-' + groupKey + '"><em>' + (groupByDeveloper ? '' + groupKey + '<button type="button" class="pub-modify-copy2"></button>' : '[' + groupKey + ']<button type="button" class="pub-modify-copy2"></button>') + '</em>\n' + content + '</div>\n';
				});
				return {
					label: groupData[groupByDeveloper ? 'developer' : 'date'],
					list: list,
					count: groupData.count
				}
			});

			var $resultHTMLHead = $resultObj.map(function(html, index) {
				return '<option' + (index === 0 ? ' selected' : '') + ' title="' + html.count + '">' + html.label + '</option>';
			}).join('');

			var $resultHTMLBody = $resultObj.map(function(html) {
				return '<div class="mb-' + html.label + '"><mark><strong>' + (groupByDeveloper ? '[' + html.label + ']' : html.label) + '</strong></mark><br>' + html.list + '</div>';
			}).join('');

			$('.pub-modify').html('<div class="pub-modify-inr"><select multiple>' + $resultHTMLHead + '</select><div class="pub-modify-list">' + $resultHTMLBody + '</div><p class="pub-msg">※ 업데이트후 수정일(YYYY-MM-DD)을 검색해주세요. (동일 수정일이 존재할 수 있으니 전체적으로 검색)</p></div><button type="button" class="pub-modify-copy">전체복사</button><button type="button" class="pub-modify-close" title="닫기"><span></span><span></span><span></span></button>');

			if (dev!=0) $('.pub-modify').prepend('<div class="pub-radio"><span><input type="radio" name="view-option" value="date" id="pub-radio1"' + (!groupByDeveloper ? ' checked' : '') + '><label for="pub-radio1">수정일로 보기</label></span><span><input type="radio" name="view-option" value="developer" id="pub-radio2"' + (groupByDeveloper ? ' checked' : '') + '><label for="pub-radio2">개발자로 보기</label></span></div>');
			else $('.pub-modify').prepend('<div class="pub-radio"><span><input type="radio" name="view-option" value="date" id="pub-radio1"' + (!groupByDeveloper ? ' checked' : '') + '><label for="pub-radio1">수정일로 보기</label></span><span><input type="radio" name="view-option" value="developer" id="pub-radio2"' + (groupByDeveloper ? ' checked' : '') + '><label for="pub-radio2">메뉴별로 보기</label></span></div>');

			$('.pub-modify .pub-modify-inr > select').off('change').on('change', function(e) {
				var $this = $(this);
				var $value = $this.val();
				var $list = $this.next().find('>div');
				$list.hide();
				if ($value != null) {
					$value.forEach(function(item) {
						$('.pub-modify-list').find('[class*="mb-' + item + '"]').show();
					});
				}
				$('.pub-modify .pub-modify-list').scrollTop(0);
			}).trigger('change');

			$('input[name="view-option"]').change(function() {
				var selectedOption = $(this).val();
				if (selectedOption === 'date') {
					showModifyList(false);
				} else if (selectedOption === 'developer') {
					showModifyList(true);
					$('.pub-modify-inr > select')[0].selectedIndex = 0;

					var selectedDeveloper = $('.pub-modify-inr > select').val();
					$('.pub-modify-list > .mb-' + selectedDeveloper).show();
				}
			});

			$('.pub-modify .pub-modify-list mark, .pub-modify .pub-modify-list em, .pub-modify .pub-modify-inr > select option').each(function () {
				var $this=$(this);
				var $text=$this.text();
				var $date=$text.replace(/-/g,'');
				if ($date==today) $this.addClass('today');
				else if ($date==today-1) $this.addClass('yesterday');
				else if (day=='01' && $date==prevLastDate) $this.addClass('yesterday');
				else if (dayOfWeek==monday && $date==today-2) $this.addClass('yesterday');
				else if (dayOfWeek==monday && $date==today-3) $this.addClass('yesterday');
				else if (dayOfWeek==monday && day=='01' && $date==prevLastDate) $this.addClass('yesterday');
				else if (dayOfWeek==monday && day=='01' && $date==prevLastDate-1) $this.addClass('yesterday');
				else if (dayOfWeek==monday && day=='01' && $date==prevLastDate-2) $this.addClass('yesterday');
				else if (dayOfWeek==monday && day=='02' && $date==prevLastDate) $this.addClass('yesterday');
				else if (dayOfWeek==monday && day=='02' && $date==prevLastDate-1) $this.addClass('yesterday');
				else if (dayOfWeek==monday && day=='03' && $date==prevLastDate) $this.addClass('yesterday');
			});
			$('.pub-modify-copy').off('click').on('click', function(e) {
				var $text=$('.pub-modify .pub-modify-list>div:visible').text();
				$('body').append('<textarea id="pub-modify-textarea"></textarea>');
				$('#pub-modify-textarea').val($text).select();
				document.execCommand('Copy');
				$('#pub-modify-textarea').remove();
				clipboardCopyMsg();
			});
			$('.pub-modify-copy2').off('click').on('click', function(e) {
				var $this = $(this);
				var $list = $this.closest('div[class*="mb2-"]').text();
				var $mark = $this.closest('div[class*="mb-"]').find('mark').text();
				var $text = $mark + '\n\n' + $list;
				console.log($mark);
				$('body').append('<textarea id="pub-modify-textarea"></textarea>');
				$('#pub-modify-textarea').val($text).select();
				document.execCommand('Copy');
				$('#pub-modify-textarea').remove();
				clipboardCopyMsg();
			});

			$('.pub-modify .pub-modify-list [class*="mb-"] [class*="mb2-"] a').on('click', function() {
				$('.pub-modify .pub-modify-list [class*="mb-"] [class*="mb2-"] a').removeClass('active');
				$(this).addClass('active');
			});
		}
		$(document).on('click', '.pub-modify-close', function () {
			$('.pub-modify-open').click();
		});

		$(document).bind('mouseup touchend', function(e) {
			var target=$('.pub-total');
			if (!target.is(e.target) && target.has(e.target).length==0) $('.pub-total .pub-button-detail').attr('aria-expanded', 'false').closest('.pub-total').parent().parent().removeClass('on');
			var target=$('.pub-record');
			if (!target.is(e.target) && target.has(e.target).length==0) {
				$('.pub-record>button').attr('aria-expanded', 'false').next().slideUp(200);
				setTimeout(function() {
					if ($('.pub-record .pub-option>button').hasClass('on')) {
						$('.pub-record a').removeClass('on').next().hide();
						$('.pub-record .progress a').addClass('on').next().show();
					} else {
						$('.pub-record button.on').closest('div').show().prev().addClass('on').parent().siblings().find('a.on').removeClass('on').next().hide();
					}
				}, 300);
			}
		});

		//csv 파일 다운로드
		$('.pub-csv-down').off('click').on('click', function (e) {
			e.preventDefault();
			if(typeof pub_index_data === 'undefined'){
				console.error('pub_index_data json 목록이 없습니다.');
				return
			}
			if(pub_index_data.length === 0){
				console.error('pub_index_data json 목록 비엿습니다.');
				return
			}

			const csvData = jsonToCSV(pub_index_data);
			const fileTxt = $('.pub-tab.on').length ? $('.pub-tab.on').text() + '_' : '';
			const bom = '\uFEFF';
			const blob = new Blob([bom+csvData], {type: 'text/csv;charset=utf-8;'});
			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = fileTxt+'json_data.csv';
			link.click();
		});
		function jsonToCSV(jsonData){
			const excludedHeaders = ['COUNT', 'URL', 'WBS', 'SB', 'MEMO', 'MODIFY'];
			if (dev === '0') excludedHeaders.push('DEV');
			if (dgn === '0') excludedHeaders.push('DGN');
			if (pla === '0') excludedHeaders.push('PLA');

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
		}

		/* 검색 */
		function isCho(e) {
			var t = /[ㄱ-ㅎ]/gi;
			return t.test(e)
		}
		function cho_hangul(e) {
			for (cho = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"], result = "", i = 0; i < e.length; i++) code = e.charCodeAt(i) - 44032, code > -1 && code < 11172 ? result += cho[Math.floor(code / 588)] : result += e.charAt(i);
			return result
		}
		function resetStart(){
			$('.pub-site .pub-table .pub-tbody tr').show();
			$('td[class*="dep"] span, td.screen span, td.id strong, td.publisher, td.designer, td.planner, td.developer, td.memo').each(function() {
				$(this).html($(this).text());
			}); 
		}
		$('.pub-header .pub-search .pub-search-btn').on('click', function() {
			resetStart();
			resetRecord();
			resetLabel();
			var $this=$(this),
				$input=$this.prev(),
				elVal=$input.val().toLowerCase(),
				elValSpacing=$input.val().toLowerCase().replace(' ','');
			if ($('.pub-site .pub-table .pub-thead th select').hasClass('on')) resetDepth();
			$('.pub-site .pub-table .pub-tbody tr').filter(function() {
				if (isCho(elVal)) {
					 $(this).toggle($(this).text().toLowerCase().indexOf(elVal) > -1 || (cho_hangul($(this).text().toLowerCase()).toLowerCase().indexOf(cho_hangul(elVal)) > -1));
					 $(this).toggle($(this).text().toLowerCase().replace(' ','').indexOf(elValSpacing) > -1 || (cho_hangul($(this).text().toLowerCase()).toLowerCase().replace(' ','').indexOf(cho_hangul(elValSpacing)) > -1));
				} else {
					$(this).toggle($(this).text().toLowerCase().indexOf(elVal) > -1);
					$(this).toggle($(this).text().toLowerCase().replace(' ','').indexOf(elValSpacing) > -1);
				}
			});
			var highlight=$('td[class*="dep"] span:contains("'+elVal+'"), td.screen span:contains("'+elVal+'"), td.id strong:contains("'+elVal+'"), td.publisher:contains("'+elVal+'"), td.designer:contains("'+elVal+'"), td.planner:contains("'+elVal+'"), td.developer:contains("'+elVal+'"), td.memo:contains("'+elVal+'")');
			highlight.each(function () {
				var regex = new RegExp(elVal,'gi');
				$(this).html( $(this).text().replace(regex, "<i class='pub-highlight'>"+elVal+"</i>") );
			});
		});
		$('.pub-header .pub-search input').keyup(function(key) {
			// if ($(this).val().trim()=='' || key.keyCode==13) $('.pub-header .pub-search .pub-search-btn').click();
			if (key.keyCode==13) $('.pub-header .pub-search .pub-search-btn').click();
		});

		$(document).on('click', '.pub-header .pub-unlock', function() {
			resetRecord();
			resetDepth();
			resetLabel();
		});

		//초기화
		function resetRecord(){
			$('.pub-header .pub-record .pub-option>button').addClass('on').parent().prev().removeClass('on').html('# 전체');
			$('.pub-header .pub-record .pub-option>button').next('.pub-option-inr').find('button').removeClass('on');
			$('.pub-header .pub-record .pub-option>button').next('.pub-option-inr').find('a').removeClass('on').next().hide();
			$('.pub-header .pub-record .pub-option>button').next('.pub-option-inr').find('.progress a').addClass('on').next().show();
			$('.pub-site .pub-table .pub-tbody tr').find('td.modify li').css('display','');
		}
		function resetSearch(){
			$('.pub-header .pub-search input').val('');
		}
		function resetDepth(){
			$('.pub-site .pub-table .pub-thead th select').removeClass('on').find('option:first').prop('selected', true);
			$('.pub-site .pub-table .pub-tbody tr').css('display', '');
		}
		function resetDepth2(){
			$('.pub-site .pub-table .pub-thead th select').removeClass('on').find('option:first').prop('selected', true);
		}
		function resetLabel(){
			$('.pub-header .pub-label button').removeClass('on');
			$('.pub-site .pub-table .pub-tbody tr').find('td.modify li').css('display','');
		}
	}

	/* GUIDE */
	if ($('.pub-wrap').attr('data-layout')=='guide') {
		$('.pub-site .pub-template').each(function() {
			if ($(this).find('.pub-code').length) $(this).find('.pub-code').append('<button type="button" class="pub-copy" title="Copy Code"><span></span></button>');
		});
		$('.pub-site .pub-site-content .pub-code').each(function() {
			var code=$(this).find('.pub-pre').html();
			if($(this).find('pre').length) var code=code.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');
			$(this).find('.pub-copy').on('click', function() {
				$('body').append('<textarea id="pub-code-textarea"></textarea>');
				$('#pub-code-textarea').val(code).select();
				document.execCommand('Copy');
				$('#pub-code-textarea').remove();
				clipboardCopyMsg();
			});
		});
	}

	/* CONVENTION */
	if ($('.pub-wrap').attr('data-layout').indexOf('direction')!=-1) {
		$('.pub-version').on('click', function() {
			$(this).toggleClass('on');
		});
		$(document).bind('mouseup touchend', function(e) {
			var target=$('.pub-version');
			if (!target.is(e.target) && target.has(e.target).length==0) $('.pub-version').removeClass('on');
		});
	}

	/* COMMON */
	var pub_global='';
		pub_global += '<div class="pub-global">';
			pub_global += '<ul>';
				pub_global += '<li><a href="guide.html"><span>가이드</span></a></li>';
				pub_global += '<li><a href="convention.html"><span>작업규칙</span></a></li>';
				pub_global += '<li><a href="accessibility.html"><span>접근성</span></a></li>';
			pub_global += '</ul>';
			pub_global += '<button type="button" class="pub-global-close on"><span></span><span></span><span></span></button>';
		pub_global += '</div>';
	var pub_nav='';
		pub_nav += '<div class="pub-nav">';
			pub_nav += '<div class="pub-nav-inr">';
				pub_nav += '<div class="pub-all"><a href="#menu0" class="on"><span>전체</span></a></div>';
				pub_nav += '<div class="pub-menu"></div>';
			pub_nav += '</div>';
		pub_nav += '</div>';
	if ($('.pub-wrap').attr('data-layout')!='index') {
		$('.pub-header').append(pub_global);
		$('.pub-global a').each(function() {
			var el=$(this),
				elVal=el.attr('href'),
				elVal=elVal.slice(0, elVal.length-5);
			if ($('.pub-wrap').attr('data-layout').indexOf(elVal)!=-1) el.addClass('on');
		});
	}
	$('.pub-header .pub-title').after(pub_nav);

	function device() {
		var filter="win16|win32|win64|mac";
		var isMobile=navigator.userAgent.match(/Android|Mobile|iP(hone|od|ad)|BlackBerry|IEMobile|kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/) || filter.indexOf(navigator.platform.toLowerCase()) < 0 ? true : false;
		if (isMobile) $('html').attr('id', 'isMobile');
		else $('html').removeAttr('id', 'isMobile').find('body').removeClass('pub-nav-up').addClass('pub-nav-down');
	} device();
	$(window).on('resize', function() { device(); });

	var didScroll,
		lastScrollTop=0,
		delta=0;
	$(window).scroll(function(event) {
		didScroll=true;
	});
	setInterval(function() {
		if (didScroll) {
			hasScrolled();
			didScroll=false;
		}
	}, 100);

	function hasScrolled() {
		var st=$(this).scrollTop();
		if (Math.abs(lastScrollTop - st) <= delta) {return;}
		if (st>lastScrollTop) { //Scroll Down
			$('body').removeClass('pub-nav-down').addClass('pub-nav-up');
			$('.pub-page-top').removeClass('on');
		}
		else if (st + $(window).height() + 100 < $(document).height()) { //Scroll Up
			$('body').removeClass('pub-nav-up').addClass('pub-nav-down');
			$('.pub-page-top').addClass('on');
		}
		if ($(document).scrollTop() <= delta + 10) { //최상단
			$('body').removeClass('pub-nav-down').addClass('pub-nav-top');
			$('.pub-page-top').removeClass('on');
		}
		else $('body').removeClass('pub-nav-top');
		if (st == $(document).height() - $(window).height()) { //최하단
			$('body').addClass('pub-nav-bottom');
		}
		else $('body').removeClass('pub-nav-bottom');
		lastScrollTop=st;
	}
	$(window).on('scroll', function() {
		scrollProgress();
		$('.pub-header .pub-legend .pub-global-btn').attr('aria-expanded', 'false');
		$('.pub-header .pub-global').removeClass('on');
	});
	$('.pub-header').append('<div class="pub-scroll-progress"><div></div></div>');
	$('.pub-wrap').append('<div class="pub-page-top"><button type="button"></button></div>');
	function scrollProgress() {
		if (($(document).outerHeight()-$(window).height())<1) currentPercentage=0;
		else currentPercentage=($(window).scrollTop()/($(document).outerHeight()-$(window).height()))*100;
		$('.pub-scroll-progress div').width(currentPercentage+'%');
	}
	$('.pub-header .pub-legend .pub-global-btn').on('click', function() {
		$(this).attr('aria-expanded', 'true');
		$('.pub-header .pub-global').addClass('on');
	});
	$('.pub-header .pub-global .pub-global-close').on('click', function() {
		$('.pub-header .pub-legend .pub-global-btn').attr('aria-expanded', 'false');
		$('.pub-header .pub-global').removeClass('on');
	});
	$('.pub-header .pub-global li a').on('click', function() {
		if ($(this).hasClass('on')) return false;
	});
	$('.pub-site').each(function() {
		var index=$('.pub-site').index($(this)[0]);
		$(this).attr('id','menu'+index);
	});
	$('.pub-header .pub-nav .pub-menu').each(function() {
		var el=$(this),
			arrtabhtml=[],
			i=0;
		$('.pub-site .pub-site-title h2>span').each(function() {
			var text=$(this).text();
			arrtabhtml.push('<li><a href=\'#\' title=\''+text+'\'><span>'+text+'</span></a></li>');
			i++
		});
		if ($('.pub-site .pub-site-title h2>span').length>0) el.append('<ul>'+arrtabhtml.join('\n')+'</ul>');
	});
	$('.pub-header .pub-nav li').each(function() {
		var index=$('.pub-nav li').index($(this)[0]);
		$(this).find('> a').attr('href','#menu'+index);
	});
	$('.pub-header .pub-nav a').on('click', function(e) {
		e.preventDefault();
		scrollProgress();
		if ($(this).hasClass('on')) return;
		$('.pub-header').removeClass('pub-nav-up');
		if (!$(this).parent().hasClass('pub-all')) {
			var viewBox=$(this).attr('href');
			$('.pub-site').fadeOut(0);
			$('.pub-site'+viewBox).fadeIn(100);
			$('.pub-site .pub-table>table').show();
		}
		else $('.pub-site').fadeIn(100);
		$(this).closest('.pub-nav').find('a').removeClass('on');
		$(this).addClass('on');
		$('html,body').animate({scrollTop:0}, 0);

		var menu=$(this);
		if(menu.closest('.pub-all').length){
			setUrlParamsMU(false);
		}else{
			const $li = menu.closest('li');
			const $idx = $li.index();
			setUrlParamsMU('tab', $idx);
		}
		var scrItem=$('.pub-menu li');
		var scrIWidth=0;
		for (var i=0; i<scrItem.length; i++) scrIWidth+=scrItem.eq(i)[0].getBoundingClientRect().width;
		var target=menu.parent();
		muCenter(target);
		function muCenter(target){
			var box=menu.closest('.pub-nav-inr');
			var boxItem=box.find('li');
			var boxHarf=box.width()/2;
			var pos;
			var listWidth=0;
			var targetLeft=0;
			boxItem.each(function(){ listWidth+=$(this)[0].getBoundingClientRect().width; });
			for (var i=0; i<target.index(); i++) targetLeft+=boxItem.eq(i)[0].getBoundingClientRect().width; // 선택요소 까지 길이
			var selectTargetPos=(targetLeft+target.outerWidth()/2);
			if (selectTargetPos<=boxHarf) pos=-50; // left
			else if (listWidth-selectTargetPos<=boxHarf) pos=listWidth-box.width()+30; //right : target 절반 이후 영역이 boxHarf 보다 작을경우 right 정렬
			else pos=selectTargetPos-boxHarf; // 중앙정렬
			box.animate({scrollLeft:pos+50}, 300);
		}
		$(window).scroll();
	});

	/* TOP */
	$('.pub-page-top>button').on('click', function() {
		$('html,body').animate({scrollTop: 0}, 100);
	});

	function clipboardCopyMsg() {
		$('body').append('<div class="clipboard" style="display:none;position:fixed;left:50%;top:50%;z-index:99999;padding:50px 60px;background-color:#fff;border-radius:5px;box-shadow:0 3px 5px 0 rgba(0,0,0,.2);font-size:14px;color:#111;transform:translate3d(-50%,-50%,0);">클립보드에 복사되었습니다.</div>');
		$('.clipboard').fadeIn(100);
		setTimeout(function() {
			$('.clipboard').fadeOut(300).remove();
		}, 600);
	}

	loadingBarEnd();

	let $tab = getUrlParamsMU().tab;
	if($tab){
		$tab = parseInt($tab);
		$('.pub-header .pub-nav .pub-menu > ul > li').eq($tab).find('a').click();
	}
}, 50);

//파라미터 값 갖고오기
function getUrlParamsMU() {
	const params = {};
	window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
		params[key] = value;
	});
	return params;
};

function setUrlParamsMU(key, value){
	const currentUrl = new URL(window.location.href);
	const params = new URLSearchParams(currentUrl.search);
	let newUrl = currentUrl.pathname;
	if(key){
		params.set(key, value);
		newUrl = newUrl+'?'+params.toString();
	}
	history.pushState(null, '', newUrl);
}
