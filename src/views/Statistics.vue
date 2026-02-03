<template>
  <div class="statistics">
    <h1>统计分析 📊</h1>

    <n-spin :show="loading">
      <n-grid :cols="1" :x-gap="16" :y-gap="16">
        <!-- 概览卡片 -->
        <n-gi>
          <n-card title="概览">
            <n-statistic label="总记录天数" :value="statistics.overview.totalDays" />
            <n-statistic label="A组菜品" :value="statistics.overview.mealsByGroup.A" />
            <n-statistic label="B组菜品" :value="statistics.overview.mealsByGroup.B" />
            <n-statistic label="C组菜品" :value="statistics.overview.mealsByGroup.C" />
          </n-card>
        </n-gi>

        <!-- 热门菜品 -->
        <n-gi>
          <n-card title="热门菜品">
            <n-list v-if="statistics.overview.topDishes.length > 0">
              <n-list-item v-for="dish in statistics.overview.topDishes" :key="dish.name">
                {{ dish.name }} ({{ dish.group }}组) - {{ dish.count }}次
              </n-list-item>
            </n-list>
            <n-empty v-else description="暂无数据" />
          </n-card>
        </n-gi>

        <!-- 趋势图表 -->
        <n-gi>
          <TrendChart
            :data="statistics.trends.intakeTrend"
            :granularity="granularity"
            @granularity-change="handleGranularityChange"
          />
        </n-gi>
      </n-grid>
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NCard, NGrid, NGi, NSpin, NStatistic, NList, NListItem, NEmpty } from 'naive-ui'
import TrendChart from '@/components/statistics/TrendChart.vue'
import { statsService } from '@/services'
import type { Statistics } from '@/types'

const loading = ref(false)
const granularity = ref<'day' | 'week' | 'month'>('week')
const statistics = ref<Statistics>({
  overview: {
    totalDays: 0,
    totalRecords: 0,
    mealsByGroup: { A: 0, B: 0, C: 0 },
    topDishes: []
  },
  frequency: {
    byGroup: { A: 0, B: 0, C: 0 },
    byDish: []
  },
  trends: {
    timeGranularity: 'week',
    intakeTrend: [],
    diversityTrend: []
  }
})

async function loadStatistics() {
  loading.value = true
  try {
    statistics.value = await statsService.generateStatistics(granularity.value)
  } finally {
    loading.value = false
  }
}

function handleGranularityChange(value: 'day' | 'week' | 'month') {
  granularity.value = value
  loadStatistics()
}

onMounted(async () => {
  await loadStatistics()
})
</script>

<style scoped>
.statistics {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
