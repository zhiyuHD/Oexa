<script setup lang="ts">
import { useConfig, useSite } from '@/composables/useConfig'

const { config } = useConfig()
const { site } = useSite()
</script>

<template>
  <div class="about-page">
    <div class="profile-section">
      <div class="profile-card">
        <div class="avatar">
          <mdui-icon name="person" style="font-size: 3rem;"></mdui-icon>
        </div>
        <div class="profile-info">
          <h1 class="name">{{ site.author }}</h1>
          <p class="bio">{{ site.description }}</p>
          <p class="location">
            <mdui-icon name="language"></mdui-icon>
            {{ site.url.replace(/^https?:\/\//, '') }}
          </p>
        </div>
      </div>
    </div>

    <mdui-card class="links-card">
      <h2>联系方式</h2>
      <div class="link-list">
        <a
          v-for="link in config.social"
          :key="link.name"
          :href="link.url"
          target="_blank"
          class="link-item"
        >
          <div class="link-icon">
            <mdui-icon :name="link.icon"></mdui-icon>
          </div>
          <span class="link-name">{{ link.name }}</span>
          <mdui-icon name="open_in_new" class="external-icon"></mdui-icon>
        </a>
      </div>
    </mdui-card>

    <mdui-card class="about-card">
      <h2>关于本站</h2>
      <p>
        本站使用 <strong>Oexa</strong> 构建，这是一个基于 Vue 3 + Vite 的静态博客生成器。
      </p>
      <div class="features">
        <div class="feature-item">
          <mdui-icon name="rocket_launch"></mdui-icon>
          <span>使用 Vite 构建，开发体验极佳</span>
        </div>
        <div class="feature-item">
          <mdui-icon name="palette"></mdui-icon>
          <span>使用 MDUI 组件库，Material Design 风格</span>
        </div>
        <div class="feature-item">
          <mdui-icon name="edit_note"></mdui-icon>
          <span>支持 Markdown 写作，兼容 Hexo 语法</span>
        </div>
        <div class="feature-item">
          <mdui-icon name="label"></mdui-icon>
          <span>支持标签和分类</span>
        </div>
        <div class="feature-item">
          <mdui-icon name="search"></mdui-icon>
          <span>支持文章搜索</span>
        </div>
        <div class="feature-item">
          <mdui-icon name="settings"></mdui-icon>
          <span>灵活的配置系统</span>
        </div>
      </div>
    </mdui-card>
  </div>
</template>

<style scoped>
.about-page {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* 个人资料区域 */
.profile-section {
  margin-bottom: 2rem;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: var(--mdui-color-surface-container);
  border-radius: 16px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--mdui-color-primary-container);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar mdui-icon {
  color: var(--mdui-color-on-primary-container);
}

.profile-info {
  flex: 1;
}

.name {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.bio {
  color: var(--mdui-color-on-surface-variant);
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.location {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: var(--mdui-color-on-surface-variant);
}

/* 卡片通用样式 */
.links-card,
.about-card {
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.links-card h2,
.about-card h2 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

/* 链接列表 */
.link-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.link-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: background 0.2s;
}

.link-item:hover {
  background: var(--mdui-color-surface-container-high);
}

.link-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--mdui-color-surface-container-highest);
  display: flex;
  align-items: center;
  justify-content: center;
}

.link-icon mdui-icon {
  font-size: 1.125rem;
}

.link-name {
  flex: 1;
  font-weight: 500;
}

.external-icon {
  opacity: 0.4;
  font-size: 1.125rem;
}

/* 特性列表 */
.about-card p {
  color: var(--mdui-color-on-surface-variant);
  line-height: 1.6;
  margin-bottom: 1.25rem;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  color: var(--mdui-color-on-surface-variant);
}

.feature-item mdui-icon {
  color: var(--mdui-color-primary);
  font-size: 1.25rem;
}

/* 桌面端优化 */
@media (min-width: 768px) {
  .about-page {
    padding: 3rem 2rem;
  }

  .profile-card {
    padding: 2.5rem;
  }

  .avatar {
    width: 100px;
    height: 100px;
  }

  .avatar mdui-icon {
    font-size: 3.5rem;
  }

  .name {
    font-size: 1.75rem;
  }

  .links-card,
  .about-card {
    padding: 2rem;
  }

  .link-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.75rem;
  }

  .features {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem 1.5rem;
  }
}
</style>
