$(document).ready(function () {
	Layer.init();
	deviceCheck();
	htmlnclude();
	common.init();
	buttonUI();
	btnTopUI();
	formUI();
	tabUI();
	tableUI();
	scrollItem();
	multiSwiper();
	todayPopUI();
});


//글자바꾸기
$.fn.changeTxt = function (beforeTxt, afterTxt) {
	var element = this;
	element.html(element.html().split(beforeTxt).join(afterTxt));
	//element.html(element.html().replace(beforeTxt, afterTxt));
};

/* 디바이스, 브라우제 제크 */
var deviceCheck = function () {
	isMobile.check();
	isPC.check();
	if (isMobile.any()) {
		var $pixelRatio = window.devicePixelRatio;
		if (!!$pixelRatio) $('html').addClass('pixelRatio' + $pixelRatio);
	}
};

var isMobile = {
	Android: function (){
		return navigator.userAgent.match(/Android/i) == null ? false : true;
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i) == null ? false : true;
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i) == null ? false : true;
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i) == null ? false : true;
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i) == null ? false : true;
	},
	any: function () {
		return (isMobile.Android() || isMobile.i0S() || isMobile.BlackBerry() || isMobile.Opera() || isMobile.Windows());
	},
	check: function () {
		if (isMobile.any()) {
			if (isMabile.iOS()) $('html').addClass('ios');
			if (isMobile.Android()) $('html').addClass('android');
		}
	}
};


var isPC = {
	window: function () {
		return navigator.userAgent.match(/windows/i) == null ? false : true;
	},
	mac: function () {
		return navigator.userAgent.match(/macintosh/i) == null ? false : true;
	},
	chrome: function () {
		return navigator.userAgent.match(/chrome/i) == null ? false : true;
	},
	firefox: function () {
		return navigator.userAgent.match(/firefox/i) == null ? false : true;
	},
	opera: function () {
		return navigator.userAgent.match(/opera|OPR/i) == null ? false : true;
	},
	safari: function () {
		return navigator.userAgent.match(/safari/i) == null ? false : true;
	},
	edge: function () {
		return navigator.userAgent.match(/edge/i) == null ? false : true;
	},
	msie: function () {
		return navigator.userAgent.match(/rv:11.0|msie/i) == null ? false : true;
	},
	ie11: function () {
		return navigator.userAgent.match(/rv:11.0/i) == null ? false : true;
	},
	ie10: function () {
		return navigator.userAgent.match(/msie 10.0/i) == null ? false : true;
	},
	ie9: function () {
		return navigator.userAgent.match(/msie 9.0/i) == null ? false : true;
	},
	ie8: function () {
		return navigator.userAgent.match(/msie 8.0/i) == null ? false : true;
	},
	any: function () {
		return (isPC.window() || isPC.mac());
	},
	check: function () {
		if (isPC.any()) {
			if (isPC.window()) $('html').addClass('window');
			if (isPC.mac()) $('html').addClass('mac');
			if (isPC.ie11()) $('html').addClass('ie11');
			if (isPC.ie10()) $('html').addClass('ie10');
			if (isPC.ie9()) $('html').addClass('ie9');
			if (isPC.ie8()) $('html').addClass('ie8');
			if (isPC.edge()) {
				$('html').addClass('edge');
			} else if (isPC.opera()) {
				$('html').addClass('opera');
			} else if (isPC.chrome()) {
				$('html').addClass('chrome');
			} else if (isPC.safari()) {
				$('html').addClass('safari');
			} else if (isPC.firefox()) {
				$('html').addClass('firefox');
			}
		}
	}
};

//Html include
var htmlnclude = function () {
	var $elements = $.find('*[data-include-html]');
	if ($elements.length) {
		$.each($elements, function () {
			var $this = $(this),
				$html = $this.data('include-html'),
				$htmlAny = $html.split('/'),
				$htmlFile = $htmlAry[$htmlAry.length - 1];
			$this.load($html, function (res, sta, xhr) {
				if (sta == 'success') {
					console.log('Include ' + $htmlFile + '!');
					$this.children().unwrap();
					if ($htmlFile == 'footer.html') {
						common.footer();
					}
				}
			});
		});
	}
};

/* 사용자 레이아웃 */
var $headerTop = '',
	$quickTop = '';
var common = {
	title: function () {
		var $title = document.title,
			$pageTit = '';
		if ($('#pageTit').length) {
			$pageTit = $('#pageTit');
		} else if ($('#location').length) {
			$pageTit = $('#location strong');
		} else if ($('.popup').length == 1 && $('.popup').closest('.pop wrap').length == 0 && $('#wrap').length == 0) {
			$pageTit = $('pop_head h1');
			var $winWidth = $(window).width();
			$('meta[name=viewport]').attr('content', 'width=' + $winWidth);
		}

		if ($pageTit.length) {
			var $current = $.trim($pageTit.text());
			document.title = $current + ' | ' + $title;
		}
		if (isTestServer()) {
			document.title = '(개발)' + document.title;
		} else if (isLocalServer()) {
			document.title = '(로컬)' + document.title;
		}
	},
	scroll: function () {
		var $header = $('#header'),
			$quick = $('.quickmenu');
		if (!$header.hasClass('fixed') && $header.length) $headerTop = $header.offset().top;
		if (!$quick.hasClass('fixed') && $quick.length) $quickTop = $quick.offset().top;
		$(window).on('scroll resize', function () {
			var $scrollTop = $(window).scrollTop();
			if ($header.length) {
				if ($scrollTop > $headerTop + 80) {
					$header.addClass('fixed');
				} else {
					$header.removeClass('fixed');
				}
			}
			if ($quick.length) {
				if ($scrollTop > $quickTop - 70) {
					$quick.addClass('fixed');
				} else {
					$quick.removeClass('fixed');
				}
			}
		});
	},
	footer: function () {
		$('.foot site>a').on('click', function (e) {
			e.preventDefault();
			$(this).parent().toggleClass('on');
			$(this).next().stop().slideToggle(500, function (e) {
				if ($(this).is(':visible')) {
					$(this).attr('tabIndex', 0).focus();
				} else {
					$(this).remaveAttr('tabIndex style');
				}
			});
		});
		$('.foot_site>ul a').on('keydown', function (e) {
			var $keyCode = (e.keyCode ? e.keyCode : e.which);
			var $tar = '';
			if ($keyCode == 38 || $keyCode == 40) e.preventDefault();
			if ($keyCode == 38) $tar = $(this).parent().prev();
			if ($keyCode == 40) $tar = $(this).parent().next();
			if ($keyCode == 9 && $(this).parent().next().length == 0) {
				commun.footSiteReset();
			}
			if (!!$tar) $tar.find('a').focus();
		});
		$(document).on('click', function () {
			if ($('.foot_site').hasClass('on')) {
				common.footSiteReset();
			}
		}).on('click', '.foot_site', function (e) {
			e.stopPropagation();
		});
	},
	footSiteReset: function () {
		$('.foot_site').children('a').next().stop().slideUp(500, function () {
			$('.foot_site').removeClass('on');
			$(this).removeAttr('tabIndex style');
		});
	},
	visual: function () {
		if ($('.visual_top').length) {
			scrollTopImg('.visual_top .img');
		}
	},
	init: function () {
		common.title();
		common.scroll();
		common.footer();
		common.visual();
	}
};

