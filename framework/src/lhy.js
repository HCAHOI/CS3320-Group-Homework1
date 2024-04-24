let json = null;
let json2 = null;
let json_total = [["纸质馆藏", "378万册"], ["数据库", "443个"], ["电子图书", "334.7万种"], ["电子期刊", "5.8万种"], ["学位论文", "556.85万种"]];
let data_list = [];
let myChartDaily = null;


function read_json(file_path) {
  let xhrEnter = new XMLHttpRequest();
  xhrEnter.open('GET', file_path, false);
  xhrEnter.onreadystatechange = function () {
    if (xhrEnter.readyState === 4 && xhrEnter.status === 200) {
      json = JSON.parse(xhrEnter.responseText);
    }
  };
  xhrEnter.send();
}

function readJson2(file_path) {
  let xhrEnter = new XMLHttpRequest();
  xhrEnter.open('GET', file_path, false);
  xhrEnter.onreadystatechange = function () {
    if (xhrEnter.readyState === 4 && xhrEnter.status === 200) {
      json2 = JSON.parse(xhrEnter.responseText);
    }
  };
  xhrEnter.send();
}

function initNewBookChart() {
  for (let i = 0; i < 3; i++) {
    //let string json.data[i][1] and json.data[i][2] merge to one string
    let string = json.data[i][1] + ' ' + json.data[i][2];
    data_list.push(string);
  }

  let myChart = echarts.init(document.getElementById('new-book'));

  let option = {
    // tooltip: {
    //   trigger: 'item',
    //   formatter: '{a} <br/>{b} : {c}%'
    // },
    // toolbox: {
    //   feature: {
    //     dataView: { readOnly: false },
    //     restore: {},
    //     saveAsImage: {}
    //   }
    // },
    // legend: {
    //   data: data_list
    // },
    series: [
      {
        name: 'Names',
        type: 'funnel',
        left: '10%',
        top: 60,
        bottom: 60,
        width: '80%',
        min: 0,
        max: 100,
        minSize: '0%',
        maxSize: '100%',
        sort: 'ascending',
        gap: 5,
        label: {
          show: true,
          position: 'inside',
          fontSize: 10
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        emphasis: {
          label: {
            fontSize: 20
          }
        },
        data:[
          { value: 30, name: data_list[0] },
          { value: 60, name: data_list[1] },
          { value: 90, name: data_list[2] }
        ]
      }
    ]
  };

  myChart.setOption(option);
}


function find_correct_file_name(day, month, year) {
  return day + '_' + month + '_' + year + '.json';
}

function initTotalChart() {
  let chartDomTotal = document.getElementById('total-resource');
  let myChartTotal = echarts.init(chartDomTotal);

  let total_data_str = "";
  for (let i = 0; i < json_total.length; i++){
    total_data_str += json_total[i][0] + ' ' + json_total[i][1] + '\n';
  }

  let optionTotal = {
    graphic: {
      elements: [
        {
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: total_data_str,
            fontSize: 20,
            fontWeight: 'bold',
            lineDash: [0, 200],
            lineDashOffset: 0,
            fill: 'transparent',
            stroke: '#08f',
            lineWidth: 1,
          },
          keyframeAnimation: {
            duration: 2000,
            loop: false,
            keyframes: [
              {
                percent: 0.7,
                style: {
                  fill: 'transparent',
                  lineDashOffset: 200,
                  lineDash: [200, 0],
                },
              },
              {
                // Stop for a while.
                percent: 0.8,
                style: {
                  fill: 'transparent',
                },
              },
              {
                percent: 1,
                style: {
                  fill: 'blue',
                },
              },
            ],
          },
        },
      ],
    },
  };

  myChartTotal.setOption(optionTotal);
}

