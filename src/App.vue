<template>
  <div id="app">
    <keep-alive exclude="Detail">
      <router-view></router-view>
    </keep-alive>
    <!-- 进入详情页时，底部导航栏不显示 -->
    <main-tab-bar v-show="$route.meta.title !== 'Detail'"></main-tab-bar>

    <!-- <main-tab-bar ></main-tab-bar> -->
  </div>
</template>

<script>
import MainTabBar from './components/content/mainTabbar/MainTabBar';

export default {
  name: 'App',
  components: {
    MainTabBar
  }
}
</script>

<style scoped>
@import "assets/css/base.css";
</style>


