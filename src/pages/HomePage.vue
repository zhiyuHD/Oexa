<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfig, useHome } from '@/composables/useConfig'

interface PostMeta {
  slug: string
  title: string
  date: string
  tags: string[]
  description: string
  readingTime?: number
  wordCount?: number
  cover?: string
}

const router = useRouter()
const { config } = useConfig()
const { home } = useHome()

const recentPosts = ref<PostMeta[]>([])
const loading = ref(true)

const hero = computed(() => home.value.hero)
const showTags = computed(() => home.value.showTags)
const tagCloudCount = computed(() => home.value.tagCloudCount || 20)

// 标签云数据
const tags = ref<{ name: string; count: number }[]>([])

onMounted(async () => {
  try {
    // 加载文章
    const postsRes = await fetch('/posts/index.json')
    const data: PostMeta[] = await postsRes.json()
    recentPosts.value = data.slice(0, home.value.recentPosts || 5)
    
    // 加载标签
    if (showTags.value) {
      const tagsRes = await fetch('/posts/tags.json')
      const tagsMap: Record<string, PostMeta[]> = await tagsRes.json()
      tags.value = Object.entries(tagsMap)
        .map(([name, posts]) => ({ name, count: posts.length }))
        .sort((a, b) => b.count - a.count)
        .slice(0, tagCloudCount.value)
    }
  } catch (e) {
    console.error('Failed to load data:', e)
  } finally {
    loading.value = false
  }
})

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="home">
    <div class="hero">
      <div class="hero-content">
        <h1 class="title">{{ hero.title }}</h1>
        <p class="subtitle">{{ hero.subtitle }}</p>
        <div v-if="hero.showActions" class="hero-actions">
          <mdui-button variant="filled" @click="router.push('/posts')">
            <mdui-icon slot="icon" name="article"></mdui-icon>
            浏览文章
          </mdui-button>
          <mdui-button variant="outlined" @click="router.push('/about')">
            <mdui-icon slot="icon" name="person"></mdui-icon>
            关于我
          </mdui-button>
        </div>
      </div>
      <div class="hero-decoration">
        <div class="decoration-circle circle-1"></div>
        <div class="decoration-circle circle-2"></div>
        <div class="decoration-circle circle-3"></div>
      </div>
    </div>

    <!-- 标签云 -->
    <section v-if="showTags && tags.length > 0" class="tags-section">
      <h2>热门标签</h2>
      <div class="tags-cloud">
        <mdui-chip
          v-for="tag in tags"
          :key="tag.name"
          :href="`/tags/${tag.name}`"
        >
          {{ tag.name }}
          <span class="tag-count">{{ tag.count }}</span>
        </mdui-chip>
      </div>
    </section>

    <section class="recent-posts">
      <div class="section-header">
        <h2>最新文章</h2>
        <mdui-button variant="text" @click="router.push('/posts')">
          查看全部
          <mdui-icon slot="end-icon" name="arrow_forward"></mdui-icon>
        </mdui-button>
      </div>
      
      <div v-if="loading" class="loading">
        <mdui-circular-progress></mdui-circular-progress>
      </div>
      
      <div v-else-if="recentPosts.length === 0" class="empty">
        <mdui-icon name="article" style="font-size: 4rem; opacity: 0.3;"></mdui-icon>
        <p>暂无文章</p>
      </div>
      
      <div v-else class="post-grid">
        <mdui-card
          v-for="(post, index) in recentPosts"
          :key="post.slug"
          class="post-card"
          :class="{ 'featured': index === 0 && post.cover }"
          clickable
          @click="router.push(`/posts/${post.slug}`)"
        >
          <!-- 封面图 -->
          <div v-if="post.cover && index === 0" class="post-cover">
            <img :src="post.cover" :alt="post.title" />
          </div>
          
          <div class="post-content">
            <div class="post-header">
              <h3 class="post-title">{{ post.title }}</h3>
              <div class="post-meta">
                <span class="meta-item">
                  <mdui-icon name="calendar_today"></mdui-icon>
                  {{ formatDate(post.date) }}
                </span>
                <span v-if="post.readingTime && config.post.showReadingTime" class="meta-item">
                  <mdui-icon name="schedule"></mdui-icon>
                  {{ post.readingTime }} 分钟
                </span>
                <span v-if="post.wordCount && config.post.showWordCount" class="meta-item">
                  <mdui-icon name="text_fields"></mdui-icon>
                  {{ post.wordCount }} 字
                </span>
              </div>
            </div>
            <p class="post-description">{{ post.description }}</p>
            <div class="post-tags">
              <mdui-chip v-for="tag in post.tags.slice(0, 3)" :key="tag" disabled>
                {{ tag }}
              </mdui-chip>
            </div>
          </div>
        </mdui-card>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* Hero 区域 */
.hero {
  position: relative;
  padding: 4rem 0;
  text-align: center;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  line-height: 1.2;
}

.subtitle {
  font-size: 1.25rem;
  color: var(--mdui-color-on-surface-variant);
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* 装饰圆圈 */
.hero-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
}

.circle-1 {
  width: 300px;
  height: 300px;
  background: var(--mdui-color-primary);
  top: -100px;
  right: -50px;
}

.circle-2 {
  width: 200px;
  height: 200px;
  background: var(--mdui-color-tertiary);
  bottom: -50px;
  left: -50px;
}

.circle-3 {
  width: 150px;
  height: 150px;
  background: var(--mdui-color-secondary);
  top: 50%;
  left: 10%;
}

/* 标签云 */
.tags-section {
  margin-top: 1rem;
  margin-bottom: 2rem;
}

.tags-section h2 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-count {
  margin-left: 0.25rem;
  opacity: 0.7;
  font-size: 0.75rem;
}

/* 最新文章 */
.recent-posts {
  margin-top: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
}

.loading, .empty {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--mdui-color-on-surface-variant);
}

.empty p {
  margin-top: 1rem;
}

/* 文章网格 */
.post-grid {
  display: grid;
  gap: 1rem;
}

.post-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: hidden;
}

.post-card:hover {
  transform: translateY(-2px);
}

.post-cover {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.post-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-content {
  padding: 1.5rem;
}

.post-header {
  margin-bottom: 0.75rem;
}

.post-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.post-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8125rem;
  color: var(--mdui-color-on-surface-variant);
}

.meta-item mdui-icon {
  font-size: 1rem;
}

.post-description {
  color: var(--mdui-color-on-surface-variant);
  font-size: 0.9375rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* 桌面端优化 */
@media (min-width: 768px) {
  .home {
    padding: 3rem 2rem;
  }

  .hero {
    padding: 5rem 0;
  }

  .title {
    font-size: 3rem;
  }

  .subtitle {
    font-size: 1.375rem;
  }

  .post-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .post-card.featured {
    grid-column: span 2;
  }

  .post-card.featured .post-cover {
    height: 280px;
  }

  .post-card.featured .post-title {
    font-size: 1.5rem;
  }

  .post-card.featured .post-description {
    -webkit-line-clamp: 3;
  }
}

@media (min-width: 1024px) {
  .title {
    font-size: 3.5rem;
  }
}
</style>