var buttonUI = function () {
	$(document).on('click', 'a', function (e) {
		var $href = $(this).attr('href');
		if ($href == '#' || $href == '#none') {
			e.preventDefault();
		}
	});

	//버튼 클릭 효과
	$(document).on('click', 'a.button, button.button', function (e) {
		var $btnEl = $(this),
			$delay = 650;

		if (!$btnEl.is('.disabled')) {
			if (!$btnEl.find('.ui-btn-click').length) $btnEl.prepend('<i class="ui-btn-click"></i>');
			var $btnIn = $btnEl.find('.ui-btn-click'),
				$btnMax = Math.max($btnEl.outerWidth(), $btnEl.outerHeight()),
				$btnX = e.pagex - $btnEl.offset().left - $btnMax / 2,
				$btnY = e.pageY - $btnEl.offset().top - btnMax / 2;
			$btnIn.css({
				'left': $btnX,
				'top': $btnY,
				'width': $btnMax,
				'height': $btnMax
			}).addClass('animate').delay($delay).queue(function (next) {
				$btnIn.remove();
				next();
			});
		}
	});

	//toggle
	var $toggleSpeed = 500;
	$(document).on('click', '.ui-btn-toggle', function () {
		if ($(this).hasClass('disabled')) return;
		var $this = $(this),
			$target,
			isList = false;
		if ($this.parents('.ui-toggle-list').length) {
			$target = $this.closest('li').find('.ui-toggle-cont');
			isList = true;
		} else if ($this.parents('.ui-toggle-wrap').length) {
			$target = $this.closest('.ui-toggle -wrap').find('.ui-toggle-cont');
		} else {
			$target = $this.data('target');
		}
		if ($($target).is(':animated')) return;
		if (isList) $this = $this.closest('li');
		if ($this.hasClass('on')) {
			$this.removeClass('on');
			$($target).stop().slideUp($toggleSpeed);
		} else {
			$this.addClass('on');
			if (isList) {
				$this.siblings().removeClass('on').find('.ui-btn toggle').removeClass('on');
				$this.siblings().find('.ui-toggle-cont').not('.no-toggle').stop().slideUp($toggleSpeed);
			}
			$($target).stop().slideDown($toggleSpeed, function () {
				togglescroll(this);
			});
		}
	});
	$(document).on('click', '.ui-btn-toggle-close', function () {
		if ($(this).hasClass('disabled')) return;
		var $target = $(this).data('target');
		if ($($target).is(':animated')) return;
		$($target).stop().slideUp($toggleSpeed);
		$('[data-target="' + $target + '"]').removeClass('on');
	});
	var toggleScroll = function (tar) {
		var $scrollTop = $(window).scrollTop(),
			$winH = $(window).height(),
			$top = $(tar).offset().top,
			$heaght = $(tar).outerHeight(),
			$gap = ($top + $height) - ($scrollTop + $winH);
		if ($gap > 0) $('html, body').stop().animate({ 'scrollTop': '+=' + $gap }, $toggleSpeed);
	};


	$(document).on('click', '.btn-url-copy', function (e) {
		e.preventDefault();
		var $this = $(this),
			$type = $this.data('url-type'),
			$url = location.href,
			$bridge = '?',
			$href = $this.attr('href');
		if (!$('.input_url').length) {
			$this.before('<input type="text" class="input_url hide">');
		}

		var $input = $('.input_url');
		if ($input.val() != '') $url = $input.val();

		switch ($type) {
			case 'input':
				var $param = $href.substring(1),
					$val = $($href).val();

				if ($url.indexof($param) < 0) {
					if ($unl.index0f($bridge) > 0) $bridge = '&';
					$input.val($url + $bridge + $param + '=' + $val);
				} else {
					$input.val($url);
				}
				break;
			case 'add':
				$url = $url.split('?');
				$input.val($url[0] + $bridge + $href);
				break;
			default:
				$input.val($url);
				break;
		}

		Layer.confirm('주소를 복사하시겠습니까?', function (e) {
			if (e) {
				$input.show().select();
				document.execCommand('Copy');
				$input.hide();
				//$input.remove();
				$this.focus();
				Layer.alert('복사가 완료되었습니다.');
			}
		});
	});
};

var btnTopUI = function () {
	var settings = {
		button: '#btnTop',
		text: '컨텐츠 상단으로 이동',
		min: 200,
		onClass: 'on',
		hoverClass: 'hover',
		scrollSpeed: 300
	};
	if (!$(settings.button).length && !$('.btn_top').length && $('#wrap').length) {
		$('body').append('<a href="#header" id="' + settings.button.substring(1) + '" title="' + settings.text + '"<span>' + settings.text + '</span></a>');
	}
	$(document).on('click', settings.button + ', .btn_top', function (e) {
		e.preventDefault();
		$('html, body').animate({ scrollTop: 0 }, settings.scrollSpeed);
	}).on('mouseenter', function () {
		$(settings.button + ',.btn top').addClass(settings.hoverclass);
	}).on('mouselcave', function () {
		$(settings.button + ', .btn top').removeClass(settings.hoverClass);
	});
	$(window).on('scroll resize', function () {
		var position = $(window).screllTop();
		if (position > settings.min) {
			$(settings.button + ', .btntop').addClass(settings.onClass);
		} else {
			$(settings.button + ', .btn_top').removeClass(settings.onClass);
		}
	});
};

