<template>
    <div class="bgpage">
        <Header></Header>
        <!-- 用两个box作为示例，具体使用请自行更改 -->
        <div>
            <div class="container">
                <div class="box">
                    <Viewbox
                        :title="subTitle"
                        :boxb="true"
                    />
                </div>
                <div class="box">
                    <Viewbox
                        :title="subTitle"
                        :boxb="true"
                    />
                </div>
                <div class="box">
                    <Viewbox
                        :title="subTitle"
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
    height: 90vh;
    width: 90vw;
}
.container {
    display: flex; /* 将容器设置为 flex 容器 */
}
.box {
    flex: 1; /* 每个子元素占据相等的空间 */
    height: 300px;
    margin: 10px;
}
</style>