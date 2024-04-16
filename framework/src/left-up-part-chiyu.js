// onload
document.addEventListener('DOMContentLoaded', function () {
  let readerBox = document.querySelector('#reader-statistics .data-box')
  let departmentBox = document.querySelector('#department-distribution .data-box')
  let borrowTopBox = document.querySelector('#borrow-top .data-box')

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