function initDailyChart() {
  let dateStr = document.getElementById('date-input').value;
  let date = new Date(dateStr);
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  console.log(date);

  myChartDaily = echarts.init(document.getElementById('daily-number'));

  readJson2("../../data/split_json/" + find_correct_file_name(day, month, year));

  //set loading animation
  let peopleNumberPerLib = calculate_people_number();
  let optionDaily = {
    legend: {},
    tooltip: {
      trigger: 'axis',
      showContent: false
    },
    dataset: {
      source:[
        ['product', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
          '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
        peopleNumberPerLib[0],
        peopleNumberPerLib[1],
        peopleNumberPerLib[2],
        peopleNumberPerLib[3]
      ]
    },
    xAxis: { type: 'category' },
    yAxis: { gridIndex: 0 },
    grid: { top: '55%' },
    series: [
      {
        type: 'line',
        smooth: true,
        seriesLayoutBy: 'row',
        emphasis: { focus: 'series' }
      },
      {
        type: 'line',
        smooth: true,
        seriesLayoutBy: 'row',
        emphasis: { focus: 'series' }
      },
      {
        type: 'line',
        smooth: true,
        seriesLayoutBy: 'row',
        emphasis: { focus: 'series' }
      },
      {
        type: 'line',
        smooth: true,
        seriesLayoutBy: 'row',
        emphasis: { focus: 'series' }
      },
      {
        type: 'pie',
        id: 'pie',
        radius: '30%',
        center: ['50%', '25%'],
        emphasis: {
          focus: 'self'
        },
        label: {
          formatter: '{b}: {@2012} ({d}%)'
        },
        encode: {
          itemName: 'product',
          value: '2012',
          tooltip: '2012'
        }
      }
    ]
  };
  myChartDaily.on('updateAxisPointer', function (event) {
    const xAxisInfo = event.axesInfo[0];
    if (xAxisInfo) {
      const dimension = xAxisInfo.value + 1;
      myChartDaily.setOption({
        series: {
          id: 'pie',
          label: {
            formatter: '{b}: {@[' + dimension + ']} ({d}%)'
          },
          encode: {
            value: dimension,
            tooltip: dimension
          }
        }
      });
    }
  });
  myChartDaily.setOption(optionDaily);
}

function updateDailyChart() {
  let dateStr = document.getElementById('date-input').value;
  let date = new Date(dateStr);
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  console.log(date);

  readJson2("../../data/split_json/" + find_correct_file_name(day, month, year));

  console.log(json2);

  //set loading animation
  let peopleNumberPerLib = calculate_people_number();
  let optionDaily = {
    dataset: {
      source:[
        ['product', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
          '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
        peopleNumberPerLib[0],
        peopleNumberPerLib[1],
        peopleNumberPerLib[2],
        peopleNumberPerLib[3]
      ]
    },
  };
  // myChartDaily.on('updateAxisPointer', function (event) {
  //   const xAxisInfo = event.axesInfo[0];
  //   if (xAxisInfo) {
  //     const dimension = xAxisInfo.value + 1;
  //     myChartDaily.setOption({
  //       series: {
  //         id: 'pie',
  //         label: {
  //           formatter: '{b}: {@[' + dimension + ']} ({d}%)'
  //         },
  //         encode: {
  //           value: dimension,
  //           tooltip: dimension
  //         }
  //       }
  //     });
  //   }
  // });
  myChartDaily.setOption(optionDaily);
}


function calculate_people_number(time_interval = 3600){
  let people_number_density_with_time_per_lib = {};
  for (let i = 0; i < json2.length; i++) {
    let lib = json2[i]["Sub_Lib"];
    let event_time = json2[i]["EventTime"];
    //convert event time to seconds
    let time = event_time.split(':');
    let seconds = parseInt(time[0]) * 3600 + parseInt(time[1]) * 60 + parseInt(time[2]);

    for (let hours = 0; hours < 24; hours += 1){
      let start_time = hours * 3600;
      let end_time = start_time + time_interval;
      if (seconds >= start_time && seconds < end_time){
        if (people_number_density_with_time_per_lib[lib] === undefined){
          people_number_density_with_time_per_lib[lib] = [];
          people_number_density_with_time_per_lib[lib].push(lib);
          for (let j = 0; j < 24; j++){
            people_number_density_with_time_per_lib[lib].push(0);
          }
        }else{
          // let sub_script = seconds / time_interval;
          let sub_script = Math.floor(seconds / time_interval) + 1;
          people_number_density_with_time_per_lib[lib][sub_script] += 1;
        }
      }
    }
  }

  //convert people_number_density_with_time_per_lib to list
  let people_number_density_with_time_per_lib_list = [];
  for (let key in people_number_density_with_time_per_lib){
    people_number_density_with_time_per_lib_list.push(people_number_density_with_time_per_lib[key]);
  }

  return people_number_density_with_time_per_lib_list;
}

document.addEventListener('DOMContentLoaded', function() {
  let totalResourceContainer = document.querySelector('#total-resource-container .data-box');
  let dailyNumberContainer = document.querySelector('#daily-number-container .data-box');
  let newBookContainer = document.querySelector('#new-book-container .data-box');

  let totalResource = document.createElement('div');
  totalResource.id = 'total-resource';
  totalResource.style.width = '900px';
  totalResource.style.height = '200px';
  totalResourceContainer.appendChild(totalResource);

  let dailyNumber = document.createElement('div');
  dailyNumber.id = 'daily-number';
  dailyNumber.style.width = '900px';
  dailyNumber.style.height = '400px';
  dailyNumberContainer.appendChild(dailyNumber);

  let newBook = document.createElement('div');
  newBook.id = 'new-book';
  newBook.style.width = '300px';
  newBook.style.height = '300px';
  newBookContainer.appendChild(newBook);

  read_json('../../data/04-新书榜单.json');
  initNewBookChart();
  initTotalChart();
  initDailyChart();
  document.getElementById('date-input').addEventListener('change', function () {
    updateDailyChart();
  });

});