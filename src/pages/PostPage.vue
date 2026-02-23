<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'

interface Post {
  slug: string
  title: string
  date: string
  tags: string[]
  description: string
  readingTime: number
  content: string
}

const route = useRoute()
const router = useRouter()
const post = ref<Post | null>(null)
const loading = ref(true)
const error = ref(false)

const renderedContent = computed(() => {
  if (!post.value) return ''
  return marked(post.value.content)
})

onMounted(async () => {
  const slug = route.params.slug as string
  try {
    const res = await fetch(`/posts/${slug}.json`)
    if (!res.ok) throw new Error('Post not found')
    post.value = await res.json()
  } catch (e) {
    console.error('Failed to load post:', e)
    error.value = true
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

function goBack() {
  router.push('/posts')
}
</script>

<template>
  <article class="post-page">
    <div v-if="loading" class="loading">
      <mdui-circular-progress></mdui-circular-progress>
    </div>

    <div v-else-if="error" class="error">
      <mdui-icon name="error_outline" style="font-size: 4rem;"></mdui-icon>
      <h1>文章未找到</h1>
      <p>抱歉，这篇文章不存在或已被删除。</p>
      <mdui-button variant="filled" @click="goBack">
        返回文章列表
      </mdui-button>
    </div>

    <template v-else-if="post">
      <header class="post-header">
        <mdui-button variant="text" @click="goBack" class="back-btn">
          <mdui-icon slot="icon" name="arrow_back"></mdui-icon>
          返回
        </mdui-button>
        
        <div class="header-content">
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-meta">
            <span class="meta-item">
              <mdui-icon name="calendar_today"></mdui-icon>
              {{ formatDate(post.date) }}
            </span>
            <span class="meta-item">
              <mdui-icon name="schedule"></mdui-icon>
              {{ post.readingTime }} 分钟阅读
            </span>
          </div>
          <div class="post-tags">
            <mdui-chip
              v-for="tag in post.tags"
              :key="tag"
              :href="`/tags/${tag}`"
            >
              {{ tag }}
            </mdui-chip>
          </div>
        </div>
      </header>

      <mdui-card class="content-card">
        <div class="post-content" v-html="renderedContent"></div>
      </mdui-card>

      <footer class="post-footer">
        <mdui-button variant="outlined" @click="goBack">
          <mdui-icon slot="icon" name="arrow_back"></mdui-icon>
          返回文章列表
        </mdui-button>
      </footer>
    </template>
  </article>
</template>

<style scoped>
.post-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
}

.loading, .error {
  text-align: center;
  padding: 6rem 2rem;
}

.error h1 {
  margin: 1rem 0 0.5rem;
}

.error p {
  color: var(--mdui-color-on-surface-variant);
  margin-bottom: 1.5rem;
}

.post-header {
  margin-bottom: 2rem;
}

.back-btn {
  margin-bottom: 1.5rem;
}

.header-content {
  padding-left: 0.5rem;
}

.post-title {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 1rem;
}

.post-meta {
  display: flex;
  gap: 1.5rem;
  font-size: 0.875rem;
  color: var(--mdui-color-on-surface-variant);
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.meta-item mdui-icon {
  font-size: 1.125rem;
}

.post-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.content-card {
  margin-bottom: 2rem;
}

.post-content {
  padding: 2rem;
  line-height: 1.8;
  font-size: 1rem;
}

/* Markdown 样式 */
.post-content :deep(h1),
.post-content :deep(h2),
.post-content :deep(h3),
.post-content :deep(h4),
.post-content :deep(h5),
.post-content :deep(h6) {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
  line-height: 1.3;
}

.post-content :deep(h1) { font-size: 1.75rem; }
.post-content :deep(h2) { font-size: 1.5rem; }
.post-content :deep(h3) { font-size: 1.25rem; }
.post-content :deep(h4) { font-size: 1.125rem; }

.post-content :deep(p) {
  margin-bottom: 1rem;
}

.post-content :deep(a) {
  color: var(--mdui-color-primary);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

.post-content :deep(a:hover) {
  border-bottom-color: var(--mdui-color-primary);
}

.post-content :deep(code) {
  background: var(--mdui-color-surface-container-highest);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-size: 0.875em;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
}

.post-content :deep(pre) {
  background: var(--mdui-color-surface-container-highest);
  padding: 1.25rem;
  border-radius: 12px;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.post-content :deep(pre code) {
  background: none;
  padding: 0;
  font-size: 0.875rem;
  line-height: 1.6;
}

.post-content :deep(blockquote) {
  border-left: 4px solid var(--mdui-color-primary);
  padding: 0.5rem 0 0.5rem 1.25rem;
  margin: 1.5rem 0;
  color: var(--mdui-color-on-surface-variant);
  background: var(--mdui-color-surface-container);
  border-radius: 0 8px 8px 0;
}

.post-content :deep(ul),
.post-content :deep(ol) {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.post-content :deep(li) {
  margin-bottom: 0.5rem;
}

.post-content :deep(img) {
  max-width: 100%;
  border-radius: 12px;
  margin: 1.5rem 0;
}

.post-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  font-size: 0.9375rem;
}

.post-content :deep(th),
.post-content :deep(td) {
  border: 1px solid var(--mdui-color-outline-variant);
  padding: 0.75rem 1rem;
  text-align: left;
}

.post-content :deep(th) {
  background: var(--mdui-color-surface-container-highest);
  font-weight: 600;
}

.post-content :deep(hr) {
  border: none;
  height: 1px;
  background: var(--mdui-color-outline-variant);
  margin: 2rem 0;
}

.post-footer {
  text-align: center;
  padding: 1rem 0;
}

/* 桌面端优化 */
@media (min-width: 768px) {
  .post-page {
    padding: 2rem;
  }

  .post-title {
    font-size: 2.25rem;
  }

  .post-content {
    padding: 2.5rem 3rem;
    font-size: 1.0625rem;
  }

  .post-content :deep(h1) { font-size: 2rem; }
  .post-content :deep(h2) { font-size: 1.625rem; }
  .post-content :deep(h3) { font-size: 1.375rem; }
}

@media (min-width: 1024px) {
  .post-page {
    padding: 3rem;
  }

  .post-content {
    padding: 3rem 4rem;
  }
}
</style>