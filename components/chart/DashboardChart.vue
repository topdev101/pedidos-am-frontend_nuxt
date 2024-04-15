<template>
    <div class="echarts position-relative" :style="{height: chart_data.keys.length * categoryHeight + 'px'}">
        <IEcharts
            :option="option"
        />
    </div>
</template>
<script>
import IEcharts from 'vue-echarts-v3/src/full.js'
import echarts from "echarts";
export default {
    name: 'DashboardEcharts',
    components: {
        IEcharts
    },
    props: ['chart_data'],
    data() {
        const barWidth = 20;
        return {
            categoryHeight: 80,
            option: {
                legend: {
                    data: [this.$t('page.ordered_quantity'), this.$t('page.received_quantity')],
                    itemHeight: 10,
                    itemGap: 30,
                    textStyle: {
                        padding: [0, 5]
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                yAxis: [
                    {
                        type: 'category',
                        data: this.chart_data.keys,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                xAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: this.$t('page.ordered_quantity'),
                        type: 'bar',
                        barWidth: barWidth,
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#83bff6' },
                            { offset: 0.5, color: '#188df0' },
                            { offset: 1, color: '#188df0' }
                            ])
                        },
                        emphasis: {
                            itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#2378f7' },
                                { offset: 0.7, color: '#2378f7' },
                                { offset: 1, color: '#83bff6' }
                            ])
                            }
                        },
                        data: this.chart_data.values.ordered
                    },
                    {
                        name: this.$t('page.received_quantity'),
                        type: 'bar',
                        barWidth: barWidth,
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#fda085' },
                                { offset: 0.5, color: '#f6d365' },
                                { offset: 1, color: '#f6d365' }
                            ])
                        },
                        emphasis: {
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#f6d365' },
                                    { offset: 0.7, color: '#fda085' },
                                    { offset: 1, color: '#fda085' }
                                ])
                            }
                        },
                        data: this.chart_data.values.received
                    }
                ]
            },
        }
    }
}
</script>
<style lang="scss" scoped>
    .echarts {
        // min-height: 500px;
    }
</style>