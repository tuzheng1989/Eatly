<template>
  <header class="app-header">
    <div class="logo">
      <h1>🥗 Eatly</h1>
    </div>
    <nav class="nav-menu desktop-only">
      <router-link to="/" :class="{ active: $route.name === 'home' }">
        首页
      </router-link>
      <router-link to="/recommend" :class="{ active: $route.name === 'recommend' }">
        推荐
      </router-link>
      <router-link to="/record" :class="{ active: $route.name === 'record' }">
        记录
      </router-link>
      <router-link to="/calendar" :class="{ active: $route.name === 'calendar' }">
        日历
      </router-link>
      <router-link to="/statistics" :class="{ active: $route.name === 'statistics' }">
        统计
      </router-link>
      <router-link to="/schemes" :class="{ active: $route.name === 'schemes' }">
        方案
      </router-link>
      <router-link to="/settings" :class="{ active: $route.name === 'settings' }">
        设置
      </router-link>
    </nav>
  </header>
</template>

<script setup lang="ts">
// 简单的头部组件
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
}

.nav-menu {
  display: flex;
  gap: 1rem;
}

.nav-menu a {
  text-decoration: none;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s;
}

.nav-menu a:hover,
.nav-menu a.active {
  background: #42b983;
  color: white;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }
}
</style>
