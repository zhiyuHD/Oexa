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
    <mdui-text-field clearable variant="outlined" label="Text Field"></mdui-text-field>
    <p>有了一个输入框</p>
    <mdui-switch></mdui-switch>
    <p>一个开关</p>
    <mdui-slider></mdui-slider>
    <p>wwwweeeeee</p>
    <mdui-range-slider></mdui-range-slider>
    <p>wwwwwweeee</p>
    <mdui-radio-group value="chinese">
      <mdui-radio value="zhiyuHD">智宇</mdui-radio>
      <mdui-radio value="InverseLight">逆光</mdui-radio>
    </mdui-radio-group>
    <p>你们要选哪个</p>
    <mdui-navigation-bar value="item-1">
      <mdui-navigation-bar-item icon="place" value="home">主页</mdui-navigation-bar-item>
      <mdui-navigation-bar-item icon="commute" value="post">文章</mdui-navigation-bar-item>
      <mdui-navigation-bar-item icon="people" value="about">关于我</mdui-navigation-bar-item>
    </mdui-navigation-bar>
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
