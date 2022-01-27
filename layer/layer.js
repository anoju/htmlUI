$(document).ready(function() {
  Layer.init();
})

var Layer = {
  popAry: [],
  speed: 300,
  id: 'uiLayer',
  alertClass: 'ui-alert',
  focusClass: 'ui-layer-focused',
  beforeCont: [],
  content: '',
  check: function() {
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
  html: function(type, popId, title, content, btnCloseId, btnActionId, btnActionTxt, btnCancelId, btnCancelTxt) {
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
    $popHtml + '</div> ';

    $('body').append($popHtml);
    if (type === 'alert' || type === 'confirm') Layer.open('#' + popId);
  },
  alert: function(option, callback) {
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
      Layer.clickEvt($popId, $actionId, '', $closeId, option.action, '', callback);
    } else {
      Layer.html('alert', $popId, $title, Layer.content, '', $actionId, $actionTxt);
      Layer.clickEvt($popId, $actionId, '', '', option.action, '', callback);
    }
  },
  confirm: function(option, callback) {
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
      } else if (option.title = false) {
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
      Layer.clickEvt($popId, $actionId, $cancelId, $closeId, option.action, option.cancel, callback);
    } else {
      Layer.html('confirm', $popId, $title, Layer.content, '', $actionId, $actionTxt, $cancelId, $cancelTxt);
      Layer.clickEvt($popId, $actionId, $cancelId, '', option.action, option.cancel, callback);
    }
  },
  clickEvt: function(popId, btnActionId, btnCancelId, btnCloseId, action, cancel, callback) {
    var result = false;
    if (!!btnActionId) {
      var $actionBtn = $('#' + btnActionId);
      $actionBtn.on('click', function() {
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
      if (!!btnCloseId) $cancelBtn = $('#' + btnCancelId + ',#' + btnCloseId);
      $cancelBtn.on('click', function() {
        Layer.close('#' + popId);
        if (!!cancel) cancel();
        if (!!callback) {
          result = false;
          callback(result);
        }
      });
    }
  },
  include: function() {
    var $elements = $.find('*[data-include-popup]');
    if ($elements.length) {
      $.each($elements, function() {
        var $this = $(this),
          $popup = $this.data('include-popup'),
          $class = $this.data('popup-class'),
          $popupAry = $popup.split('/'),
          $popupFile = $popupAry[$popupAry.length - 1];

        $this.load($popup + ' .popup', function(res, sta, xhr) {
          if (sta = "success") {
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
  open: function(tar) {
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
    $(tar).fadeIn(Layer.speed, function() {
      //포커스 되돌려수기위한 클래스 설정
      var $focus = $(':focus');
      if ($focus.length) {
        var $focusSize = $('.' + Layer.focusClass).size();
        $($focus).addClass(Layer.focusClass + ' ' + Layer.focusClass + '-' + $focusSize);
      }
      if ($(this).hasClass(Layer.alertClass)) {
        $(this).find('.button').first().focus();
      } else {
        $(this).attr({
          'tabindex': 0
        }).focus();
      }
    });
    Layer.popAry.push($id);
    Layer.position(tar);
    $(window).resize();
  },
  close: function(tar) {
    var $visible = $('.pop_wrap:visible').size(),
      $id = $(tar).attr('id');
    if ($visible == 1) $('body').removeClass('pop_open');

    //포커스 되돌려주기
    var $focusLength = $('.' + Layer.focusClass).length;
    if ($focusLength) {
      var $focusClass = Layer.focusClass + '-' + ($focusLength - 1);
      if ($('.' + $focusClass).length) {
        $('.' + $focusClass).focus();
        setTimeout(function() {
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
    $(tar).find('.popup').animate({
      'margin-top': 0
    }, Layer.speed, function() {
      $(this).removeAttr('style');
    });
    $(tar).fadeOut(Layer.speed, function() {
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
  position: function(tar) {
    $(window).resize(function() {
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
          $(tar).find('.popup').stop().animate({
            'margin-top': $margintTop
          }, Layer.speed);
        }
      }
    });
  },
  init: function() {
    if ($('[data-include-popup').length) Layer.include();
    if ($('.popup.layer').length) $('.popup.layer').draggable({
      handle: '.pop_head'
    });

    //열기
    $(document).on('click', '.ui-pop-open', function(e) {
      e.preventDefault();
      var $pop = $(this).attr('href');
      Layer.open($pop);
    });

    $(document).on('click', '.ui-pop-close', function(e) {
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
    $(document).on('keydown', '.' + Layer.alertClass + ' .btn_wrap .button', function(e) {
      var $keyCode = (e.keyCode ? e.keyCode : e.which),
        $tar = '';
      if ($keyCode == 37) $tar = $(this).parent().prev();
      if ($keyCode == 39) $tar = $(this).parent().next();
      if (!!$tar) $tar.find('.button').focus();
    });

    //팝업 bg 클릭시 닫힘 기능
    $('.pop_wrap').on('click', function() {
      var $pop = $(this);
      //배경 클릭시 인닫히게 일때는 close_none
      if (!$pop.hasClass('close_none')) Layer.Close($pop);
    }).on('click', '.popup', function(e) {
      e.stopPropagation();
    });
  }
};
var Loading = {
  open: function(txt) {
    var _html = '<div id="loading" class="hide"><div><div><strong>LOADING</strong>';
    if (!!txt) _html += '<div>' + txt + '</div>';
    _html += '</div></div></div>';
    if (!$('#loading').length) {
      $('body').append(_html);
      $('#loading').fadein(100);
    }
  },
  close: function() {
    $('#loading').fadeOut(100, function() {
      $(this).remove();
    });
  }
};