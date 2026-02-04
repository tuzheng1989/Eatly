<template>
  <div class="trend-chart">
    <div class="chart-header">
      <h3>饮食摄入趋势</h3>
      <n-select
        v-model:value="localGranularity"
        :options="granularityOptions"
        @update:value="handleGranularityChange"
      />
    </div>
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { NSelect } from 'naive-ui'
import * as echarts from 'echarts'
import type { TrendDataPoint } from '@/types'

const props = defineProps<{
  data: TrendDataPoint[]
  granularity: 'day' | 'week' | 'month'
}>()

const emit = defineEmits<{
  'granularity-change': [value: 'day' | 'week' | 'month']
}>()

const chartRef = ref<HTMLDivElement>()
const localGranularity = ref(props.granularity)
const chartInstance = ref<echarts.ECharts>()

const granularityOptions = [
  { label: '日', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' }
]

onMounted(() => {
  if (chartRef.value) {
    chartInstance.value = echarts.init(chartRef.value)
    updateChart()
  }
})

watch(() => props.data, updateChart, { deep: true })

function updateChart() {
  if (!chartInstance.value) return

  const option: echarts.EChartsOption = {
    title: { text: '饮食摄入趋势' },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        if (!Array.isArray(params) || params.length === 0) return ''

        const date = params[0].axisValue
        let result = `<strong>${date}</strong><br/>`

        params.forEach((item: any) => {
          const value = item.value
          const count = typeof value === 'number' ? value : 0
          result += `${item.marker} ${item.seriesName}: ${count} 个<br/>`
        })

        return result
      }
    },
    legend: { data: ['A组', 'B组', 'C组'] },
    xAxis: {
      type: 'category',
      data: props.data.map(d => d.date)
    },
    yAxis: {
      type: 'value',
      name: '菜品数量'
    },
    series: [
      {
        name: 'A组',
        type: 'line',
        data: props.data.map(d => d.breakdown.A)
      },
      {
        name: 'B组',
        type: 'line',
        data: props.data.map(d => d.breakdown.B)
      },
      {
        name: 'C组',
        type: 'line',
        data: props.data.map(d => d.breakdown.C)
      }
    ]
  }

  chartInstance.value.setOption(option)
}

function handleGranularityChange(value: 'day' | 'week' | 'month') {
  emit('granularity-change', value)
}
</script>

<style scoped>
.trend-chart {
  width: 100%;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.chart-container {
  width: 100%;
  height: 400px;
}
</style>
