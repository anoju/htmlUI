setGridSize();
grabResize();
// window.addEventListener('resize', setGridSize, false)

function grabResize() {
  const wrap = document.querySelector('.wrap');
  wrap.addEventListener('mousedown', _start, false);
  wrap.addEventListener('mousemove', _move, false);
  wrap.addEventListener('mouseup', _end, true);
  wrap.addEventListener('touchstart', _start, false);
  wrap.addEventListener('touchmove', _move, false);
  wrap.addEventListener('touchend', _end, false);

  let grabing = false;
  let $startX = 0;
  let $startY = 0;
  let $prevVal = 0;
  let $nextVal = 0;
  let $target;
  let prevEl;
  let nextEl;

  function _start(e) {
    $target = e.target;
    if ($target.classList.contains('wrap-grab')) {
      grabing = true;
      const $clientX = e.targetTouches ? e.targetTouches[0].clientX : e.clientX;
      const $clientY = e.targetTouches ? e.targetTouches[0].clientY : e.clientY;
      $startX = $clientX;
      $startY = $clientY;

      prevEl = $target.previousElementSibling;
      nextEl = $target.nextElementSibling;
      if ($target.classList.contains('col')) {
        if (prevEl) $prevVal = prevEl.offsetWidth;
        if (nextEl) $nextVal = nextEl.offsetWidth;
      }
      if ($target.classList.contains('row')) {
        if (prevEl) $prevVal = prevEl.offsetHeight;
        if (nextEl) $nextVal = nextEl.offsetHeight;
      }
    }
  }

  function _move(e) {
    if (!grabing) return;
    const $clientX = e.targetTouches ? e.targetTouches[0].clientX : e.clientX;
    const $clientY = e.targetTouches ? e.targetTouches[0].clientY : e.clientY;
    const $moveX = $clientX - $startX;
    const $moveY = $clientY - $startY;
    const $minWidth = 150;
    const $minHeight = 100;
    if ($target.classList.contains('col')) {
      $prevW = Math.round(($prevVal + $moveX) / $wrapWidth() * 10000) / 100;
      $nextW = Math.round(($nextVal - $moveX) / $wrapWidth() * 10000) / 100;
      if ($prevVal + $moveX >= $minWidth && $nextVal - $moveX >= $minWidth) {
        prevEl.style.width = $prevW + '%';
        nextEl.style.width = $nextW + '%';
      }
    }
    if ($target.classList.contains('row')) {
      $prevH = Math.round(($prevVal + $moveY) / $wrapHeight() * 10000) / 100;
      $nextH = Math.round(($nextVal - $moveY) / $wrapHeight() * 10000) / 100;
      if ($prevVal + $moveY >= $minHeight && $nextVal - $moveY >= $minHeight) {
        prevEl.style.height = $prevH + '%';
        nextEl.style.height = $nextH + '%';
      }
    }
  }

  function _end(e) {
    if (!grabing) return;
    grabing = false;
    const $clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const $clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
    $startX = $clientX;
    $startY = $clientY;
    getGridSize();
  }
}


function getGridSize() {
  const $cols = document.querySelectorAll('.wrap-col');
  const $colsWidth = [];
  $cols.forEach(function(colItem) {
    const $width = colItem.offsetWidth;
    $colsWidth.push($width);
  });

  const $rows = document.querySelectorAll('.wrap-row');
  const $rowsHeight = [];
  $rows.forEach(function(rowItem) {
    const $height = rowItem.offsetHeight;
    $rowsHeight.push($height);
  });
  localStorage.setItem('gridSize-col', $colsWidth);
  localStorage.setItem('gridSize-row', $rowsHeight);
}

function setGridSize() {
  const colSize = localStorage.getItem('gridSize-col');
  if (colSize) {
    const $colWidth = colSize.split(',');;

    const $cols = document.querySelectorAll('.wrap-col');
    $cols.forEach(function(colItem, i) {
      const $w = Math.round(parseInt($colWidth[i]) / $wrapWidth() * 10000) / 100;
      colItem.style.width = $w + '%';
    });
  }
  const rowSize = localStorage.getItem('gridSize-row');
  if (rowSize) {
    const $rowHeight = rowSize.split(',');
    const $rows = document.querySelectorAll('.wrap-row');
    $rows.forEach(function(rowItem, i) {
      const $h = Math.round(parseInt($rowHeight[i]) / $wrapHeight() * 10000) / 100;
      rowItem.style.height = $h + '%';
    });
  }
}

function $wrapWidth() {
  let wrapW = document.querySelector('.wrap').clientWidth;
  const colGrab = document.querySelectorAll('.wrap-grab.col');
  if (colGrab) {
    colGrab.forEach(function(item) {
      wrapW -= item.offsetWidth
    });
  }
  return wrapW;
}

function $wrapHeight() {
  let wrapH = document.querySelector('.wrap').clientHeight;
  const rowGrab = document.querySelectorAll('.wrap-grab.row');
  if (rowGrab) {
    rowGrab.forEach(function(item) {
      wrapH -= item.offsetHeight
    });
  }
  return wrapH;
}