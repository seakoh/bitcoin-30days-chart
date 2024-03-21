async function fetchCandleData() {
  const response = await fetch(
    "https://api.upbit.com/v1/candles/days?market=KRW-BTC&count=37"
  ); // 7일 이동 평균을 포함하기 위해 37일치 데이터 요청
  const data = await response.json();
  return data;
}

function calculateMovingAverage(data, count) {
  let movingAverages = [];
  for (let i = 0; i <= data.length - count; i++) {
    let sum = 0;
    for (let j = 0; j < count; j++) {
      sum += data[i + j].trade_price;
    }
    movingAverages.push({
      x: new Date(data[i + count - 1].candle_date_time_kst),
      y: sum / count,
    });
  }
  return movingAverages;
}

function drawChart(data) {
  var dataPoints = data.slice(0, 30).map((d) => ({
    x: new Date(d.candle_date_time_kst),
    y: [d.opening_price, d.high_price, d.low_price, d.trade_price],
  }));

  var movingAveragePoints = calculateMovingAverage(data, 7);

  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: "비트코인 30일 캔들 그래프 및 7일 평균선",
    },
    axisX: {
      valueFormatString: "DD MMM",
    },
    axisY: {
      title: "가격 (KRW)",
      prefix: "₩",
    },
    data: [
      {
        type: "candlestick",
        name: "일일 가격",
        showInLegend: true,
        yValueFormatString: "₩###,###",
        dataPoints: dataPoints,
      },
      {
        type: "line",
        name: "7일 평균",
        showInLegend: true,
        markerType: "none",
        yValueFormatString: "₩###,###",
        dataPoints: movingAveragePoints,
      },
    ],
  });

  chart.render();
}

async function init() {
  const candleData = await fetchCandleData();
  drawChart(candleData);
}

init();
