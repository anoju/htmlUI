// 메뉴링크 주소변경
function changeHrefDomain(oldName, newName) {
  const elementsWithHref = document.querySelectorAll('a[href]');

  elementsWithHref.forEach(function(element) {
    const $href = element.href;
    if ($href.indexOf(oldName) > -1) {
      let $newHref = $href.replace(oldName, newName);
      if ($newHref.indexOf('/wp/') === $newHref.length - 4) $newHref = $newHref.replace('/wp/', '/');
      element.href = $newHref;
    }
  });
}
if (location.host.indexOf('hiuxc.co') > -1) changeHrefDomain('taranux.co', 'hiuxc.co');

const uiStorage = {
  set: function(key, value, type) {
    let $storage = type === 'session' ? sessionStorage : localStorage;
    $storage.setItem(key, value);
  },
  get: function(key, type) {
    let $storage = type === 'session' ? sessionStorage : localStorage;
    const $value = $storage.getItem(key);
    return $value;
  },
  remove: function(key, type) {
    let $storage = type === 'session' ? sessionStorage : localStorage;
    $storage.removeItem(key);
  },
  clear: function(type) {
    let $storage = type === 'session' ? sessionStorage : localStorage;
    $storage.clear();
  }
};
const todayTimeString = function(addDay, addMonth, addYear) {
  // const $type = addType ? addType : 'day';
  const $today = new Date();
  if (!!addDay && addDay !== 0) $today.setDate($today.getDate() + addDay);
  if (!!addMonth && addMonth !== 0) $today.setMonth($today.getMonth() + addMonth);
  if (!!addYear && addYear !== 0) $today.setFullYear($today.getFullYear() + addYear);
  return timeString($today);
};
const timeString = function(date) {
  const $year = date.getFullYear();
  let $month = date.getMonth() + 1;
  let $day = date.getDate();
  let $hour = date.getHours();
  let $min = date.getMinutes();
  let $sec = date.getSeconds();
  if (('' + $month).length == 1) $month = '0' + $month;
  if (('' + $day).length == 1) $day = '0' + $day;
  if (('' + $hour).length == 1) $hour = '0' + $hour;
  if (('' + $min).length == 1) $min = '0' + $min;
  if (('' + $sec).length == 1) $sec = '0' + $sec;
  return '' + $year + $month + $day + $hour + $min + $sec;
};
const $dayLabelPrint = function($date) {
  const $today = $date ? new Date($date) : new Date();
  const $week = ['일', '월', '화', '수', '목', '금', '토'];
  const $dayLabel = $week[$today.getDay()];
  return $dayLabel;
};
const $nowDateFull = parseInt(todayTimeString()); //년+월+일+시+분+초
const $nowDateHour = parseInt(todayTimeString().substr(0, 10)); //년+월+일+시
const $nowDateDay = parseInt(todayTimeString().substr(0, 8)); //년+월+일
const $nowDateMonth = parseInt(todayTimeString().substr(0, 6)); //년+월
const $nowDateOnlyFullTime = parseInt(todayTimeString().substr(8, 6)); //시+분
const $nowDateOnlyTime = parseInt(todayTimeString().substr(8, 4)); //시+분
const $nowDateOnlyYear = parseInt(todayTimeString().substr(0, 4)); //년
const $nowDateOnlyMonth = parseInt(todayTimeString().substr(4, 2)); //월
const $nowDateOnlyDay = parseInt(todayTimeString().substr(6, 2)); //일
const $nowDateOnlyHour = parseInt(todayTimeString().substr(8, 2)); //시
const $nowDateOnlyMin = parseInt(todayTimeString().substr(10, 2)); //분
const $nowDateOnlySec = parseInt(todayTimeString().substr(12, 2)); //초
const $nowDateDayLabel = $dayLabelPrint(); //요일
const $addDate = function(day, month, year) {
  return parseInt(todayTimeString(day, month, year).substr(0, 8));
};