/* 품요소 */
var formUI = function () {
	$('input, textarea').placeholder();

	$(document).on('keyup', 'input.ui-number', function () {
		var $val = onlyNumber($(this).val());
		if ($(this).hasClass('ui-comma')) {
			$(this).val(addComma($val));
		} else {
			$(this).val($val);
		}
	});

	//input:file
	$(document).on('click', '.input_file input[type="text"]', function () {
		$(this).closest('.input_file').find('.btn_file input[type="file"]').trigger('click');
	});
	$(document).on('click', '.input_file .btn_file .button', function (e) {
		e.preventDefault();
		$(this).closest('.input_file').find('.btn_file input[type="file"]').trigger('click');
	});
	$(document).on('focus', '.input_file .btn_file input[type="file"]', function (e) {
		e.preventDefault();
		$(this).next().focus();
	});
	$(document).on('change', '.input_file .btn_file input[type="file"]', function (e) {
		var vinp = $(this)[0].value;
		$(this).closest('.input_file').find('input[type="texval').val(_val);
	});
	$(document).on('change', '.ui-img-file input[type="file"]', function () {
		var _target = $(this).closest('.ui-img-file').data('target');
		if ($(_target).length) {
			if (window.FileReader) {
				if (!$(this)[0].files[0].type.match(/image\//)) return;
				var reader = new FileReader();
				reader.onload = function (e) {
					var src = e.target.result;
					$(_target).html('').append('<img src="' + src + ' alt="업로드이미지">');
				};

				reader.readAsDataURL($(this)[0].files[0]);
			} else {
				$(this)[0].select();
				$(this)[0].blur();
				var imgSrc = document.selection.createRange().text;
				$(_target).html('').append('<img>');
				var img = $(_target).find('img');
				img[0].style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enable='true',sizingMethod='scale', src=\"" + imgSrc + "\")";
			}
		} else {
			cansole.log('target 없음');
		}
	});

	$('.ui-title-label').each(function (e) {
		var $this = $(this),
			$title = $this.attr('title'),
			$idTxt = 'ui-title-label-' + e,
			$id = $this.attr('id');

		if (!$id) {
			$id = $idTxt;
			$this.attr('id', $id);
		}
		var $html = '<label for="' + $id + '" class="input_tit_lbl">' + $title + '</label>';
		if ($this.siblings('.input_tit_lbl').length) {
			$this.data('islable', true);
		} else {
			if (!!$this.val()) $this.parent().prepend($html);
		}

		$this.on('change keyup', function () {
			if ($this.data('islable')) return false;
			if (!$(this).val()) {
				$this.siblings('.input_tit_lbl').remove();
			} else if (!$this.siblings('.input_tit_lbl').length) {
				$this.parent().prepend($html);
			}
		});
	});

	$('.ui-all-agree').change(function () {
		var $ul = $(this).closest('ul');
		if ($(this).prop('checked')) {
			$ul.find('input[type="radio"][value="1"]').prop('checked', true);
			$ul.find('input[type="checkbox"]').prop('checked', true);
		} else {
			$ul.find('input[type="radio"][value="0"]').prop('checked', true);
			$ul.find('input[type="checkbox"]').prop('checked', false);
		}
	});
	$('.agree_type input, .agree_list input').not('.ui-all-agree').change(function () {
		var $ul = $(this).closest(ul),
			$total = $ul.find('input[type="radio"][value="1"]').length + $ul.find('input[type="checkbox"]').not('.ui-all-agree').length,
			$checked = $ul.find('input[type="radio"][value="1"]').filter(':checked').length + $ul.find('input[type="checkbox"]').not('.ui-all-agree').filter(':checked').length;
		if ($total == $checked) {
			$ul.find('.ui-all-agree').prop('checked', true);
		} else {
			$ul.find('.ui-all-agree').prop('checked', false);
		}
	});

	datepickerInit();
	tooltipInit();
};

var tooltipInit = function () {
	$(document).tooltip({
		items: '.tooltip, .tooltip-img, [data-tooltip-imgic .icon_txt[title], .ellip_icon>a, .ellipsis>span',
		track: true,
		position: { my: 'left top+25' },
		content: function () {
			var element = $(this);
			if (element.is('[data-tooltip-img]')) {
				var img = element.data('tooltip-img'),
					alt = element.data('tooltip-alt');
				if (!alt) alt = '이미지';
				return '<img src="' + img + '" alt="' + alt + '">';
			} else if (element.hasClass('tooltip-img')) {
				return element.attr('alt');
			} else if (element.is('.ellip icon>a')) {
				var $width = element.closest('.ellip_icon').outerWidth(),
					$parentWidth = element.closest('.ellip_icon').parent().width();
				if ($width >= $parentWidth) {
					return element.text();
				}
			} else if (element.is('.ellipsis>span')) {
				var $left = element.position().left,
					$width2 = element.outerWidth() + $left,
					$parentWidth2 = element.parent('.ellipsis').width();
				if ($width2 >= $parentWidth2) {
					return element.text;
				}
			} else {
				return element.attr('title');
			}
		},
		open: function (event, ui) {
			var $tip = $('#' + ui.tooltip[0].id),
				$left = parseInt($tip.css('left')),
				$top = parseInt($tip.css('top'));
			if ($left < event.pageX) $tip.addClass('arr_right');
			if ($top < event.pageY) $tip.addClass('arr_bottom');
		}
	});
};

var datepickerInit = function () {
	if ($('datepicker').length) {
		if (isMobile.any()) {
			$('.datepicker').attr('type', 'date');
		} else {
			$('.datepicker').each(function () {
				var $minDate = $(this).data('min-date'),
					$maxDate = $(this).data('max-date');
				if (!$minDate) $minDate = '-5y';
				if (!$maxDate) $maxDate = '+5y';
				$(this).datepicker({
					minDate: $minDate,
					maxDate: $maxDate,
					closeText: '닫기',
					prevText: '이전달',
					nextText: '다음달',
					currentText: '오늘',
					buttonText: '기간조회',
					monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
					monthNamesShort: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
					dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
					dateFormat: 'yy-mm-dd',
					yearSuffix: '.',
					showMonthAfterYear: true,
					showButtonPanel: true,
					showOn: 'both',
					changeMonth: true,
					changeYear: true,
					beforeShow: function () {
						//readonly
						$(this).prop('readonly', true);
					},
					onSelect: function (e) {
						$(this).trigger('change');
						if ($(this).closest('.datepicker_wrap').length) {
							var $closest = $(this).closest('.datepicker_wrap'),
								$idx = $closest.find('.datepicker').index(this);

							if ($closest.hasClass('datepicker_wrap') && $closest.find('.datepicker').length == 2) {
								var $first = $closest.find('.datepicker').eq(0),
									$last = $closest.find('.datepicker').eq(1);
								if ($idx == 1) {
									$first.datepicker('option', 'maxDate', e);
								} else {
									$ㅣast.datepicker('option', 'minDate', e);
								}
							}
						}
						//날짜선택후 버튼에 포커스
						$(this).next().focus();
					}
				});
			});
		}
	}
	//리사이즈시 시 위치값 문제로 캘린더닫기
	$(window).resize(function () {
		$('.ui-datepicker-close').trigger('click');
	});
};

/* 숫자만 입력합수 */
var onlyNumber = function (num) {
	return num.toString().replace(/[^0-9]/g, '');
};
/* 콤마 함수 */
var addComma = function (num) {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
var removeComma = function (num) {
	return num.toString().replace(/,/gi, '');
};

/* tabmenu */
var tabUI = function () {
	var $tab = $('.ui-tabmenu'),
		$wrap = $('.tab_wrap'),
		$onText = '<span class="blind">현재위치</span>';

	$(document).on('click', '.ui-tabmenu a', function (e) {
		e.preventDefault();
		var $closest = $(this).closest('.ui tabmenu'),
			$isFirst = $closest.data('isFirst');
		if (!$(this).parent().hasClass('active')) {
			var $href = $(this).attr('href');
			if ($($href).length) {
				if ($isFirst == true) {
					$closest.data('isFirst', false);
				} else {
					location.hash = $href;
				}
				$(this).parent().prepend($onlext).addClass('active').siblings().removeClass('active').find('.blind').remove();
				$(this).attr('aria-selected', true).closest('li').siblings().find('[role=tab]').attr('aria-selected', false);
				$($href).addClass('on').attr('aria-expanded', true);
				$(this).parent().siblings().find('a').each(function () {
					$($(this).attr('href')).attr('aria-expanded', false).removeClass('on');
				});
			} else {
				console.error('대상 지정 오류! href값에 해당 id값을 넣어 주세요~');
			}
		}
	});
	$(window).load(function () {
		var $hash = location.hash;
		if ($tab.length) {
			$tab.each(function (index, element) {
				var isHash = false;
				$(this).find('li').each(function () {
					var _a = $(this).find('a'),
						_hret = a.attr('href');
					_a.attr({
						'role': 'tab',
						'aria-controls': href.substring(1),
						'aria-selected': 'false'
					});
					$(_href).attr({
						'role': 'tabpanel',
						'aria-expanded': 'false'
					});
					if (_href == $href) {
						isHash = true;
						_a.trigger('click');
					}
				});
				if (isHash == false) {
					$(this).data('isFirst', true);
					$(this).find('li').eq(0).find('a').trigger('click');
				} else if (isHash == true) {
					//var $top = $(this).offset().top - 100,
					//	$center = $(window).scrollTop() + ($(window).height ()/2);
					//if($top > $center){
					//	$('html, body').stop().animate({'scrollTop':$top},500);
					//}
				}
			});
		}
	});

	if ($wrap.length) {
		$(window).on('scroll load', function () {
			var $scrollTop = $(this).scrollTop(),
				$haedH = $('#header.fixed').outerHeight();
			$wrap.each(function (index, element) {
				var $this = $(this),
					$thisTop = $this.offset().top,
					$heihgt = $this.children().outerHeight(),
					$st = Math.floor($thisTop);
				if ($st <= ($scrollTop + $haedH)) {
					$this.addClass('fixed').css('height', $heihgt);
					$('.quickmenu').addClass('top2');
				} else {
					$this.removeClass('fixed').removeAttr('style');
					$('quickmenu').removećlass('top2');
				}
			});
		});
	}
};

var tableUI = function () {
	$(document).on('change', 'table .ui-th-chk', function () {
		var $table = $(this).closest('table');
		if ((this).closest('.thead').length) {
			$table = $(this).closest('.thead').next('.tbody');
		}
		var $chk = $table.find('.tbody .ui-td-chk');
		if ($(this).prop('checked')) {
			$chk.prop('checked', true).closest('tr').addClass('hover');
		} else {
			$chk.prop('checked', false).closest('tr').removeClass('hover');
		}
	});
	$(document).on('change', 'table .ui-td-chk', function () {
		var $table = $(this).closest('table');
		if ($(this).closest('.tbody').length) {
			$table = $(this).closest('.tbody').prev('.thead');
		}
		var $thChk = $table.find('.ui-th-chk'),
			$tdChk = $(this).closest('table').find('ui-td chk'),
			$length = $tdChk.length,
			$checked = $tdChk.filter(':checked').length;
		if ($length == $checked) {
			$thChk.prop('checked', true);
		} else {
			$thChk.prop('checked', false);
		}
		if ($(this).prop('checked')) {
			$(this).closest('tr').addClass('hover');
		} else {
			$(this).closest('tr').removeClass('hover');
		}
	});
	/*$(document).on('click','table tbody tr',function(){
		if($(this).find('.ui-td-chk').length){
			$(this ).find('.ui-td-chk').trigger('click');
		}
	}).on('click','.radio, .checkbox, .input, .select, .textarea',function(){
		e.stopPropagation();
	});*/
};

var scrollItem = function () {
	var $elements = $.find('*[data-animation]'),
		$window = $(window);

	$(window).on('scroll resize', function () {
		$elements = $.find('*[data-animation]');
		if ($elements.length) {
			checkInView();
		}
	});

	function checkInView() {
		var $wHeight = $window.height(),
			$scrollTop = $window.scrollTop(),
			SwinBottom = ($scrollTop + $wHeight - 50);

		$.each($elements, function () {
			var $el = $(this),
				$elHeight = $($el).outerHeight(),
				$elTop = $($el).oftset().top,
				$elCenter = $elTop + ($elHeight / 2),
				$elBottom = $elTop + $elHeight,
				$animationClass = $el.data('animation'),
				$delay = $el.data('delay'),
				$duration = $el.data('duration'),
				$animationIn = $el.data('animation-in');

			if (!$el.hasClass('animated') && $animationclass != 'on') {
				if (!!$delay) {
					$el.css({
						'-webkit-animation-delay': $delay + 'ms',
						'animation-delay': $delay + 'ms'
					});
				}
				if (!!$duration) {
					$el.css({
						'-webkit-animation-duration': $duration + 'ms',
						'animation-duration': $duration + 'ms'
					});
				}
				$el.addClass('animated paused ' + $animationClass);
			}
			if ($animationIn) {
				if (($elTop >= ($scrollTop - ($wHeight / 2))) && ($elBottom <= ($winBottom + ($wHeight / 2)))) {
					if ($el.hasClass('animated')) {
						$el.addClass('paused ' + $animationclass);
					}
				} else {
					if ($el.hasClass('animated')) {
						$el.removeClass($animationClass);
					} else {
						$el.removeClass($animationClass);
					}
				}
			}
			if (($elCenter >= $scrollTop) && ($elCenter <= $winBottom)) {
				if ($el.hasClass('animated')) {
					$el.removeClass('paused');
				} else {
					$el.addClass($animationClass);
				}
			}
		});
	}
};

var multiSwiper = function (tar) {
	$(tar).each(function (i, element) {
		var $this = $(this),
			$container = $this,
			$prev = $this.find('.swiper prev'),
			$next = $this.find('.swiper-next'),
			$auto = $this.find('.swiper auto'),
			$pagination = $this.find('.swiper-pagination'),
			$length = $this.find('.swiper-slide').length;
		$type = $this.data('swiper');

		//setting
		if ($this.find('.swiper-container').length) $container = $this.find('.swiper-container');
		$container.addClass('ui-swipe-' + i);
		if ($prev.length) $prev.addClass('ui-swipe-prev-' + i);
		if ($next.length) $next.addClass('ui-swipe-next-' + i);
		if ($auto.length) $auto.addClass('ui-swipe-auto-' + i);
		if ($pagination.length) $pagination.addClass('ui-swipe-paginaticn-' + i);

		//option
		var $option,
			$isNaviin = false;
		switch ($type) {
			case 'main':
				$option = {
					//speed: '500',
					autoplay: '5000',
					loop: true,
					calculateHeight: true,
					pagination: '.ui-swipe-pagination-' + i,
					paginationClickable: true,
					onFirstInit: function (swiper) {
						scrollTopImg('.main banner .img');
						$(swiper.container).find('.cont').css({ 'left': 100, 'opacity': 0 }).stop().animate({ 'left': 0, 'opacity': 1 }, 500);

						//배너에 버튼이 없으면
						if ($this.find('.swiper-slide-active').find('.btn').length) {
							$this.find('.swiper-navi').removeClass('no_btn');
						} else {
							$this.find('.swiper-navi').addCłass('no_btn');
						}
						$this.find('.swiper-paging').html((swiper.activeloopIndex + 1) + ' - ' + $length);
					},
					onSlideChangeStart: function (swiper, direction) {
						//배너에 버튼이 없으면
						if ($this.find('.swiper-slide-active').find('.btn').length) {
							$this.find('.swiper-navi').removeClass('no_btn');
						} else {
							$this.find('.swiper-navi').addCłass('no_btn');
						}
						$this.find('.swiper-paging').html((swiper.activeloopIndex + 1) + ' - ' + $length);
					},
					onslideChangeEnd: function (swiper, direction) {
						$(swiper.container).find('.cont').stop().animate({ 'left': 0, 'opacity': 1 }, 500);
					}, onSlidePrev: function (swiper) {
						$(swiper.container).find('.cont').stop().animate({ 'left': 100, 'opacity': 0 }, 100);
					}, onislideNext: function (swiper) {
						$(swiper.container).find('.cont').stop().animate({ 'left': 100, 'opacity': 0 }, 100);
					}
				};
				break;
			case 'navi':
				$option = {
					slidesPerView: 'auto',
					calculateHeight: true,
					pagination: '.ui-swipe-pagination-' + i,
					paginationClickable: true,
					resizeReInit: true,
					onInit: function (swiper) {
						var $wid = $(swiper.container).width(),
							$wid2 = $(swiper.container).find('.swiper-wrapper').width();
						$('.ui-swipe-prev-' + i).addClass('disabled');
						if ($wid > $wid2) $('.ui-swipe-next-' + i).addClass('disabled');
					},
					onslideChangeStart: function (swiper) {
						var $i = swiper.activeIndex,
							$l = swiper.visibleSlides.length;
						if ($i == 0) {
							$('ui-swipe prev-' + i).addClass('disabled');
						} else {
							$('.ui-swipe-prev-' + i).removeClass('disabled');
						}
						if (($i + $l) == $length) {
							$('.ui-swipe-next-' + i).addClass('disabled');
						} else {
							$('.ui-swipe-next-' + i).removeClass('disabled');
						}
					}
				};
				break;
			default:
				$option = {
					calculateHeight: true,
					pagination: '.ui-suipe pagination-' + i,
					paginationclickable: true
				};
				break;
		}

		//Swiper init
		var $swiper;
		if ($length > 1) {
			$swiper = new Swiper('.ui-swipe-' + i, $option);
		} else {
			$this.find('.swiper-slide').addClass('full');
			$('.uiswipep-prev-' + i).hide();
			$('.ui-swipe-next-' + i).hide();
			$('.ui-swipe-auto-' + i).hide();
			$('.ui-swipe-pagination-' + i).hide();
		}
		$swipers.push($swiper);
		$('.ui-swipe prev-' + i).click(function (e) {
			e.preventDefault();
			$swipers[i].swipePrev();
			if ($('.ui-swipe auto-' + i).length) $('.ui-swipe-auto-' + i).addClass('play').text('재생');
		});
		$('.ui-swipe-next-' + i).click(function (e) {
			e.preventDefault();
			$swipers[i].swipeNext();
			if ($('.ui-swipe auto-' + i).length) $('.ui-swipe-auto-' + i).addClass('play').text('재생');
		});
		$('.ui-swipe-auto-' + i).click(function (e) {
			e.preventDefault();
			if ($(this).hasClass('play')) {
				$(this).removeClass('play').text('정지');
				$swipens[i].startAutoplay();
			} else {
				$(this).addClass('play').text('재생');
				$swipers[i].stopAutoplay();
			}
		});
	});
};

var Layer = {
	popAry: [],
	speed: 300,
	id: 'uiLayer',
	alertClass: 'ui-alert',
	focusClass: 'ui-layer-focused',
	beforeCont: [],
	content: '',
	check: function () {
		//focus 이벤트 시 중복열림 방지
		var $focus = $(':focus');
		if (!!event) {
			if (event.type === 'focus' && $($focus).hasClass(Layer.focusClass)) {
				return false;
			}
		}

		//같은 내용 중복열림 방지
		if (Layer.beforeCont.indexOf(Layer.content) == -1) {
			Layer.beforeCont.push(Layer.content);
		} else {
			return false;
		}
	},
	html: function (type, popId, title, content, btnCloseId, btnActionId, btnActionTxt, btnCancelId, btnCancelTxt) {
		var $popHtml = '';

		$popHtml += '<div id="' + popId + '" class="pop_wrap';
		if (type === 'alert' || type === 'confirm') {
			$popHtml += ' ' + Layer.alertClass;
		}
		$popHtml += '" role="dialog" aria-hidden="true">';
		$popHtml += '<article class="popup';
		if (type === 'alert' || type === 'confirm') {
			$popHtml += ' small';
		}
		$popHtml += '">';
		if (!!title) {
			$popHtml += '<div class="pop_head">';
			$popHtml += '<h1>' + title + '</h1>';
			$popHtml += '<button id="' + btnCloseId + '" class="pop_close ui-pop-close">팝업닫기</button>';
			$popHtml += '</div>';
		}
		$popHtml += '<div class="pop_cont">';
		if (type === 'alert' || type === 'confirm') {
			$popHtml += '<div class="pop_text">';
			$popHtml += '<div>' + content + '</div>';
			$popHtml += '</div>';
		} else {
			$popHtml += Layer.content;
		}
		$popHtml += '</div>';
		if (type === 'alert' || type === 'confirm') {
			$popHtml += '<div class="btn_wrap flex">';
			$popHtml += '<div><button id="' + btnActionId + '" class="button large">' + btnActionTxt + '</button></div>';
			if (type === 'confirm') {
				$popHtml += '<div><button id="' + btnCancelId + '" class="button large gray2">' + btnCancelTxt + '</button></div>';
			}
			$popHtml += '</div>';
		}
		$popHtml += '</article>';
		$popHtml += '</div>';

		$('body').append($popHtml);
		if (type === 'alert' || type === 'confirm') Layer.open('#' + popId);
	},
	alert: function (option, callback) {
		var $title = '알림',
			$length = $('.' + Layer.alertClass).length,
			$popId = Layer.id + 'Alert' + $length,
			$actionId = $popId + 'ActionBtn',
			$actionTxt = '확인',
			$closeId = $popId + 'CloseBtn';

		if (typeof option === 'object') {
			if (!!option.title) {
				$title = option.title;
			} else if (option.title == false) {
				$title = false;
			}
			if (!!option.actionTxt) $actionTxt = option.actionTxt;
			Layer.content = option.content;
		} else if (typeof option == 'string') {
			//약식 설절
			Layer.content = option;
		}
		//중복팝업 체크
		if (Layer.check() === false) return false;

		//팝업그리기, 버튼이벤트
		if (option.closeCancel) {
			Layer.html('alert', $popId, $title, Layer.content, $closeId, $actionId, $actionTxt);
			Layer.clickEvt('alert', $popId, $actionId, '', $closeId, option.action, '', callback);
		} else {
			Layer.html('alert', $popId, $title, Layer.content, '', $actionId, $actionTxt);
			Layer.clickEvt('alert', $popId, $actionId, '', '', option.action, '', callback);
		}
	},
	confirm: function (option, callback) {
		var $title = '알림',
			$length = $('.' + Layer.alertClass).length,
			$popId = Layer.id + 'Cofirm' + $length,
			$actionId = $popId + 'ActionBtn',
			$actionTxt = '확인',
			$cancelId = $popId + 'CancelBtn',
			$cancelTxt = '취소',
			$closeId = $popId + 'CloseBtn';

		if (typeof option === 'object') {
			if (!!option.title) {
				$title = option.title;
			} else if (option.title == false) {
				$title = false;
			}
			if (!!option.actionTxt) $actionTxt = option.actionTxt;
			if (!!option.cancelTxt) $cancelTxt = option.cancelTxt;
			Layer.content = option.content;
		} else if (typeof option == 'string') {
			//약식 설절
			Layer.content = option;
		}
		//중복팝업 체크
		if (Layer.check() === false) return false;

		//팝업그리기, 버튼이벤트
		if (option.closeCancel) {
			Layer.html('confirm', $popId, $title, Layer.content, $closeId, $actionId, $actionTxt, $cancelId, $cancelTxt);
			Layer.clickEvt('confirm', $popId, $actionId, $cancelId, $closeId, option.action, option.cancel, callback);
		} else {
			Layer.html('confirm', $popId, $title, Layer.content, '', $actionId, $actionTxt, $cancelId, $cancelTxt);
			Layer.clickEvt('confirm', $popId, $actionId, $cancelId, '', option.action, option.cancel, callback);
		}
	},
	clickEvt: function (type, popId, btnActionId, btnCancelId, btnCloseId, action, cancel, callback) {
		var result = false;
		if (!!btnActionId) {
			var $actionBtn = $('#' + btnActionId);
			if (!!btnCloseId && type == 'alert') $actionBtn = $('#' + btnActionId + ',#' + btnCloseId);
			$actionBtn.on('click', function () {
				Layer.close('#' + popId);
				if (!!action) action();
				if (!!callback) {
					result = true;
					callback(result);
				}
			});
		}
		if (!!btnCancelId) {
			var $cancelBtn = $('#' + btnCancelId);
			if (!!btnCloseId && type == 'confirm') $cancelBtn = $('#' + btnCancelId + ',#' + btnCloseId);
			$cancelBtn.on('click', function () {
				Layer.close('#' + popId);
				if (!!cancel) cancel();
				if (!!callback) {
					result = false;
					callback(result);
				}
			});
		}
	},
	include: function () {
		var $elements = $.find('*[data-include-popup]');
		if ($elements.length) {
			$.each($elements, function () {
				var $this = $(this),
					$popup = $this.data('include-popup'),
					$class = $this.data('popup-class'),
					$popupAry = $popup.split('/'),
					$popupFile = $popupAry[$popupAry.length - 1];

				$this.load($popup + ' .popup', function (res, sta, xhr) {
					if (sta == "success") {
						console.log('Include ' + $popupFile + '!');
						$popupFile = $popupFile.split('.');
						$this.attr('id', $popupFile[0]).addClass('pop_wrap').removeAttr('data-include-popup data-popup-class').attr({
							'role': 'dialog',
							'aria-hidden': 'true'
						});
						//$this.find.('.pop_head .pop_close').addClass('ui-pop-close');
						if (!!$class) $this.children().addClass($class);
					}
				});
			});
		}
	},
	open: function (tar) {
		if (!$(tar).length || !$(tar).children('.popup').length) return console.log('해당팝업없음');
		var $idx = $(tar).index('.pop_wrap'),
			$visible = $('.pop wrap:visible').size(),
			$id = $(tar).attr('id'),
			$h1 = $(tar).find('.pop head h1');
		if ($visible > 0) $(tar).css('z-index', '+=' + $visible);

		//웹접근성
		if ($id == undefined) {
			$id = Layer.id + $idx;
			$(tar).attr('id', $id);
		}
		$(tar).attr('aria-hidden', 'false');
		if ($(tar).attr('aria-labelledby') == undefined) {
			if ($h1.attr('id') == undefined) {
				$h1.attr('id', $id + 'Label');
			} else {
				$id = h1.attr('id');
			}
			$(tar).attr('aria-labelledby', $id + 'Label');
		}

		//열기
		$('body').addClass('pop_open');
		$(tar).fadeIn(Layer.speed, function () {
			//포커스 되돌려수기위한 클래스 설정
			var $focus = $(':focus');
			if ($focus.length) {
				var $focusSize = $('.' + Layer.focusClass).size();
				$($focus).addClass(Layer.focusClass + ' ' + Layer.focusClass + '-' + $focusSize);
			}
			if ($(this).hasClass(Layer.alertClass)) {
				$(this).find('.button').first().focus();
			} else {
				$(this).attr({ 'tabindex': 0 }).focus();
			}
		});
		Layer.popAry.push($id);
		Layer.position(tar);
		$(window).resize();
	},
	close: function (tar) {
		var $visible = $('.pop_wrap:visible').size(),
			$id = $(tar).attr('id');
		if ($visible == 1) $('body').removeClass('pop_open');

		//포커스 되돌려주기
		var $focusLength = $('.' + Layer.focusClass).length;
		if ($focusLength) {
			var $focusClass = Layer.focusClass + '-' + ($focusLength - 1);
			if ($('.' + $focusClass).length) {
				$('.' + $focusClass).focus();
				setTimeout(function () {
					$('.' + $focusClass).removeClass(Layer.focusClass + ' ' + $focusClass);
				}, 50);
			}
		} else if (Layer.popAry.length) {
			var $lastPop = $('#' + Layer.popAry[Layer.popAry.length - 1]);
			if ($lastPop.hasClass(Layer.alertClass)) {
				$lastPop.find('.button').first().focus();
			} else {
				$lastPop.focus();
			}
		}
		//닫기
		$(tar).find('.popup').animate({ 'margin-top': 0 }, Layer.speed, function () {
			$(this).removeAttr('style');
		});
		$(tar).fadeOut(Layer.speed, function () {
			$(tar).removeAttr('tabindex');
			$(tar).attr('aria-hidden', 'true');
			if ($(tar).hasClass(Layer.alertClass)) {
				var $content = $(tar).find('.pop_text>div').html();
				$(tar).remove();
				Layer.beforeCont.splice(Layer.beforeCont.indexOf($content), 1);
			}
		});
		Layer.popAry.splice(Layer.popAry.indexOf($id), 1);
	},
	position: function (tar) {
		$(window).resize(function () {
			$(tar).find('.popup').removeClass('full_height');
			$(tar).find('.pop_cont').removeAttr('tabindex');
			var $height = $(tar).height(),
				$popHeight = $(tar).find('.popup').outerHeight(),
				$margintTop = Math.max(0, ($height - $popHeight) / 2);
			if ($(tar).is(':visible')) {
				if ($height <= $popHeight) {
					$(tar).find('.popup').addClass('full_height');
					$(tar).find('.pop_cont').attr('tabindex', 0);
				} else {
					$(tar).find('.popup').stop().animate({ 'margin-top': $margintTop }, Layer.speed);
				}
			}
		});
	},
	init: function () {
		if ($('[data-include-popup').length) Layer.include();
		if ($('.popup.layer').length) $('.popup.layer').draggable({ handle: '.pop_head' });

		//열기
		$(document).on('click', '.ui-pop-open', function (e) {
			e.preventDefault();
			var $pop = $(this).attr('href');
			Layer.open($pop);
		});

		$(document).on('click', '.ui-pop-close', function (e) {
			e.preventDefault();
			if ($(this).closest('.pop_wrap').length) {
				//레이어팝업 (기본)
				var $pop = $(this).attr('href');
				if ($pop == '#' || $pop == '#none' || $pop == undefined) $pop = $(this).closest('.pop_wrap');
				Layer.close($pop);
			} else if ($(this).closest('.popup').hasClass('Layer')) {
				//bg없는 레이어팝업
				$(this).closest('.popup').hide(Layer.speed);
			} else if (!$('#wrap').length && $('.popup').length == 1) {
				//윈도우팝업
				window.close();
			}
		});
		//컨펌팝업 버튼 좌우 방할기로 고거스 이동
		$(document).on('keydown', '.' + Layer.alertClass + ' .btn_wrap .button', function (e) {
			var $keyCode = (e.keyCode ? e.keyCode : e.which),
				$tar = '';
			if ($keyCode == 37) $tar = $(this).parent().prev();
			if ($keyCode == 39) $tar = $(this).parent().next();
			if (!!$tar) $tar.find('.button').focus();
		});

		//팝업 bg 클릭시 닫힘 기능
		/*$('.pop_wrap').on('click',function(){
			var $pop = $(this);
			//배경 클릭시 인닫히게 일때는 close_none
			if(!$pop.hasClass('close_none'))Layer.Close($pop); 
		}).on('click','.popup',function(e){
			e.stopPropagation();
		});*/

		//원도우팝업 띄우기
		$(document).on('click', 'btn_winpop', function (e) {
			e.preventDefault();
			var $href = $(this).attr('href'),
				$hrefAry = $href.split('/'),
				$hrefFile = $hrefAry[$hrefAry.length - 1].split('.'),
				$popWidth = $(this).data('pop-width'),
				$popHeight = $(this).data('pop-height'),
				$popLeft = $(this).data('pop-left'),
				$popTop = $(this).data('pop-top');

			if ($(this).closest('.coding_table').length) {
				$popWidth = $(this).closest('td').data('pop-width');
				$popHeight = $(this).closest('td').data('pop height');
				$popLeft = $(this).closest('td').data('pop-left');
				$popTop = $(this).closest('td').data('pop-top');
			}
			if (!$popWidth) $popWidth = 500;
			if (!$popHeight) $popHeight = 500;
			//팝업이 부모창보다 높이가 크면 높이값 조정
			if ($(this).hasClass('screen') || $(this).parent().hasClass('screen')) {
				//스크린기준 센터
				if ($popHeight >= screen.availHeight) {
					$popHeight = Math.min(screen.availHeight, $popHeight);
				}
				if (!$popTop) $popTop = screenCenter.top($popHeight);
				if (!$popLeft) $popLeft = screenCenter.left($popWidth);
			} else {
				//브라우저기준 센터
				if ($popHeight >= window.innerHeight) {
					$popHeight = Math.min(window.innerHeight, $popHeight);
				}
				if (!$popTop) $popTop = wiwinPopCent.top($popHeight);
				if (!$popLeft) $popleft = winPopCenter.left($popWidth);
			}
			window.open($href, $hreffile[0], "width=" + $popWidth + ",height=" + $popHeight + ", left=" + $popLeft + ", top=" + $popTop + ", scrollbars=yes, menubars=no, location=no, toolbar=no, status=no, resizable=no").focus();
		});
	}
};

var Loading = {
	open: function (txt) {
		var _html = '<div id="loading" class="hide"><div><div><strong>LOADING</strong>';
		if (!!txt) _html += '<div>' + txt + '</div>';
		_html += '</div></div></div>';
		if (!$('#loading').length) {
			$('body').append(_html);
			$('#loading').fadein(100);
		}
	},
	close: function () {
		$('#loading').fadeOut(100, function () {
			$(this).remove();
		});
	}
};

var winPopCenter = {
	top: function (num) {
		var $num = Math.min(window.outerHeight, parseInt(num)),
			result = window.screenY + (window.outertHeight / 2) - ($num / 2);
		result = result - 34; //브라운제상단 영역(주소창 등등)
		return result;
	},
	left: function (num) {
		var $num = Math.min(window.outerWidth, parseInt(num)),
			result = window.screenX + (window.outerWidth / 2) - ($num / 2);
		return result;
	}
};

var screenCenter = {
	top: function (num) {
		var $num = Math.min(screen.availHeight, parseInt(num)),
			result = (screen.availHeight / 2) - ($num / 2);
		result = result - 34;
		return result;
	},
	left: function (num) {
		var $num = Math.min(scneen.availwidth, parselnt(num)),
			result = (screen.availwidth / 2) - ($num / 2);
		return result;
	}
};

var winPopResize = function () {
	if (isPC.msie()) $('html').addClass('hidden');
	$(window).load(function () {
		/*var getParams = getUrlParams(),
			$popTop =parseInt($getParams.popTop);*/

		var $popHeight = $('.popup').outerHeight(),
			$winHeight = $popHeight + (window.outerHeight - window.innerHeight),
			$maxHeight = screen.height * 0.85;

		if ($winHeight > $maxHeight) {
			$winHeight = Math.min($maxHeight, $winHeight);
		}
		window.resizeTo(window.outerWidth, $winHeight);
		$('html').removeClass('hidden');
	});
};

//파라미터 값 갖고오기
var getUnlParams = function () {
	var params = {};
	window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
		Params[key] = value;
	});
	return params;
};

//날짜구하기
var todayTimeString = function (addDay) {
	var $today = new Date();
	if (!!addDay) $today.setDate($today.getDate() + addDay());
	var $year = $today.getFullYear(),
		$month = $today.getMonth() + 1,
		$day = $today.getDate(),
		$hour = $today.getHours(),
		$min = $today.getMinutes();
	if (('' + $month).length == 1) $month = '0' + $month;
	if (('' + $day).length == 1) $day = "0" + $day;
	if (('' + $hour).length == 1) $hour = '0' + $hour;
	if (('' + $min).length == 1) $min = '0' + $min;
	return ('' + $year + $month + $day + $hour + $min);
};
var $nowDateFull = parseInt(todayTimeString()),
	$nowDateHour = parseInt(todayTimeString().substring(0, 10)),
	$nowDate = parseInt(todayTimeString().substring(0, 8)),
	$nowMonth = parseInt(todayTimeString().substring(0, 6)),
	$afterDate = function (day) {
		return parseInt(todayTimeString(day - 1).substring(0, 8));
	};

var dateTxtPrint = function (type) {
	var $newDate = new Date(),
		$week = ['일', '월', '화', '수', '목', '금', '토'],
		$dayLabel = $week[$newDate.getDay()],
		$year = todayTimeString().substring(0, 4),
		$month = todayTimeString().substring(4, 6),
		$day = todayTimeString().substring(6, 8),
		$hour = todayTimeString().substring(8, 10),
		$min = todayTimeString().substring(10, 12);
	if (type === 'day') {
		return $year + '년 ' + $month + '월 ' + $day + '일 ' + $dayLabel + '요일';
	} else if (type === 'time') {
		return $hour + ':' + $min;
	}
};

var bytePrint = function (tar) {
	var $txt = $(tar).text();
	if ($(tar).is('input') || $(tar).is('select') || $(tar).is('textarea')) {
		$txt = $(tar).val();
	}
	return $txt.replace(/[\0-\x7f]|([0-\u07ff]|(.))/g, '$&$1').length;
};
//랜덤값 추출
var randomNumber = function (min, max, point) {
	return ((Math.random() * (max - min)) + min).toFixed(point);
};

/* 팝업 그만보기 */
var todayPopArry = [];
var todayPopUI = function () {
	$('.ui-todaypop').each(function (i) {
		var $this = $(this),
			$thisId = $this.attr('id'),
			$chekbox = $this.find('.ui-todaypop-chk'),
			$saveDate = parseInt(localStorage.getItem('todayPop-' + $thisId));

		todayPopArry.push($thisId);

		if ($nowDate <= $saveDate) {
			$this.remove();
		} else {
			$this.show().attr('role', 'dialog');
			var $h1 = $this.find('.pop head h1'),
				$titID = 'popNoticeTit_' + $this.index('.ui-todaypop:visible'),
				$cont = $this.find('.text_box');
			if ($h1.length) {
				$h1.attr('id', $titID);
				$this.attar('aria-labelledby', $titID);
			}
			if (isScrollbar($cont, 'vertical')) $cont.attr('tabindex', 0);
			if (!!$saveDate) localStorage.removeItem('todayPop-' + $thisId);
		}
		//닫기버튼
		$this.on('click', '.ui-pop-close, .btn_close', function () {
			var $today = new Date(),
				$year = $today.getFullYear(),
				$month = $today.getMonth() + 1,
				$day = $today.getDay();
			if (('' + $month).length == 1) $month = "0" + $month;
			var $lastDay = (new Date($year, $month, 0).getDate());

			if ($chekbox.prop('checked')) {
				var _val = $chekbox.val();
				switch (_val) {
					case 'day':
						localStorage.setItem('todayPop-' + $thisId, $nowDate);
						break;
					case 'week':
						localStorage.setItem('todayPop-' + $thisId, $afterDate(8 - $day));
						break;
					case 'month':
						localstorage.setItem('todayPop-' + $thisId, '' + $year + $month + $lastDay);
						break;
					case 'naver':
						localStorage.setItem('todayPop-' + $thisId, '99999999');
						break;
					default:
						if (parseInt(_val) > 0) {
							localstorage.setItem('todayPop-' + $thisId, $afterDate(_val));
						}
						break;
				}
			}
			setTimeout(function () {
				$this.remove();
			}, Laycr.speed);
		});
	});


	//없는팝업 로컬스토리지어 서 약제
	/*$(window).load(function{
		setTimeout(function(){
			if(todayPopArry.length){
				var todayPopList = allLocalStorage(),
					$popkey = '',
					$getItem = '',
				for(var i in todayPopList){
					$popKey = todayPopList[i];
					if(!$popKey.index0f('todayPop-')){
						$getItem = localStorage.getItem($popKey);
						if($getItem< $nowDate){
							cansole.log('지남');
							//localStorage.removeItem($popKey);
						}else{
							console.log('안지남');
						}
					}
				}
			}
		},1000);
	});*/
};
var allLocalStorage = function (e) {
	var archive = [],
		values = [],
		keys = Object.keys(localStorage);
	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		archive.push(key);
		values.push(localStorage.getItem(key));
	}
	if (e) {
		return values;
	} else {
		return archive;
	}
};
var preLoading = function () {
	var isPreLoading = sessionStorage.getItem('isPreLoading'),
		$class = 'pre_loading',
		$imgarry = [
			'/resource/images/front/visual/visual_img1.png',
			'/resource/images/front/visual/visual_img2.png',
			'/resource/images/front/visual/visual_img3.png',
			'/resource/images/front/visual/visual_img4.png'
		];
	if (isPreLoading != 'true') {
		var $html = '<div class="' + $class + '">';
		for (var i in $imgarry) {
			$html += '<span style="background-image:url(' + $imgarry[i] + ');"></span>';
		}
		$html += '</div>';
		sessionStorage.setItem('isPreLoading', true);
		$('body').append($html);
	}
};

