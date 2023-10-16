setGridSize();
grabResize();

function grabResize(){
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
  function _start(e){
    $target = e.target;
    if($target.classList.contains('wrap-grab')){
      grabing = true;
      const $clientX = e.targetTouches ? e.targetTouches[0].clientX : e.clientX;
      const $clientY = e.targetTouches ? e.targetTouches[0].clientY : e.clientY;
      $startX = $clientX;
      $startY = $clientY;

      prevEl = $target.previousElementSibling;
      nextEl = $target.nextElementSibling;
      if($target.classList.contains('col')){
        if (prevEl) $prevVal = prevEl.offsetWidth;
        if (nextEl) $nextVal = nextEl.offsetWidth;
      }
      if($target.classList.contains('row')){
        if (prevEl) $prevVal = prevEl.offsetHeight;
        if (nextEl) $nextVal = nextEl.offsetHeight;
      }
    }
  }
  function _move(e){
    if(!grabing) return;
    const $clientX = e.targetTouches ? e.targetTouches[0].clientX : e.clientX;
    const $clientY = e.targetTouches ? e.targetTouches[0].clientY : e.clientY;
    const $moveX = $clientX - $startX;
    const $moveY = $clientY - $startY;
    const $minWidth = 150; 
    const $minHeight = 100; 
    if($target.classList.contains('col')){
      $prevW = $prevVal + $moveX;
      $nextW = $nextVal - $moveX;
      if($prevW >= $minWidth && $nextW >= $minWidth ){
        prevEl.style.width = $prevW + 'px';
        nextEl.style.width = $nextW + 'px';
      }
    }
    if($target.classList.contains('row')){
      $prevH = $prevVal + $moveY;
      $nextH = $nextVal - $moveY;
      if($prevH >= $minHeight && $nextH >= $minHeight ){
        prevEl.style.height = $prevH + 'px';
        nextEl.style.height = $nextH + 'px';
      }
    }
  }

  function _end(e){
    if(!grabing) return;
    grabing = false;
    const $clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const $clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
    $startX = $clientX;
    $startY = $clientY;
    getGridSize();
  }
}


function getGridSize(){
  const $cols = document.querySelectorAll('.wrap-col');
  const $colsWidth = [];
  $cols.forEach(function(colItem){
    const $width = colItem.offsetWidth;
    $colsWidth.push($width);
  });

  const $rows = document.querySelectorAll('.wrap-row');
  const $rowsHeight = [];
  $rows.forEach(function(rowItem){
    const $height = rowItem.offsetHeight;
    $rowsHeight.push($height);
  });
  localStorage.setItem('gridSize-col', $colsWidth);
  localStorage.setItem('gridSize-row', $rowsHeight);
}

function setGridSize(){
  const colSize = localStorage.getItem('gridSize-col');
  if(colSize){
    const $colWidth = colSize.split(',');
    const $cols = document.querySelectorAll('.wrap-col');
    $cols.forEach(function(colItem, i){
      colItem.style.width = $colWidth[i] + 'px';
    });
  }
  const rowSize = localStorage.getItem('gridSize-row');
  if(rowSize){
    const $rowHeight = rowSize.split(',');
    const $rows = document.querySelectorAll('.wrap-row');
    $rows.forEach(function(rowItem, i){
      rowItem.style.height = $rowHeight[i] + 'px';
    });
  }
  /*
  

  const $rows = document.querySelectorAll('.wrap-row');
  const $rowsHeight = [];
  $rows.forEach(function(rowItem){
    const $height = rowItem.offsetHeight;
    $rowsHeight.push($height);
  });
  const setVal = {
    'col': $colsWidth,
    'row': $rowsHeight
  }
  */
}
