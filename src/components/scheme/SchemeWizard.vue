<template>
  <n-modal v-model:show="visible" preset="card" title="创建新方案" style="width: 800px">
    <n-steps :current="currentStep" :status="stepStatus">
      <n-step title="基本信息" />
      <n-step title="配置模式" />
      <n-step title="菜品池配置" />
      <n-step title="预览确认" />
    </n-steps>

    <div class="wizard-content">
      <component :is="currentStepComponent" ref="stepRef" />
    </div>

    <template #footer>
      <n-space justify="space-between">
        <n-button v-if="currentStep > 1" :disabled="loading" @click="handlePrevious">
          上一步
        </n-button>
        <div></div>
        <n-space>
          <n-button :disabled="loading" @click="handleCancel">
            取消
          </n-button>
          <n-button v-if="currentStep < totalSteps" type="primary" :loading="loading" @click="handleNext">
            下一步
          </n-button>
          <n-button v-else type="primary" :loading="loading" @click="handleFinish">
            完成创建
          </n-button>
        </n-space>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, provide, watch } from 'vue'
import { NModal, NSteps, NStep, NSpace, NButton } from 'naive-ui'
import { useSchemeStore } from '@/stores'
import StepBasicInfo from './wizard-steps/StepBasicInfo.vue'
import StepConfigMode from './wizard-steps/StepConfigMode.vue'
import StepPoolConfig from './wizard-steps/StepPoolConfig.vue'
import StepPreview from './wizard-steps/StepPreview.vue'
import type { Scheme } from '@/types'

interface Props {
  show: boolean
}

interface Emits {
  'update:show': [value: boolean]
  'success': [scheme: Scheme]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const schemeStore = useSchemeStore()

// 状态管理
const currentStep = ref(1)
const totalSteps = 4
const loading = ref(false)
const stepRef = ref()
const stepStatus = ref<'process' | 'finish' | 'error' | 'wait'>('process')

// 表单数据
const formData = ref({
  name: '',
  description: '',
  configMode: 'template' as const,
  pools: { A: [], B: [], C: [] }
})

// Provide共享数据
provide('wizardData', formData)
provide('wizardUpdate', (updates: Partial<typeof formData.value>) => {
  Object.assign(formData.value, updates)
})

// 步骤组件映射
const stepComponents = [StepBasicInfo, StepConfigMode, StepPoolConfig, StepPreview]
const currentStepComponent = computed(() => stepComponents[currentStep.value - 1])

// 下一步（带验证）
async function handleNext() {
  const isValid = await stepRef.value?.validate()
  if (!isValid) {
    stepStatus.value = 'error'
    return
  }
  stepStatus.value = 'process'
  currentStep.value++
}

// 上一步
function handlePrevious() {
  if (currentStep.value > 1) {
    currentStep.value--
    stepStatus.value = 'process'
  }
}

// 完成创建
async function handleFinish() {
  loading.value = true
  try {
    const newScheme = await schemeStore.createScheme({
      name: formData.value.name,
      description: formData.value.description,
      pools: formData.value.pools,
      originalPools: formData.value.pools
    })
    window.$message?.success('方案创建成功')
    emit('success', newScheme)
    emit('update:show', false)
  } catch (error) {
    window.$message?.error('创建失败: ' + (error as Error).message)
  } finally {
    loading.value = false
  }
}

// 取消
function handleCancel() {
  emit('update:show', false)
}

// 重置表单
function resetForm() {
  currentStep.value = 1
  formData.value = {
    name: '',
    description: '',
    configMode: 'template',
    pools: { A: [], B: [], C: [] }
  }
  stepStatus.value = 'process'
}

// 监听显示状态
watch(() => props.show, (show) => {
  if (show) {
    resetForm()
  }
})

// 计算visible
const visible = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val)
})
</script>

<style scoped>
.wizard-content {
  min-height: 400px;
  padding: 2rem 0;
}
</style>
