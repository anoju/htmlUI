
/*************************************
* 공통 변수 
**************************************/
var horizontalMultiBarSeries = [
  {
    type: 'bar',
    name: '홍길동',
    stack: 'MultiChart', // 이름이 모두 동일해야 함.
    data: [4],
    showBackground: true,
    backgroundStyle: {
      borderRadius: [6, 6, 6, 6],
    },
    itemStyle: {
      borderRadius: [6, 0, 0, 6],
    },
  },
  {
    type: 'bar',
    name: '김윤정',
    stack: 'MultiChart', // 이름이 모두 동일해야 함.
    data: [4],
  },
  {
    type: 'bar',
    name: '권나연',
    stack: 'MultiChart', // 이름이 모두 동일해야 함.
    data: [10],
  },
  {
    type: 'bar',
    name: '박은희',
    stack: 'MultiChart', // 이름이 모두 동일해야 함.
    data: [1],
    itemStyle: {
      borderRadius: [0, 6, 6, 0],
    },
  },
]

// 멀티차트 툴팁 커스텀. value 에 % 추가
let multiChartTooltip = {
  trigger: 'axis', // item, axis 유형이 있음. 개별 툴팁일지, 바 전체 툴팁일지 결정 
  borderColor: 'transparent',
  textStyle: {
    fontSize: 11,
    fontFamily: 'Noto Sans KR',
  },
  appendToBody: true,
  formatter: function(params) {
    var obj = `<div class="tooltip-title">${params[0].axisValue}</div>`

    // sum 구하기
    var sum = 0;
    for(var i=0; i<params.length; i++) {
      sum += params[i].value;

      // 1000단위 콤마(,) 추가, 
      var addCommaValue = params[i].value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      // 비율구하기
      var percent = (params[i].value / sum * 100).toFixed(1);

      obj += `<div class="tooltip-remark" style="--color:${params[i].color}">${params[i].seriesName} <span class="values">${addCommaValue}명 (${percent}%)</span></div>`
    }

    return obj;
  },
}

/**************************
* Bar1 - 기본유형
***************************/
const barChart1 = () => {
  var chartDom = document.getElementById('barV-1');
  var myChart = echarts.init(chartDom);

  option = {
    grid: {
      show: false,
      width: 240,
      left: 'center', // 숫자 가능
      bottom: 25,
    },
    color: ['#2d99ff'],
    barWidth: 24,
    xAxis: {
      type: 'category',
      data: ['02.08', '02.09', '02.10', '02.11', '02.12'],
      axisLabel: {
        color: '#888',
        fontSize: 12,
        fontFamily: 'Noto Sans KR',
      },
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: '#ddd',
        },
      },
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    tooltip: {
      trigger: 'axis', // item 기본값. axis 일경우 xAxis value 값 위치가 변경됨.
    },
    label: {
      show: true,
      position: 'top',
      fontSize: 14,
      fontWeight: '500',
      fontFamily: 'Noto Sans KR',
    },
    series: [
      {
        type: 'bar',
        itemStyle: {
          borderRadius: [6,6,0,0],
        },
        label: {
          formatter: function(params) {
            var addCommaValue = params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return addCommaValue + '건';
          }
        },
        data: [5, 6, 2, 1, 3], 
        // data: [{value: 5},{value: 4}, {value: 2}, {value: 1}, {value: 3}], 두가지 형태 모두 가능
      }
    ],
  }

  option && myChart.setOption(option);
};



