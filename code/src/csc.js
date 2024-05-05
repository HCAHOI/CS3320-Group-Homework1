let bookBorrowMap = new Map();
let popularityMap = new Map();
let bookBorrowChart = null;
let popularityChart = null;

document.addEventListener('DOMContentLoaded', function () {
    let bookBorrowBox = document.querySelector('#book-borrow-trend .data-box');
    bookBorrowBox.style.display = 'flex';

    let borrowChartContainer = document.createElement('div');
    borrowChartContainer.style.width = '100%';
    borrowChartContainer.style.height = '100%';
    borrowChartContainer.id = 'book-borrow-chart';
    bookBorrowBox.appendChild(borrowChartContainer);

    let populationBox = document.querySelector('#book-search-popularity .data-box');
    populationBox.style.display = 'flex';

    let popularityChartContainer = document.createElement('div');
    popularityChartContainer.style.width = '100%';
    popularityChartContainer.style.height = '100%';
    popularityChartContainer.id = 'popularity-chart';
    populationBox.appendChild(popularityChartContainer);

    loadBookBorrowData().then(() => {
        initBookBorrowChart();
    });

    loadPopularityData().then(() => {
        initPopularityChart();
    });

    document.getElementById('date-input').addEventListener('change', function () {
        let date = document.getElementById('date-input').value;
        console.log(date);
        initBookBorrowChart();
    });
    
/*
    generateRoomOptions();
    document.getElementById('room-select').addEventListener('change', () => {
        updatepopularityChart();
    });
    document.getElementById('library-select').addEventListener('change', () => {
        generateRoomOptions();
        updatepopularityChart();
    });
*/
});

function loadBookBorrowData() {
    return fetch('../data/book_borrow_data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        for (const [date, events] of Object.entries(data)) {
            const dailyEvents = new Map(Object.entries(events));
            bookBorrowMap.set(date, dailyEvents);
        }
    })
    .then(() => {
        const entries = Array.from(bookBorrowMap.entries()).map(entry => [
            entry[0], Array.from(entry[1].entries())
        ]);
        console.log("Book Borrow Data Loaded: ", entries);
    })
    .catch(error => {
        console.error('There has been a problem with fetching book_borrow_data.json:', error);
    });
}
function initBookBorrowChart() {
    let dateStr = document.getElementById('date-input').value;
    console.log(dateStr);
    let myChart = echarts.init(document.getElementById('book-borrow-chart'));

    // 准备图表数据
    const dates = [];
    const borrowCounts = [];
    const returnCounts = [];
    const renewCounts = [];
    const reserveCounts = [];

    const sortedDates = Array.from(bookBorrowMap.keys()).sort((a, b) => {
        return a.localeCompare(b);
    });
    const Month = dateStr.slice(5, 7);

    sortedDates.forEach(date => {
        const events = bookBorrowMap.get(date);
        const month = date.slice(0, 2);
        if(month === Month) {
            dates.push(date);
            borrowCounts.push(events.get('借阅') || 0);
            returnCounts.push(events.get('归还') || 0);
            renewCounts.push(events.get('续借') || 0);
            reserveCounts.push(events.get('预约') || 0);
        }
    });
    // 获取特定日期的借还书数目
    const specificDate = dateStr.replace(/-/g, '').slice(4); // 将 "2023-04-01" 转换为 "0401"
    const specificEvents = bookBorrowMap.get(specificDate);
    const borrowToday = specificEvents ? specificEvents.get('借阅') || 0 : 0;
    const returnToday = specificEvents ? specificEvents.get('归还') || 0 : 0;
    const renewToday = specificEvents ? specificEvents.get('续借') || 0 : 0;
    const reserveToday = specificEvents ? specificEvents.get('预约') || 0 : 0;

    const displayText = `预约: ${reserveToday}\n\n续借: ${renewToday}\n\n归还: ${returnToday}\n\n借阅: ${borrowToday}`;

    let option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['借阅', '归还', '续借', '预约'],
            textStyle: {
                color: 'white'
            }
        },
        grid: {
            left: '20%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dates
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '借阅',
                type: 'line',
                stack: '总量',
                areaStyle: {},
                data: borrowCounts
            },
            {
                name: '归还',
                type: 'line',
                stack: '总量',
                areaStyle: {},
                data: returnCounts
            },
            {
                name: '续借',
                type: 'line',
                stack: '总量',
                areaStyle: {},
                data: renewCounts
            },
            {
                name: '预约',
                type: 'line',
                stack: '总量',
                areaStyle: {},
                data: reserveCounts
            }
        ],
        graphic: {
            type: 'text',
            left: '5%',
            top: '30%',
            style: {
                text: displayText,
                fill: 'white',
                fontSize: 16,
                fontWeight: 'bold'
            }
        }
    };

    myChart.setOption(option);
}

