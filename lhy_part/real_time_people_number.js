//now read json file and get data_list
let json2 = null;
let json_total = null;

function find_correct_file_name(day, month, year) {
    return day + '_' + month + '_' + year + '.json';
}

function updateDailyChart() {
    let dateStr = document.getElementById('date-input').value;
    let date = new Date(dateStr);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let chartDomTotal = document.getElementById('total-resource');
    let myChartTotal = echarts.init(chartDomTotal);
    let optionTotal ={};

    let chartDomDaily = document.getElementById('daily-number');
    let myChartDaily = echarts.init(chartDomDaily);
    let optionDaily ={};
    let peopleNumberPerLib = [];

    let fileName = "../data/split_json/" + find_correct_file_name(day, month, year);
    console.log(fileName);

    readJsonTotal('../data/00-图书馆资源总量.json');
    readJson2(fileName);

    //set loading animation
    optionTotal = {
        graphic: {
            elements: [
                {
                    type: 'group',
                    left: 'center',
                    top: 'center',
                    children: new Array(7).fill(0).map((val, i) => ({
                        type: 'rect',
                        x: i * 20,
                        shape: {
                            x: 0,
                            y: -40,
                            width: 10,
                            height: 80
                        },
                        style: {
                            fill: '#5470c6'
                        },
                        keyframeAnimation: {
                            duration: 1000,
                            delay: i * 200,
                            loop: true,
                            keyframes: [
                                {
                                    percent: 0.5,
                                    scaleY: 0.3,
                                    easing: 'cubicIn'
                                },
                                {
                                    percent: 1,
                                    scaleY: 1,
                                    easing: 'cubicOut'
                                }
                            ]
                        }
                    }))
                }
            ]
        }
    };
    optionDaily = optionTotal;

    // myChartTotal.setOption(option_total);
    myChartDaily.setOption(optionDaily);

    setTimeout(function(){
        myChartTotal.clear();
        // myChartTotal = echarts.init(chartDomTotal);
        let total_data_str = "";
        for (let i =0; i< json_total.index.length; i++){
            total_data_str += json_total.data[i][0] + ' ' + json_total.data[i][1] + '\n';
        }

        optionTotal = {
            graphic: {
                elements: [
                    {
                        type: 'text',
                        left: 'center',
                        top: 'center',
                        style: {
                            text: total_data_str,
                            fontSize: 20,
                            fontWeight: 'bold',
                            lineDash: [0, 200],
                            lineDashOffset: 0,
                            fill: 'transparent',
                            stroke: '#08f',
                            lineWidth: 1
                        },
                        keyframeAnimation: {
                            duration: 2000,
                            loop: false,
                            keyframes: [
                                {
                                    percent: 0.7,
                                    style: {
                                        fill: 'transparent',
                                        lineDashOffset: 200,
                                        lineDash: [200, 0]
                                    }
                                },
                                {
                                    // Stop for a while.
                                    percent: 0.8,
                                    style: {
                                        fill: 'transparent'
                                    }
                                },
                                {
                                    percent: 1,
                                    style: {
                                        fill: 'blue'
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        };

        myChartTotal.setOption(optionTotal);

        setTimeout(function () {
            myChartDaily.clear();
            peopleNumberPerLib = calculate_people_number();
            optionDaily = {
                legend: {},
                tooltip: {
                    trigger: 'axis',
                    showContent: false
                },
                dataset: {
                    source:[
                        ['product', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
                            '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
                        peopleNumberPerLib[0],
                        peopleNumberPerLib[1],
                        peopleNumberPerLib[2],
                        peopleNumberPerLib[3]
                    ]
                },
                xAxis: { type: 'category' },
                yAxis: { gridIndex: 0 },
                grid: { top: '55%' },
                series: [
                    {
                        type: 'line',
                        smooth: true,
                        seriesLayoutBy: 'row',
                        emphasis: { focus: 'series' }
                    },
                    {
                        type: 'line',
                        smooth: true,
                        seriesLayoutBy: 'row',
                        emphasis: { focus: 'series' }
                    },
                    {
                        type: 'line',
                        smooth: true,
                        seriesLayoutBy: 'row',
                        emphasis: { focus: 'series' }
                    },
                    {
                        type: 'line',
                        smooth: true,
                        seriesLayoutBy: 'row',
                        emphasis: { focus: 'series' }
                    },
                    {
                        type: 'pie',
                        id: 'pie',
                        radius: '30%',
                        center: ['50%', '25%'],
                        emphasis: {
                            focus: 'self'
                        },
                        label: {
                            formatter: '{b}: {@2012} ({d}%)'
                        },
                        encode: {
                            itemName: 'product',
                            value: '2012',
                            tooltip: '2012'
                        }
                    }
                ]
            };
            myChartDaily.on('updateAxisPointer', function (event) {
                const xAxisInfo = event.axesInfo[0];
                if (xAxisInfo) {
                    const dimension = xAxisInfo.value + 1;
                    myChartDaily.setOption({
                        series: {
                            id: 'pie',
                            label: {
                                formatter: '{b}: {@[' + dimension + ']} ({d}%)'
                            },
                            encode: {
                                value: dimension,
                                tooltip: dimension
                            }
                        }
                    });
                }
            });
            myChartDaily.setOption(optionDaily);
        });
        optionDaily && myChartDaily.setOption(optionDaily);
    }, 1000);
}

function readJson2(file_path) {
    fetch(file_path)
        .then(response => response.json())
        .then(data => {
            json2 = data;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function readJsonTotal(file_path) {
    fetch(file_path)
        .then(response => response.json())
        .then(data => {
            json_total = data;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function calculate_people_number(time_interval = 3600){
    let people_number_density_with_time_per_lib = {};
    for (let i = 0; i < json2.length; i++) {
        let lib = json2[i]["Sub_Lib"];
        let event_time = json2[i]["EventTime"];
        //convert event time to seconds
        let time = event_time.split(':');
        let seconds = parseInt(time[0]) * 3600 + parseInt(time[1]) * 60 + parseInt(time[2]);

        for (let hours = 0; hours < 24; hours += 1){
            let start_time = hours * 3600;
            let end_time = start_time + time_interval;
            if (seconds >= start_time && seconds < end_time){
                if (people_number_density_with_time_per_lib[lib] === undefined){
                    people_number_density_with_time_per_lib[lib] = [];
                    people_number_density_with_time_per_lib[lib].push(lib);
                    for (let j = 0; j < 24; j++){
                        people_number_density_with_time_per_lib[lib].push(0);
                    }
                }else{
                    // let sub_script = seconds / time_interval;
                    let sub_script = Math.floor(seconds / time_interval) + 1;
                    people_number_density_with_time_per_lib[lib][sub_script] += 1;
                }
            }
        }
    }

    //convert people_number_density_with_time_per_lib to list
    let people_number_density_with_time_per_lib_list = [];
    for (let key in people_number_density_with_time_per_lib){
        people_number_density_with_time_per_lib_list.push(people_number_density_with_time_per_lib[key]);
    }

    return people_number_density_with_time_per_lib_list;
}





