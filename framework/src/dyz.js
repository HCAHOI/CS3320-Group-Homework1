let bookTimeMap = new Map();    // timestamp -> array of data
let occupationMap = new Map();  //
let bookTimeChart = null;

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
    xhrBorrow.open('GET', '../../data/06-2021年11月-2024年4月共享办公位预约情况.json', false);
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
    xhrBorrow.open('GET', '../../data/07-231101-240331小组学习面试空间预约情况.json', false);
    xhrBorrow.onreadystatechange = function () {
        if (xhrBorrow.readyState === 4 && xhrBorrow.status === 200) {
            let occupationData = JSON.parse(xhrBorrow.responseText).data;
            console.log('Finish Reading 06.json');
        }
    };
    xhrBorrow.send();
}

function initBookTimeChart() {
    let selectedSeat = document.getElementById('seat-select').value;
    let seatData = [];

    // get data
    bookTimeMap.forEach((recordArray) => {
        let bookCount = 0;
        let peopleCountSet = new Set();
        recordArray.forEach(record => {
           if(record[3] === selectedSeat) {
               if(!peopleCountSet.has(record[2])) {
                    peopleCountSet.add(record[2]);
               }
                bookCount++;
           }
        });
        // book times, people count
        seatData.push([bookCount, peopleCountSet.size]);
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
            data: ['预约次数', '预约人数'],
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
                name: '预约次数',
                min: 0,
                max: d3.max(seatData.map((data) => data[0])),
                interval: 20,
                axisLabel: {
                    formatter: '{value} 次',
                    textStyle: {
                        color: '#FFFFFF'
                    },
                },
            },
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
            }
        ],
        series: [
            {
                name: '预约次数',
                type: 'line',
                data: seatData.map((data) => data[0])
            },
            {
                name: '预约人数',
                type: 'bar',
                yAxisIndex: 1,
                data: seatData.map((data) => data[1])
            }
        ]
    };

    bookTimeChart.setOption(options);
}

function updateBookTimeChart() {
    let selectedSeat = document.getElementById('seat-select').value;
    let seatData = [];

    // get data
    bookTimeMap.forEach((recordArray) => {
        let bookCount = 0;
        let peopleCountSet = new Set();
        recordArray.forEach(record => {
            if(record[3] === selectedSeat) {
                if(!peopleCountSet.has(record[2])) {
                    peopleCountSet.add(record[2]);
                }
                bookCount++;
            }
        });
        // book times, people count
        seatData.push([bookCount, peopleCountSet.size]);
    });

    let options = {
        yAxis: [
            {
                max: d3.max(seatData.map((data) => data[0])),
            },
        ],
        series: [
            {
                data: seatData.map((data) => data[0])
            },
            {
                data: seatData.map((data) => data[1])
            }
        ]
    };

    bookTimeChart.setOption(options);
}

document.addEventListener('DOMContentLoaded', function () {
    let bookTimeBox = document.querySelector('#book-time-chart-container .data-box')
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


    loadBookTimeData();
    loadOccupationData();

    initBookTimeChart();
    document.getElementById('seat-select').addEventListener('change', () => {
        updateBookTimeChart();
    });

    generateRoomOptions();
    generateOccupationChart();
    document.getElementById("room-select").addEventListener("change", () => {
        generateOccupationChart();
    });
    document.getElementById("library-select").addEventListener("change", () => {
        generateRoomOptions();
        generateOccupationChart();
    });

    let roomBox = document.querySelector('#A3Dbox .data-box')
    roomBox.style.display = 'flex';
});

export function generateRoomOptions() {
    let librarySelect = document.getElementById("library-select");
    let roomSelect = document.getElementById("room-select");
    roomSelect.innerHTML = ""; // Clear previous options

    switch (librarySelect.value) {
        case "minhang1": {
            let rooms = [
                "A215", "A216", "A315", "A316", "A415", "A416",
                "B215", "B216", "B315", "B316", "B415", "B416",
                "C315", "C316",
                "E209", "E210", "E211", "E216", "E309", "E310", "E311", "E312", "E316"
            ];

            rooms.forEach(function (room, index) {
                addRoomOption(room, "Room " + room);
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
                addRoomOption(room, "Room " + room);
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

// Updated search function
export function generateOccupationChart() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '../../data/room_occupancy_all.json', true);
    let t_data = null;
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    t_data = JSON.parse(xhr.responseText);
                    updateOccupationChart(t_data);
                } catch (e) {
                    console.error('Error parsing JSON!', e);
                }
            } else {
                console.error('HTTP Error: ' + xhr.status);
            }
        }
    };
    xhr.send();
}


export function updateOccupationChart(roomData) {
    const selectedRoom = document.getElementById("room-select").value;


}
