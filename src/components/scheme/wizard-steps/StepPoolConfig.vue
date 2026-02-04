<template>
  <n-space vertical size="large">
    <n-tabs type="line" animated>
      <!-- A组配置 -->
      <n-tab-pane name="A" tab="A组（叶菜类）">
        <n-dynamic-input
          v-model:value="localPools.A"
          placeholder="请输入菜品名称"
          @update:value="handleUpdate('A', $event)"
        >
          <template #create-button-default>
            <n-button type="primary" dashed>添加菜品</n-button>
          </template>
        </n-dynamic-input>
        <n-alert type="info" style="margin-top: 1rem">
          常见叶菜类：大白菜、油菜、菠菜、娃娃菜等
        </n-alert>
      </n-tab-pane>

      <!-- B组配置 -->
      <n-tab-pane name="B" tab="B组（豆制品）">
        <n-dynamic-input
          v-model:value="localPools.B"
          placeholder="请输入菜品名称"
          @update:value="handleUpdate('B', $event)"
        >
          <template #create-button-default>
            <n-button type="primary" dashed>添加菜品</n-button>
          </template>
        </n-dynamic-input>
        <n-alert type="info" style="margin-top: 1rem">
          常见豆制品：豆腐、香干、腐竹、豆皮等
        </n-alert>
      </n-tab-pane>

      <!-- C组配置 -->
      <n-tab-pane name="C" tab="C组（瓜果类）">
        <n-dynamic-input
          v-model:value="localPools.C"
          placeholder="请输入菜品名称"
          @update:value="handleUpdate('C', $event)"
        >
          <template #create-button-default>
            <n-button type="primary" dashed>添加菜品</n-button>
          </template>
        </n-dynamic-input>
        <n-alert type="info" style="margin-top: 1rem">
          常见瓜果类：番茄、黄瓜、茄子、土豆等
        </n-alert>
      </n-tab-pane>
    </n-tabs>

    <!-- 统计信息 -->
    <n-card title="菜品统计" size="small">
      <n-space>
        <n-statistic label="A组数量" :value="localPools.A.length" />
        <n-statistic label="B组数量" :value="localPools.B.length" />
        <n-statistic label="C组数量" :value="localPools.C.length" />
        <n-statistic label="总计" :value="totalCount" />
      </n-space>
    </n-card>
  </n-space>
</template>

<script setup lang="ts">
import { ref, inject, watch, computed } from 'vue'
import {
  NTabs,
  NTabPane,
  NDynamicInput,
  NButton,
  NSpace,
  NAlert,
  NCard,
  NStatisticGroup,
  NStatistic
} from 'naive-ui'

const wizardData = inject<Ref<{ pools: Record<string, string[]> }>>('wizardData')!
const wizardUpdate = inject<(data: Partial<{ pools: Record<string, string[]> }>) => void>('wizardUpdate')!

const localPools = ref<Record<string, string[]>>({ A: [], B: [], C: [] })

watch(
  () => wizardData.value.pools,
  (pools) => {
    localPools.value = JSON.parse(JSON.stringify(pools))
  },
  { immediate: true, deep: true }
)

const totalCount = computed(() => {
  return localPools.value.A.length + localPools.value.B.length + localPools.value.C.length
})

function handleUpdate(type: 'A' | 'B' | 'C', items: string[]) {
  const updatedPools = { ...localPools.value, [type]: items }
  wizardUpdate({ pools: updatedPools })
}

async function validate() {
  if (localPools.value.A.length === 0 || localPools.value.B.length === 0 || localPools.value.C.length === 0) {
    window.$message?.error('每组至少需要包含1个菜品')
    return false
  }
  return true
}

defineExpose({ validate })
</script>
