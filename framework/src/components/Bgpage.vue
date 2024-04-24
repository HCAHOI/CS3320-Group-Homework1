<template>
    <div class="bgpage">
      <Header></Header>
      <!-- 用两个box作为示例，具体使用请自行更改 -->
      <input id="date-input" name="date" type="date" value="2023-12-01" />
      <div style="display: flex">
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
          <div id="right-top-container">
            <div id="total-resource-container">
              <Viewbox title="图书馆资源总览" :boxb="true"></Viewbox>
            </div>
            <div id="daily-number-container">
              <Viewbox title="当日数据" :boxb="true"></Viewbox>
            </div>
          </div>
          <div id="right-bottom-container">
            <div id="new-book-container">
              <Viewbox title="新书榜单" :boxb="true"></Viewbox>
            </div>
          </div>
          <div id="bottom-right-container">
              <div id = 'book-time-chart-container' class="box" >
                <Viewbox title="共享办公预约" :boxb="true"></Viewbox>
              </div>
              <div id = 'occupation-chart-container' class="box">
                  <Viewbox title="空间预约" :boxb="true"></Viewbox>
              </div>
          </div>
          <div id="middle-left-container">
            <div id='book-borrow-trend' class="box">
                <Viewbox
                    title="图书借还趋势"
                    :boxb="true"
                />
            </div>
          </div>
          <div id="middle-right-container">
            <div id='book-search-popularity' class="box">
                <Viewbox
                    title="检索热度"
                    :boxb="true"
                />
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
    height: 118vh;
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
#middle-left-container .box{
  height: 25vh;
}
#middle-right-container .box{
  height: 25vh;
}
#bottom-right-container .box{
  height: 31vh;
}
#left-top-container .box{
  height: 35vh;
}
#date-input {
  position: absolute;
  top: 4vh;
  left: 3vw;
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
#right-top-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 11vh;
  left: 31vw;
  width: 50vw;
}
#right-bottom-container {
  display: flex;
  position: absolute;
  top: 11vh;
  left:81.3vw;
}
#left-top-container {
  position:absolute;
  display: flex;
  flex-direction: column;
  font-size: 1em;
  width: 30vw;
  top: 10.5vh;
  left: 1vw;
  height: 45vh;
}

.in-title {
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

#bottom-right-container {
  display: flex;
  position: absolute;
  top: 85.7vh;
  left: 30.27vw;
  width: 70.4vw;
}
#book-time-chart-container {
  margin-right: -0.5vw;
}
#bottom-right-container #seat-select {
  position: absolute;
  right: 10px;
  top : 5px;
}

#bottom-right-container #selectors {
  position: absolute;
  right: 10px;
  top : 5px;
}


#bottom-right-container #selectors button {
  z-index: 100;
}

#bottom-right-container #book-time-chart {
  top: 10px;
}
#middle-left-container {
  position: absolute;
  top: 60.5vh;
  left: 30.35vw;
  flex-direction: row;
  width:35.8vw;
}
#middle-right-container {
  position: absolute;
  top: 60.5vh;
  left: 64.8vw;
  flex-direction: row;
  width:35.9vw;
}

Viewbox {
    width: 100%;
    height: 100%;
    z-index: 0; /* Viewbox 覆盖于 canvas 之下 */
}
</style>