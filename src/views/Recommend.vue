<template>
  <div class="recommend">
    <h1>菜品推荐 🎲</h1>

    <RecommendForm
      :loading="loading"
      @generate="handleGenerate"
    />

    <div v-if="recommendations.length > 0" class="recommendations">
      <RecommendItem
        v-for="rec in recommendations"
        :key="rec.id"
        :recommendation="rec"
        @edit="handleEdit(rec)"
        @confirm="handleConfirm(rec)"
        @update="handleUpdateMeals(rec, $event)"
      />
    </div>

    <n-empty v-else-if="!loading" description="暂无推荐，请点击上方按钮生成推荐" />
  </div>
</template>

<script setup lang="ts">
import { NEmpty } from 'naive-ui'
import RecommendForm from '@/components/recommendation/RecommendForm.vue'
import RecommendItem from '@/components/recommendation/RecommendItem.vue'
import { useRecommendationStore } from '@/stores'
import { storeToRefs } from 'pinia'

const recommendStore = useRecommendationStore()
const { recommendations, loading } = storeToRefs(recommendStore)

async function handleGenerate(count: number) {
  await recommendStore.generateRecommendations(count)
}

function handleEdit(rec: import('@/types').Recommendation) {
  console.log('编辑推荐', rec)
}

function handleUpdateMeals(rec: import('@/types').Recommendation, meals: import('@/types').MealGroup) {
  recommendStore.updateRecommendationMeals(rec.id, meals)
  window.$message?.success('推荐已更新')
}

async function handleConfirm(rec: import('@/types').Recommendation) {
  await recommendStore.confirmRecommendation(rec.id)
  window.$message?.success('记录已创建')
}
</script>

<style scoped>
.recommend {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.recommendations {
  margin-top: 2rem;
}
</style>
