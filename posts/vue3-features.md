---
title: Vue 3 新特性介绍
date: 2026-02-22
tags:
  - Vue
  - 前端
description: 介绍 Vue 3 的主要新特性，包括 Composition API、Teleport 等。
---

# Vue 3 新特性介绍

Vue 3 带来了许多令人兴奋的新特性，让我们一起来了解。

## Composition API

Composition API 是 Vue 3 最重要的新特性之一：

```vue
<script setup>
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">
    Count: {{ count }} (doubled: {{ doubled }})
  </button>
</template>
```

## Teleport

Teleport 允许我们将组件渲染到 DOM 的其他位置：

```vue
<teleport to="body">
  <div class="modal">
    这是一个模态框
  </div>
</teleport>
```

## Fragments

Vue 3 支持多个根节点：

```vue
<template>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</template>
```

## 总结

Vue 3 的这些新特性让开发更加灵活和高效！
