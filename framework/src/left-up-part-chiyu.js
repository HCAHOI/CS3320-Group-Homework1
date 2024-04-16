// onload
document.addEventListener('DOMContentLoaded', function () {
  let readerBox = document.querySelector('#reader-statistics .data-box')
  let departmentBox = document.querySelector('#department-distribution .data-box')
  let borrowTopBox = document.querySelector('#borrow-top .data-box')

  let testDiv1 = document.createElement('div');
  testDiv1.textContent = 'test';
  testDiv1.style.color = 'red';

  let testDiv2 = testDiv1.cloneNode(true);
  let testDiv3 = testDiv1.cloneNode(true);

  readerBox.appendChild(testDiv1);
  departmentBox.appendChild(testDiv2);
  borrowTopBox.appendChild(testDiv3);

  console.log(readerBox, departmentBox, borrowTopBox);
});