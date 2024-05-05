let bookTimeMap = new Map();    // timestamp -> array of data
let occupationMap = new Map();  //room -> (timestamp -> (startTime -> endTime))
let bookTimeChart = null;
let occupationChart = null;

function mapCountUpdate (element, map) {
    if (!map.has(element)) {
        map.set(element, 1);
    } else {
        map.set(element, map.get(element) + 1);
    }
}

function getWeek (data) {
    let date = new Date(data);
    let day = date.getDay();
    let diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
}

function loadBookTimeData () {
    let xhrBorrow = new XMLHttpRequest();
    xhrBorrow.open('GET', '../data/06-2021年11月-2024年4月共享办公位预约情况.json', false);
    xhrBorrow.onreadystatechange = function () {
        if (xhrBorrow.readyState === 4 && xhrBorrow.status === 200) {
            let bookTimeData = JSON.parse(xhrBorrow.responseText).data;
            bookTimeData.forEach((record) => {
                let accurateDate = new Date(record[0]);
                if(accurateDate.getFullYear() !== 2023) {
                    return;
                }
                let date = new Date(accurateDate.getFullYear(), accurateDate.getMonth(), 1);
                if (!bookTimeMap.has(date.toDateString())) {
                    bookTimeMap.set(date.toDateString(), []);
                }
                bookTimeMap.get(date.toDateString()).push(record);
            })

            console.log(bookTimeMap);
            console.log('Finish Reading 06.json');
        }
    };
    xhrBorrow.send();
}

function loadOccupationData () {
    let xhrBorrow = new XMLHttpRequest();
    xhrBorrow.open('GET', '../data/07-231101-240331小组学习面试空间预约情况.json', false);
    xhrBorrow.onreadystatechange = function () {
        if (xhrBorrow.readyState === 4 && xhrBorrow.status === 200) {
            let occupationData = JSON.parse(xhrBorrow.responseText).data;

            // record[4] -> room
            occupationData.forEach((record) => {
                let room = record[4];
                let accurateStartDate = new Date(record[7]);
                let accurateEndDate = new Date(record[8]);
                // filter the records that not in the same day or start at dawn
                if (accurateStartDate.getDate() !== accurateEndDate.getDate() || accurateStartDate.getHours() < 6 || accurateEndDate.getHours() < 6) {
                    return;
                }
                // only year, month, day
                let mapDate = new Date(accurateStartDate.getFullYear(), accurateStartDate.getMonth(), accurateStartDate.getDate());

                // if no room log, add room
                if (!occupationMap.has(room)) {
                    occupationMap.set(room, new Map());
                }
                // if no date log, add date
                if (!occupationMap.get(room).has(mapDate.toDateString())) {
                    occupationMap.get(room).set(mapDate.toDateString(), []);
                }

                // add start time and end time
                occupationMap.get(room).get(mapDate.toDateString()).push([accurateStartDate, accurateEndDate]);
            });

            console.log(occupationMap);
            console.log('Finish Reading 07.json');
        }
    };
    xhrBorrow.send();
}