function loadPopularityData() {
    return fetch('../data/03-检索热度.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            data.data.forEach((item) => {
                popularityMap.set(item[0], item[1]);
            });
        })
        .then(() => {
            console.log("Popularity Map Loaded: ", Array.from(popularityMap.entries()));
        })
        .catch(error => {
            console.error('There has been a problem with fetching 03.json:', error);
        });
}
function initPopularityChart()
{
    let data = Array.from(popularityMap.entries()).sort((a, b) => b[1] - a[1]);

    let margin = {top: 75, right: 5, bottom: 10, left: 5};
    let width = 400 - margin.left - margin.right;
    let height = 250 - margin.top - margin.bottom;

    const svg = d3.select('#popularity-chart').append('svg')
        .attr('width', width + margin.left + margin.right + 100)
        .attr('height', height + margin.top + margin.bottom)
        .attr('transform', 'translate(0, 20)')
        .append('g')
        .attr('transform', `translate(80, 20)`);

    function hexagon(x0, y0, radius) {
        const angle = Math.PI / 3;
        return d3.range(6).map(i => {
            const x = x0 + radius * Math.sin(angle * i);
            const y = y0 + radius * Math.cos(angle * i);
            return [x, y];
        });
    }
    const radiusScale = d3.scaleSqrt()
        .domain([0, d3.max(data, d => d[1])])
        .range([0, 60]);
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, d3.max(data, d => d[1])]);
    const brightnessScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[1])])
        .range([0.3, 1]);
    const strokeWidthScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[1])])
        .range([0, 2]);

    data.forEach((d, i) => {
        const radius = radiusScale(d[1]) - 15;
        const baseColor = d3.color(colorScale(d[1]));
        baseColor.opacity = brightnessScale(d[1]);
        const strokeWidth = strokeWidthScale(d[1]);
        let x, y;
        switch (i) {
            case 0:
                x = width / 2;
                y = height / 2 - 0.3 * radius;
                break;
            case 1:
                x = width / 2 - 2.3 * radius;
                y = height / 2 - 1.1 * radius;
                break;
            case 2:
                x = width / 2 + 2 * radius;
                y = height / 2 + 1.8 * radius;
                break;
            case 3:
                x = width / 2 + 2.8 * radius;
                y = height / 2 - 1.4 * radius;
                break;
            case 4:
                x = width / 2 - 3 * radius;
                y = height / 2 + 1.2 * radius;
                break;
            case 5:
                x = width / 2 + 5.5 * radius;
                y = height / 2 + 0.6 * radius;
                break;
            case 6:
                x = width / 2 - 6 * radius;
                y = height / 2 - radius;
                break;
            case 7:
                x = width / 2 - 6.2 * radius;
                y = height / 2 + 0.7 * radius;
                break;
            case 8:
                x = width / 2 + 6.3 * radius;
                y = height / 2 - radius;
                break;
            case 9:
                x = width / 2 - radius;
                y = height / 2 + 4 * radius;
                break;
            default:
                let angle = Math.random() * 2 * Math.PI;
                let spread = 4 * radius + (i * radius / 4);
                x = width / 2 + spread * Math.cos(angle);
                y = height / 2 + spread * Math.sin(angle);
                break;
        }
        if (x - radius < 0) x = radius;
        if (x + radius > width) x = width - radius;
        if (y - radius < 0) y = radius;
        if (y + radius > height) y = height - radius;

        svg.append('polygon')
        .attr('points', hexagon(x, y, radius).join(' '))
        .style('fill', baseColor)
        .style('stroke', 'lightblue')
        .style('stroke-width', strokeWidth);

        svg.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'central')
        .text(d[0]+': '+d[1])
        .style('fill', 'white')
        .style('font-family', 'Arial')
        .style('font-size', '12px')
        .attr('font-weight', 'bold');
    });
}