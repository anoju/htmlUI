$(document).on('input', 'input[type="datetime"]', function() {
  const $this = $(this);
  const $val = $this.val();
  const $setVal = getDateFormat($val);
  $this.val($setVal);
});
function getDateFormat(str) {
  const $str = getOnlyNumber(str).substr(0, 8);
  const $dateAry = [];
  let $year;
  let $month;
  let $day;
  if ($str.length < 5) {
    $year = $str;
  } else if ($str.length < 7) {
    $year = $str.substr(0, 4);
    $month = $str.substr(4, 2);
  } else {
    $year = $str.substr(0, 4);
    $month = $str.substr(4, 2);
    $day = $str.substr(6);
  }
  if ($year) $dateAry.push($year);
  if ($month) {
    if ($str.length === 6 && parseInt($month) > 12) $month = 12;
    $dateAry.push($month);
  }
  if ($day) {
    const $lastDay = getMonthLastDay($year, $month);
    if ($str.length === 8 && parseInt($day) > $lastDay) $day = $lastDay;
    $dateAry.push($day);
  }
  return $dateAry.join(dateFormatMark);
}