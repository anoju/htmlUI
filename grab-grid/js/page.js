setGridSize();
grabResize();

function grabResize() {
  const wrap = document.querySelector('.wrap');
  wrap.addEventListener('mousedown', _start, false);
  wrap.addEventListener('mousemove', _move, false);
  wrap.addEventListener('mouseup', _end, false);
  wrap.addEventListener('touchstart', _start, {
    passive: true
  });
  wrap.addEventListener('touchmove', _move, {
    passive: true
  });
  wrap.addEventListener('touchend', _end, false);

  let grabing = false;
  let $startX = 0;
  let $startY = 0;
  let $prevVal = 0;
  let $nextVal = 0;
  let $prevPer = 0;
  let $nextPer = 0;
  let $totalPer = 0;
  let $target;
  let prevEl;
  let nextEl;

  function _start(e) {
    $target = e.target;
    if ($target.classList.contains('wrap-grab')) {
      const $clientX = e.targetTouches ? e.targetTouches[0].clientX : e.clientX;
      const $clientY = e.targetTouches ? e.targetTouches[0].clientY : e.clientY;
      $startX = $clientX;
      $startY = $clientY;

      prevEl = $target.previousElementSibling;
      nextEl = $target.nextElementSibling;
      if ($target.classList.contains('col')) {
        if (prevEl) {
          $prevVal = prevEl.offsetWidth;
          $prevPer = parseFloat(prevEl.style.width.replace('%', ''));
          if (prevEl.dataset.reset === undefined) prevEl.dataset.reset = $prevPer;
        }
        if (nextEl) {
          $nextVal = nextEl.offsetWidth;
          $nextPer = parseFloat(nextEl.style.width.replace('%', ''));
          if (nextEl.dataset.reset === undefined) nextEl.dataset.reset = $nextPer;
        }
      }
      if ($target.classList.contains('row')) {
        if (prevEl) {
          $prevVal = prevEl.offsetHeight;
          $prevPer = parseFloat(prevEl.style.height.replace('%', ''));
          if (prevEl.dataset.reset === undefined) prevEl.dataset.reset = $prevPer;
        }
        if (nextEl) {
          $nextVal = nextEl.offsetHeight;
          $nextPer = parseFloat(nextEl.style.height.replace('%', ''));
          if (nextEl.dataset.reset === undefined) nextEl.dataset.reset = $nextPer;
        }
      }
      $totalPer = $prevPer + $nextPer;
      grabing = true;
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
    const $maxWidth = (prevEl ? prevEl.offsetWidth : 0) + (nextEl ? nextEl.offsetWidth : 0) - $minWidth;
    const $maxHeight = (prevEl ? prevEl.offsetHeight : 0) + (nextEl ? nextEl.offsetHeight : 0) - $minHeight;

    if ($target.classList.contains('col')) {
      const $prevX = $prevVal + $moveX;
      const $nextX = $nextVal - $moveX;
      if (prevEl && $prevX >= $minWidth && $prevX <= $maxWidth) {
        const getDistancePer = getDistancePercentage($prevX);
        prevEl.style.width = getDistancePer + '%';
        if (nextEl) nextEl.style.width = $totalPer - getDistancePer + '%';
      } else if (nextEl && $nextX >= $minWidth && $nextX <= $maxWidth) {
        const getDistancePer = getDistancePercentage($nextX);
        nextEl.style.width = getDistancePer + '%';
      }
    }
    if ($target.classList.contains('row')) {
      const $prevY = $prevVal + $moveY;
      const $nextY = $nextVal - $moveY;
      if (prevEl && $prevY >= $minHeight && $prevY <= $maxHeight) {
        const getDistancePer = getDistancePercentage($prevY, 'height')
        prevEl.style.height = getDistancePer + '%';
        if (nextEl) nextEl.style.height = $totalPer - getDistancePer + '%';
      } else if (nextEl && $nextY >= $minWidth && $nextY <= $maxWidth) {
        const getDistancePer = getDistancePercentage($nextY, 'height');
        nextEl.style.height = getDistancePer + '%';
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

function getDistancePercentage(distance, type) {
  const $sum = type === 'height' ? grabWrap().height : grabWrap().width;
  const $distance = Math.round(distance / $sum * 1000000) / 10000;
  return $distance;
}

function getGridSize() {
  const $cols = document.querySelectorAll('.wrap-col');
  const $colsWidth = [];
  $cols.forEach(function(colItem) {
    const $width = parseFloat(colItem.style.width.replace('%', ''));
    $colsWidth.push($width);
  });

  const $rows = document.querySelectorAll('.wrap-row');
  const $rowsHeight = [];
  $rows.forEach(function(rowItem) {
    const $height = parseFloat(rowItem.style.height.replace('%', ''));
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
      colItem.style.width = $colWidth[i] + '%';
    });
  }
  const rowSize = localStorage.getItem('gridSize-row');
  if (rowSize) {
    const $rowHeight = rowSize.split(',');
    const $rows = document.querySelectorAll('.wrap-row');
    $rows.forEach(function(rowItem, i) {
      rowItem.style.height = $rowHeight[i] + '%';
    });
  }
}

function grabWrap() {
  let width = document.querySelector('.wrap').clientWidth;
  const colGrab = document.querySelectorAll('.wrap-grab.col');
  if (colGrab) {
    colGrab.forEach(function(item) {
      width -= item.offsetWidth;
    });
  }

  let height = document.querySelector('.wrap').clientHeight;
  const rowGrab = document.querySelectorAll('.wrap-grab.row');
  if (rowGrab) {
    rowGrab.forEach(function(item) {
      height -= item.offsetHeight;
    });
  }
  return {
    'width': width,
    'height': height
  };
}

document.querySelector('.reset').addEventListener('click', gridReset)

function gridReset() {
  localStorage.removeItem('gridSize-col');
  localStorage.removeItem('gridSize-row');
  const $cols = document.querySelectorAll('.wrap-col');
  $cols.forEach(function(colItem) {
    colItem.style.width = colItem.dataset.reset + '%';
    delete colItem.dataset.reset;
  });
  const $rows = document.querySelectorAll('.wrap-row');
  $rows.forEach(function(rowItem, i) {
    rowItem.style.height = rowItem.dataset.reset + '%';
    delete rowItem.dataset.reset;
  });
}