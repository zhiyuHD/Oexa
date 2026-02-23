<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

interface ArchivePost {
  slug: string
  title: string
  date: string
}

interface Archives {
  [year: string]: {
    [month: string]: ArchivePost[]
  }
}

const router = useRouter()
const archives = ref<Archives>({})
const loading = ref(true)
const expandedYears = ref<Set<string>>(new Set())

// 按年份排序
const sortedYears = computed(() => {
  return Object.keys(archives.value).sort((a, b) => parseInt(b) - parseInt(a))
})

// 统计文章数
const totalPosts = computed(() => {
  let count = 0
  for (const year of Object.values(archives.value)) {
    for (const month of Object.values(year)) {
      count += month.length
    }
  }
  return count
})

onMounted(async () => {
  try {
    const res = await fetch('/posts/archives.json')
    archives.value = await res.json()
    
    // 默认展开最新年份
    const firstYear = sortedYears.value[0]
    if (firstYear) {
      expandedYears.value.add(firstYear)
    }
  } catch (e) {
    console.error('Failed to load archives:', e)
  } finally {
    loading.value = false
  }
})

function toggleYear(year: string) {
  if (expandedYears.value.has(year)) {
    expandedYears.value.delete(year)
  } else {
    expandedYears.value.add(year)
  }
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric'
  })
}

function getMonthName(month: string) {
  const monthNum = parseInt(month)
  const months = ['一月', '二月', '三月', '四月', '五月', '六月', 
                  '七月', '八月', '九月', '十月', '十一月', '十二月']
  return months[monthNum - 1] || month
}

function getYearPostCount(year: string) {
  let count = 0
  const yearData = archives.value[year]
  if (yearData) {
    for (const month of Object.values(yearData)) {
      count += month.length
    }
  }
  return count
}
</script>

<template>
  <div class="archives-page">
    <header class="page-header">
      <h1>归档</h1>
      <p>共 {{ totalPosts }} 篇文章</p>
    </header>

    <div v-if="loading" class="loading">
      <mdui-circular-progress></mdui-circular-progress>
    </div>

    <div v-else-if="sortedYears.length === 0" class="empty">
      <mdui-icon name="archive" style="font-size: 4rem; opacity: 0.3;"></mdui-icon>
      <p>暂无文章</p>
    </div>

    <div v-else class="archives-list">
      <div
        v-for="year in sortedYears"
        :key="year"
        class="year-section"
      >
        <div class="year-header" @click="toggleYear(year)">
          <div class="year-info">
            <h2 class="year-title">{{ year }}</h2>
            <span class="year-count">{{ getYearPostCount(year) }} 篇</span>
          </div>
          <mdui-icon :name="expandedYears.has(year) ? 'expand_less' : 'expand_more'"></mdui-icon>
        </div>
        
        <div v-show="expandedYears.has(year)" class="year-content">
          <div
            v-for="(posts, month) in archives[year]"
            :key="month"
            class="month-section"
          >
            <h3 class="month-title">{{ getMonthName(month) }}</h3>
            <div class="month-posts">
              <div
                v-for="post in posts"
                :key="post.slug"
                class="post-item"
                @click="router.push(`/posts/${post.slug}`)"
              >
                <span class="post-date">{{ formatDate(post.date) }}</span>
                <span class="post-title">{{ post.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.archives-page {
  max-width: 800px;
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

.archives-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.year-section {
  background: var(--mdui-color-surface-container);
  border-radius: 16px;
  overflow: hidden;
}

.year-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: background 0.2s;
}

.year-header:hover {
  background: var(--mdui-color-surface-container-high);
}

.year-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.year-title {
  font-size: 1.5rem;
  font-weight: 700;
}

.year-count {
  font-size: 0.875rem;
  color: var(--mdui-color-on-surface-variant);
  background: var(--mdui-color-surface-container-highest);
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
}

.year-content {
  padding: 0 1.5rem 1.5rem;
}

.month-section {
  margin-bottom: 1.5rem;
}

.month-section:last-child {
  margin-bottom: 0;
}

.month-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--mdui-color-primary);
  margin-bottom: 0.75rem;
  padding-left: 0.5rem;
  border-left: 3px solid var(--mdui-color-primary);
}

.month-posts {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.post-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: var(--mdui-color-surface);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.post-item:hover {
  background: var(--mdui-color-surface-container-highest);
  transform: translateX(4px);
}

.post-date {
  font-size: 0.8125rem;
  color: var(--mdui-color-on-surface-variant);
  white-space: nowrap;
  min-width: 80px;
}

.post-title {
  font-weight: 500;
  line-height: 1.4;
}

/* 桌面端优化 */
@media (min-width: 768px) {
  .archives-page {
    padding: 3rem 2rem;
  }

  .page-header h1 {
    font-size: 2.25rem;
  }

  .post-item {
    padding: 1rem 1.25rem;
  }
}
</style>