function initBookTimeChart() {
    let selectedSeat = document.getElementById('seat-select').value;
    let seatData = [];

    // get data
    let maxTimeCount = 0;
    let minTimeCount = 100000;
    bookTimeMap.forEach((recordArray) => {
        let bookCount = 0;
        let peopleCountSet = new Set();
        let bookTimeCount = 0;
        recordArray.forEach(record => {
           if(record[3] === selectedSeat) {
               if(!peopleCountSet.has(record[2])) {
                    peopleCountSet.add(record[2]);
               }
               bookCount++;
               bookTimeCount += (+record[1] - +record[0]) / 1000 / 60 / 60;
               maxTimeCount = Math.max(maxTimeCount, bookTimeCount);
               minTimeCount = Math.min(minTimeCount, bookTimeCount);
           }
        });
        // book times, people count
        seatData.push([bookCount, peopleCountSet.size, bookTimeCount]);
    })

    // generate chart
    bookTimeChart = echarts.init(document.getElementById('book-time-chart'));
    let months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    let options = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data: [ '预约人数', '预约人次'],
            textStyle: {
                color: '#FFFFFF'
            },
        },
        xAxis: {
            type: 'category',
            data: months,
            axisLabel: {
                textStyle: {
                    color: '#FFFFFF'
                },
            },
        },
        yAxis: [
            {
                type: 'value',
                name: '预约人数',
                min: 10,
                max: 0,
                interval: 20,
                axisLabel: {
                    formatter: '{value} 人',
                    textStyle: {
                        color: '#FFFFFF'
                    },
                },
            },
            {
                type: 'value',
                name: '预约人次',
                min: 0,
                max: d3.max(seatData.map((data) => data[0])),
                interval: 20,
                axisLabel: {
                    formatter: '{value} 次',
                    textStyle: {
                        color: '#FFFFFF'
                    },
                },
            }
        ],
        series: [
            {
                name: '预约人数',
                type: 'line',
                data: seatData.map((data) => data[1])
            },
            {
                name: '预约人次',
                type: 'bar',
                yAxisIndex: 1,
                data: seatData.map((data) => {
                    let colorScale = d3.scaleLinear()
                      .domain([minTimeCount, maxTimeCount])
                      .range(['#edf3ed', '#318031']);

                    return {
                        value: data[0],
                        itemStyle: {
                            color: colorScale(data[2])
                        }
                    };
                })
            }
        ]
    };

    bookTimeChart.setOption(options);
}

function updateBookTimeChart() {
    let selectedSeat = document.getElementById('seat-select').value;
    let seatData = [];

    // get data
    let maxTimeCount = 0;
    let minTimeCount = 100000;
    bookTimeMap.forEach((recordArray) => {
        let bookCount = 0;
        let peopleCountSet = new Set();
        let bookTimeCount = 0;
        recordArray.forEach(record => {
            if(record[3] === selectedSeat) {
                if(!peopleCountSet.has(record[2])) {
                    peopleCountSet.add(record[2]);
                }
                bookCount++;
                bookTimeCount += (+record[1] - +record[0]) / 1000 / 60 / 60;
                maxTimeCount = Math.max(maxTimeCount, bookTimeCount);
                minTimeCount = Math.min(minTimeCount, bookTimeCount);
            }
        });
        // book times, people count
        seatData.push([bookCount, peopleCountSet.size, bookTimeCount]);
    });

    let options = {
        yAxis: [
            {
                type: 'value',
                name: '预约人数',
                min: 10,
                max: 0,
                interval: 20,
                axisLabel: {
                    formatter: '{value} 人',
                    textStyle: {
                        color: '#FFFFFF'
                    },
                },
            },
            {
                type: 'value',
                name: '预约人次',
                min: 0,
                max: d3.max(seatData.map((data) => data[0])),
                interval: 20,
                axisLabel: {
                    formatter: '{value} 次',
                    textStyle: {
                        color: '#FFFFFF'
                    },
                },
            }
        ],
        series: [
            {
                name: '预约人数',
                type: 'line',
                data: seatData.map((data) => data[1])
            },
            {
                name: '预约人次',
                type: 'bar',
                yAxisIndex: 1,
                data: seatData.map((data) => {
                    let colorScale = d3.scaleLinear()
                      .domain([minTimeCount, maxTimeCount])
                      .range(['#edf3ed', '#318031']);

                    return {
                        value: data[0],
                        itemStyle: {
                            color: colorScale(data[2])
                        }
                    };
                })
            }
        ]
    };

    bookTimeChart.setOption(options);
}