/**************************
* Bar2 - Lable 데이터 커스텀 
***************************/
const barChart2 = () => {
  var chartDom = document.getElementById('barV-2');
  var myChart = echarts.init(chartDom);

  option = {
    grid: {
      show: false,
      width: 240,
      left: 'center', // 숫자 가능
      bottom: 25,
    },
    barWidth: 45,
    xAxis: {
      type: 'category',
      data: ['02.02', '02.03'],
      axisLabel: {
        color: '#555',
        fontSize: 12,
        fontFamily: 'Noto Sans KR',
      },
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: '#ddd',
        },
      },
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    tooltip: {
      trigger: 'axis', // 바 전체 데이터 나옴
      borderColor: 'transparent',
      textStyle: {
        fontSize: 11,
        fontFamily: 'Noto Sans KR',
      },
      appendToBody: true,
    },
    label: {
      show: true,
      position: 'top',
      fontSize: 14,
      fontWeight: '500',
      fontFamily: 'Noto Sans KR',
    },
    series: [
      {
        type: 'bar',
        itemStyle: {
          borderRadius: [6,6,0,0],
        },
        label: {
          formatter: function(params) {
            return params.data.tooltip;
          }
        },
        data: [
          {
            value: 3000,
            tooltip: '10% 증가',  
            itemStyle: {
              color: '#ddd',
            }
          },
          {
            value: 2200,
            tooltip: '20% 증가',
            itemStyle: {
              color: '#feb23a',
            }
          },
        ],
      }
    ],
  }

  option && myChart.setOption(option);
};

/*********************
* Multi Bar
**********************/
const MultiBar1 = () => {
  var chartDom = document.getElementById('multiBarV-1');
  var myChart = echarts.init(chartDom);

  option = {
    grid: {
      show: false,
      width: 240,
      left: 'center', // 숫자 가능
      bottom: 25,
    },
    barWidth: 45,
    xAxis: {
      type: 'category',
      data: ['02.02', '02.03'],
      axisLabel: {
        color: '#555',
        fontSize: 12,
        fontFamily: 'Noto Sans KR',
      },
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: '#ddd',
        },
      },
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    tooltip: multiChartTooltip,
    label: {
      show: true,
      position: 'top',
      fontSize: 14,
      fontWeight: '500',
      fontFamily: 'Noto Sans KR',
    },
    series: [
      {
        name:'범례 A',
        type: 'bar',
        stack: 'MultiChart', // 이름이 모두 동일해야 함.
        data: [120, 132],
        label: {
          show: false,
        }
      },
      {
        name:'범례 B',
        type: 'bar',
        stack: 'MultiChart', // 이름이 모두 동일해야 함.
        data: [220, 80],
        label: {
          show: false,
        }
      },
      {
        name:'범례 C',
        type: 'bar',
        stack: 'MultiChart', // 이름이 모두 동일해야 함.
        data: [150, 120],
        label: {
          formatter: function(params) {
            return '10%증가'
          }
        },
        itemStyle: {
          borderRadius: [6,6,0,0],
        }
      }
    ],
  }

  option && myChart.setOption(option);
};

/****************************
* Horizontal BarChart 기본유형 
*****************************/
const horizontalBarChart1 = () => {
  var chartDom = document.getElementById('barH-1');
  var myChart = echarts.init(chartDom);

  option = {
    grid: {
      left: 20,
      right: 20, 
      top: 'center',
    },
    barWidth: 12,
    xAxis: {
      type: 'value',
      
      max: 100, // data 합계를 넣어야 bar의 가로 너비가 100%로 참
      show: false,
    },
    yAxis: {
      type: 'category',
      show: false,
      data: ['범례'],
    },
    tooltip: {},
    series: [
      {
        type: 'bar',
        name: '차트이름',
        data: [78],
        showBackground: true,
        backgroundStyle: {
          borderRadius: [6, 6, 6, 6],
          borderWidth: 1,
          borderColor: '#e8e8e8',
          color: '#eaeaea',
        },
        itemStyle: {
          borderRadius: [6, 6, 6, 6],
          color: '#2d99ff',
        }
      }
    ],
  }

  option && myChart.setOption(option);
};




