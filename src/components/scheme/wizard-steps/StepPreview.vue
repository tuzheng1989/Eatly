<template>
  <n-space vertical size="large">
    <!-- 基本信息 -->
    <n-card title="基本信息">
      <n-descriptions bordered :column="1">
        <n-descriptions-item label="方案名称">
          {{ wizardData.name }}
        </n-descriptions-item>
        <n-descriptions-item label="方案描述">
          {{ wizardData.description || '(无)' }}
        </n-descriptions-item>
        <n-descriptions-item label="配置模式">
          <n-tag :type="wizardData.configMode === 'template' ? 'info' : 'warning'">
            {{ wizardData.configMode === 'template' ? '从模板开始' : '从零开始' }}
          </n-tag>
        </n-descriptions-item>
      </n-descriptions>
    </n-card>

    <!-- 菜品池预览 -->
    <n-card title="菜品池预览">
      <n-space vertical>
        <div><strong>A组（叶菜类）:</strong> {{ wizardData.pools.A.join('、') || '(无)' }}</div>
        <div><strong>B组（豆制品）:</strong> {{ wizardData.pools.B.join('、') || '(无)' }}</div>
        <div><strong>C组（瓜果类）:</strong> {{ wizardData.pools.C.join('、') || '(无)' }}</div>
      </n-space>
    </n-card>

    <!-- 统计信息 -->
    <n-alert type="success" :show-icon="false">
      <n-statistic-group>
        <n-statistic label="总菜品数" :value="totalDishes" />
      </n-statistic-group>
    </n-alert>

    <!-- 确认提示 -->
    <n-alert type="info">
      请确认以上信息无误后，点击"完成创建"按钮。方案创建后可随时修改菜品池。
    </n-alert>
  </n-space>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'
import { NSpace, NCard, NDescriptions, NDescriptionsItem, NTag, NAlert, NStatisticGroup, NStatistic } from 'naive-ui'

const wizardData = inject<Ref<any>>('wizardData')!

const totalDishes = computed(() => {
  return wizardData.value.pools.A.length + wizardData.value.pools.B.length + wizardData.value.pools.C.length
})

async function validate() {
  return true
}

defineExpose({ validate })
</script>
