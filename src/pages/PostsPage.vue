<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

interface PostMeta {
  slug: string
  title: string
  date: string
  tags: string[]
  description: string
  readingTime: number
}

const router = useRouter()
const posts = ref<PostMeta[]>([])
const loading = ref(true)
const searchQuery = ref('')

const filteredPosts = computed(() => {
  if (!searchQuery.value) return posts.value
  const query = searchQuery.value.toLowerCase()
  return posts.value.filter(post => 
    post.title.toLowerCase().includes(query) ||
    post.description.toLowerCase().includes(query) ||
    post.tags.some(tag => tag.toLowerCase().includes(query))
  )
})

onMounted(async () => {
  try {
    const res = await fetch('/posts/index.json')
    posts.value = await res.json()
  } catch (e) {
    console.error('Failed to load posts:', e)
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
  <div class="posts-page">
    <header class="page-header">
      <h1>文章</h1>
      <p>共 {{ posts.length }} 篇文章</p>
    </header>

    <div class="search-box">
      <mdui-text-field
        v-model="searchQuery"
        variant="outlined"
        placeholder="搜索文章..."
        clearable
      >
        <mdui-icon slot="icon" name="search"></mdui-icon>
      </mdui-text-field>
    </div>

    <div v-if="loading" class="loading">
      <mdui-circular-progress></mdui-circular-progress>
    </div>

    <div v-else-if="filteredPosts.length === 0" class="empty">
      <mdui-icon name="search_off" style="font-size: 4rem; opacity: 0.3;"></mdui-icon>
      <p>{{ searchQuery ? '没有找到匹配的文章' : '暂无文章' }}</p>
    </div>

    <div v-else class="post-list">
      <mdui-card
        v-for="post in filteredPosts"
        :key="post.slug"
        class="post-card"
        clickable
        @click="router.push(`/posts/${post.slug}`)"
      >
        <div class="post-content">
          <div class="post-main">
            <div class="post-info">
              <h2 class="post-title">{{ post.title }}</h2>
              <p class="post-description">{{ post.description }}</p>
            </div>
            <div class="post-meta">
              <span class="date">
                <mdui-icon name="calendar_today"></mdui-icon>
                {{ formatDate(post.date) }}
              </span>
              <span class="reading-time">
                <mdui-icon name="schedule"></mdui-icon>
                {{ post.readingTime }} 分钟
              </span>
            </div>
          </div>
          <div class="post-tags">
            <mdui-chip
              v-for="tag in post.tags"
              :key="tag"
              disabled
            >
              {{ tag }}
            </mdui-chip>
          </div>
        </div>
      </mdui-card>
    </div>
  </div>
</template>

<style scoped>
.posts-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.page-header p {
  color: var(--mdui-color-on-surface-variant);
}

.search-box {
  margin-bottom: 2rem;
}

.search-box mdui-text-field {
  width: 100%;
}

.loading, .empty {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--mdui-color-on-surface-variant);
}

.empty p {
  margin-top: 1rem;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.post-card:hover {
  transform: translateY(-2px);
}

.post-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-main {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.post-info {
  flex: 1;
}

.post-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.post-description {
  color: var(--mdui-color-on-surface-variant);
  font-size: 0.9375rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-meta {
  display: flex;
  gap: 1.5rem;
  font-size: 0.8125rem;
  color: var(--mdui-color-on-surface-variant);
}

.post-meta span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.post-meta mdui-icon {
  font-size: 1.125rem;
}

.post-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* 桌面端优化 */
@media (min-width: 768px) {
  .posts-page {
    padding: 3rem 2rem;
  }

  .page-header h1 {
    font-size: 2.25rem;
  }

  .post-content {
    flex-direction: row;
    align-items: center;
  }

  .post-main {
    flex: 1;
    flex-direction: row;
    align-items: center;
  }

  .post-info {
    flex: 1;
  }

  .post-meta {
    flex-shrink: 0;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
    min-width: 140px;
  }

  .post-tags {
    flex-shrink: 0;
    min-width: 150px;
    justify-content: flex-end;
  }
}

@media (min-width: 1024px) {
  .post-title {
    font-size: 1.375rem;
  }
}
</style>