/*************************************
* Horizontal Multi BarChart 기본형 
**************************************/
const horizontalMultiBar1 = () => {
  var chartDom = document.getElementById('multiBarH-1');
  var myChart = echarts.init(chartDom);

  var total = 0;
  horizontalMultiBarSeries.forEach(function(item) {
    total += item.data[0];
  }); 

  option = {
    grid: {
      show: false,
      left: 4,
      right: 4,
    },
    barWidth: 12,
    xAxis: {
      type: 'value',
      max: total, // data 합계를 넣어야 bar의 가로 너비가 100%로 참
      show: false,
    },
    yAxis: {
      type: 'category',
      show: false,
      data: ['접속횟수'],
    },
    tooltip: {},
    series: horizontalMultiBarSeries,
  }

  option && myChart.setOption(option);
};

/*************************************************
* Horizontal Multi BarChart 커스텀 툴팁. value
**************************************************/
const horizontalMultiBar2 = () => {
  var chartDom = document.getElementById('multiBarH-2');
  var myChart = echarts.init(chartDom);

  var total = 0;
  horizontalMultiBarSeries.forEach(function(item) {
    total += item.data[0];
  }); 

  option = {
    grid: {
      show: false,
      left: 4,
      right: 4,
    },
    barWidth: 12,
    color: ['#bc6eff', '#826af9', '#2d99ff', '#5066f7', 'powderblue'],
    xAxis: {
      type: 'value',
      max: total, // data 합계를 넣어야 bar의 가로 너비가 100%로 참
      show: false,
    },
    yAxis: {
      type: 'category',
      show: false,
      data: ['접속횟수'],
    },
    tooltip: {
      className: 'tooltip-custom-black',
      borderColor: 'transparent',
      appendToBody: true,
      formatter: function(item) {
        // 1000단위 콤마(,) 추가, 
        var addCommaValue = item.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return `<div><span class="label">${item.seriesName}</span><span class="value">${addCommaValue}회</span></div>`
      }
    },
    series: horizontalMultiBarSeries,
  }

  option && myChart.setOption(option);
};

/*************************************************
* Horizontal Multi BarChart 커스텀 툴팁. %
**************************************************/
const horizontalMultiBar3 = () => {
  var chartDom = document.getElementById('multiBarH-3');
  var myChart = echarts.init(chartDom);

  var total = 0;
  horizontalMultiBarSeries.forEach(function(item) {
    total += item.data[0];
  }); 

  option = {
    grid: {
      show: false,
      left: 4,
      right: 4,
    },
    barWidth: 12,
    xAxis: {
      type: 'value',
      max: total, // data 합계를 넣어야 bar의 가로 너비가 100%로 참
      show: false,
    },
    yAxis: {
      type: 'category',
      show: false,
      data: ['접속횟수'],
    },
    tooltip: {
      className: 'tooltip-custom-black',
      borderColor: 'transparent',
      appendToBody: true,
      formatter: function(item) {
        // percent
        var percent = (item.data / total * 100).toFixed(2);
        return `<div><span class="label">${item.seriesName}</span><span class="value">${percent}%</span></div>`
      }
    },
    series: horizontalMultiBarSeries,
  }

  option && myChart.setOption(option);
};


/*************************************************
* Pie Chart
**************************************************/
const pieChart1 = () => {
  var chartDom = document.getElementById('pie-1');
  var myChart = echarts.init(chartDom);

  var seriesData = [
    {
      name: '범례A',
      value: 2,
    },
    {
      name: '범례B',
      value: 5,
    },
    {
      name: '범례C',
      value: 3,
    },
    {
      name: '범례D',
      value: 0,
    },
    {
      name: '범례E',
      value: 1,
    },
  ];

  option = {
    grid: {
      width: 280
    },
    height: 260,
    legend: {
      bottom: 0,
      itemGap: 15,
      itemWidth: 12,
      icon: 'circle', 
      //selectedMode: false, //범례 별 끄고 켜기
      formatter: function(name) {
        // 인자 name은 범례명 
        // 데이터에서 name과 동일한 데이터의 value 값을 찾아와 legend에 같이 출력
        let itemValue = seriesData.filter(item => item.name === name);
        return name + ' (' + itemValue[0].value + ')';
      }
    },
    tooltip: {},
    series: [
      {
        type: 'pie',
        radius: ['67%', '77%'],
        empasis: {
          disabled: true,
          scale: false,
        },
        clockwise: true, // 애니메이션 시 차트 생성 방향. true 시계방향
       // animation: false, // 범례 값이 0이면 깜빡이는 현상 있음. 
        label: {
          show: false
        },
        color: ['#bc6eff', '#826af9', '#2d99ff', '#5066f7', '#2cd9c5', '#30bc86', '#ffc400', '#fe943a', '#bbbbbb'],
        data: seriesData,
        // top: 0
      }
    ],
  }

  option && myChart.setOption(option);
};



