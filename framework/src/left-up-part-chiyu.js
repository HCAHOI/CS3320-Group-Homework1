// --------------Global Variables----------------
// Original Data
let borrowData = [];
let enterData = [];

// People
let borrowIdentificationMap = new Map();
let eventTypeMap = new Map();
let departmentBorrowMap = new Map();
let departmentEnterMap = new Map();

// Book
let bookInfoMap = new Map();  // Name -> author
let dailyBookBorrowMap = new Map();  // Date -> [Book Name]

// View
let currentView = [];

// --------------Helper----------------------


function mapCountUpdate (element, map) {
  if (!map.has(element)) {
    map.set(element, 1);
  } else {
    map.set(element, map.get(element) + 1);
  }
}

// Given a date, return the first day of the week
function getWeek (data) {
  let date = new Date(data);
  let day = date.getDay();
  let diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

// Given a date represented by a float number such as 20230121.0, return a Date object
function numberToDate (numDate) {
  let year = parseInt(numDate / 10000);
  let month = parseInt((numDate % 10000) / 100);
  let day = parseInt(numDate % 100);
  return new Date(year, month - 1, day);
}

function dateToNumber (date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  return year * 10000 + month * 100 + day;
}

// Date -> 20xx/xx/xx
function dateToString (date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  return year + '/' + month + '/' + day;
}

function getBorrowView (startDate, endDate) {
  let day = new Date(startDate);
  let end = new Date(endDate);

  let borrowCount = new Map();

  while (day.toDateString() !== end.toDateString()) {
    let dayBorrowArray = dailyBookBorrowMap.get(day.toDateString());
    if (dayBorrowArray !== undefined) {
      for (let i = 0; i < dayBorrowArray.length; i++) {
        mapCountUpdate(dayBorrowArray[i], borrowCount);
      }
    }
    day.setDate(day.getDate() + 1);
  }

  borrowCount.delete('笔记本支架');

  // transform to array
  let borrowArray = [];
  borrowCount.forEach((value, key) => {
    borrowArray.push({ key: key, value: value });
  });
  // sort
  borrowArray.sort((a, b) => {
    return b.value - a.value;
  });

  console.log(borrowArray);
  return borrowArray;
}

function getWeekView (date) {
  let day = getWeek(date);
  let end = getWeek(date);
  end.setDate(end.getDate() + 7);

  return [getBorrowView(day, end), day, end];
}

function getMonthView (date) {
  let month = date.getMonth();
  let year = date.getFullYear();

  let day = new Date(year, month, 1);
  let end = new Date(year, month + 1, 1);

  return [getBorrowView(day, end), day, end];
}

function getQuarterView (date) {
  let month = date.getMonth();
  let year = date.getFullYear();

  let day = new Date(year, Math.floor(month / 3) * 3, 1);
  let end = new Date(year, Math.floor(month / 3) * 3 + 3, 1);

  return [getBorrowView(day, end), day, end];
}

function getYearView (date) {
  let year = date.getFullYear();
  let day = new Date(year, 0, 1);
  let end = new Date(year + 1, 0, 1);

  return [getBorrowView(day, end), day, end];
}

function generateView (day, end) {
  // update time span
  document.getElementById('view-time-span').textContent = dateToString(day) + ' - ' + dateToString(end);

  // update view
  let view = document.getElementById('view-top4');
  while (view && view.firstChild) {
    view.removeChild(view.firstChild);
  }
  for (let idx = 0; idx < 4; idx++) {
    // get book data
    let bookName = currentView[idx].key;
    let bookAuthor = bookInfoMap.get(bookName);

    let msg = 'NO. ' + (idx + 1).toString() + ' ' + bookName;
    if (bookAuthor !== null) {
      msg += ' - ' + bookAuthor;
    }

    // create item
    let item = document.createElement('div');
    item.className = 'view-item';
    item.textContent = msg;

    // append item
    view.appendChild(item);
  }
}

// --------------Data Visualization----------------
function initPieChart (idMap) {
  // map to array
  let idArray = [];
  idMap.forEach((value, key) => {
    idArray.push({ name: key, value: value });
  });
  let pieChart = echarts.init(document.getElementById('pie-chart-container'));
  pieChart.setOption({
    title: {
      text: '',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      data: [],
    },
    series: [{
      name: 'ID',
      type: 'pie',
      data: idArray,
    }],
  });
}

function initDepartmentChart () {
  let enterChartData = Array.from(departmentEnterMap).map(function (item) {
    return { department: item[0], value: item[1] };
  }).sort(function (a, b) {
    return b.value - a.value;
  });

  // remove unknown department
  enterChartData = enterChartData.filter(function (dep) {
    return dep.department !== null;
  });

  // enter top5
  let topEnterDepartments = enterChartData.slice(0, 5);
  console.log(topEnterDepartments);

  // get borrow data of top5
  let borrowChartData = [];
  topEnterDepartments.forEach(function (dep) {
    borrowChartData.push({ department: dep.department, value: departmentBorrowMap.get(dep.department) || 0 });
  });


  // zig
  let finalData = [];
  for (let i = 0; i < topEnterDepartments.length; i++) {
    finalData.push({
      department: topEnterDepartments[i].department,
      enter: topEnterDepartments[i].value,
      borrow: borrowChartData[i].value / 2,
    });
  }

  let margin = { top: 5, right: 0, bottom: 5, left: 20 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  let svg = d3.select('#department-chart').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  let xLeft = d3.scaleLinear()
    .range([width / 2, 0])
    .domain([0, d3.max(finalData, function (d) { return d.enter; })]);

  let xRight = d3.scaleLinear()
    .range([0, width / 2])
    .domain([0, d3.max(finalData, function (d) { return d.enter; })]);

  let y = d3.scaleBand()
    .range([0, height / 8])
    .padding(0.1)
    .domain(finalData.map(function (d) { return d.department; }));

// 创建入馆人数的条形
  svg.selectAll('.enter-bar')
    .data(finalData)
    .enter().append('rect')
    .attr('class', 'enter-bar')
    .attr('x', function (d) { return xLeft(d.enter); })
    .attr('y', function (d) { return y(d.department); })
    .attr('width', function (d) { return width / 2 - xLeft(d.enter); })
    .attr('height', y.bandwidth())
    .attr('fill', 'steelblue');

// 创建借书数目的条形
  svg.selectAll('.borrow-bar')
    .data(finalData)
    .enter().append('rect')
    .attr('class', 'borrow-bar')
    .attr('x', width / 2)
    .attr('y', function (d) { return y(d.department); })
    .attr('width', function (d) { return xRight(d.borrow); })
    .attr('height', y.bandwidth())
    .attr('fill', 'darkorange');

// 添加 y 轴
  svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + 0 + ',0)')
    .call(d3.axisLeft(y));

// 添加左侧 x 轴
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + (y.bandwidth() + y.padding()) * 6 + ')')
    .call(d3.axisBottom(xLeft).ticks(5));

// 添加右侧 x 轴
  svg.append('g')
    .attr('class', 'x axis')
    .attr('ticks', 5)
    .attr('transform', 'translate(' + width / 2 + ',' + (y.bandwidth() + y.padding()) * 6 + ')')
    .call(d3.axisBottom(xRight).ticks(5));

}

