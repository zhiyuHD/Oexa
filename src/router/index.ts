import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/HomePage.vue')
  },
  {
    path: '/posts',
    name: 'Posts',
    component: () => import('@/pages/PostsPage.vue')
  },
  {
    path: '/posts/:slug',
    name: 'Post',
    component: () => import('@/pages/PostPage.vue')
  },
  {
    path: '/tags',
    name: 'Tags',
    component: () => import('@/pages/TagsPage.vue')
  },
  {
    path: '/tags/:tag',
    name: 'TagPosts',
    component: () => import('@/pages/TagPostsPage.vue')
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('@/pages/CategoriesPage.vue')
  },
  {
    path: '/categories/:category',
    name: 'CategoryPosts',
    component: () => import('@/pages/CategoryPostsPage.vue')
  },
  {
    path: '/archives',
    name: 'Archives',
    component: () => import('@/pages/ArchivesPage.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/pages/AboutPage.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFoundPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router