/*************************************************
* SVG 커스텀 Chart
**************************************************/
const svgChart1 = () => {
  const gradientBar = document.getElementById('graBar');
  let chartValue = 30; // 차트에 적용될 데이터
  let maxValue = 40; // 최대값
  const calcValue = chartValue / maxValue * 100 //퍼센트 변환
  gradientBar.style.setProperty('--v', calcValue);
  gradientBar.classList.add('ani');
};



/*************************************************
* Line 블록형
**************************************************/
const blockLine1 = () => {
  var chartDom = document.getElementById('line-1');
  var myChart = echarts.init(chartDom);

  option = {
    grid: {
      left: 30,
      right: 10,
      top: 20,
    },
    color: ['#bc6eff', '#826af9', '#2d99ff'],
    xAxis: {
      type: 'category',
      axisLabel: {
        color: '#888',
        fontSize: 11,
        fontWeight: 300,
      },
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: '#ddd'
        },
      },
      data: ['1일', '2일', '3일', '4일', '5일', '6일', '7일', '8일', '9일']
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#888',
        fontSize: 11,
        fontWeight: 300,
      },
    },
    legend: {
      bottom: 0, 
      left: 'center',
      itemWidth: 12,
      icon: 'circle',
      textStyle: {
        overflow: 'truncate', // ellipsis 작동안함.
      },
      // orient: 'vertical',
    },
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
    },
    series: [
      {
        type: 'line',
        name: '홍길동',
        data: [50,50,50,50,50,50,0,0,0,0],
        areaStyle: {},
        showSymbol: false,
        simbolSize: 0,
        lineStyle: {
          width: 0,
        },
      },
      {
        type: 'line',
        name: '김나영',
        data: [0,0,250,250,250,250,150,150,180,0],
        areaStyle: {},
        showSymbol: false,
        simbolSize: 0,
        lineStyle: {
          width: 0,
        },
      },
      {
        type: 'line',
        name: '최지훈',
        data: [0,0,0,0,300,300,300,250,250,0],
        areaStyle: {},
        showSymbol: false,
        simbolSize: 0,
        lineStyle: {
          width: 0,
        },
      },
    ],
  }

  option && myChart.setOption(option);
};



