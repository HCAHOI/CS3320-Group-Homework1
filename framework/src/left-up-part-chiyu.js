// onload
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
  readerBox.appendChild(pieChartContainer);

  // departmentBox element
  let departmentChartContainer = document.createElement('div');
  departmentChartContainer.id = 'department-chart-container';
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
  viewTop4.id = 'view-top-4';

  borrowTopBox.appendChild(viewSelector);
  borrowTopBox.appendChild(viewTimeSpan);
  borrowTopBox.appendChild(viewTop4);
});