<template>
  <div class="home">
    <div class="welcome">
      <h1>欢迎使用 Eatly 🥗</h1>
      <p>每日饮食推荐记录，让饮食更健康、更多样</p>
    </div>

    <div class="quick-actions">
      <n-card hoverable class="action-card" @click="$router.push('/recommend')">
        <div class="icon">🎲</div>
        <h3>获取推荐</h3>
        <p>随机生成今日饮食推荐</p>
      </n-card>

      <n-card hoverable class="action-card" @click="$router.push('/record')">
        <div class="icon">📝</div>
        <h3>记录饮食</h3>
        <p>记录今天吃的菜品</p>
      </n-card>

      <n-card hoverable class="action-card" @click="$router.push('/calendar')">
        <div class="icon">📅</div>
        <h3>历史记录</h3>
        <p>查看过去的饮食记录</p>
      </n-card>

      <n-card hoverable class="action-card" @click="$router.push('/statistics')">
        <div class="icon">📊</div>
        <h3>统计分析</h3>
        <p>查看饮食习惯分析</p>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NCard } from 'naive-ui'
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome {
  text-align: center;
  margin-bottom: 3rem;
}

.welcome h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.action-card {
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.action-card:hover {
  transform: translateY(-4px);
}

.action-card .icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.action-card h3 {
  margin-bottom: 0.5rem;
}
</style>
