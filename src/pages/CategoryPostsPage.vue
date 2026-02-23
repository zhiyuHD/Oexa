<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface PostMeta {
  slug: string
  title: string
  date: string
}

const route = useRoute()
const router = useRouter()
const categoryName = ref('')
const posts = ref<PostMeta[]>([])
const loading = ref(true)
const error = ref(false)

onMounted(async () => {
  categoryName.value = route.params.category as string
  try {
    const res = await fetch('/posts/categories.json')
    const categoriesMap: Record<string, PostMeta[]> = await res.json()
    posts.value = categoriesMap[categoryName.value] || []
    if (posts.value.length === 0) {
      error.value = true
    }
  } catch (e) {
    console.error('Failed to load category posts:', e)
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
  router.push('/categories')
}
</script>

<template>
  <div class="category-posts-page">
    <header class="page-header">
      <mdui-button variant="text" @click="goBack" class="back-btn">
        <mdui-icon slot="icon" name="arrow_back"></mdui-icon>
        返回
      </mdui-button>
      
      <div class="header-content">
        <div class="category-badge">
          <mdui-icon name="folder"></mdui-icon>
          <h1>{{ categoryName }}</h1>
        </div>
        <p>共 {{ posts.length }} 篇文章</p>
      </div>
    </header>

    <div v-if="loading" class="loading">
      <mdui-circular-progress></mdui-circular-progress>
    </div>

    <div v-else-if="error" class="error">
      <mdui-icon name="error_outline" style="font-size: 4rem;"></mdui-icon>
      <p>该分类下没有文章</p>
      <mdui-button variant="filled" @click="goBack">
        返回分类列表
      </mdui-button>
    </div>

    <div v-else class="post-list">
      <mdui-card
        v-for="post in posts"
        :key="post.slug"
        class="post-card"
        clickable
        @click="router.push(`/posts/${post.slug}`)"
      >
        <div class="post-content">
          <h2 class="post-title">{{ post.title }}</h2>
          <p class="post-meta">
            <mdui-icon name="calendar_today"></mdui-icon>
            {{ formatDate(post.date) }}
          </p>
        </div>
        <mdui-icon name="arrow_forward" class="arrow-icon"></mdui-icon>
      </mdui-card>
    </div>
  </div>
</template>

<style scoped>
.category-posts-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.page-header {
  margin-bottom: 2rem;
}

.back-btn {
  margin-bottom: 1rem;
}

.header-content {
  padding-left: 0.5rem;
}

.category-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.category-badge mdui-icon {
  font-size: 1.75rem;
  color: var(--mdui-color-secondary);
}

.category-badge h1 {
  font-size: 1.75rem;
  font-weight: 700;
}

.header-content p {
  color: var(--mdui-color-on-surface-variant);
}

.loading, .error {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--mdui-color-on-surface-variant);
}

.error p {
  margin: 1rem 0 1.5rem;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.post-card {
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
}

.post-card:hover {
  transform: translateX(4px);
}

.post-content {
  padding: 1.25rem 1.5rem;
  flex: 1;
}

.post-title {
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: var(--mdui-color-on-surface-variant);
}

.post-meta mdui-icon {
  font-size: 1rem;
}

.arrow-icon {
  margin-right: 1.5rem;
  color: var(--mdui-color-on-surface-variant);
  opacity: 0.5;
  transition: opacity 0.2s, transform 0.2s;
}

.post-card:hover .arrow-icon {
  opacity: 1;
  transform: translateX(4px);
}

/* 桌面端优化 */
@media (min-width: 768px) {
  .category-posts-page {
    padding: 3rem 2rem;
  }

  .category-badge h1 {
    font-size: 2rem;
  }

  .post-title {
    font-size: 1.25rem;
  }
}
</style>