document.addEventListener('DOMContentLoaded', function () {
    let bookTimeBox = document.querySelector('#book-time-chart-container .data-box');
    bookTimeBox.style.display = 'flex';
    let chartContainer = document.createElement('div');
    chartContainer.style.width = '100%';
    chartContainer.style.height = '100%';
    chartContainer.id = 'book-time-chart';
    bookTimeBox.appendChild(chartContainer);

    let seatSelector = document.createElement('select');
    seatSelector.id = 'seat-select';
    seatSelector.innerHTML = `
      <option value="522-A">522-A</option>
      <option value="523-A">523-A</option>
      <option value="523-B">523-B</option>
      <option value="523-C">523-C</option>
      <option value="523-D">523-D</option>
      <option value="523-E">523-E</option>
      <option value="523-F">523-F</option>
      <option value="523-G">523-G</option>
    `;
    bookTimeBox.appendChild(seatSelector);

    let occupationBox = document.querySelector('#occupation-chart-container .data-box');
    let selectors = document.createElement('div');
    selectors.id = 'selectors';
    let librarySelector = document.createElement('select');
    librarySelector.id = 'library-select';
    librarySelector.innerHTML = `
      <option value="minhang1">闵行-主馆</option>
      <option value="minhang2">闵行-包玉刚</option>
    `;
    selectors.appendChild(librarySelector);
    let roomSelector = document.createElement('select');
    roomSelector.id = 'room-select';
    selectors.appendChild(roomSelector);
    occupationBox.appendChild(selectors);

    let occupationChartContainer = document.createElement('div');
    occupationChartContainer.style.width = '100%';
    occupationChartContainer.style.height = '100%';
    occupationChartContainer.id = 'occupation-chart';
    occupationBox.appendChild(occupationChartContainer);

    loadBookTimeData();
    loadOccupationData();

    initBookTimeChart();
    document.getElementById('seat-select').addEventListener('change', () => {
        updateBookTimeChart();
    });

    generateRoomOptions();
    initOccupationChart();
    document.getElementById('room-select').addEventListener('change', () => {
        updateOccupationChart();
    });
    document.getElementById('library-select').addEventListener('change', () => {
        generateRoomOptions();
        updateOccupationChart();
    });
    document.getElementById('date-input').addEventListener('change', () => {
        updateOccupationChart();
    });

});

export function generateRoomOptions () {
    let librarySelect = document.getElementById('library-select');
    let roomSelect = document.getElementById('room-select');
    roomSelect.innerHTML = ''; // Clear previous options

    switch (librarySelect.value) {
        case "minhang1": {
            let rooms = [
                "A215", "A216", "A315", "A316", "A415", "A416",
                "B215", "B216", "B315", "B316", "B415", "B416",
                "C315", "C316",
                "E209", "E210", "E211", "E216", "E309", "E310", "E311", "E312", "E316"
            ];

            rooms.forEach(function (room, index) {
                addRoomOption(room, room);
            });
            break;
        }
        case "minhang2": {
            let rooms = [
                "306", "307", "308", "309", "311",
                "407", "408", "409", "410", "411", "412", "413",
                "619", "620", "621"
            ];

            rooms.forEach(function (room) {
                addRoomOption(room, room);
            });
            break;
        }
    }
}

export function addRoomOption(value, text) {
    let option = document.createElement("option");
    option.value = value;
    option.text = text;
    document.getElementById("room-select").appendChild(option);
}

