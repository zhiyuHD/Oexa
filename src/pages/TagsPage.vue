<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const tagsMap = ref<Record<string, Array<{ slug: string; title: string; date: string }>>>({})
const loading = ref(true)

const tags = computed(() => {
  return Object.entries(tagsMap.value)
    .map(([name, posts]) => ({ name, count: posts.length }))
    .sort((a, b) => b.count - a.count)
})

onMounted(async () => {
  try {
    const res = await fetch('/posts/tags.json')
    tagsMap.value = await res.json()
  } catch (e) {
    console.error('Failed to load tags:', e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="tags-page">
    <header class="page-header">
      <h1>标签</h1>
      <p>共 {{ tags.length }} 个标签</p>
    </header>

    <div v-if="loading" class="loading">
      <mdui-circular-progress></mdui-circular-progress>
    </div>

    <div v-else-if="tags.length === 0" class="empty">
      <mdui-icon name="label_off" style="font-size: 4rem; opacity: 0.3;"></mdui-icon>
      <p>暂无标签</p>
    </div>

    <div v-else class="tags-grid">
      <mdui-card
        v-for="tag in tags"
        :key="tag.name"
        class="tag-card"
        clickable
        @click="router.push(`/tags/${tag.name}`)"
      >
        <div class="tag-content">
          <div class="tag-icon">
            <mdui-icon name="label"></mdui-icon>
          </div>
          <div class="tag-info">
            <span class="tag-name">{{ tag.name }}</span>
            <span class="tag-count">{{ tag.count }} 篇文章</span>
          </div>
          <mdui-icon name="arrow_forward" class="arrow-icon"></mdui-icon>
        </div>
      </mdui-card>
    </div>
  </div>
</template>

<style scoped>
.tags-page {
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

.loading, .empty {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--mdui-color-on-surface-variant);
}

.empty p {
  margin-top: 1rem;
}

.tags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
}

.tag-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.tag-card:hover {
  transform: translateY(-2px);
}

.tag-card:hover .arrow-icon {
  transform: translateX(4px);
}

.tag-content {
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.tag-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--mdui-color-primary-container);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tag-icon mdui-icon {
  color: var(--mdui-color-on-primary-container);
  font-size: 1.25rem;
}

.tag-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.tag-name {
  font-weight: 600;
  font-size: 1rem;
}

.tag-count {
  font-size: 0.8125rem;
  color: var(--mdui-color-on-surface-variant);
}

.arrow-icon {
  color: var(--mdui-color-on-surface-variant);
  transition: transform 0.2s;
}

/* 桌面端优化 */
@media (min-width: 768px) {
  .tags-page {
    padding: 3rem 2rem;
  }

  .page-header h1 {
    font-size: 2.25rem;
  }

  .tags-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}
</style>