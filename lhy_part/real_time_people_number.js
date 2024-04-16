//now read json file and get data_list
let json2 = null;
let json_total = null;
let day_to_show = null;
let month_to_show = null;
let year_to_show = null;


function parse_file_name(file_path) {
    let obj = {};
    let arr = file_path.split('_');
    obj['day'] = arr[0];
    obj['month'] = arr[1];
    obj['year'] = arr[2].split('.')[0];
    return obj;
}

function find_correct_file_name(day, month, year) {
    return day + '_' + month + '_' + year + '.json';
}

//get the input "day" from the <label for="day">日:</label>
// <input type="number" id="day" name="day" min="1" max="31" required>

function get_date() {
    day_to_show = document.getElementById('day').value;
    month_to_show = document.getElementById('month').value;
    year_to_show = document.getElementById('year').value;


    var chartDom_total = document.getElementById('total_resource');
    var myChart_total = echarts.init(chartDom_total);
    var option_total ={};

    var chartDom_daily = document.getElementById('daily_number');
    var myChart_daily = echarts.init(chartDom_daily);
    var option_daily ={};
    let people_number_per_lib = [];

    let file_name = "../data/split_json/" + find_correct_file_name(day_to_show, month_to_show, year_to_show);
    console.log(file_name);

    read_json_total('../data/00-图书馆资源总量.json');
    read_json2(file_name);

//set loading animation
    option_total = {
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
    option_daily = option_total;

    // myChart_total.setOption(option_total);
    myChart_daily.setOption(option_daily);

    setTimeout(function(){
        myChart_total.clear();
        // myChart_total = echarts.init(chartDom_total);
        let total_data_str = "";
        for (let i =0; i< json_total.index.length; i++){
            total_data_str += json_total.data[i][0] + ' ' + json_total.data[i][1] + '\n';
        }

        option_total = {
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

        myChart_total.setOption(option_total);

        // console.log(people_number_per_lib);

        setTimeout(function () {
            myChart_daily.clear();
            people_number_per_lib = calculate_people_number();
            option_daily = {
                legend: {},
                tooltip: {
                    trigger: 'axis',
                    showContent: false
                },
                dataset: {
                    // source: [
                    //     ['product', '2012', '2013', '2014', '2015', '2016', '2017', '2018'],
                    //     ['Milk Tea', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1, 90],
                    //     ['Matcha Latte', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7, 70],
                    //     ['Cheese Cocoa', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5, 80],
                    //     ['Walnut Brownie', 25.2, 37.1, 41.2, 18, 33.9, 49.1, 30]
                    // ]
                    source:[
                        ['product', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
                            '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
                        people_number_per_lib[0],
                        people_number_per_lib[1],
                        people_number_per_lib[2],
                        people_number_per_lib[3]
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
            myChart_daily.on('updateAxisPointer', function (event) {
                const xAxisInfo = event.axesInfo[0];
                if (xAxisInfo) {
                    const dimension = xAxisInfo.value + 1;
                    myChart_daily.setOption({
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
            myChart_daily.setOption(option_daily);
        });

        option_daily && myChart_daily.setOption(option_daily);


    }, 1000);


}

function read_json2(file_path) {
    fetch(file_path)
        .then(response => response.json())
        .then(data => {
            json2 = data;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function read_json_total(file_path) {
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