export function initOccupationChart() {
    let date = new Date(2023, 11, 1);
    let room = document.getElementById('room-select').value;
    let roomMap = occupationMap.get(room);

    // get sevem days' data
    let occupationData = [];
    for(let i = 0; i < 7; i++) {
        let dateStr = date.toDateString();
        if(roomMap.has(dateStr)) {
            occupationData.push(roomMap.get(dateStr));
        } else {
            occupationData.push([]);
        }
        date.setDate(date.getDate() + 1);
    }

    // erase records which has the same start time
    for(let i = 0; i < 7; i++) {
        let dayData = occupationData[i];
        let dayMap = new Map();
        for(let j = 0; j < dayData.length; j++) {
            let interval = dayData[j];
            let startTime = interval[0];
            if(dayMap.has(startTime.toDateString())) {
                dayData.splice(j, 1);
                j--;
            } else {
                dayMap.set(startTime.toDateString(), 1);
            }
        }
    }

    // generate
    let margin = {top: 50, right: 20, bottom: 30, left: 100};
    let width = 550 - margin.left - margin.right;
    let height = 250 - margin.top - margin.bottom;

    const svg = d3.select('#occupation-chart').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('transform', 'translate(0, 20)')
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleLinear()
      .domain([0, 24])
      .range([0, width]);

    const yScale = d3.scaleBand()
      .domain(d3.range(7))
      .rangeRound([0, height])
      .paddingInner(0.5);

    // add background
    svg.selectAll('rect')
      .data(d3.range(7))
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', d => yScale(d))
      .attr('width', width)
      .attr('height', yScale.bandwidth())
      .attr('fill', 'grey');


    occupationData.forEach((dayData, dayIndex) => {
        dayData.forEach(interval => {
            svg.append('rect')
              .attr('x', xScale(interval[0].getHours()))
              .attr('y', yScale(dayIndex))
              .attr('width', xScale(interval[1].getHours()) - xScale(interval[0].getHours())) // endTime - startTime
              .attr('height', yScale.bandwidth())
              .attr('class', 'occupation-rect')
              .attr('fill', 'rgba(120, 200, 80, 0.8)');
        });
    });

    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('fill', 'white');

    // set date back
    date.setDate(date.getDate() - 7);
    svg.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale).tickFormat(d => {
          let dateStr = date.toDateString();
          date.setDate(date.getDate() + 1);
          return dateStr;
      }))
      .selectAll('text')
      .attr('fill', 'white');

    const legend_reserved = svg.append('g')
      .attr('transform', `translate(${30}, ${height - 200})`);

    legend_reserved.append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', 'rgba(120, 200, 80, 0.8)');

    legend_reserved.append('text')
      .attr('x', 24)
      .attr('y', 9)
      .attr('dy', '0.35em')
      .style('text-anchor', 'start')
      .text('已预约')
      .style('fill', 'white');

    const legend_available = svg.append('g')
      .attr('transform', `translate(${200}, ${height - 200})`);

    legend_available.append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', 'grey');

    legend_available.append('text')
      .attr('x', 24)
      .attr('y', 9)
      .attr('dy', '0.35em')
      .style('text-anchor', 'start')
      .text('无人使用')
      .style('fill', 'white');

    occupationChart = svg;

}

export function updateOccupationChart() {
    let dateStr = document.getElementById('date-input').value;
    if (dateStr < '2023-11-01' || dateStr > '2023-12-31') {
        dateStr = '2023-12-01';
    }
    let date = new Date(dateStr);
    let room = document.getElementById('room-select').value;
    let roomMap = occupationMap.get(room);

    let occupationData = [];
    for(let i = 0; i < 7; i++) {
        let dateStr = date.toDateString();
        if(roomMap.has(dateStr)) {
            occupationData.push(roomMap.get(dateStr));
        } else {
            occupationData.push([]);
        }
        date.setDate(date.getDate() + 1);
    }

    for(let i = 0; i < 7; i++) {
        let dayData = occupationData[i];
        let dayMap = new Map();
        for(let j = 0; j < dayData.length; j++) {
            let interval = dayData[j];
            let startTime = interval[0];
            if(dayMap.has(startTime.toDateString())) {
                dayData.splice(j, 1);
                j--;
            } else {
                dayMap.set(startTime.toDateString(), 1);
            }
        }
    }

    let margin = {top: 50, right: 20, bottom: 30, left: 100};
    let width = 550 - margin.left - margin.right;
    let height = 250 - margin.top - margin.bottom;

    occupationChart.selectAll('.occupation-rect').remove();

    const xScale = d3.scaleLinear()
      .domain([0, 24])
      .range([0, width]);

    const yScale = d3.scaleBand()
      .domain(d3.range(7))
      .rangeRound([0, height])
      .paddingInner(0.5);

    occupationData.forEach((dayData, dayIndex) => {
        dayData.forEach(interval => {
            occupationChart.append('rect')
              .attr('x', xScale(interval[0].getHours()))
              .attr('y', yScale(dayIndex))
              .attr('width', xScale(interval[1].getHours()) - xScale(interval[0].getHours()))
              .attr('height', yScale.bandwidth())
              .attr('class', 'occupation-rect')
              .attr('fill', 'rgba(120, 200, 80, 0.8)');
        });
    });

    date.setDate(date.getDate() - 7);
    // remove previous axis
    occupationChart.selectAll('.y-axis').remove();

    occupationChart.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale).tickFormat(d => {
          let dateStr = date.toDateString();
          date.setDate(date.getDate() + 1);
          return dateStr;
      }))
      .selectAll('text')
      .attr('fill', 'white');
}
