<template>
  <n-space vertical size="large">
    <n-radio-group v-model:value="selectedMode" @update:value="handleModeChange">
      <n-space vertical>
        <!-- 模板模式 -->
        <n-card
          hoverable
          :class="['mode-card', { selected: selectedMode === 'template' }]"
          @click="handleSelectTemplate"
        >
          <template #header>
            <n-space align="center">
              <n-radio value="template" />
              <span class="mode-title">从模板开始</span>
              <n-tag type="info" size="small">推荐</n-tag>
            </n-space>
          </template>
          <p>基于默认方案模板，快速创建自定义方案。预置了A/B/C三组常见菜品。</p>
          <n-space>
            <n-tag size="small">A组: 10种</n-tag>
            <n-tag size="small">B组: 10种</n-tag>
            <n-tag size="small">C组: 12种</n-tag>
          </n-space>
        </n-card>

        <!-- 自定义模式 -->
        <n-card
          hoverable
          :class="['mode-card', { selected: selectedMode === 'custom' }]"
          @click="handleSelectCustom"
        >
          <template #header>
            <n-space align="center">
              <n-radio value="custom" />
              <span class="mode-title">从零开始</span>
            </n-space>
          </template>
          <p>完全自定义菜品池，需要手动输入A/B/C三组的所有菜品。</p>
          <n-alert type="warning" :show-icon="false" style="margin-top: 0.5rem">
            需要确保每组至少包含1个菜品
          </n-alert>
        </n-card>
      </n-space>
    </n-radio-group>

    <!-- 模板预览 -->
    <n-collapse v-if="selectedMode === 'template'">
      <n-collapse-item title="查看模板菜品详情">
        <n-descriptions bordered :column="1">
          <n-descriptions-item label="A组（叶菜类）">
            {{ DEFAULT_SCHEME.pools.A.join('、') }}
          </n-descriptions-item>
          <n-descriptions-item label="B组（豆制品）">
            {{ DEFAULT_SCHEME.pools.B.join('、') }}
          </n-descriptions-item>
          <n-descriptions-item label="C组（瓜果类）">
            {{ DEFAULT_SCHEME.pools.C.join('、') }}
          </n-descriptions-item>
        </n-descriptions>
      </n-collapse-item>
    </n-collapse>
  </n-space>
</template>

<script setup lang="ts">
import { ref, inject, watch } from 'vue'
import {
  NRadioGroup,
  NRadio,
  NSpace,
  NCard,
  NTag,
  NCollapse,
  NCollapseItem,
  NAlert,
  NDescriptions,
  NDescriptionsItem
} from 'naive-ui'
import { DEFAULT_SCHEME } from '@/constants/default-scheme'

const wizardData = inject<Ref<{ configMode: string; pools: Record<string, string[]> }>>('wizardData')!
const wizardUpdate = inject<(data: Partial<{ configMode: string; pools: Record<string, string[]> }>) => void>(
  'wizardUpdate'
)!

const selectedMode = ref<'template' | 'custom'>('template')

watch(
  () => wizardData.value.configMode,
  (mode) => {
    selectedMode.value = mode as 'template' | 'custom'
  },
  { immediate: true }
)

function handleModeChange() {
  const pools =
    selectedMode.value === 'template'
      ? JSON.parse(JSON.stringify(DEFAULT_SCHEME.pools))
      : { A: [], B: [], C: [] }
  wizardUpdate({ configMode: selectedMode.value, pools })
}

function handleSelectTemplate() {
  selectedMode.value = 'template'
  handleModeChange()
}

function handleSelectCustom() {
  selectedMode.value = 'custom'
  handleModeChange()
}

async function validate() {
  return true
}

defineExpose({ validate })
</script>

<style scoped>
.mode-card {
  cursor: pointer;
  transition: all 0.3s;
}

.mode-card.selected {
  border-color: #18a058;
  box-shadow: 0 0 0 2px rgba(24, 160, 88, 0.2);
}

.mode-title {
  font-weight: 500;
  font-size: 16px;
}
</style>
