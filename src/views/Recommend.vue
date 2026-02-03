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
      />
    </div>

    <n-empty v-else-if="!loading" description="暂无推荐，请生成推荐" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
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

function handleEdit(rec: any) {
  // TODO: 实现编辑功能
  console.log('编辑推荐', rec)
}

async function handleConfirm(rec: any) {
  await recommendStore.confirmRecommendation(rec.id)
  window.$message?.success('记录已创建')
}

onMounted(async () => {
  // 自动生成一次推荐
  await handleGenerate(1)
})
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
