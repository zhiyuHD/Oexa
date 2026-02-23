<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfig, useSite, useFooter } from '@/composables/useConfig'

const route = useRoute()
const router = useRouter()
const { config, loading } = useConfig()
const { site } = useSite()
const { footer } = useFooter()

// 当前导航项
const currentNav = ref('/')

// 监听路由变化更新导航
watch(
  () => route.path,
  (path) => {
    currentNav.value = path
  },
  { immediate: true }
)

// 导航切换
function navigateTo(path: string) {
  router.push(path)
}

// 当前年份
const currentYear = new Date().getFullYear()
const sinceYear = computed(() => footer.value.since || currentYear)
const yearDisplay = computed(() => 
  sinceYear.value === currentYear 
    ? currentYear 
    : `${sinceYear.value} - ${currentYear}`
)
</script>

<template>
  <div class="app">
    <!-- 桌面端侧边导航 -->
    <aside class="desktop-nav">
      <div class="nav-brand">
        <h1>{{ site.title }}</h1>
        <p>{{ site.subtitle }}</p>
      </div>
      
      <nav class="nav-menu">
        <div
          v-for="item in config.nav"
          :key="item.path"
          class="nav-item"
          :class="{ active: currentNav === item.path || (item.path !== '/' && currentNav.startsWith(item.path)) }"
          @click="navigateTo(item.path)"
        >
          <mdui-icon :name="item.icon"></mdui-icon>
          <span>{{ item.name }}</span>
        </div>
      </nav>

      <div class="nav-social">
        <a
          v-for="link in config.social"
          :key="link.name"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="social-link"
          :title="link.name"
        >
          <mdui-icon :name="link.icon"></mdui-icon>
        </a>
      </div>

      <div class="nav-footer">
        <p>© {{ yearDisplay }} {{ site.author }}</p>
        <p v-if="footer.icp" class="icp">{{ footer.icp }}</p>
        <p class="powered">Powered by <a href="https://github.com" target="_blank">Oexa</a></p>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- 移动端底部导航 -->
    <footer class="mobile-nav">
      <mdui-navigation-bar :value="currentNav">
        <mdui-navigation-bar-item
          v-for="item in config.nav.slice(0, 4)"
          :key="item.path"
          :icon="item.icon"
          :value="item.path"
          @click="navigateTo(item.path)"
        >
          {{ item.name }}
        </mdui-navigation-bar-item>
      </mdui-navigation-bar>
    </footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
}

/* 桌面端侧边导航 */
.desktop-nav {
  display: none;
  width: 260px;
  min-width: 260px;
  height: 100vh;
  position: sticky;
  top: 0;
  flex-direction: column;
  background: var(--mdui-color-surface-container);
  border-right: 1px solid var(--mdui-color-outline-variant);
}

.nav-brand {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid var(--mdui-color-outline-variant);
}

.nav-brand h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  background: linear-gradient(135deg, var(--mdui-color-primary), var(--mdui-color-tertiary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-brand p {
  font-size: 0.8125rem;
  color: var(--mdui-color-on-surface-variant);
}

.nav-menu {
  flex: 1;
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--mdui-color-on-surface-variant);
  font-weight: 500;
}

.nav-item:hover {
  background: var(--mdui-color-surface-container-high);
}

.nav-item.active {
  background: var(--mdui-color-primary-container);
  color: var(--mdui-color-on-primary-container);
}

.nav-item mdui-icon {
  font-size: 1.375rem;
}

.nav-social {
  padding: 1rem 1.5rem;
  display: flex;
  gap: 0.75rem;
  border-top: 1px solid var(--mdui-color-outline-variant);
}

.social-link {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: var(--mdui-color-on-surface-variant);
  transition: all 0.2s;
}

.social-link:hover {
  background: var(--mdui-color-surface-container-high);
  color: var(--mdui-color-primary);
}

.social-link mdui-icon {
  font-size: 1.25rem;
}

.nav-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--mdui-color-outline-variant);
  text-align: center;
}

.nav-footer p {
  font-size: 0.75rem;
  color: var(--mdui-color-on-surface-variant);
  margin: 0.25rem 0;
}

.nav-footer .icp {
  font-size: 0.6875rem;
}

.nav-footer .powered a {
  color: var(--mdui-color-primary);
}

/* 主内容区 */
.main-content {
  flex: 1;
  min-height: 100vh;
  padding-bottom: 80px;
}

/* 移动端底部导航 */
.mobile-nav {
  display: block;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

/* 桌面端显示侧边栏，隐藏底部导航 */
@media (min-width: 768px) {
  .desktop-nav {
    display: flex;
  }

  .mobile-nav {
    display: none;
  }

  .main-content {
    padding-bottom: 0;
  }
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>