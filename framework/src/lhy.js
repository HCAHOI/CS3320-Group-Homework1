let json = null;
let data_list = [];


function read_json(file_path) {
  let xhrEnter = new XMLHttpRequest();
  xhrEnter.open('GET', file_path, false);
  xhrEnter.onreadystatechange = function () {
    if (xhrEnter.readyState === 4 && xhrEnter.status === 200) {
      json = JSON.parse(xhrEnter.responseText);
      console.log('Finish Reading 04-new.json');
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
  console.log(data_list);

  let myChart = echarts.init(document.getElementById('new-book'));

  let option = {
    title: {
      text: '新书榜单'
    },
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

document.addEventListener('DOMContentLoaded', function() {
  let totalResourceContainer = document.querySelector('#total-resource-container .data-box');
  let dailyNumberContainer = document.querySelector('#daily-number-container .data-box');
  let newBookContainer = document.querySelector('#new-book-container .data-box');

  let totalResource = document.createElement('div');
  totalResource.id = 'total-resource';
  totalResourceContainer.appendChild(totalResource);

  let dailyNumber = document.createElement('div');
  dailyNumber.id = 'daily-number';
  dailyNumberContainer.appendChild(dailyNumber);

  let newBook = document.createElement('div');
  newBook.id = 'new-book';
  newBook.style.width = '300px';
  newBook.style.height = '300px';
  newBookContainer.appendChild(newBook);

  read_json('../../data/04-新书榜单.json');
  initNewBookChart();
});