/*************************************************
* Pie Chart - Label 고정
**************************************************/
const pieChart2 = () => {
  var chartDom = document.getElementById('pie-2');
  var myChart = echarts.init(chartDom);

  var seriesData = [
    {
      name: '범례A',
      value: 50000,
    },
    {
      name: '범례B',
      value: 180000,
    },
    {
      name: '범례C',
      value: 120000,
    },
    {
      name: '범례D',
      value: 80000,
    },
    {
      name: '범례E',
      value: 70000,
    },
  ];

  option = {
    // grid: {
    //   top: 100
    // },
    //height: 300,
    title: {
      left: 0,
      text: "차트 타이틀",
      textStyle: {
        color: '#333',
        fontSize: 16
      }
    },
    legend: {
      bottom: 0,
      itemGap: 15,
      itemWidth: 12,
      icon: 'circle', 
      selectedMode: true, //범례 별 끄고 켜기
      formatter: function(name) {
        // 인자 name은 범례명 
        // 데이터에서 name과 동일한 데이터의 value 값을 찾아와 legend에 같이 출력
        let itemValue = seriesData.filter(item => item.name === name);
        return name + ' (' + itemValue[0].value + ')';
      }
    },
    label: {
      fontWeight: 300,
      fontSize: 11,
      lineHeight: 17,
      formatter: function(params) {
        // 1000단위 콤마(,) 추가, 
        var addCommaValue = params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return '{a|' + params.name + '} {b|' + addCommaValue + '명\n' + '} {c|' + params.percent + '%}';
      },
      rich: {
        a: {
          fontWeight: 700,
        },
        c: {
          align: 'right',
          backgroundColor: '#eaeaea',
          padding: [5,5,3,5],
          borderRadius: 5,
        },
      },
    },
    labelLine: {
      // length: 20,
      // length2: 120,
      lineStyle: {
        color: '#bbb'
      }
    },
    tooltip: {},
    series: [
      {
        name: '2023.01.01 ~ 02.02', // 차트이름
        type: 'pie',
       // position: 'outside',
        radius: ['50%', '70%'],
        clockwise: true, // 애니메이션 시 차트 생성 방향. true 시계방향
       // animation: false, // 범례 값이 0이면 깜빡이는 현상 있음. 
        
        color: ['#bc6eff', '#826af9', '#2d99ff', '#5066f7', '#2cd9c5', '#30bc86', '#ffc400', '#fe943a', '#bbbbbb'],
        data: seriesData,
        // top: 0
      }
    ],
  }

  option && myChart.setOption(option);
};

/*************************************************
* Funnel Chart
**************************************************/
const funnelChart1 = () => {
  var chartDom = document.getElementById('funnel-1');
  var myChart = echarts.init(chartDom);

  var funnelData = [
    {
      value: 380,
      name: '[1단계]',
    },
    {
      value: 200,
      name: '[2단계]',
    },
    {
      value: 150,
      name: '[3단계]',
    },
    {
      value: 100,
      name: '[4단계]',
    },
    {
      value: 70,
      name: '[5단계]',
    },
    {
      value: 10,
      name: '[6단계]',
    },
  ]
  
  option = {
    title: {
      left: 0,
      text: '생존자',
      textStyle: {
        color: '#333',
        fontSize: 16,
      }
    },
    grid: {
      top: 'center',
    },
    color: ['#bc6eff','#826af9','#2d99ff','#5066f7','#c157a1','#30bc86'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross', // line, cross, shadow, none
        crossStyle: {
          color: '#999'
        }
      },
      // formatter: '{b}<br /> {a}" {c}: {c}' // b 는 시리즈 이름, a는 범례
      formatter: function(params) {
        // 증가일 때 percent에 plus 클래스 추가, 감소일때 minus, 변동 없을 시 추가 클래스 없음.
        var obj = `<div class="tooltip-title">2023년 3월 ${params[0].axisValue} <span class="percent plus">(▲ 10% 증가) </div>`;
      
        for(var i=0; i<params.length; i++) {
          var sum = params[params.length - 1].value;
          var addCommaValue = params[i].value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

          if(params.length -1 === i) {
            continue; // 마지막 값 건너뛰기. 범례에 표시 X
          }

          var percent = ((params[i].value / sum) * 100).toFixed(1);

          obj += `<div class="tooltip-remark" style="--color:${params[i].color}">전체<span class="values">${addCommaValue}명</span></div>`;
        }
        return obj;
      }
    },
    label: {
      show: false,
    },
    series: [ 
      {
        name: '차트이름',
        type: 'funnel',
        top: 0,
        minSize: 2,
        label: {
          show: true,
          color: '#555',
          fontSize: 13,
          formatter: function(params) {
            var addCommaValue = params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            var totalValue = funnelData[0].value; // 1단계 값을 100%로 잡음.
            return '{a|' + params.name + '} {b|' + addCommaValue + '명\n' + '} {c|' + (params.value / totalValue * 100).toFixed(2) + '%}';
          },
          rich: {
            a: {
              fontWeight: 700,
            },
            c: {
              align: 'right',
              backgroundColor: '#eaeaea',
              padding: [5,5,3,5],
              borderRadius: 5,
            },
          },
        },
        labelLayout: {

        },
        labelLine: {

        },
        itemStyle: {},
        data: funnelData,
      },
    ],
  }

  option && myChart.setOption(option);
};

