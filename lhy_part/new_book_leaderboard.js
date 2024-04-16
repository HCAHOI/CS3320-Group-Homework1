
// function parseJSON(json) {
//     var obj = JSON.parse(json);
//     return obj;
// }
//
// // Path: new_book_leaderboard.js
// //read json file
// function read_file_to_string(file_path){
//     var fs = require('fs');
//     var json = fs.readFileSync(file_path, 'utf8');
//     return json;
// }
//
// let json = read_file_to_string('./04-新书榜单.json');
// let obj = parseJSON(json);
// console.log(obj.index);
let json = null;
let data_list = [];
function read_json(file_path) {

    //load json file, not use fs module
    fetch(file_path)
        .then(response => response.json())
        .then(data => {
            // 在这里处理读取到的JSON数据
            console.log(data);
            json = data;
        })
        .catch(error => {
            // 处理错误情况
            console.error('Error:', error);
        });
}

read_json('../data/04-新书榜单.json');
//sleep for 1 second


var chartDom = document.getElementById('main');
var myChart = echarts.init(chartDom);
var option;


setTimeout(function(){
    for (let i = 0; i < 3; i++) {
        //let string json.data[i][1] and json.data[i][2] merge to one string
        let string = json.data[i][1] + ' ' + json.data[i][2];
        data_list.push(string);
    }
    console.log(data_list);

    option = {
        title: {
            text: '新书榜单'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}%'
        },
        toolbox: {
            feature: {
                dataView: { readOnly: false },
                restore: {},
                saveAsImage: {}
            }
        },
        legend: {
            // data: ['Show', 'Click', 'Visit', 'Inquiry', 'Order']
            data: data_list
        },
        series: [
            {
                name: 'Names',
                type: 'funnel',
                left: '10%',
                top: 60,
                bottom: 60,
                width: '80%',
                min: 0,
                max: 100,
                minSize: '0%',
                maxSize: '100%',
                sort: 'ascending',
                gap: 5,
                label: {
                    show: true,
                    position: 'inside',
                    fontSize: 10
                },
                labelLine: {
                    length: 10,
                    lineStyle: {
                        width: 1,
                        type: 'solid'
                    }
                },
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 1
                },
                emphasis: {
                    label: {
                        fontSize: 20
                    }
                },
                // data: [
                //     { value: 60, name: 'Visit' },
                //     { value: 40, name: 'Inquiry' },
                //     { value: 20, name: 'Order' },
                //     { value: 80, name: 'Click' },
                //     { value: 100, name: 'Show' }
                // ]
                data:[
                    { value: 30, name: data_list[0] },
                    { value: 60, name: data_list[1] },
                    { value: 90, name: data_list[2] }
                ]
            }
        ]
    };

    option && myChart.setOption(option);
}, 500);