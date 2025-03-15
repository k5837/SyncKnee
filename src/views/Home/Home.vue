<template>
    <el-row>
        <el-col :span="24">
            <div>
                <h3>&nbsp;&nbsp;&nbsp;Pattern Histoty</h3>
                <el-divider></el-divider>
            </div>
        </el-col>

        <el-col :span="24">
            <div id="echart-pie1" :style="{ width: '100%', height: '300px', }"></div>
        </el-col>

        <el-dropdown @command="handleCommand">
            <el-button type="primary" icon="el-icon-edit" round>
                Select<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="userGroup">Hour</el-dropdown-item>
                <el-dropdown-item command="userGroup2">Day</el-dropdown-item>
                <el-dropdown-item command="userGroup3">Week</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <br>
        <br>

        <el-col :span="24">
            <div v-show="show1" id="echart-scatter1" :style="{ width: '100%', height: '300px' }"></div>
        </el-col>

        <el-col :span="24" v-show="show2">
            <div id="echart-scatter2" :style="{ width: '100%', height: '300px' }"></div>
        </el-col>

        <el-col :span="24" v-show="show3">
            <div id="echart-scatter3" :style="{ width: '100%', height: '300px' }"></div>
        </el-col>

        <el-col :span="24" v-show="show4">
            <div id="echart-scatter4" :style="{ width: '100%', height: '300px' }"></div>
        </el-col>


        <el-col :span="24" v-show="show5">
            <div id="echart-scatter5" :style="{ width: '100%', height: '300px' }"></div>
        </el-col>

        <el-col :span="24" v-show="show6">
            <div id="echart-scatter6" :style="{ width: '100%', height: '300px' }"></div>
        </el-col>

        <el-col :span="24" v-show="show7">
            <div id="echart-scatter7" :style="{ width: '100%', height: '300px' }"></div>
        </el-col>


        <el-col :span="24" v-show="show8">
            <div id="echart-scatter8" :style="{ width: '100%', height: '300px' }"></div>
        </el-col>

        <el-col :span="24" v-show="show9">
            <div id="echart-scatter9" :style="{ width: '100%', height: '300px' }"></div>
        </el-col>



    </el-row>
</template>


<script>
import axios from 'axios';

