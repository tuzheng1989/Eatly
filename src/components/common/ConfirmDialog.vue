<template>
  <n-modal v-model:show="visible" preset="dialog" :title="title">
    <p>{{ message }}</p>
    <template #action>
      <n-button @click="handleCancel">取消</n-button>
      <n-button type="error" @click="handleConfirm">确认</n-button>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NModal, NButton } from 'naive-ui'

interface Props {
  show: boolean
  title: string
  message: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:show': [value: boolean]
  confirm: []
  cancel: []
}>()

const visible = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val)
})

function handleConfirm() {
  emit('confirm')
  visible.value = false
}

function handleCancel() {
  emit('cancel')
  visible.value = false
}
</script>
