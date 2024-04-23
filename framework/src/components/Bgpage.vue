<template>
    <div class="bgpage">
      <Header></Header>
      <!-- 用两个box作为示例，具体使用请自行更改 -->
      <input id="date-input" name="date" type="date" value="2023-04-01" />
      <div>
            <div id="left-top-container">
                <div id='reader-statistics' class="box">
                    <Viewbox
                        title="读者画像"
                        :boxb="true"
                    />
                </div>
                <div id='department-distribution' class="box">
                    <Viewbox
                        title="读者学院分布"
                        :boxb="true"
                    />
                </div>
                <div id='borrow-top' class="box">
                    <Viewbox
                        title="借阅排行"
                        :boxb="true"
                    />
                </div>
            </div>
            <div class="container">
                <div id = 'A3Dbox' class="box" >
                  <Viewbox title="预约时间分布" :boxb="true">
                  </Viewbox>
                  
                </div>
                <div id = 'classroomSearch'class="box">

                  
                  <div id="room-search-chart" style="position: relative; height: 300px;">
                    <div style="text-align: center; margin-bottom: 10px; position: absolute; top: 0; left: 300px; z-index: 10;">
                        <label for="location-select" style="color: white;">选择校区:</label>
                        <select id="room-select"></select>
                        <select id="location-select" >
                            <option value="minhang1">闵行-主馆</option>
                            <option value="minhang2">闵行-包玉刚</option>
                        </select>
                        <button id = "dyz-button" >Search</button>
                  </div>
                    <canvas id="room-chart"  style="position: absolute; top: 50px; left: 0; z-index: 11;width:800px; height: calc(300px - 50px);"></canvas>
                    <div id="tooltip" style="position: absolute; top: 50px; left: 0; z-index: 11;width:800px; height: calc(300px - 50px);"></div>
                    <Viewbox title="教室预约时间查询" :boxb="true" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0;"></Viewbox>
                  </div>
            </div>
            
        </div>
    </div>
    </div>
</template>

<script>
import Header from './Header.vue'
import Viewbox from './viewbox/Viewbox.vue'

export default {
  components: {
    Header,
    Viewbox,
  },
  data() {
    return {
      subTitle: "子标题"
    }
  },
}
</script>


<style>
.bgpage{
    background: url(src/assets/true.png);
    height: 120vh;
    width: 100vw;
}
.container {
    display: flex; /* 将容器设置为 flex 容器 */
}
.box {
    flex: 1; /* 每个子元素占据相等的空间 */
    height: 300px;
    margin: 10px;
}

#date-input {
  position: absolute;
  top: 10px;
  left: 30px;
}

input[type="date"] {
  background-color: rgb(39, 81, 151);
  border: 1px solid rgb(39, 81, 151);
  border-radius: 4px;
  padding: 5px;
  color: white;
  font-size: 12px;
  font-family: 'Arial', sans-serif;
  font-style: italic;
  font-weight: bold;
  margin: 5px;
  transition: all 0.3s ease;
  opacity: 0.7;
}

#date-input:hover {
  border-color: #a5a5a5;
  background-color: white;
  box-shadow: 0 0 5px rgba(0,0,0,0.2);
  color: black;
  opacity: 1;
}

#left-top-container {
  display: flex;
  flex-direction: column;
  font-size: 1em;
  width: 30vw;
  top: 0;
}

#left-top-container .in-title {
  position: absolute;
  z-index: 0;
  margin-top: 0;
}

#left-top-container .box {
  flex: 1;
  margin: 4px;
  color: white;
}

#left-top-container #readerBox {
  flex-direction: row;
}

#left-top-container #basic-info {
  position: relative;
  margin-left: 10px;
  top: 6vh;
  left: 0;
  height: 20vh;
  font-weight: bold;
}

#left-top-container #basic-info div {
  padding: 5px;
}

#left-top-container #pie-chart-container {
  position: relative;
  top: 2vh;
}

#left-top-container .box button {
  position: relative;
  left: 14vw;
  background-color: transparent;
  border: none;
  color: white;
  margin-right: 1px;
  opacity: 0.8;
  border-radius: 3px;
}

#left-top-container .box button:hover {
  background-color: rgb(28, 58, 108);
  opacity: 1;
}

#left-top-container #view-time-span {
  margin-right: 5px;
  right: 5px;
  position: absolute;
}

#left-top-container #view-selector {
  margin-top: 2px;
  margin-bottom: 5px;
}

#left-top-container .view-item {
  position: relative;
  left: 20px;
  padding: 1px;
}
#room-search-chart {
    position: relative;
    height: 300px; /* 确保有足够的高度容纳 canvas 和 Viewbox */
}

#room-chart, #tooltip, Viewbox {
    position: absolute;
    top: 0;
    left: 0;
}

#room-chart {
    z-index: 1; /* 确保 canvas 在最底层 */
}


#tooltip {
        position: absolute;
        display: none;
        background-color: rgb(212, 212, 212);
        border: 2px solid rgb(147, 143, 143);
        padding: 8px;
        border-radius: 10px; /* 圆角半径 */
        z-index: 10; /* Tooltip 需要在 canvas 之上显示 */
    }

Viewbox {
    width: 100%;
    height: 100%;
    z-index: 0; /* Viewbox 覆盖于 canvas 之下 */
}
</style>