// --------------Data Processing----------------

function loadEnterData () {
  let xhrEnter = new XMLHttpRequest();
  xhrEnter.open('GET', '../../data/02-2023年全年入馆数据.json', false);
  xhrEnter.onreadystatechange = function () {
    if (xhrEnter.readyState === 4 && xhrEnter.status === 200) {
      enterData = JSON.parse(xhrEnter.responseText).RECORDS;
      console.log('Finish Reading 02-enter.json');
    }
  };
  xhrEnter.send();
}

function loadBorrowData () {
  let xhrBorrow = new XMLHttpRequest();
  xhrBorrow.open('GET', '../data/01-2023年全年图书借阅预约归还等数据.json', false);
  xhrBorrow.onreadystatechange = function () {
    if (xhrBorrow.readyState === 4 && xhrBorrow.status === 200) {
      borrowData = JSON.parse(xhrBorrow.responseText).RECORDS;
      console.log('Finish Reading 01-borrow.json');
    }
  };
  xhrBorrow.send();
}

function loadData () {
  loadBorrowData();
  // loadEnterData();
  processData();
}

function processData () {
  borrowData.forEach((record) => {
    // Record type
    mapCountUpdate(record['事件类型'], eventTypeMap);

    // Identification
    mapCountUpdate(record['身份'].trim(), borrowIdentificationMap);

    // Department
    mapCountUpdate(record['学院'], departmentBorrowMap);

    // Book
    if (!bookInfoMap.has(record['图书书名'])) {
      bookInfoMap.set(record['图书书名'], record['著者']);
    }

    if (record['事件类型'] === '借阅' || record['事件类型'] === '续借（pc端）' || record['事件类型'] === '续借（web端）') {
      let date = numberToDate(record['事件时间']).toDateString();
      if (!dailyBookBorrowMap.has(date)) {
        dailyBookBorrowMap.set(date, [record['图书书名']]);
      } else {
        dailyBookBorrowMap.get(date).push(record['图书书名']);
      }
    }
  });

  enterData.forEach((record) => {
    // Department
    mapCountUpdate(record.Department, departmentEnterMap);

  });

  // unique dailyBookBorrowMap
  dailyBookBorrowMap.forEach((value, key) => {
    let uniqueValue = [...new Set(value)];
    dailyBookBorrowMap.set(key, uniqueValue);
  });
  // sort dailyBookBorrowMap
  dailyBookBorrowMap = new Map([...dailyBookBorrowMap.entries()].sort());

  departmentEnterMap = departmentBorrowMap; // TODO: For debug purpose. Remove this line later

  // console.log(eventTypeMap);
  // console.log(borrowIdentificationMap);
  // console.log(departmentBorrowMap);
  // console.log(departmentEnterMap);
  // console.log(bookInfoMap);
  // console.log(dailyBookBorrowMap);

}