(function($) {
  $(document).ready(function() {

    // $('.page-id-111460').find('.box-wrapper').prepend('<div class="popup_bg"><div class="popup"><div class="close_popup"></div></div><div class="nosee"><input type="checkbox" id="nomore"><label for="nomore">오늘하루 그만보기</label></div></div>');
    // $(document).click(function(e) {		
    //     if(!$('.popup_bg').has(e.target).length && $('.popup_bg').hasClass('close')==false){
    //         $('.popup_bg').addClass('close');
    //     }
    // })
    // $('.close_popup').click(function(){		
    //     $(this).parent().parent().addClass('close');
    // })

    if (location.pathname === '/wp/' || location.pathname === '/') {
      const $popHtml = `<div class="today-modal">
          <div class="today-modal-inner">
            <div class="today-modal-img">
              <img src="/wp/wp-content/uploads/2023/11/pop-1.png" alt="">
            </div>
            <div class="today-modal-btn">
              <label class="today-modal-check"><input type="checkbox"><span class="lbl">오늘하루 그만보기</span></label>
              <button type="button" class="today-modal-close">닫기</button>
            </div>
          </div>
        </div>`;
      if (!$('.today-modal').length) $('body').append($popHtml);
      const $getTodayModal = uiStorage.get('todayModal' + $nowDateDay);
      if (!$getTodayModal) $('.today-modal').addClass('on');
      $('.today-modal .today-modal-close').click(function() {
        const $checkbox = $('.today-modal .today-modal-check input');
        $(this).closest('.today-modal').fadeOut();
        if ($checkbox.prop('checked')) {
          uiStorage.set('todayModal' + $nowDateDay, true);
        }
      });
    }
  });

  $(window).load(function() {

    // modify menu name ((주)타란UX컨설팅 > Home) 2023-01-26
    $('#menu-taranux-menu-1').find('.menu-item-home > a').text('Home');

    // Homepage delete link 

    $('.link_to').find('.col-link.custom-link').removeAttr('href');
    $('.link_to').find('.col-link.custom-link').attr('onclick', 'Javascript: return false;');

    $('.link_to.kb_star').find('.col-link.custom-link').click(function(e) {
      e.preventDefault();
      location.href = "/wp/?page_id=112097";
    });

    $('.link_to.kb_stock').find('.col-link.custom-link').click(function(e) {
      e.preventDefault();
      location.href = "/wp/?page_id=110703";
    });

    $('.link_to.kkl').find('.col-link.custom-link').click(function(e) {
      e.preventDefault();
      location.href = "/wp/?page_id=112153";
    });

    $('.link_to.kcredit').find('.col-link.custom-link').click(function(e) {
      e.preventDefault();
      location.href = "/wp/?page_id=110700";
    });

    $('.link_to.orora').find('.col-link.custom-link').click(function(e) {
      e.preventDefault();
      location.href = "/wp/?page_id=110694";
    });

    $('.link_to.dt_lab').find('.col-link.custom-link').click(function(e) {
      e.preventDefault();
      location.href = "/wp/?page_id=110636";
    });


    //pop_up cookie
    $('.nosee').click(function() {
      $(this).find('#nomore').toggleClass('clicked')
    })
    $('.nosee label').click(function() {
      $('.nosee').find('#nomore').toggleClass('clicked')
    })

    let myPopup = $('#pum-112019'),
      closeBtn = $('.pum-close.popmake-close'),
      oneDayCheck = $('#nomore');

    function checkcookie(name) {
      var cookies = document.cookie.split(';');
      var visited = false;

      for (ck of cookies) {
        if (ck.indexOf(name) > -1) {
          visited = true;
        }
      }
      if (visited) {
        myPopup.addClass('none_display');
        // alert('재방문');
      } else {
        myPopup.removeClass('none_display')
        // alert('첫방문');
      }
    }

    checkcookie('taranux');

    function setcookie(name, value, day) {
      var date = new Date();
      date.setDate(date.getDate() + day); // 2023-02-07 day > 7

      var myCookie = '';
      myCookie = `${name}=${value};Expires=${date.toUTCString()}`;

      document.cookie = myCookie;
      //alert('쿠키저장 성공');
    } //setcookie

    function deleteCookie(name, value) {
      var date = new Date();
      date.setDate(date.getDate() - 1);

      var myCookie = '';
      myCookie = `${name}=${value};Expires=${date.toUTCString()}`;

      document.cookie = myCookie;
    }

    closeBtn.click(function(e) {
      if (!oneDayCheck.hasClass('clicked')) { //체크안되어 있을 때
        deleteCookie('taranux', 'home');
      } else { //체크되어 있을 때
        setcookie('taranux', 'home', 1);
      }
      myPopup.css('display', 'none');
    });

    /* work list add year */
    $('.year_txt').each(function() {
      var $this = $(this);
      var year = $(this).text();
      $this.parents('a').children('.drop-image-extra').append('<span class="t-entry-category">' + year + '</span>');
    });
    $('.year_2021').find('a').css('cursor', 'default');
    $('.year_2021').find('a').click(function(e) {
      e.preventDefault();
    });

    $('.mobile-menu-button.lines-button').click(function() {
      if ($(this).find('.position_box').hasClass('overflow_hidden')) {
        $(this).find('.position_box').removeClass('overflow_hidden');
      }
    });

    $('.lines-button .lines').wrap('<div class="position_box overflow_hidden">' + '</div>');
    $('.lines-button .lines').after('<div class="lines_after">' + '</div>');
    $('.lines_after').before('<div class="lines_before">' + '</div>');


    /* about attraction */
    if ($(window).width() > 1280) {
      $(window).scroll(function() {
        var scrollValue = $(document).scrollTop();
        if (!$('.title_text').length || !$('.service_list').length || !$('.service_background').length) return;
        var service = $('.title_text').offset().top,
          serviceList = $('.service_list').offset().top + $('.service_list').height() / 2.5,
          serviceBack = $('.service_background');

        if (scrollValue > service) {
          serviceBack.addClass('fix');
        } else {
          serviceBack.removeClass('fix');
        }
        if (scrollValue >= serviceList) {
          serviceBack.addClass('bottom');
        } else {
          serviceBack.removeClass('bottom');
        }
      });
    }

    /*contact*/
    $('#contents_wrap .uncont').find('.btn-container').wrapAll('<div id="button_wrap"></div>');

    /*homepage_menu_background_color_control*/
    if ($(window).width() > 1400) {
      if (!$('body').hasClass('taran_homepage')) {
        $('.style-color-xsdn-bg').css('background-color', 'rgb(255,255,255)');
        if ($(document).scrollTop() > 0) {
          //$('.style-color-xsdn-bg').addClass('boxShadow');
        } else if ($(document).scrollTop() === 0) {
          //$('.style-color-xsdn-bg').removeClass('boxShadow');
        }
      }
    }
    if ($(window).width() < 500) {
      if ($('body').hasClass('taran_homepage')) {
        $('body').removeClass('uncode-fullpage-trid');
        $('body').addClass('uncode-fullpage-parallax');
        $('#pagination_container1').css('display', 'none');
      }
    }
  });

  if ($('body').hasClass('contact_page')) {
    var mapLocation = {
      'x': 37.530733879674145,
      'y': 126.89887339311068
    }
    var mapContainer1 = document.getElementById('taranmap_container');
    var mapOptions1 = {
      center: new kakao.maps.LatLng(mapLocation.x, mapLocation.y),
      level: 3
    };
    var map1 = new kakao.maps.Map(mapContainer1, mapOptions1);

    var markerPosition = new kakao.maps.LatLng(mapLocation.x, mapLocation.y);

    var imageSrc = '/wp/wp-content/uploads/2023/11/map_marker3.png'; // 마커이미지의 주소
    var imageSize;
    var imageOption1;
    if ($(window).width() < 800) {
      imageSize = new kakao.maps.Size(56, 64); // 마커이미지의 크기
      imageOption1 = {
        offset: new kakao.maps.Point(28, 64)
      }; // 마커이미지의 옵션
    } else {
      imageSize = new kakao.maps.Size(110, 128); // 마커이미지의 크기
      imageOption1 = {
        offset: new kakao.maps.Point(55, 128)
      }; // 마커이미지의 옵션
    }

    var markerImage1 = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption1),
      markerPosition1 = new kakao.maps.LatLng(mapLocation.x, mapLocation.y);

    var marker1 = new kakao.maps.Marker({
      position: markerPosition1,
      image: markerImage1
    });

    marker1.setMap(map1);
  }
})(jQuery);