<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="not-found">
    <div class="content">
      <div class="error-code">404</div>
      <h1>页面未找到</h1>
      <p>抱歉，您访问的页面不存在或已被移除。</p>
      <div class="actions">
        <mdui-button variant="filled" @click="goHome">
          <mdui-icon slot="icon" name="home"></mdui-icon>
          返回首页
        </mdui-button>
        <mdui-button variant="outlined" @click="router.push('/posts')">
          <mdui-icon slot="icon" name="article"></mdui-icon>
          浏览文章
        </mdui-button>
      </div>
    </div>
    <div class="decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.content {
  text-align: center;
  position: relative;
  z-index: 1;
  padding: 2rem;
}

.error-code {
  font-size: 8rem;
  font-weight: 800;
  line-height: 1;
  background: linear-gradient(135deg, var(--mdui-color-primary), var(--mdui-color-tertiary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.not-found h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.not-found p {
  color: var(--mdui-color-on-surface-variant);
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* 装饰 */
.decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.08;
}

.circle-1 {
  width: 400px;
  height: 400px;
  background: var(--mdui-color-primary);
  top: -150px;
  right: -100px;
}

.circle-2 {
  width: 300px;
  height: 300px;
  background: var(--mdui-color-tertiary);
  bottom: -100px;
  left: -100px;
}

/* 桌面端优化 */
@media (min-width: 768px) {
  .not-found {
    min-height: 100vh;
  }

  .error-code {
    font-size: 12rem;
  }

  .not-found h1 {
    font-size: 2rem;
  }

  .not-found p {
    font-size: 1.125rem;
  }
}
</style>