// ---------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  let readerBox = document.querySelector('#reader-statistics .data-box')
  let departmentBox = document.querySelector('#department-distribution .data-box')
  let borrowTopBox = document.querySelector('#borrow-top .data-box')

  // readerBox element
  readerBox.style.display = 'flex';
  let basicInfo = document.createElement('div');
  basicInfo.id = 'basic-info';
  let enterInfo = document.createElement('div');
  enterInfo.textContent = '入馆人数: 114514';
  enterInfo.style.color = 'white';
  let borrowInfo = document.createElement('div');
  borrowInfo.textContent = '借书人数: 1919810';
  borrowInfo.style.color = 'white';
  basicInfo.appendChild(enterInfo);
  basicInfo.appendChild(borrowInfo);
  readerBox.appendChild(basicInfo);

  let pieChartContainer = document.createElement('div');
  pieChartContainer.id = 'pie-chart-container';
  pieChartContainer.style.width = '60%';
  pieChartContainer.style.height = '120%';
  readerBox.appendChild(pieChartContainer);

  // departmentBox element
  let departmentChartContainer = document.createElement('div');
  departmentChartContainer.id = 'department-chart-container';
  departmentChartContainer.style.width = '100%';
  departmentChartContainer.style.height = '20vh';
  departmentBox.appendChild(departmentChartContainer);

  // borrowTopBox element
  let viewSelector = document.createElement('div');
  viewSelector.id = 'view-selector';
  let weekViewButton = document.createElement('button');
  weekViewButton.id = 'week-view';
  weekViewButton.innerText = '周视图';
  let monthViewButton = document.createElement('button');
  monthViewButton.id = 'month-view';
  monthViewButton.innerText = '月视图';
  let quarterViewButton = document.createElement('button');
  quarterViewButton.id = 'quarter-view';
  quarterViewButton.innerText = '季视图';
  let yearViewButton = document.createElement('button');
  yearViewButton.id = 'year-view';
  yearViewButton.innerText = '年视图';
  viewSelector.appendChild(weekViewButton);
  viewSelector.appendChild(monthViewButton);
  viewSelector.appendChild(quarterViewButton);
  viewSelector.appendChild(yearViewButton);

  let viewTimeSpan = document.createElement('div');
  viewTimeSpan.id = 'view-time-span';

  let viewTop4 = document.createElement('div');
  viewTop4.id = 'view-top4';

  borrowTopBox.appendChild(viewSelector);
  borrowTopBox.appendChild(viewTimeSpan);
  borrowTopBox.appendChild(viewTop4);

  document.getElementById('date-input').addEventListener('change', function () {
    let date = document.getElementById('date-input').value;
    console.log(date);
  });

  document.getElementById('week-view').addEventListener('click', function () {
    let date = document.getElementById('date-input').value;
    let day = new Date();
    let end = new Date();
    [currentView, day, end] = getWeekView(new Date(date));
    generateView(day, end);
  });

  document.getElementById('month-view').addEventListener('click', function () {
    let date = document.getElementById('date-input').value;
    let day = new Date();
    let end = new Date();
    [currentView, day, end] = getMonthView(new Date(date));
    generateView(day, end);
  });

  document.getElementById('quarter-view').addEventListener('click', function () {
    let date = document.getElementById('date-input').value;
    let day = new Date();
    let end = new Date();
    [currentView, day, end] = getQuarterView(new Date(date));
    generateView(day, end);
  });

  document.getElementById('year-view').addEventListener('click', function () {
    let date = document.getElementById('date-input').value;
    let day = new Date();
    let end = new Date();
    [currentView, day, end] = getYearView(new Date(date));
    generateView(day, end);
  });

  // set elements
  // enter and borrow
  // let borrowCount = eventTypeMap.get('借阅') + eventTypeMap.get('续借（pc端）') + eventTypeMap.get('续借（web端）');
  // let enterCount = borrowCount; // TODO: temp
  // document.getElementById('borrow').textContent = '本年借书人次: ' + borrowCount;
  // document.getElementById('enter').textContent = '本年进馆人次: ' + enterCount;

  loadData();
  // charts
  initPieChart(borrowIdentificationMap);
  initDepartmentChart();
  // view
  let date = document.getElementById('date-input').value;
  let day = new Date();
  let end = new Date();
  [currentView, day, end] = getWeekView(new Date(date));
  generateView(day, end);
});