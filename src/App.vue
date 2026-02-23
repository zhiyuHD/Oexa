<script setup lang="ts">
</script>

<template>
  <header>
  </header>

  <main>
    <mdui-button>Wow!A Button</mdui-button>
    <p>嗯对，我们有一个MD3 风格的按钮</p>
    <mdui-button full-width>SecondButton</mdui-button>
    <p>好的现在有两个了</p>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
