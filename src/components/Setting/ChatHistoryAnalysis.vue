<template>
    <div ref="mains" style="width: 830px;height: 280px">
    </div>
</template>

<script>
    let data= [["2000-06-05", 116], ["2000-06-06", 129],
        ["2000-06-07", 135], ["2000-06-08", 86], ["2000-06-09", 73],
        ["2000-06-10", 85], ["2000-06-11", 73], ["2000-06-12", 68],
        ["2000-06-13", 92], ["2000-06-14", 130], ["2000-06-15", 245],
        ["2000-06-16", 139], ["2000-06-17", 115], ["2000-06-18", 111],
        ["2000-06-19", 309], ["2000-06-20", 206], ["2000-06-21", 137],
        ["2000-06-22", 128], ["2000-06-23", 85], ["2000-06-24", 94],
        ["2000-06-25", 71]]
    const dateList = data.map(function (item) {
        return item[0];
    });
    const valueList = data.map(function (item) {
        return item[1];
    });
    export default {
        name: "ChatHistoryAnalysis",
        props:{
            chatHistoryData:{
                type:Array,
            }
        },
        data() {
            return {
                chartInstance: null,
            }
        }, mounted() {
            this.initEcharts()
        },
        methods: {
            initEcharts() {
                const dateList = this.chatHistoryData.map(function (item) {
                    return item.chatHistoryDate;
                });
                const valueList = this.chatHistoryData.map(function (item) {
                    return item.chatHistoryValue;
                });
                this.chartInstance = this.$echarts.init(this.$refs.mains);
                const option = {
                    // Make gradient line here
                    visualMap: [
                        {
                            show: true,
                            type: 'continuous',
                            seriesIndex: 0,
                            min: 0,
                            max: 100
                        },
                    ],
                    title: [

                    ],
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: [

                        {
                            data: dateList,
                            gridIndex: 0
                        }
                    ],
                    yAxis: [
                        {
                            gridIndex: 0
                        }
                    ],
                    grid: [
                        {
                            top: '10%'
                        }
                    ],
                    series: [
                        {
                            type: 'line',
                            showSymbol: false,
                            data: valueList
                        },

                    ]
                };
                this.chartInstance.setOption(option)
            }
        }
    }
</script>

<style scoped>

</style>
