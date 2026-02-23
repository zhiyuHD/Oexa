<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

interface CategoryPost {
  slug: string
  title: string
  date: string
}

const router = useRouter()
const categoriesMap = ref<Record<string, CategoryPost[]>>({})
const loading = ref(true)

const categories = computed(() => {
  return Object.entries(categoriesMap.value)
    .map(([name, posts]) => ({ name, count: posts.length }))
    .sort((a, b) => b.count - a.count)
})

onMounted(async () => {
  try {
    const res = await fetch('/posts/categories.json')
    categoriesMap.value = await res.json()
  } catch (e) {
    console.error('Failed to load categories:', e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="categories-page">
    <header class="page-header">
      <h1>分类</h1>
      <p>共 {{ categories.length }} 个分类</p>
    </header>

    <div v-if="loading" class="loading">
      <mdui-circular-progress></mdui-circular-progress>
    </div>

    <div v-else-if="categories.length === 0" class="empty">
      <mdui-icon name="folder_off" style="font-size: 4rem; opacity: 0.3;"></mdui-icon>
      <p>暂无分类</p>
    </div>

    <div v-else class="categories-grid">
      <mdui-card
        v-for="category in categories"
        :key="category.name"
        class="category-card"
        clickable
        @click="router.push(`/categories/${category.name}`)"
      >
        <div class="category-content">
          <div class="category-icon">
            <mdui-icon name="folder"></mdui-icon>
          </div>
          <div class="category-info">
            <span class="category-name">{{ category.name }}</span>
            <span class="category-count">{{ category.count }} 篇文章</span>
          </div>
          <mdui-icon name="arrow_forward" class="arrow-icon"></mdui-icon>
        </div>
      </mdui-card>
    </div>
  </div>
</template>

<style scoped>
.categories-page {
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

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
}

.category-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.category-card:hover {
  transform: translateY(-2px);
}

.category-card:hover .arrow-icon {
  transform: translateX(4px);
}

.category-content {
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.category-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--mdui-color-secondary-container);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.category-icon mdui-icon {
  color: var(--mdui-color-on-secondary-container);
  font-size: 1.25rem;
}

.category-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.category-name {
  font-weight: 600;
  font-size: 1rem;
}

.category-count {
  font-size: 0.8125rem;
  color: var(--mdui-color-on-surface-variant);
}

.arrow-icon {
  color: var(--mdui-color-on-surface-variant);
  transition: transform 0.2s;
}

/* 桌面端优化 */
@media (min-width: 768px) {
  .categories-page {
    padding: 3rem 2rem;
  }

  .page-header h1 {
    font-size: 2.25rem;
  }

  .categories-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}
</style>
