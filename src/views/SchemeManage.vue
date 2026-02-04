<template>
  <div class="schemes">
    <h1>方案管理 🔄</h1>

    <n-space vertical size="large">
      <!-- 当前方案 -->
      <n-card title="当前方案">
        <n-space v-if="currentScheme">
          <n-statistic label="方案名称" :value="currentScheme.name" />
          <n-statistic label="A组菜品数" :value="currentScheme.pools.A.length" />
          <n-statistic label="B组菜品数" :value="currentScheme.pools.B.length" />
          <n-statistic label="C组菜品数" :value="currentScheme.pools.C.length" />
        </n-space>
        <n-empty v-else description="未选择方案" />
      </n-card>

      <!-- 方案列表 -->
      <n-card title="所有方案">
        <n-list v-if="schemes.length > 0">
          <n-list-item v-for="scheme in schemes" :key="scheme.id">
            <div class="scheme-item">
              <div class="info">
                <h3>{{ scheme.name }}</h3>
                <p>A: {{ scheme.pools.A.length }} | B: {{ scheme.pools.B.length }} | C: {{ scheme.pools.C.length }}</p>
              </div>
              <div class="actions">
                <n-button v-if="currentSchemeId !== scheme.id" @click="handleSelect(scheme.id)">
                  选择
                </n-button>
                <n-tag v-else type="success">当前</n-tag>
                <n-button v-if="!scheme.isDefault" type="error" @click="handleDelete(scheme.id)">
                  删除
                </n-button>
              </div>
            </div>
          </n-list-item>
        </n-list>
        <n-empty v-else description="暂无方案" />
      </n-card>

      <!-- 创建新方案 -->
      <n-card title="创建新方案">
        <n-form :model="formValue" label-placement="left" label-width="80">
          <n-form-item label="方案名称">
            <n-input v-model:value="formValue.name" placeholder="输入方案名称" />
          </n-form-item>
          <n-form-item label="描述">
            <n-input v-model:value="formValue.description" type="textarea" placeholder="可选描述" />
          </n-form-item>
          <n-form-item>
            <n-button type="primary" @click="handleCreate">
              创建方案
            </n-button>
          </n-form-item>
        </n-form>
      </n-card>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  NSpace,
  NCard,
  NList,
  NListItem,
  NButton,
  NTag,
  NStatistic,
  NForm,
  NFormItem,
  NInput,
  NEmpty,
  NCollapse,
  NCollapseItem
} from 'naive-ui'
import { useSchemeStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { DEFAULT_SCHEME } from '@/constants/default-scheme'

const schemeStore = useSchemeStore()
const { schemes, currentSchemeId, currentScheme } = storeToRefs(schemeStore)

const formValue = ref({
  name: '',
  description: ''
})

async function handleSelect(id: string) {
  schemeStore.setCurrentScheme(id)
  window.$message?.success('方案已切换')
}

async function handleDelete(id: string) {
  await schemeStore.deleteScheme(id)
  window.$message?.success('方案已删除')
}

async function handleCreate() {
  if (!formValue.value.name) {
    window.$message?.error('请输入方案名称')
    return
  }

  await schemeStore.createScheme({
    ...DEFAULT_SCHEME,
    name: formValue.value.name,
    description: formValue.value.description
  })

  window.$message?.success('方案已创建')
  formValue.value.name = ''
  formValue.value.description = ''
}

onMounted(async () => {
  await schemeStore.loadSchemes()

  // 如果没有方案，初始化默认方案
  if (schemes.value.length === 0) {
    const defaultScheme = await schemeStore.createScheme(DEFAULT_SCHEME)
    schemeStore.setCurrentScheme(defaultScheme.id)
  } else if (!currentSchemeId.value && schemes.value.length > 0) {
    schemeStore.setCurrentScheme(schemes.value[0].id)
  } else if (currentSchemeId.value) {
    schemeStore.loadCurrentPools()
  }
})
</script>

<style scoped>
.schemes {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.scheme-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.scheme-item .info h3 {
  margin: 0 0 0.5rem 0;
}

.scheme-item .info p {
  margin: 0;
}

.scheme-item .actions {
  display: flex;
  gap: 0.5rem;
}
</style>
