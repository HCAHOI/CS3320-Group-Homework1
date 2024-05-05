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
let playClicked = false;

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
  let year = +numDate / 10000;
  let month = +numDate % 10000 / 100;
  let day = +numDate % 100;
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

    let prefixDiv = document.createElement('div');
    prefixDiv.textContent = 'NO. ' + (idx + 1).toString();
    prefixDiv.style.marginRight = '10px';
    prefixDiv.style.color = 'rgb(71, 136, 251)';
    prefixDiv.style.fontWeight = 'bold';

    let bookInfo = bookName;
    if (bookAuthor !== null) {
      bookInfo += ' - ' + bookAuthor;
    }

    let bookInfoDiv = document.createElement('div');
    bookInfoDiv.textContent = bookInfo;
    bookInfoDiv.style.color = 'white';

    // create item
    let item = document.createElement('div');
    item.className = 'view-item';
    item.style.display = 'flex';
    item.appendChild(prefixDiv);
    item.appendChild(bookInfoDiv);

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
      radius: ['40%', '70%'],
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
  let topEnterDepartments = enterChartData.slice(1, 6);
  // console.log(topEnterDepartments);

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
      borrow: Math.floor(borrowChartData[i].value / 2),
    });
  }

  let container = document.getElementById('department-chart-container');

  let margin = { top: 35, right: 0, bottom: 0, left: 160 },
    width = container.clientWidth - margin.left - margin.right,
    height = container.clientHeight - margin.top - margin.bottom;

  let svg = d3.select('#department-chart-container').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  let xLeft = d3.scaleLinear()
    .range([width / 2, 0])
    .domain([0, d3.max(finalData, function (d) { return d.enter; })]);

  let xRight = d3.scaleLinear()
    .range([0, width / 4])
    .domain([0, d3.max(finalData, function (d) { return d.borrow; })]);

  let y = d3.scaleBand()
    .range([0, height / 24 * 15])
    .padding(0.3)
    .domain(finalData.map(function (d) { return d.department; }));

  svg.selectAll('.enter-bar')
    .data(finalData)
    .enter().append('rect')
    .attr('class', 'enter-bar')
    .attr('x', function (d) { return xLeft(d.enter); })
    .attr('y', function (d) { return y(d.department); })
    .attr('width', function (d) { return width / 2 - xLeft(d.enter); })
    .attr('height', y.bandwidth())
    .attr('fill', 'steelblue');

  svg.selectAll('.borrow-bar')
    .data(finalData)
    .enter().append('rect')
    .attr('class', 'borrow-bar')
    .attr('x', width / 2)
    .attr('y', function (d) { return y(d.department); })
    .attr('width', function (d) { return xRight(d.borrow); })
    .attr('height', y.bandwidth())
    .attr('fill', 'darkorange');

  // left labels
  svg.append('text')
    .attr('x', width / 4)
    .attr('y', -9)
    .attr('text-anchor', 'middle')
    .attr('fill', 'white')
    .attr('font-size', '14px')
    .attr('font-weight', 'bold')
    .text('入馆人数');

  svg.selectAll('.enter-label')
    .data(finalData)
    .enter().append('text')
    .attr('x', d => { return xLeft(d.enter) / 2})
    .attr('y', d => { return y(d.department) + y.bandwidth() - 2; })
    .attr('text-anchor', 'end')
    .attr('fill', 'white')
    .attr('font-size', '16px')
    .attr('transform', 'translate(' + width / 24 * 7 + ', 0)')
    .text(d => { return d.enter; });

  // right labels
  svg.append('text')
    .attr('x', width / 8 * 5)
    .attr('y', -9)
    .attr('text-anchor', 'middle')
    .attr('fill', 'white')
    .attr('font-size', '14px')
    .attr('font-weight', 'bold')
    .text('借阅人数');

  svg.selectAll('.borrow-label')
    .data(finalData)
    .enter().append('text')
    .attr('x', d => { return width / 2 + xRight(d.borrow) + 5; })
    .attr('y', d => { return y(d.department) + y.bandwidth() - 2; })
    .attr('text-anchor', 'start')
    .attr('fill', 'white')
    .attr('font-size', '16px')
    // .attr('transform', 'translate(' + width / 24 * 7 + ', 0)')
    .text(d => { return d.borrow; });

  svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + 0 + ',0)')
    .call(d3.axisLeft(y))
    .selectAll('text')
    .attr('fill', 'white')
    .attr('font-size', '13px');

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + y.bandwidth() * 7.6 + ')')
    .call(d3.axisBottom(xLeft).ticks(3))
    .selectAll('text')
    .attr('fill', 'white')
    .attr('font-size', '14px');

  svg.append('g')
    .attr('class', 'x axis')
    .attr('ticks', 5)
    .attr('transform', 'translate(' + width / 2 + ',' + y.bandwidth() * 7.6 + ')')
    .call(d3.axisBottom(xRight).ticks(2))
    .selectAll('text')
    .attr('fill', 'white')
    .attr('font-size', '14px');
}

// --------------Data Processing----------------