export default {
    data() {
        return {
            username: '',

            myChartd1: null,//扇形图

            show1: true,
            show2: true,
            show3: true,
            show4: false,
            show5: false,
            show6: false,
            show7: false,
            show8: false,
            show9: false,

            ydata: [

            ],

            // xdata: ['1', '2', '3', '4', '5', '6'],
            // adata: [120, 132, 101, 134, 90, 230, 210],
            // bdata: [220, 182, 191, 234, 290, 330, 310],
            // cdata: [150, 232, 201, 154, 190, 330, 410],
        }
    },

    watch: {
        //扇形图
        ydata: {
            handler: function () {
                this.drawPie();
            },
            deep: true,
        },
    },
    mounted: function () {
        this.PiedataGet();
        this.drawPie();

        this.userGroup();


    },


    methods: {
        //绘制扇形图
        drawPie() {
            let myChartd1 = this.$echarts.init(document.getElementById("echart-pie1"));
            let options = {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    type: "scroll",
                    orient: "vertical",
                    left: "70%",
                    align: "left",
                    top: "30%",
                },
                series: [
                    {
                        name: 'Access From',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '40',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: this.ydata,
                    }
                ]
            };
            //随着屏幕大小调节图表
            myChartd1.setOption(options);
        },
        PiedataGet() {
            const Url = 'https://v614backend-1-x1986037.deta.app/api/v1/records/';
            axios.get(Url)
                .then((response) => {

                    let list = response.data
                    let username = window.sessionStorage.getItem('username')
                    let newList = list && list.map(item => { return { userId: item.userId, data: [] } })

                    let hash = {};//数组去重
                    newList = newList && newList.reduce((item, next) => {
                        hash[next.userId] ? '' : hash[next.userId] = true && item.push(next);
                        return item
                    }, [])
                    console.log(hash[username])

                    //给每个对象的data追加数据
                    list && list.forEach((item, index) => {
                        for (let i in newList) {
                            if (item.userId == newList[i].userId) {
                                newList[i].data.push(item.patterns)
                            }
                        }
                    })

                    for (let i in newList) {

                        console.log(typeof newList[i].userId)
                        console.log(typeof username)
                        if (newList[i].userId == username) {
                            // 这里应该循环处理，newList[i].data是一个数组
                            const list = newList[i].data;
                            let finalArr = [];
                            list.forEach((i, v) => {
                                // 把多个数组拆分出来的数字合并到一个数组
                                finalArr = finalArr.concat(JSON.parse(i));//parse(i)解析数组
                            });

                            console.log("最终的结果：", finalArr);

                            let obj = {};
                            finalArr.forEach((i, v) => {
                                obj[`pattern${i}`] = (obj[`pattern${i}`] || 0) + 1;

                            });

                            for (var key in obj) {
                                var obj1 = new Object();
                                obj1.value = obj[key];
                                obj1.name = key;
                                this.ydata.push(obj1);
                            }
                            console.log('扇形图数据', this.ydata);
                        }
                    }

                })
                .catch((error) => {
                    // console.log(error)
                })
        },

        drawScatter() {
            // 获取数据
            const Url = 'https://v614backend-1-x1986037.deta.app/api/v1/records';
            axios.get(Url)
                .then((response) => {
                    let list = response.data
                    console.log('原始数据：', list)

                    list = list.map(item => {
                        const { userId, patterns, tStart, tEnd } = item
                        return {
                            userId, patterns: JSON.parse(patterns), tStart, tEnd,
                        }
                    })
                    console.log("处理后的数据：", list)

                    // 过滤登录用户数据
                    let username = sessionStorage.getItem('username')
                    list = list.filter(item => item.userId === username)
                    console.log("过滤后的数据：", list)

                    const sortList = list.sort((a, b) => {
                        return a.tStart - b.tStart
                    })

                    console.log("排序后数组：", sortList)

                    // let initTime = 0
                    // sortList.forEach((i, v) => {
                    //     const { tStart } = i

                    //     if (tStart > initTime) {
                    //         initTime = tStart
                    //         return
                    //     } else {
                    //         console.log("需要排序！！！！")
                    //     }
                    // })

                    console.log("当前时间戳：", Date.now())
                    console.log("向前一小时：", new Date(Date.now() - 1000 * 60 * 60))

                    // 临时测试数据
                    //let tempStartTime = 1676527284480

                    let now = Date.now()
                    //let now = tempStartTime


                    // 目标时间段
                    const targetStartTime = now - 1000 * 60 * 60
                    const targetEndTime = now

                    // const targetList = sortList.filter(item => item.tStart >= targetStartTime && item.tEnd <= targetEndTime)
                    const targetList = sortList.filter(item => item.tStart >= targetStartTime && item.tStart <= targetEndTime)

                    console.log("按照时间过滤后的：", targetList)

                    // targetList[targetList.length-1]

                    // 把现在按照时间过滤的数组进行区间划分(6段时间)
                    let timeOne = [targetStartTime, targetStartTime + 1000 * 60 * 10]
                    let timeTwo = [targetStartTime + 1000 * 60 * 10, targetStartTime + 1000 * 60 * 20]
                    let timeThree = [targetStartTime + 1000 * 60 * 20, targetStartTime + 1000 * 60 * 30]
                    let timeFour = [targetStartTime + 1000 * 60 * 30, targetStartTime + 1000 * 60 * 40]
                    let timeFive = [targetStartTime + 1000 * 60 * 40, targetStartTime + 1000 * 60 * 50]
                    let timeSix = [targetStartTime + 1000 * 60 * 50, targetStartTime + 1000 * 60 * 60]



                    // console.log('now的时间', hour1.toLocaleTimeString())
                    // console.log('now的时间', hour2.toLocaleTimeString())
                    // console.log('now的时间', hour3.toLocaleTimeString())
                    // console.log('now的时间', hour4.toLocaleTimeString())
                    console.log('now的时间', targetStartTime + 1000 * 60 * 10)
                    console.log('now的时间', targetStartTime + 1000 * 60 * 60)

                    const timeOneList = targetList.filter(item => {
                        const { tStart } = item
                        return tStart >= timeOne[0] && tStart <= timeOne[1]
                    })

                    const timeTwoList = targetList.filter(item => {
                        const { tStart } = item
                        return tStart >= timeTwo[0] && tStart <= timeTwo[1]
                    })

                    const timeThreeList = targetList.filter(item => {
                        const { tStart } = item
                        return tStart >= timeThree[0] && tStart <= timeThree[1]
                    })

                    const timeFourList = targetList.filter(item => {
                        const { tStart } = item
                        return tStart >= timeFour[0] && tStart <= timeFour[1]
                    })

                    const timeFiveList = targetList.filter(item => {
                        const { tStart } = item
                        return tStart >= timeFive[0] && tStart <= timeFive[1]
                    })

                    let timeSixList = targetList.filter(item => {
                        const { tStart } = item
                        return tStart >= timeSix[0] && tStart <= timeSix[1]
                    })

                    console.log("第一段时间过滤的结果：", timeOneList)
                    console.log("第二段时间过滤的结果：", timeTwoList)
                    console.log("第三段时间过滤的结果：", timeThreeList)
                    console.log("第四段时间过滤的结果：", timeFourList)
                    console.log("第五段时间过滤的结果：", timeFiveList)
                    console.log("第六段时间过滤的结果：", timeSixList)

                    // 以第1段为例子统计
                    let arrOne = []
                    timeOneList.map(item => {
                        arrOne = arrOne.concat(item.patterns)
                    })
                    console.log('数据汇总1：', arrOne)

                    let objOne = {};
                    arrOne.forEach((i, v) => {
                        objOne[`pattern${i}`] = (objOne[`pattern${i}`] || 0) + 1;
                    });

                    console.log('统计1：', objOne)


                    // 以第2段为例子统计
                    let arrTwo = []
                    timeTwoList.map(item => {
                        arrTwo = arrTwo.concat(item.patterns)
                    })
                    console.log('数据汇总2：', arrTwo)

                    let objTwo = {};
                    arrTwo.forEach((i, v) => {
                        objTwo[`pattern${i}`] = (objTwo[`pattern${i}`] || 0) + 1;
                    });

                    console.log('统计2：', objTwo)


                    // 以第3段为例子统计
                    let arrThree = []
                    timeThreeList.map(item => {
                        arrThree = arrThree.concat(item.patterns)
                    })
                    console.log('数据汇总3：', arrThree)

                    let objThree = {};
                    arrThree.forEach((i, v) => {
                        objThree[`pattern${i}`] = (objThree[`pattern${i}`] || 0) + 1;
                    });

                    console.log('统计3：', objThree)

                    // 以第4段为例子统计
                    let arrFour = []
                    timeFourList.map(item => {
                        arrFour = arrFour.concat(item.patterns)
                    })
                    console.log('数据汇总4：', arrFour)

                    let objFour = {};
                    arrFour.forEach((i, v) => {
                        objFour[`pattern${i}`] = (objFour[`pattern${i}`] || 0) + 1;
                    });

                    console.log('统计4：', objFour)

                    // 以第5段为例子统计
                    let arrFive = []
                    timeFiveList.map(item => {
                        arrFive = arrFive.concat(item.patterns)
                    })
                    console.log('数据汇总5：', arrFive)

                    let objFive = {};
                    arrFive.forEach((i, v) => {
                        objFive[`pattern${i}`] = (objFive[`pattern${i}`] || 0) + 1;
                    });

                    console.log('统计5：', objFive)

                    // 以第六段为例子统计
                    let arrSix = []
                    timeSixList.map(item => {
                        // todo:判断是否为最后一项
                        arrSix = arrSix.concat(item.patterns)
                    })
                    console.log('数据汇总6：', arrSix)

                    let objSix = {};
                    arrSix.forEach((i, v) => {
                        objSix[`pattern${i}`] = (objSix[`pattern${i}`] || 0) + 1;
                    });

                    console.log('统计6：', objSix)



                    // 绘制图
                    this.$nextTick(() => {
                        let myChartd1 = this.$echarts.init(document.getElementById("echart-scatter1"));
                        let myChartd2 = this.$echarts.init(document.getElementById("echart-scatter2"));
                        let myChartd3 = this.$echarts.init(document.getElementById("echart-scatter3"));

                        let option1 = {
                            tooltip: {
                                trigger: 'item',
                                formatter: (params) => {  // params就是数据，这里可以打印一下看看
                                    // return 出去什么，鼠标移入就显示什么,marker就是提示前面蓝色的圆点
                                    return `${params.marker}Time:${params.data[0]}</br>Number:${params.data[1]}`
                                }
                            },
                            title: { x: 0, text: 'pattern0-Past One Hour' },
                            xAxis: {
                                name: 'Hour',
                                nameTextStyle: {
                                    fontSize: 15,
                                    color: '#666',
                                    verticalAlign: 'bottom',
                                    fontWeight: 'bold'
                                },
                                type: 'time',
                                min: targetStartTime,
                                max: targetEndTime + 1000 * 60 * 1,
                                axisLabel: {
                                     //formatter: '{hh}:{mm}:{ss}'
                                    formatter: function (e) {
                                        return timestampToTime(e);
                                    },
                                }
                            },
                            yAxis: {
                                name: 'Amount',
                                boundaryGap: ['5%', '0%'],
                                nameTextStyle: {
                                    align: 'right',
                                    fontSize: 15,
                                    color: '#666',
                                    fontWeight: 'bold'
                                },

                            },
                            series: [
                                {
                                    type: 'scatter',       //type: scatter表示散点图
                                    data: [
                                        [new Date(targetStartTime + 1000 * 60 * 10), objOne.pattern0 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 20), objTwo.pattern0 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 30), objThree.pattern0 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 40), objFour.pattern0 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 50), objFive.pattern0 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60), objSix.pattern0 || 0],
                                    ]
                                }
                            ]

                        };

                        function timestampToTime(timestamp) {
                            var date = new Date(timestamp );//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                            var Y = date.getFullYear() + '-';
                            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                            var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
                            var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
                            var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
                            var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
                            return  h + m + s;
                        }


                        let option2 = {
                            tooltip: {
                                trigger: 'item',
                                formatter: (params) => {  // params就是数据，这里可以打印一下看看
                                    // return 出去什么，鼠标移入就显示什么,marker就是提示前面蓝色的圆点
                                    return `${params.marker}Time:${params.data[0]}</br>Number:${params.data[1]}`
                                }
                            },
                            title: { x: 0, text: 'pattern1-Past One Hour' },
                            xAxis: {
                                name: 'Hour',
                                nameTextStyle: {
                                    fontSize: 15,
                                    color: '#666',
                                    verticalAlign: 'bottom',
                                    fontWeight: 'bold'
                                },
                                type: 'time',
                                min: targetStartTime,
                                max: targetEndTime + 1000 * 60 * 1,
                                axisLabel: {
                                     //formatter: '{hh}:{mm}:{ss}'
                                    formatter: function (e) {
                                        return timestampToTime(e);
                                    },
                                }
                            },
                            yAxis: {
                                name: 'Amount',
                                boundaryGap: ['5%', '0%'],
                                nameTextStyle: {
                                    align: 'right',
                                    fontSize: 15,
                                    color: '#666',
                                    fontWeight: 'bold'
                                },

                            },
                            series: [
                                {
                                    type: 'scatter',       //type: scatter表示散点图
                                    data: [
                                        [new Date(targetStartTime + 1000 * 60 * 10), objOne.pattern1 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 20), objTwo.pattern1 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 30), objThree.pattern1 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 40), objFour.pattern1 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 50), objFive.pattern1 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60), objSix.pattern1 || 0],
                                    ]
                                }
                            ]
                        };

                        let option3 = {
                            tooltip: {
                                trigger: 'item',
                                formatter: (params) => {  // params就是数据，这里可以打印一下看看
                                    // return 出去什么，鼠标移入就显示什么,marker就是提示前面蓝色的圆点
                                    return `${params.marker}Time:${params.data[0]}</br>Number:${params.data[1]}`
                                }
                            },
                            title: { x: 0, text: 'pattern2-Past One Hour' },
                            xAxis: {
                                name: 'Hour',
                                nameTextStyle: {
                                    fontSize: 15,
                                    color: '#666',
                                    verticalAlign: 'bottom',
                                    fontWeight: 'bold'
                                },
                                type: 'time',
                                min: targetStartTime,
                                max: targetEndTime + 1000 * 60 * 1,
                                axisLabel: {
                                     //formatter: '{hh}:{mm}:{ss}'
                                    formatter: function (e) {
                                        return timestampToTime(e);
                                    },
                                }
                            },
                            yAxis: {
                                name: 'Amount',
                                boundaryGap: ['5%', '0%'],
                                nameTextStyle: {
                                    align: 'right',
                                    fontSize: 15,
                                    color: '#666',
                                    fontWeight: 'bold'
                                },

                            },
                            series: [
                                {
                                    type: 'scatter',       //type: scatter表示散点图
                                    data: [
                                        [new Date(targetStartTime + 1000 * 60 * 10), objOne.pattern2 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 20), objTwo.pattern2 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 30), objThree.pattern2 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 40), objFour.pattern2 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 50), objFive.pattern2 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60), objSix.pattern2 || 0],
                                    ]
                                }
                            ]
                        };

                        //随着屏幕大小调节图表
                        myChartd1.setOption(option1);
                        myChartd2.setOption(option2);
                        myChartd3.setOption(option3);
                        window.onresize = myChartd1.resize;
                        window.onresize = myChartd2.resize;
                        window.onresize = myChartd3.resize;
                    })


                }).catch(err => { })
        },

        drawScatter2() {
            // 获取数据
            const Url = 'https://v614backend-1-x1986037.deta.app/api/v1/records';
            axios.get(Url)
                .then((response) => {
                    let list = response.data
                    console.log('原始数据：', list)

                    list = list.map(item => {
                        const { userId, patterns, tStart, tEnd } = item
                        return {
                            userId, patterns: JSON.parse(patterns), tStart, tEnd,
                        }
                    })
                    console.log("处理后的数据：", list)

                    // 过滤登录用户数据
                    let username = sessionStorage.getItem('username')
                    list = list.filter(item => item.userId === username)
                    console.log("过滤后的数据：", list)

                    const sortList = list.sort((a, b) => {
                        return a.tStart - b.tStart
                    })

                    console.log("排序后数组：", sortList)

                    // let initTime = 0
                    // sortList.forEach((i, v) => {
                    //     const { tStart } = i

                    //     if (tStart > initTime) {
                    //         initTime = tStart
                    //         return
                    //     } else {
                    //         console.log("需要排序！！！！")
                    //     }
                    // })

                    console.log("当前时间戳：", Date.now())
                    console.log("向前一天：", new Date(Date.now() - 1000 * 60 * 60 * 24))

                    // 临时测试数据
                    //let tempStartTime = 1676527284480

                    let now = Date.now()
                    //let now = tempStartTime

                    // 目标时间段
                    const targetStartTime = now - 1000 * 60 * 60 * 24
                    const targetEndTime = now

                    console.log("数字：", new Date(1677129454214))

                    // const targetList = sortList.filter(item => item.tStart >= targetStartTime && item.tEnd <= targetEndTime)
                    const targetList = sortList.filter(item => item.tStart >= targetStartTime && item.tStart <= targetEndTime)

                    console.log("按照时间过滤后的：", targetList)

                    // targetList[targetList.length-1]

                    // 把现在按照时间过滤的数组进行区间划分(12段时间)
                    let timeOne = [targetStartTime, targetStartTime + 1000 * 60 * 60 * 2]
                    let timeTwo = [targetStartTime + 1000 * 60 * 60 * 2, targetStartTime + 1000 * 60 * 60 * 4]
                    let timeThree = [targetStartTime + 1000 * 60 * 60 * 4, targetStartTime + 1000 * 60 * 60 * 6]
                    let timeFour = [targetStartTime + 1000 * 60 * 60 * 6, targetStartTime + 1000 * 60 * 60 * 8]
                    let timeFive = [targetStartTime + 1000 * 60 * 60 * 8, targetStartTime + 1000 * 60 * 60 * 10]
                    let timeSix = [targetStartTime + 1000 * 60 * 60 * 10, targetStartTime + 1000 * 60 * 60 * 12]
                    let timeSeven = [targetStartTime + 1000 * 60 * 60 * 12, targetStartTime + 1000 * 60 * 60 * 14]
                    let timeEight = [targetStartTime + 1000 * 60 * 60 * 14, targetStartTime + 1000 * 60 * 60 * 16]
                    let timeNine = [targetStartTime + 1000 * 60 * 60 * 16, targetStartTime + 1000 * 60 * 60 * 18]
                    let timeTen = [targetStartTime + 1000 * 60 * 60 * 18, targetStartTime + 1000 * 60 * 60 * 20]
                    let timeEleven = [targetStartTime + 1000 * 60 * 60 * 20, targetStartTime + 1000 * 60 * 60 * 22]
                    let timeTwelve = [targetStartTime + 1000 * 60 * 60 * 22, targetStartTime + 1000 * 60 * 60 * 24]

                    const timeOneList = targetList.filter(item => {
                        const { tStart } = item
                        return tStart >= timeOne[0] && tStart <= timeOne[1]
                    })

                    const timeTwoList = targetList.filter(item => {
                        const { tStart } = item
                        return tStart >= timeTwo[0] && tStart <= timeTwo[1]
                    })

                    const timeThreeList = targetList.filter(item => {
                        const { tStart } = item
                        return tStart >= timeThree[0] && tStart <= timeThree[1]
                    })

                    const timeFourList = targetList.filter(item => {
                        const { tStart } = item
                        return tStart >= timeFour[0] && tStart <= timeFour[1]
                    })

                    const timeFiveList = targetList.filter(item => {
                        const { tStart } = item
                        return tStart >= timeFive[0] && tStart <= timeFive[1]
                    })

                    let timeSixList = targetList.filter(item => {
                        const { tStart } = item
                        return tStart >= timeSix[0] && tStart <= timeSix[1]
                    })

                    let timeSevenList = targetList.filter(item => {
                        const { tStart } = item
                        return tStart >= timeSeven[0] && tStart <= timeSeven[1]
                    })

                    let timeEightList = targetList.filter(item => {
                        const { tStart } = item
                        return tStart >= timeEight[0] && tStart <= timeEight[1]
                    })

                    let timeNineList = targetList.filter(item => {
                        const { tStart } = item
                        return tStart >= timeNine[0] && tStart <= timeNine[1]
                    })

                    let timeTenList = targetList.filter(item => {
                        const { tStart } = item
                        return tStart >= timeTen[0] && tStart <= timeTen[1]
                    })

                    let timeElevenList = targetList.filter(item => {
                        const { tStart } = item
                        return tStart >= timeEleven[0] && tStart <= timeEleven[1]
                    })

                    let timeTwelveList = targetList.filter(item => {
                        const { tStart } = item
                        return tStart >= timeTwelve[0] && tStart <= timeTwelve[1]
                    })

                    console.log("第一段时间过滤的结果：", timeOneList)
                    console.log("第二段时间过滤的结果：", timeTwoList)
                    console.log("第三段时间过滤的结果：", timeThreeList)
                    console.log("第四段时间过滤的结果：", timeFourList)
                    console.log("第五段时间过滤的结果：", timeFiveList)
                    console.log("第六段时间过滤的结果：", timeSixList)
                    console.log("第七段时间过滤的结果：", timeSevenList)
                    console.log("第八段时间过滤的结果：", timeEightList)
                    console.log("第九段时间过滤的结果：", timeNineList)
                    console.log("第十段时间过滤的结果：", timeTenList)
                    console.log("第十一段时间过滤的结果：", timeElevenList)
                    console.log("第十二段时间过滤的结果：", timeTwelveList)

                    // 以第1段为例子统计
                    let arrOne = []
                    timeOneList.map(item => {
                        arrOne = arrOne.concat(item.patterns)
                    })
                    console.log('数据汇总1：', arrOne)

                    let objOne = {};
                    arrOne.forEach((i, v) => {
                        objOne[`pattern${i}`] = (objOne[`pattern${i}`] || 0) + 1;
                    });

                    console.log('统计1：', objOne)


                    // 以第2段为例子统计
                    let arrTwo = []
                    timeTwoList.map(item => {
                        arrTwo = arrTwo.concat(item.patterns)
                    })
                    console.log('数据汇总2：', arrTwo)

                    let objTwo = {};
                    arrTwo.forEach((i, v) => {
                        objTwo[`pattern${i}`] = (objTwo[`pattern${i}`] || 0) + 1;
                    });

                    console.log('统计2：', objTwo)


                    // 以第3段为例子统计
                    let arrThree = []
                    timeThreeList.map(item => {
                        arrThree = arrThree.concat(item.patterns)
                    })
                    console.log('数据汇总3：', arrThree)

                    let objThree = {};
                    arrThree.forEach((i, v) => {
                        objThree[`pattern${i}`] = (objThree[`pattern${i}`] || 0) + 1;
                    });

                    console.log('统计3：', objThree)

                    // 以第4段为例子统计
                    let arrFour = []
                    timeFourList.map(item => {
                        arrFour = arrFour.concat(item.patterns)
                    })
                    console.log('数据汇总4：', arrFour)

                    let objFour = {};
                    arrFour.forEach((i, v) => {
                        objFour[`pattern${i}`] = (objFour[`pattern${i}`] || 0) + 1;
                    });

                    console.log('统计4：', objFour)

                    // 以第5段为例子统计
                    let arrFive = []
                    timeFiveList.map(item => {
                        arrFive = arrFive.concat(item.patterns)
                    })
                    console.log('数据汇总5：', arrFive)

                    let objFive = {};
                    arrFive.forEach((i, v) => {
                        objFive[`pattern${i}`] = (objFive[`pattern${i }`] || 0) + 1;
                    });

                    console.log('统计5：', objFive)

                    // 以第六段为例子统计
                    let arrSix = []
                    timeSixList.map(item => {
                        // todo:判断是否为最后一项
                        arrSix = arrSix.concat(item.patterns)
                    })
                    console.log('数据汇总6：', arrSix)

                    let objSix = {};
                    arrSix.forEach((i, v) => {
                        objSix[`pattern${i}`] = (objSix[`pattern${i}`] || 0) + 1;
                    });

                    console.log('统计6：', objSix)

                    // 以第七段为例子统计
                    let arrSeven = []
                    timeSevenList.map(item => {
                        // todo:判断是否为最后一项
                        arrSeven = arrSeven.concat(item.patterns)
                    })
                    console.log('数据汇总7：', arrSeven)

                    let objSeven = {};
                    arrSeven.forEach((i, v) => {
                        objSeven[`pattern${i}`] = (objSeven[`pattern${i}`] || 0) + 1;
                    });

                    console.log('统计7：', objSeven)


                    // 以第八段为例子统计
                    let arrEight = []
                    timeEightList.map(item => {
                        // todo:判断是否为最后一项
                        arrEight = arrEight.concat(item.patterns)
                    })
                    console.log('数据汇总8：', arrEight)

                    let objEight = {};
                    arrEight.forEach((i, v) => {
                        objEight[`pattern${i}`] = (objEight[`pattern${i}`] || 0) + 1;
                    });

                    console.log('统计8：', objEight)

                    // 以第九段为例子统计
                    let arrNine = []
                    timeNineList.map(item => {
                        // todo:判断是否为最后一项
                        arrNine = arrNine.concat(item.patterns)
                    })
                    console.log('数据汇总9：', arrNine)

                    let objNine = {};
                    arrNine.forEach((i, v) => {
                        objNine[`pattern${i}`] = (objNine[`pattern${i}`] || 0) + 1;
                    });

                    console.log('统计9：', objNine)

                    // 以第10段为例子统计
                    let arrTen = []
                    timeTenList.map(item => {
                        // todo:判断是否为最后一项
                        arrTen = arrTen.concat(item.patterns)
                    })
                    console.log('数据汇总10：', arrTen)

                    let objTen = {};
                    arrTen.forEach((i, v) => {
                        objTen[`pattern${i}`] = (objTen[`pattern${i}`] || 0) + 1;
                    });

                    console.log('统计10：', objTen)

                    // 以第11段为例子统计
                    let arrEleven = []
                    timeElevenList.map(item => {
                        // todo:判断是否为最后一项
                        arrEleven = arrEleven.concat(item.patterns)
                    })
                    console.log('数据汇总11：', arrEleven)

                    let objEleven = {};
                    arrEleven.forEach((i, v) => {
                        objEleven[`pattern${i}`] = (objEleven[`pattern${i}`] || 0) + 1;
                    });

                    console.log('统计11：', objEleven)

                    // 以第12段为例子统计
                    let arrTwelve = []
                    timeTwelveList.map(item => {
                        // todo:判断是否为最后一项
                        arrTwelve = arrTwelve.concat(item.patterns)
                    })
                    console.log('数据汇总12：', arrTwelve)

                    let objTwelve = {};
                    arrTwelve.forEach((i, v) => {
                        objTwelve[`pattern${i}`] = (objTwelve[`pattern${i}`] || 0) + 1;
                    });

                    console.log('统计12：', objTwelve)



                    // 绘制图
                    this.$nextTick(() => {
                        let myChartd1 = this.$echarts.init(document.getElementById("echart-scatter4"));
                        let myChartd2 = this.$echarts.init(document.getElementById("echart-scatter5"));
                        let myChartd3 = this.$echarts.init(document.getElementById("echart-scatter6"));

                        let option1 = {
                            tooltip: {
                                trigger: 'item',
                                formatter: (params) => {  // params就是数据，这里可以打印一下看看
                                    // return 出去什么，鼠标移入就显示什么,marker就是提示前面蓝色的圆点
                                    return `${params.marker}Time:${params.data[0]}</br>Number:${params.data[1]}`
                                }
                            },
                            title: { x: 0, text: 'pattern0-Past One Day' },
                            xAxis: {
                                name: 'Day',
                                nameTextStyle: {
                                    fontSize: 15,
                                    color: '#666',
                                    verticalAlign: 'bottom',
                                    fontWeight: 'bold'
                                },
                                type: 'time',
                                min: targetStartTime,
                                max: targetEndTime + 1000 * 60 * 60,
                                axisLabel: {
                                     //formatter: '{hh}:{mm}:{ss}'
                                    formatter: function (e) {
                                        return timestampToTime(e);
                                    },
                                }
                            },
                            yAxis: {
                                name: 'Amount',
                                boundaryGap: ['5%', '0%'],
                                nameTextStyle: {
                                    align: 'right',
                                    fontSize: 15,
                                    color: '#666',
                                    fontWeight: 'bold'
                                },

                            },
                            series: [
                                {
                                    type: 'scatter',       //type: scatter表示散点图
                                    data: [
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 2), objOne.pattern0 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 4), objTwo.pattern0 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 6), objThree.pattern0 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 8), objFour.pattern0 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 10), objFive.pattern0 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 12), objSix.pattern0 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 14), objSeven.pattern0 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 16), objEight.pattern0 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 18), objNine.pattern0 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 20), objTen.pattern0 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 22), objEleven.pattern0 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 24), objTwelve.pattern0 || 0],
                                    ]
                                }
                            ]
                        };

                        function timestampToTime(timestamp) {
                            var date = new Date(timestamp );//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                            var Y = date.getFullYear() + '-';
                            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                            var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
                            var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
                            var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) ;
                            var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
                            return M + D + h + m ;
                        }

                        let option2 = {
                            tooltip: {
                                trigger: 'item',
                                formatter: (params) => {  // params就是数据，这里可以打印一下看看
                                    // return 出去什么，鼠标移入就显示什么,marker就是提示前面蓝色的圆点
                                    return `${params.marker}Time:${params.data[0]}</br>Number:${params.data[1]}`
                                }
                            },
                            title: { x: 0, text: 'pattern1-Past One Day' },
                            xAxis: {
                                name: 'Day',
                                nameTextStyle: {
                                    fontSize: 15,
                                    color: '#666',
                                    verticalAlign: 'bottom',
                                    fontWeight: 'bold'
                                },
                                type: 'time',
                                min: targetStartTime,
                                max: targetEndTime + 1000 * 60 * 60,
                                axisLabel: {
                                     //formatter: '{hh}:{mm}:{ss}'
                                    formatter: function (e) {
                                        return timestampToTime(e);
                                    },
                                }
                            },
                            yAxis: {
                                name: 'Amount',


                            },
                            series: [
                                {
                                    type: 'scatter',       //type: scatter表示散点图
                                    data: [
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 2), objOne.pattern1 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 4), objTwo.pattern1 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 6), objThree.pattern1 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 8), objFour.pattern1 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 10), objFive.pattern1 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 12), objSix.pattern1 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 14), objSeven.pattern1 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 16), objEight.pattern1 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 18), objNine.pattern1 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 20), objTen.pattern1 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 22), objEleven.pattern1 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 24), objTwelve.pattern1 || 0],
                                    ]
                                }
                            ]
                        };

                        let option3 = {
                            tooltip: {
                                trigger: 'item',
                                formatter: (params) => {  // params就是数据，这里可以打印一下看看
                                    // return 出去什么，鼠标移入就显示什么,marker就是提示前面蓝色的圆点
                                    return `${params.marker}Time:${params.data[0]}</br>Number:${params.data[1]}`
                                }
                            },
                            title: { x: 0, text: 'pattern2-Past One Day' },
                            xAxis: {
                                name: 'Day',
                                nameTextStyle: {
                                    fontSize: 15,
                                    color: '#666',
                                    verticalAlign: 'bottom',
                                    fontWeight: 'bold'
                                },
                                type: 'time',
                                min: targetStartTime,
                                max: targetEndTime + 1000 * 60 * 60,
                                axisLabel: {
                                     //formatter: '{hh}:{mm}:{ss}'
                                    formatter: function (e) {
                                        return timestampToTime(e);
                                    },
                                }
                            },
                            yAxis: {
                                name: 'Amount',
                                boundaryGap: ['5%', '0%'],
                                nameTextStyle: {
                                    align: 'right',
                                    fontSize: 15,
                                    color: '#666',
                                    fontWeight: 'bold'
                                },

                            },
                            series: [
                                {
                                    type: 'scatter',       //type: scatter表示散点图
                                    data: [
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 2), objOne.pattern2 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 4), objTwo.pattern2 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 6), objThree.pattern2 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 8), objFour.pattern2 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 10), objFive.pattern2 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 12), objSix.pattern2 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 14), objSeven.pattern2 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 16), objEight.pattern2 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 18), objNine.pattern2 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 20), objTen.pattern2 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 22), objEleven.pattern2 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 24), objTwelve.pattern2 || 0],
                                    ]
                                }
                            ]
                        };

                        //随着屏幕大小调节图表
                        myChartd1.setOption(option1);
                        myChartd2.setOption(option2);
                        myChartd3.setOption(option3);
                        window.onresize = myChartd1.resize;
                        window.onresize = myChartd2.resize;
                        window.onresize = myChartd3.resize;
                    })


                }).catch(err => { })
        },

        drawScatter3() {
            // 获取数据
            const Url = 'https://v614backend-1-x1986037.deta.app/api/v1/records';
            axios.get(Url)
                .then((response) => {
                    let list = response.data
                    console.log('原始数据：', list)

                    list = list.map(item => {
                        const { userId, patterns, tStart, tEnd } = item
                        return {
                            userId, patterns: JSON.parse(patterns), tStart, tEnd,
                        }
                    })
                    console.log("处理后的数据：", list)

                    // 过滤登录用户数据
                    let username = sessionStorage.getItem('username')
                    list = list.filter(item => item.userId === username)
                    console.log("过滤后的数据：", list)

                    const sortList = list.sort((a, b) => {
                        return a.tStart - b.tStart
                    })

                    console.log("排序后数组：", sortList)

                    // let initTime = 0
                    // sortList.forEach((i, v) => {
                    //     const { tStart } = i

                    //     if (tStart > initTime) {
                    //         initTime = tStart
                    //         return
                    //     } else {
                    //         console.log("需要排序！！！！")
                    //     }
                    // })

                    console.log("当前时间戳：", Date.now())
                    console.log("向前一周：", new Date(Date.now() - 1000 * 60 * 60 * 24 * 7))

                    // 临时测试数据
                    //let tempStartTime = 1676527284480

                    let now = Date.now()
                    //let now = tempStartTime

                    // 目标时间段
                    const targetStartTime = now - 1000 * 60 * 60 * 24 * 7
                    const targetEndTime = now

                    // const targetList = sortList.filter(item => item.tStart >= targetStartTime && item.tEnd <= targetEndTime)
                    const targetList = sortList.filter(item => item.tStart >= targetStartTime && item.tStart <= targetEndTime)

                    console.log("按照时间过滤后的：", targetList)

                    // targetList[targetList.length-1]

                    // 把现在按照时间过滤的数组进行区间划分(7段时间)
                    let timeOne = [targetStartTime, targetStartTime + 1000 * 60 * 60 * 24]
                    let timeTwo = [targetStartTime + 1000 * 60 * 60 * 24, targetStartTime + 1000 * 60 * 60 * 48]
                    let timeThree = [targetStartTime + 1000 * 60 * 60 * 48, targetStartTime + 1000 * 60 * 60 * 72]
                    let timeFour = [targetStartTime + 1000 * 60 * 60 * 72, targetStartTime + 1000 * 60 * 60 * 96]
                    let timeFive = [targetStartTime + 1000 * 60 * 60 * 96, targetStartTime + 1000 * 60 * 60 * 120]
                    let timeSix = [targetStartTime + 1000 * 60 * 60 * 120, targetStartTime + 1000 * 60 * 60 * 144]
                    let timeSeven = [targetStartTime + 1000 * 60 * 60 * 144, targetStartTime + 1000 * 60 * 60 * 168]


                    const timeOneList = targetList.filter(item => {
                        const { tStart } = item
                        return tStart >= timeOne[0] && tStart <= timeOne[1]
                    })

                    const timeTwoList = targetList.filter(item => {
                        const { tStart } = item
                        return tStart >= timeTwo[0] && tStart <= timeTwo[1]
                    })

                    const timeThreeList = targetList.filter(item => {
                        const { tStart } = item
                        return tStart >= timeThree[0] && tStart <= timeThree[1]
                    })

                    const timeFourList = targetList.filter(item => {
                        const { tStart } = item
                        return tStart >= timeFour[0] && tStart <= timeFour[1]
                    })

                    const timeFiveList = targetList.filter(item => {
                        const { tStart } = item
                        return tStart >= timeFive[0] && tStart <= timeFive[1]
                    })

                    let timeSixList = targetList.filter(item => {
                        const { tStart } = item
                        return tStart >= timeSix[0] && tStart <= timeSix[1]
                    })

                    let timeSevenList = targetList.filter(item => {
                        const { tStart } = item
                        return tStart >= timeSeven[0] && tStart <= timeSeven[1]
                    })


                    console.log("第一段时间过滤的结果：", timeOneList)
                    console.log("第二段时间过滤的结果：", timeTwoList)
                    console.log("第三段时间过滤的结果：", timeThreeList)
                    console.log("第四段时间过滤的结果：", timeFourList)
                    console.log("第五段时间过滤的结果：", timeFiveList)
                    console.log("第六段时间过滤的结果：", timeSixList)
                    console.log("第七段时间过滤的结果：", timeSevenList)


                    // 以第1段为例子统计
                    let arrOne = []
                    timeOneList.map(item => {
                        arrOne = arrOne.concat(item.patterns)
                    })
                    console.log('数据汇总1：', arrOne)

                    let objOne = {};
                    arrOne.forEach((i, v) => {
                        objOne[`pattern${i}`] = (objOne[`pattern${i}`] || 0) + 1;
                    });

                    console.log('统计1：', objOne)


                    // 以第2段为例子统计
                    let arrTwo = []
                    timeTwoList.map(item => {
                        arrTwo = arrTwo.concat(item.patterns)
                    })
                    console.log('数据汇总2：', arrTwo)

                    let objTwo = {};
                    arrTwo.forEach((i, v) => {
                        objTwo[`pattern${i}`] = (objTwo[`pattern${i}`] || 0) + 1;
                    });

                    console.log('统计2：', objTwo)


                    // 以第3段为例子统计
                    let arrThree = []
                    timeThreeList.map(item => {
                        arrThree = arrThree.concat(item.patterns)
                    })
                    console.log('数据汇总3：', arrThree)

                    let objThree = {};
                    arrThree.forEach((i, v) => {
                        objThree[`pattern${i}`] = (objThree[`pattern${i}`] || 0) + 1;
                    });

                    console.log('统计3：', objThree)

                    // 以第4段为例子统计
                    let arrFour = []
                    timeFourList.map(item => {
                        arrFour = arrFour.concat(item.patterns)
                    })
                    console.log('数据汇总4：', arrFour)

                    let objFour = {};
                    arrFour.forEach((i, v) => {
                        objFour[`pattern${i}`] = (objFour[`pattern${i}`] || 0) + 1;
                    });

                    console.log('统计4：', objFour)

                    // 以第5段为例子统计
                    let arrFive = []
                    timeFiveList.map(item => {
                        arrFive = arrFive.concat(item.patterns)
                    })
                    console.log('数据汇总5：', arrFive)

                    let objFive = {};
                    arrFive.forEach((i, v) => {
                        objFive[`pattern${i}`] = (objFive[`pattern${i}`] || 0) + 1;
                    });

                    console.log('统计5：', objFive)

                    // 以第六段为例子统计
                    let arrSix = []
                    timeSixList.map(item => {
                        // todo:判断是否为最后一项
                        arrSix = arrSix.concat(item.patterns)
                    })
                    console.log('数据汇总6：', arrSix)

                    let objSix = {};
                    arrSix.forEach((i, v) => {
                        objSix[`pattern${i}`] = (objSix[`pattern${i}`] || 0) + 1;
                    });

                    console.log('统计6：', objSix)

                    // 以第七段为例子统计
                    let arrSeven = []
                    timeSevenList.map(item => {
                        // todo:判断是否为最后一项
                        arrSeven = arrSeven.concat(item.patterns)
                    })
                    console.log('数据汇总7：', arrSeven)

                    let objSeven = {};
                    arrSeven.forEach((i, v) => {
                        objSeven[`pattern${i}`] = (objSeven[`pattern${i}`] || 0) + 1;
                    });

                    console.log('统计7：', objSeven)





                    // 绘制图
                    this.$nextTick(() => {
                        let myChartd1 = this.$echarts.init(document.getElementById("echart-scatter7"));
                        let myChartd2 = this.$echarts.init(document.getElementById("echart-scatter8"));
                        let myChartd3 = this.$echarts.init(document.getElementById("echart-scatter9"));

                        let option1 = {
                            tooltip: {
                                trigger: 'item',
                                formatter: (params) => {  // params就是数据，这里可以打印一下看看
                                    // return 出去什么，鼠标移入就显示什么,marker就是提示前面蓝色的圆点
                                    return `${params.marker}Time:${params.data[0]}</br>Number:${params.data[1]}`
                                }
                            },
                            title: { x: 0, text: 'pattern0-Past One Week' },
                            xAxis: {
                                name: 'Week',
                                nameTextStyle: {
                                    fontSize: 15,
                                    color: '#666',
                                    verticalAlign: 'bottom',
                                    fontWeight: 'bold'
                                },
                                type: 'time',
                                min: targetStartTime,
                                max: targetEndTime + 1000 * 60 * 60 * 12,
                                axisLabel: {
                                     //formatter: '{hh}:{mm}:{ss}'
                                    formatter: function (e) {
                                        return timestampToTime(e);
                                    },
                                }
                            },
                            yAxis: {
                                name: 'Amount',
                                boundaryGap: ['5%', '0%'],
                                nameTextStyle: {
                                    align: 'right',
                                    fontSize: 15,
                                    color: '#666',
                                    fontWeight: 'bold'
                                },

                            },
                            series: [
                                {
                                    type: 'scatter',       //type: scatter表示散点图
                                    data: [
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 24), objOne.pattern0 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 48), objTwo.pattern0 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 72), objThree.pattern0 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 96), objFour.pattern0 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 120), objFive.pattern0 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 144), objSix.pattern0 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 168), objSeven.pattern0 || 0],
                                    ]
                                }
                            ]
                        };

                        function timestampToTime(timestamp) {
                            var date = new Date(timestamp );//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                            var Y = date.getFullYear() + '-';
                            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                            var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
                            var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
                            var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) ;
                            var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
                            return M + D + h + m ;
                        }

                        let option2 = {
                            tooltip: {
                                trigger: 'item',
                                formatter: (params) => {  // params就是数据，这里可以打印一下看看
                                    // return 出去什么，鼠标移入就显示什么,marker就是提示前面蓝色的圆点
                                    return `${params.marker}Time:${params.data[0]}</br>Number:${params.data[1]}`
                                }
                            },
                            title: { x: 0, text: 'pattern1-Past One Week' },
                            xAxis: {
                                name: 'Week',
                                nameTextStyle: {
                                    fontSize: 15,
                                    color: '#666',
                                    verticalAlign: 'bottom',
                                    fontWeight: 'bold'
                                },
                                type: 'time',
                                min: targetStartTime,
                                max: targetEndTime + 1000 * 60 * 60 * 12,
                                axisLabel: {
                                     //formatter: '{hh}:{mm}:{ss}'
                                    formatter: function (e) {
                                        return timestampToTime(e);
                                    },
                                }
                            },
                            yAxis: {
                                name: 'Amount',
                                boundaryGap: ['5%', '0%'],
                                nameTextStyle: {
                                    align: 'right',
                                    fontSize: 15,
                                    color: '#666',
                                    fontWeight: 'bold'
                                },

                            },
                            series: [
                                {
                                    type: 'scatter',       //type: scatter表示散点图
                                    data: [
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 24), objOne.pattern1 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 48), objTwo.pattern1|| 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 72), objThree.pattern1 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 96), objFour.pattern1 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 120), objFive.pattern1 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 144), objSix.pattern1 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 168), objSeven.pattern1 || 0],
                                    ]
                                }
                            ]
                        };

                        let option3 = {
                            tooltip: {
                                trigger: 'item',
                                formatter: (params) => {  // params就是数据，这里可以打印一下看看
                                    // return 出去什么，鼠标移入就显示什么,marker就是提示前面蓝色的圆点
                                    return `${params.marker}Time:${params.data[0]}</br>Number:${params.data[1]}`
                                }
                            },
                            title: { x: 0, text: 'pattern3-Past One Week' },
                            xAxis: {
                                name: 'Week',
                                nameTextStyle: {
                                    fontSize: 15,
                                    color: '#666',
                                    verticalAlign: 'bottom',
                                    fontWeight: 'bold'
                                },
                                type: 'time',
                                min: targetStartTime,
                                max: targetEndTime + 1000 * 60 * 60 * 12,
                                axisLabel: {
                                     //formatter: '{hh}:{mm}:{ss}'
                                    formatter: function (e) {
                                        return timestampToTime(e);
                                    },
                                }
                            },
                            yAxis: {
                                name: 'Amount',
                                boundaryGap: ['5%', '0%'],
                                nameTextStyle: {
                                    align: 'right',
                                    fontSize: 15,
                                    color: '#666',
                                    fontWeight: 'bold'
                                },

                            },
                            series: [
                                {
                                    type: 'scatter',       //type: scatter表示散点图
                                    data: [
                                    [new Date(targetStartTime + 1000 * 60 * 60 * 24), objOne.pattern2 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 48), objTwo.pattern2 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 72), objThree.pattern2 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 96), objFour.pattern2 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 120), objFive.pattern2 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 144), objSix.pattern2 || 0],
                                        [new Date(targetStartTime + 1000 * 60 * 60 * 168), objSeven.pattern2 || 0],
                                    ]
                                }
                            ]
                        };

                        //随着屏幕大小调节图表
                        myChartd1.setOption(option1);
                        myChartd2.setOption(option2);
                        myChartd3.setOption(option3);
                        window.onresize = myChartd1.resize;
                        window.onresize = myChartd2.resize;
                        window.onresize = myChartd3.resize;
                    })


                }).catch(err => { })
        },



        handleCommand(cmditem) {
            if (!cmditem) {
                this.$message("菜单选项缺少command属性");
                return;
            }
            switch (cmditem) {
                case "userGroup":
                    this.userGroup();
                    break;
                case "userGroup2":
                    this.userGroup2();
                    break;
                case "userGroup3":
                    this.userGroup3();
                    break;
            }
        },

        userGroup() {
            this.show1 = true;
            this.show2 = true;
            this.show3 = true;
            this.show4 = false;
            this.show5 = false;
            this.show6 = false;
            this.show7 = false;
            this.show8 = false;
            this.show9 = false;
            this.drawScatter();
        },
        userGroup2() {
            this.show1 = false;
            this.show2 = false;
            this.show3 = false;
            this.show4 = true;
            this.show5 = true;
            this.show6 = true;
            this.show7 = false;
            this.show8 = false;
            this.show9 = false;
            this.drawScatter2();
        },
        userGroup3() {
            this.show1 = false;
            this.show2 = false;
            this.show3 = false;
            this.show4 = false;
            this.show5 = false;
            this.show6 = false;
            this.show7 = true;
            this.show8 = true;
            this.show9 = true;
            this.drawScatter3();
        },

    },

}


</script>
    
<style>
.el-dropdown {
    vertical-align: top;
}

.el-dropdown+.el-dropdown {
    margin-left: 15px;
}

.el-icon-arrow-down {
    font-size: 12px;
}
</style>