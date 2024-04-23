document.addEventListener('DOMContentLoaded', function () {
    let bookTimeBox = document.querySelector('#A3Dbox .data-box')
    bookTimeBox.style.display = 'flex';
    let chartContainer = document.createElement('div');
    chartContainer.style.width = '100%';
    chartContainer.style.height = '100%';
    chartContainer.id = 'book-time-chart';
    bookTimeBox.appendChild(chartContainer);

    const echartsInstance = echarts.init(chartContainer);
    const hours = ['0点', '1点', '2点', '3点', '4点', '5点', '6点', '7点', '8点', '9点', '10点', '11点', '12点', '13点', '14点', '15点', '16点', '17点', '18点', '19点', '20点', '21点', '22点', '23点'];
    const days = ['2024-3-24', '2024-3-25', '2024-3-26', '2024-3-27', '2024-3-28', '2024-3-29', '2024-3-30'];
    const data = [
        //[0, 0, 0], [0, 1, 0], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0], [0, 6, 0], [0, 7, 0],
        [0, 8, 37], [0, 9, 58], [0, 10, 61], [0, 11, 58], [0, 12, 76], [0, 13, 64], [0, 14, 64], [0, 15, 56],
        [0, 16, 56], [0, 17, 65], [0, 18, 68], [0, 19, 58], [0, 20, 57], [0, 21, 61], [0, 22, 45], //[0, 23, 0],
        //[1, 0,], [1, 1, 0], [1, 2, 0], [1, 3, 0], [1, 4, 0], [1, 5, 0], [1, 6, 0], [1, 7, 0],
        [1, 8, 21], [1, 9, 36], [1, 10, 41], [1, 11, 41], [1, 12, 51], [1, 13, 57], [1, 14, 59], [1, 15, 54],
        [1, 16, 58], [1, 17, 62], [1, 18, 78], [1, 19, 60], [1, 20, 58], [1, 21, 56], [1, 22, 46],// [1, 23, 0],
        //[2, 0, 0], [2, 1, 0], [2, 2, 0], [2, 3, 0], [2, 4, 0], [2, 5, 0], [2, 6, 0], [2, 7, 0],
        [2, 8, 16], [2, 9, 33], [2, 10, 39], [2, 11, 39], [2, 12, 47], [2, 13, 55], [2, 14, 55], [2, 15, 50],
        [2, 16, 50], [2, 17, 59], [2, 18, 65], [2, 19, 53], [2, 20, 52], [2, 21, 55], [2, 22, 42],// [2, 23, 0],
        //[3, 0, 0], [3, 1, 0], [3, 2, 0], [3, 3, 0], [3, 4, 0], [3, 5, 0], [3, 6, 0], [3, 7, 0],
        [3, 8, 20], [3, 9, 38], [3, 10, 45], [3, 11, 45], [3, 12, 52], [3, 13, 69], [3, 14, 67], [3, 15, 60],
        [3, 16, 62], [3, 17, 70], [3, 18, 77], [3, 19, 61], [3, 20, 57], [3, 21, 56], [3, 22, 45],// [3, 23, 0],
        //[4, 0, 0], [4, 1, 0], [4, 2, 0], [4, 3, 0], [4, 4, 0], [4, 5, 0], [4, 6, 0], [4, 7, 0],
        [4, 8, 16], [4, 9, 31], [4, 10, 39], [4, 11, 41], [4, 12, 44], [4, 13, 52], [4, 14, 57], [4, 15, 55],
        [4, 16, 58], [4, 17, 62], [4, 18, 76], [4, 19, 60], [4, 20, 53], [4, 21, 58], [4, 22, 44], //[4, 23, 0],
        //[5, 0, 0], [5, 1, 0], [5, 2, 0], [5, 3, 0], [5, 4, 0], [5, 5, 0], [5, 6, 0], [5, 7, 0],
        [5, 8, 21], [5, 9, 40], [5, 10, 49], [5, 11, 46], [5, 12, 47], [5, 13, 45], [5, 14, 48], [5, 15, 43],
        [5, 16, 43], [5, 17, 49], [5, 18, 70], [5, 19, 54], [5, 20, 57], [5, 21, 54], [5, 22, 46], //[5, 23, 0],
        //[6, 0, 0], [6, 1, 0], [6, 2, 0], [6, 3, 0], [6, 4, 0], [6, 5, 0], [6, 6, 0], [6, 7, 0],
        [6, 8, 24], [6, 9, 45], [6, 10, 55], [6, 11, 53], [6, 12, 63], [6, 13, 64], [6, 14, 60], [6, 15, 51],
        [6, 16, 52], [6, 17, 64], [6, 18, 61], [6, 19, 53], [6, 20, 49], [6, 21, 60], [6, 22, 47],// [6, 23, 0]
    ];

    const barOpt = {
        tooltip: {
            formatter: function (params) {
                let series = params.seriesName;
                let val = params.value;
                return series + '<br/>' +
                    days[val[1]] + '<br/>' +
                    hours[val[0]] + '<br/>值：' + val[2];
            },
        },
        visualMap: {
            max: 80,
            min: 15,
            calculable: true,
            inRange: {
                color: ['#4E62AB', '#469EB4', '#87CFA4', '#CBE99D', '#FDB96A', '#F57547', '#D6404E', '#9E0142'] // 颜色数组倒序排列
            },
            textStyle: {
                color: '#fff'
            }
        },
        grid3D: {
            boxWidth: 200,
            boxDepth: 80,
            viewControl: {
                distance: 200, //视觉距离
                panMouseButton: 'none',    // 禁用鼠标平移
            },
            light: { //光照配置
                main: {
                    intensity: 1.2,
                    shadow: true
                },
                ambient: {
                    intensity: 0.3
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#fff'
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#fff',
                    width: 1
                }
            },
            axisPointer: {
                show: false
            },
            roam: false
        },
        xAxis3D: {
            type: 'category',
            name: '',
            data: hours
        },
        yAxis3D: {
            type: 'category',
            name: '',
            data: days,  // 去除年份，只保留月-日
            nameGap: 100,  // 增加nameGap值以向外移动标签
            axisLabel: {
                formatter: function (value) {
                    // 去除标签的年份部分
                    return value.slice(5);  // 假设日期格式为"YYYY-MM-DD"
                }
            }
        },
        zAxis3D: {
            type: 'value',
            name: ''
        },
        series: [{
            type: 'bar3D',
            name: 'Bar3D',

            data: data.map(function (item) {
                return {
                    value: [item[1], item[0], item[2]]
                }
            }),
            shading: 'lambert',
            emphasis: {
                label: {
                    textStyle: {
                        fontSize: 16,
                        color: '#900'
                    }
                },
                itemStyle: {
                    color: '#900',
                    borderRadius: [30, 30, 30, 50] // 设置柱子的顶部圆角程度
                }
            }
        }]
    };
    // 渲染图表
    echartsInstance.setOption(barOpt);

    generateRoomOptions();
    generateOccupationChart();
    document.getElementById("room-select").addEventListener("change", () => {
        // generateRoomOptions();
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
                    visualize(t_data);
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

export function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

export function visualize(roomData) {
    const roomInput = document.getElementById("room-select");
    const selectedRoom = roomInput.value;
    console.log(selectedRoom);
    const canvas = document.getElementById("room-chart");
    if (!canvas) {
        throw new Error("Canvas element ('room-chart') not found in the document.");
    }
    const ctx = canvas.getContext("2d");
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) {
        throw new Error("Tooltip element not found in the document.");
    }

    if (!roomData) {
        throw new Error("No room data provided to visualize function.");
    }

    //console.log(roomData);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    console.log(roomData);
    const dates = Object.keys(roomData);
    console.log(dates);
    if (dates.length === 0) {
        throw new Error("Room data is empty or not properly formatted.");
    }
    const numDates = dates.length;
    const cellHeight = canvas.height / numDates;
    const cellWidth = canvas.width / 18; // Assuming 24 hours

    let blocks = []; // Array to store block information

    try {
        dates.forEach((date, index) => {
            const dailyRooms = roomData[date].find(room => room['房间名称'] === selectedRoom)['occupancy_slots'];
            if (!dailyRooms) {
                console.warn(`No occupancy slots found for date: ${date}`);
                return;
            }
            console.log("dailyRooms:",dailyRooms);
            dailyRooms.forEach(room => {
                const startTime = room[0];
                const endTime = room[1];
                //console.log(startTime);
                //console.log(endTime);
                const startHour = parseInt(startTime.substring(11, 13), 10);
                const startMinute = parseInt(startTime.substring(14, 16), 10);
                const endHour = parseInt(endTime.substring(11, 13), 10);
                const endMinute = parseInt(endTime.substring(14, 16), 10);

                const x = (startHour - 6) * cellWidth + (startMinute / 60) * cellWidth;
                const y = index * cellHeight;
                const width = ((endHour - startHour) * 60 + (endMinute - startMinute + 60) % 60) * (cellWidth / 60);
                const height = cellHeight;

                const gradient = ctx.createLinearGradient(x, y, x, y + height);
                gradient.addColorStop(0, '#313695'); // start color
                gradient.addColorStop(1, '#87CEEB'); // end color
                ctx.fillStyle = gradient;

                roundRect(ctx, x, y, width, height * 0.5, 5); // Draw rounded rectangle
                ctx.fill();

                blocks.push({ x, y, width, height, startTime, endTime });
            });
        });
    } catch (error) {
        console.error("Failed to process room data:", error);
        throw new Error("Error processing room data for visualization.");
    }

    canvas.addEventListener('mousemove', function (evt) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = evt.clientX - rect.left;
        const mouseY = evt.clientY - rect.top;

        for (const block of blocks) {
            const { x, y, width, height, startTime, endTime } = block;

            if (mouseX > x && mouseX < x + width && mouseY > y && mouseY < y + 0.5* height) {
                tooltip.style.display = 'block';
                console.log(x, y, width, height, startTime, endTime);
                tooltip.style.left = `${evt.clientX + 10}px`;
                tooltip.style.top = `${evt.clientY}px`;
                tooltip.innerHTML = `${startTime} - ${endTime}`;
                return ; // Once a block is found, stop checking
            }
        }
        tooltip.style.display = 'none'; // Hide tooltip by default
    });

    // 计算新的字体大小
    // Additional rendering setups like axis labels can be handled similarly
    // Draw x-axis labels (hours)
    ctx.font = "9px Arial";
    ctx.fillStyle = "white";
    for (let hour = 8; hour <= 23; hour += 2) {
        const x = (hour - 6) * cellWidth ;
        ctx.fillText(hour.toString(), x, canvas.height );
    }

    // Draw y-axis labels (dates)
    ctx.font = "$8px Arial";
    ctx.fillStyle = "white";
    dates.forEach((date, index) => {
        const y = (index) * cellHeight;
        ctx.fillText(date.substring(5, 10), 0, y + cellHeight/2);
    });
    const legendStartX = cellWidth/4; // 图例起始位置的横坐标
    const legendStartY = canvas.height - 50; // 图例起始位置的纵坐标
    const legendRectWidth = cellWidth/2; // 图例矩形的宽度
    const legendRectHeight = cellHeight/4; // 图例矩形的高度
    const legendTextOffset = 5; // 图例文字距离矩形的偏移量

    const legendGradientStartX = legendStartX;
    const legendGradientStartY = legendStartY;
    const legendGradientEndX = legendStartX;
    const legendGradientEndY = legendStartY + legendRectHeight;

    const legendGradient = ctx.createLinearGradient(legendGradientStartX, legendGradientStartY, legendGradientEndX, legendGradientEndY);
    // 添加渐变色断点
    legendGradient.addColorStop(0, '#313695'); // 起始色
    legendGradient.addColorStop(1, '#87CEEB'); // 结束色

    // 设置渐变色为填充样式
    ctx.fillStyle = legendGradient;
    ctx.fillRect(legendStartX, legendStartY, legendRectWidth, legendRectHeight);
    ctx.fillStyle = 'white';
    ctx.fillText('已占用', legendStartX + legendRectWidth + legendTextOffset, legendStartY + legendRectHeight);

}