function loadEnterData () {
  let xhrEnter = new XMLHttpRequest();
  xhrEnter.open('GET', '../data/02-2023年全年入馆数据.json', false);
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
  loadEnterData();
  processData();
}

function processData () {
  console.log(borrowData);
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

    if (record['事件类型'] === '借阅' || record['事件类型'] === '续借') {
      let date = numberToDate(record['发生时间']).toDateString();
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
  console.log(dailyBookBorrowMap);
  // departmentEnterMap = departmentBorrowMap; // TODO: For debug purpose. Remove this line later
}

function setButtonBackground (button) {
  let buttons = document.querySelectorAll('#view-selector button');
  buttons.forEach((b) => {
    b.style.backgroundColor = 'transparent';
  });
  button.style.backgroundColor = 'rgb(28, 58, 108)';
}

// ---------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  loadData();

  let readerBox = document.querySelector('#reader-statistics .data-box')
  let departmentBox = document.querySelector('#department-distribution .data-box')
  let borrowTopBox = document.querySelector('#borrow-top .data-box')

  // readerBox element
  readerBox.style.display = 'flex';
  let basicInfo = document.createElement('div');
  basicInfo.id = 'basic-info';
  let enterInfo = document.createElement('div');
  enterInfo.textContent = '入馆人数: ' + enterData.length;
  let borrowInfo = document.createElement('div');
  borrowInfo.textContent = '借书人数: ' + borrowData.length;
  basicInfo.appendChild(enterInfo);
  basicInfo.appendChild(borrowInfo);
  readerBox.appendChild(basicInfo);

  let pieChartContainer = document.createElement('div');
  pieChartContainer.id = 'pie-chart-container';
  pieChartContainer.style.width = '70%';
  pieChartContainer.style.height = '100%';
  readerBox.appendChild(pieChartContainer);

  // departmentBox element
  let departmentChartContainer = document.createElement('div');
  departmentChartContainer.id = 'department-chart-container';
  departmentChartContainer.style.width = '100%';
  departmentChartContainer.style.height = '26vh';
  departmentChartContainer.style.marginTop = '7vh';
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
    let day = new Date();
    let end = new Date();
    [currentView, day, end] = getWeekView(new Date(date));
    setButtonBackground(document.getElementById('week-view'));
    generateView(day, end);
  });

  document.getElementById('week-view').addEventListener('click', function () {
    let date = document.getElementById('date-input').value;
    let day = new Date();
    let end = new Date();
    [currentView, day, end] = getWeekView(new Date(date));
    setButtonBackground(document.getElementById('week-view'));
    generateView(day, end);
  });

  document.getElementById('month-view').addEventListener('click', function () {
    let date = document.getElementById('date-input').value;
    let day = new Date();
    let end = new Date();
    [currentView, day, end] = getMonthView(new Date(date));
    setButtonBackground(document.getElementById('month-view'));
    generateView(day, end);
  });

  document.getElementById('quarter-view').addEventListener('click', function () {
    let date = document.getElementById('date-input').value;
    let day = new Date();
    let end = new Date();
    [currentView, day, end] = getQuarterView(new Date(date));
    setButtonBackground(document.getElementById('quarter-view'));
    generateView(day, end);
  });

  document.getElementById('year-view').addEventListener('click', function () {
    let date = document.getElementById('date-input').value;
    let day = new Date();
    let end = new Date();
    [currentView, day, end] = getYearView(new Date(date));
    setButtonBackground(document.getElementById('year-view'));
    generateView(day, end);
  });

  document.getElementById('play').addEventListener('click', function () {
    let date = document.getElementById('date-input').value;
    if(!playClicked) {
      // add play date input
      let playDateInput = document.createElement('input');
      playDateInput.id = 'play-date-input';
      playDateInput.type = 'date';
      playDateInput.value = date;
      playDateInput.style.position = 'absolute';
      playDateInput.style.top = '4vh';
      playDateInput.style.right = '7vw';

      document.body.appendChild(playDateInput);
    } else {
      // get date of current date-input and play-date-input
      let date = document.getElementById('date-input').value;
      let playDate = document.getElementById('play-date-input').value;
      let day = new Date(date);
      let end = new Date(playDate);
      end.setDate(end.getDate() + 1);

      let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

      // forward or backward
      let direction = 1;
      if (day > end) {
        direction = -1;
      }

      let interval = setInterval(function() {
        if (day.toDateString() !== end.toDateString()) {
          let newDate = new Date(day);
          day.setDate(day.getDate() + direction);
          document.getElementById('date-input').value = newDate.toISOString().slice(0, 10);
          document.getElementById('date-input').dispatchEvent(new Event('change'));
        } else {
          clearInterval(interval);
        }
      }, 1000);

      // remove play date input
      let playDateInput = document.getElementById('play-date-input');
      playDateInput.remove();
    }
    playClicked = !playClicked;
  });

  // charts
  initPieChart(borrowIdentificationMap);
  initDepartmentChart();
  // view
  let date = document.getElementById('date-input').value;
  let day = new Date();
  let end = new Date();
  [currentView, day, end] = getWeekView(new Date(date));
  setButtonBackground(document.getElementById('week-view'));
  generateView(day, end);
});