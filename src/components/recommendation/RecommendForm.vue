<template>
  <div class="recommend-form">
    <n-form-item label="推荐数量">
      <n-input-number
        v-model:value="count"
        :min="1"
        :max="30"
        placeholder="请输入推荐数量"
      />
    </n-form-item>
    <n-button type="primary" :loading="loading" @click="handleGenerate">
      生成推荐
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NFormItem, NInputNumber, NButton } from 'naive-ui'

const props = defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  generate: [count: number]
}>()

const count = ref(1)

function handleGenerate() {
  if (count.value < 1 || count.value > 30) {
    window.$message?.error('推荐数量应在1-30之间')
    return
  }
  emit('generate', count.value)
}
</script>

<style scoped>
.recommend-form {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}
</style>