/*************************************************
* 막대바 + 증감률 추세선
**************************************************/
const barLine1 = () => {
  var chartDom = document.getElementById('line-2');
  var myChart = echarts.init(chartDom);

  
  option = {
    title: {
      left: 0,
      text: '차트이름',
      textStyle: {
        color: '#333',
        fontSize: 16,
      }
    },
    color: ['#ffbb39','#f46271'],
    grid: {
      // show: false,
      left: 0,
      top: 90,
      right: 0, 
    },
    barWidth: 16,
    xAxis: {
      type: 'category',
     // name: '(일자)', 
      data: ['1일', '2일', '3일', '4일', '5일', '6일', '7일', '8일', '9일', '10일', '11일', '12일'],
      axisLabel: {
        color: '#555,'
      },
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: '#ddd'
        }
      },
    },
    yAxis: {
      type: 'value',
      name: '(명)',   // y 축 이름.
      axisLabel: {
        fomatter: '{value} K'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross', // line, cross, shadow, none
        crossStyle: {
          color: '#999'
        }
      },
      // formatter: '{b}<br /> {a}" {c}: {c}' // b 는 시리즈 이름, a는 범례
      formatter: function(params) {
        // 증가일 때 percent에 plus 클래스 추가, 감소일때 minus, 변동 없을 시 추가 클래스 없음.
        var obj = `<div class="tooltip-title">2023년 3월 ${params[0].axisValue} <span class="percent plus">(▲ 10% 증가) </div>`;
      
        for(var i=0; i<params.length; i++) {
          var sum = params[params.length - 1].value;
          var addCommaValue = params[i].value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

          if(params.length -1 === i) {
            continue; // 마지막 값 건너뛰기. 범례에 표시 X
          }

          var percent = ((params[i].value / sum) * 100).toFixed(1);

          obj += `<div class="tooltip-remark" style="--color:${params[i].color}">전체<span class="values">${addCommaValue}명</span></div>`;
        }
        return obj;
      }
    },
    label: {
      show: false,
    },
    series: [
      {
        type: 'bar',
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
        },
        data: [1000,500,360,360,360,380,360,360,360,360,480,360]
      },
      {
        type: 'line',
        data: [1000,500,360,360,360,380,360,360,360,360,480,360]
      },
    ],
  }

  option && myChart.setOption(option);
};