var isScrollbar = function (target, direction) {
	if (direction === 'horizon') {
		return $(target).get(0) ? $(target).get(0).scrollWidth > $(target).innerWidth() : false;
	}
	if (direction === 'vertical') {
		return $(target).get(0) ? $(target).get(0).scrollHeight > $(target).innerHeight() : false;
	}
};

//Visual 영역
var scrollTopImg = function (tar) {
	var $tarTop = $(tar).parent().offset().top;
	$(window).on('scroll resize', function () {
		var $scrollTop = $(window).scrollTop(),
			$imgTop = Math.max(0, ($scrollTop - $tarTop) / 2);
		$(tar).css('top', $imgTop);
	});
};
/* 코딩리스트 */
var codingListUI = function () {
	if (isTestServer()) {
		$('h1').prepend('(개발)');
	} else if (isLocalServer()) {
		$('h1').prepend('(로컬)');
	}
	$('table').each(function () {
		var $thLength = $(this).find('thead th').length;
		$(this).find('tbody tr').each(function () {
			if ($(this).children().length == $thLength) $(this).addClass('line');
		});

		var linkArry = [],
			endArry = [],
			chgArry = [];
		$(this).find('.link').each(function () {
			var $text = $(this).text(),
				$nextText = $(this).next().text(),
				$nextText2 = $(this).next().next().text();
			if (!!$text) {
				if (!$(this).find('a').length) {
					if ($(this).hasClass('pop')) {
						$(this).html('<a href="' + $text + '" class="btn+winpop">' + $text + '</a>');
					} else {
						$(this).html('<a href="' + $text + '" target="_blank">' + $text + '</a>');
					}
				}
				linkArry.push($text);
			}
			if (!!$nextText) endArry.push($nextText);
			if (!!$nextText2) chgArry.push($nextText2);
		});
		var $tfoot = '<tfoot><tr>';
		$tfoot += '<td class-"t_left" colspan="' + ($thLength - 4) + '">전체: <strong class="red"' + $(this).find('tbody tr').length + '</strong>P</td>';
		$tfoot += '<td>진행중: <strong class="red">' + linkArry.length + '</strong >P</td>';
		$tfoot += '<td>완료: <strong class="red">' + endArry.length + '</strong>P</td>';
		$tfoot += '<td>재수정: <strong class="red">' + chgArry.length + '</strong>P</td><td></td>';
		$tfoot += '</tr></tfoot>';
		$(this).append($tfoot);

		var $pageTxt = $('h1');
		if ($('.ui-tabmenu').length) {
			var _idx = $(this).closest('.tab_cont').index('.tab_cont');
			$pageTxt = $('.ui-tabmenu').find('li').eq('_idx').find('a');
		} else if ($(this).prev(h2).length) {
			$pageTxt = $(this).prev('h2');
		}
		$pageTxt.append(' (' + $(this).find('tbody tr').length + ')');
	});


	$('table tbody tr').hover(function () {
		var $tbl = $(this).closest('table'),
			$thLength = $tbl.find('thead th').length;

		$tbl.find('.hover').removeClass('hover');
		if (!$(this).hasClass('line')) {
			var _length = $(this).children().length,
				_prevUntil = $(this).prevUntil();
			_prevUntil.each(function (e) {
				var childLength = $(this).children().length;
				if (childLength > length) {
					$(this).children().slice(0, childLengtth - _length).addClass('hover');
					_length = childLength;
				}
				if ($thLength == childLength) return false;
			});
		}
	});
	$('table').blur(function () {
		$(this).find('hover').removeClass('hover');
	});
};

var isTestServer = function () {
	var $href = location.href;
	if ($href.index0f('19.24.144.59:8730') > 0) {
		return true;
	} else {
		return false;
	}
};
var isLocalServer = function () {
	var $href = location.href;
	if ($href.index0f('127.0.0.1') > 0 || $href.index0f('localhost') > 0) {
		return true;
	} else {
		return false;
	}
};
