<template>
    <div class="bgpage">
        <Header></Header>
        <!-- 用两个box作为示例，具体使用请自行更改 -->
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
                <div class="box">
                    <Viewbox
                        title="测试子标题"
                        :boxb="true"
                    />
                </div>
                <div class="box">
                    <Viewbox
                        title="测试子标题"
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
        Viewbox
    },
    data() {
        return {
            subTitle: "子标题"
        }
    }
}
</script>


<style>
.bgpage{
    background: url(src/assets/true.png);
    height: 100vh;
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

#left-top-container {
  display: flex;
  flex-direction: column;
  font-size: 1.5em;
}

#left-top-container .box {
  flex: 1;
  width: 33vw;
  margin: 10px;
}
</style>