/*************************************************
* 멀티바 + 증감률 추세선
**************************************************/
const barLine2 = () => {
  var chartDom = document.getElementById('line-3');
  var myChart = echarts.init(chartDom);

  var limit = 14;

  // x 축 label 데이터 생성 0일~ n일
  var dummyXValue = function() {
    var xValue = [];
    for(var i=0; i < limit; i++) {
      xValue.push(i + '일');
    }
    return xValue;
  }

  var sumValue = new Array(limit);

  // 각 bar의 합계값 구하기
  var addSumValue = function(dataArray) {
    for(var i=0; i < limit; i++) {
      sumValue[i] = sumValue[i] || 0; // 처음 배열의 값이 할당되지 않았을 경우 0 할당.
      sumValue[i] = sumValue[i] + dataArray[i];
    }
  }

  // x축 더미데이터 생성
  var dummyData = function() {
    var dataValue = [];
    for(var i=0; i < limit; i++) {
      dataValue.push(Math.floor(Math.random() * 100))
    }
    addSumValue(dataValue);
    return dataValue;
  }
  
  option = {
    title: {
      left: 0,
      text: '차트이름',
      textStyle: {
        color: '#333',
        fontSize: 16,
      }
    },
    color: ['#feb23a','#30bc86','#36d598','#5066f7','#5783fd','#6d4eef','#bc6eff','#f46271'],
    grid: {
      show: false,
      left: 50,
      top: 90,
      right: 40, 
    },
    dataZoom: {
      type: 'inside', // inside, slider
    },
    barWidth: 12,
    textStyle: {
      color: '#555',
      fontSize: 12,
      fontWeight: 400,
      fontFamily: 'Noto Sans'
    },
    xAxis: {
      type: 'category',
      data: dummyXValue(),
      axisLabel: {
        color: '#555,'
      },
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: '#ddd'
        }
      },
    },
    yAxis: [
      {
        type: 'value',
        name: '(명)',   // y 축 이름.
        axisLabel: {
          fomatter: '{value} K'
        }
      },
      {
        type: 'value',
        name: '(%)',   // y 축 이름.
        min: 0,
        max: 100,
        interval: 20,
        axisLabel: {
          fomatter: '{value} %'
        }
      }
    ],
    legend: {
      bottom: 0,
      left: 'center',
      itemGap: 15,
      icon: 'circle',
      textStyle: {},
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross', // line, cross, shadow, none
        crossStyle: {
          color: '#999'
        }
      },
      // formatter: '{b}<br /> {a}" {c}: {c}' // b 는 시리즈 이름, a는 범례
      formatter: function(params) {
        // 증가일 때 percent에 plus 클래스 추가, 감소일때 minus, 변동 없을 시 추가 클래스 없음.
        var obj = `<div class="tooltip-title">2023년 3월 ${params[0].axisValue} <span class="percent plus">(▲ 10% 증가) </div>`;
      
        for(var i=0; i<params.length; i++) {
          var sum = params[params.length - 1].value;
          var addCommaValue = params[i].value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

          if(params.length -1 === i) {
            continue; // 마지막 값 건너뛰기. 범례에 표시 X
          }

          var percent = ((params[i].value / sum) * 100).toFixed(1);

          obj += `<div class="tooltip-remark" style="--color:${params[i].color}">${params[i].seriesName} <span class="values">${addCommaValue}명 (${percent}%)</span></div>`;
        }
        return obj;
      }
    },
    series: [
      {
        type: 'bar',
        name: '범례A',
        stack: 'chart',
        data: dummyData(),
      },
      {
        type: 'bar',
        name: '범례B',
        stack: 'chart',
        data: dummyData(),
      },
      {
        type: 'bar',
        name: '범례C',
        stack: 'chart',
        data: dummyData(),
      },
      {
        type: 'bar',
        name: '범례D',
        stack: 'chart',
        data: dummyData(),
      },
      {
        type: 'bar',
        name: '범례E',
        stack: 'chart',
        data: dummyData(),
      },
      {
        type: 'bar',
        name: '범례F',
        stack: 'chart',
        data: dummyData(),
      },
      {
        type: 'bar',
        name: '범례G',
        stack: 'chart',
        data: dummyData(),
        itemStyle: {
          borderRadius: [8, 8, 0, 0]
        }
      },
      {
        type: 'line',
        name: '합계',
        data: sumValue,
      },
    ],
  }

  option && myChart.setOption(option);
};



window.addEventListener('load', () => {
 barChart1();
 barChart2();
 MultiBar1();
 horizontalBarChart1();
 horizontalMultiBar1();
 horizontalMultiBar2();
 horizontalMultiBar3();
 pieChart1();
 pieChart2();
 svgChart1();
 funnelChart1();
 blockLine1();
 barLine1();
 barLine2();
})

window.addEventListener('resize', () => {
  window.location.reload();
})